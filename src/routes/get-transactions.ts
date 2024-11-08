import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
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
    app.withTypeProvider<ZodTypeProvider>().get('/transactions/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params;

        try {
            // Buscar transações no banco de dados
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
            });

            // Verificar se encontrou transações
            if (transactionsFromDb.length === 0) {
                return reply.status(404).send({ error: "Nenhuma transação encontrada" });
            }

            // Validar as transações usando Zod
            const validatedTransactions = transactionsSchema.safeParse(transactionsFromDb);
            if (!validatedTransactions.success) {
                return reply.status(400).send({
                    error: "Invalid data",
                    details: validatedTransactions.error.errors
                });
            }

            // Retornar transações válidas
            return reply.status(200).send({ transactions: validatedTransactions.data });

        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            return reply.status(500).send({ error: "Erro ao buscar transações" });
        }
    });
};
