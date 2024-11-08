import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import z from "zod";

const transactionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  created_at: z.coerce.date(),
  update_at: z.coerce.date().optional(),
  paymentCategory: z.object({
    id: z.string().uuid(),
    name: z.string(),
    colorId: z.string().uuid(),
    iconId: z.string().uuid()
  }).optional(),
  paymentMethod: z.object({
    id: z.string().uuid(),
    name: z.string()
  }).optional()
});

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.coerce.date(),
  budget: z.number(),
  transaction: z.array(transactionSchema).optional()
});

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/user/:userId', {
    schema: {
      params: z.object({
        userId: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { userId } = request.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          transaction: {
            include: {
              paymentCategory: {
                select: {
                  id: true,
                  name: true,
                  colorId: true,
                  iconId: true
                }
              },
              paymentMethod: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      const validatedUser = userSchema.parse(user);
      return { user: validatedUser };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return reply.status(500).send({ error: "Erro ao buscar usuário" });
    }
  });
}
