import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const transactionsSchema = z.object({
    name: z.string(),
    amount: z.number(),
    description: z.string().max(100).nullable(),
    date: z.coerce.date(),
    type: z.enum(["INCOME", "EXPENSE"]),
    created_at: z.coerce.date().optional(),
    update_at: z.coerce.date().optional(), 
    userId: z.string().uuid(), 
    paymentCategoryId: z.string().uuid(),
    paymentMethodId: z.string().uuid()
});

export async function createTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/transactions',{
        schema: {
            body: transactionsSchema
        }
    }, async (request) => {
        const {
            name,
            amount,
            date,
            type,
            created_at,
            description,
            update_at,
            paymentCategoryId,
            paymentMethodId,
            userId
        } = request.body

        const transaction = await prisma.transaction.create({
            data: {
                name,
                amount,
                date,
                type,
                created_at,
                description,
                update_at,
                user: { connect: { id: userId } },
                paymentCategory: { connect: { id: paymentCategoryId } },
                paymentMethod: { connect: { id: paymentMethodId } },
            }
        })
        if(!transaction) {
            throw new Error("Transaction not found");
        }
        return {transactionId: transaction.id}
    })
}