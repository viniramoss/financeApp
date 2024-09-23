import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const paymentMethodSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});
    
const paymentCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});
const transactionsSchema = z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      amount: z.number(),
      type: z.enum(["INCOME", "EXPENSE"]),
      paymentMethod: paymentMethodSchema,
      paymentCategory: paymentCategorySchema,
      created_at: z.coerce.date().optional(),

    })
);

export async function getTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/transactions/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params
        try {
            const transactionsFromDb = await prisma.transaction.findMany({
                where: {
                    userId: userId
                },
                include: {
                    paymentMethod: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    paymentCategory: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
            if(transactionsFromDb.length === 0) {
                throw new Error("Transaction not found");
            }
            const validatedTransactions = transactionsSchema.parse(transactionsFromDb)
            return {transaction: validatedTransactions}
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                  error: "Invalid data",
                  details: error.errors
                });
            }
        } 
    })};
