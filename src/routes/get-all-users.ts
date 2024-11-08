import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import z from "zod";

// Reutilizando o esquema do usuário que você já definiu
const usersSchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        created_at: z.coerce.date(),
        budget: z.number(),
        transaction: z.array(z.object({
            id: z.string().uuid(),
            amount: z.number(),
            type: z.enum(["INCOME", "EXPENSE"]),
            created_at: z.coerce.date(),
            update_at: z.coerce.date().optional(),
        })).optional(),
        PaymentMethod: z.array(z.object({
            id: z.string().uuid(),
            name: z.string(),
        })),
        PaymentCategory: z.array(z.object({
            id: z.string().uuid(),
            name: z.string(),
            colorId: z.string().uuid(),
            iconId: z.string().uuid(),
        })),
        Reminder: z.array(z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string(),
            date: z.coerce.date(),
        })).optional(),
        Settings: z.array(z.object({
            id: z.string().uuid(),
            theme: z.string(),
            notifications: z.boolean(),
        })).optional()
    })
);

export async function getUsers(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/users', async (request, reply) => {
        try {
            const users = await prisma.user.findMany({
                include: {
                    transaction: true,
                    PaymentMethod: true,
                    PaymentCategory: true,
                    Reminder: true,
                    Settings: true
                }
            });
            const validatedUsers = usersSchema.safeParse(users);
            if (!validatedUsers.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validatedUsers.error.errors
                });
            }

            return reply.status(200).send({ users: validatedUsers.data });
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            return reply.status(500).send({ error: "Erro ao buscar usuários" });
        }
    });
}
