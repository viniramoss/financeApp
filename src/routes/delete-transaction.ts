import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
// const transactionsSchema = z.object({
//     name: z.string(),
//     amount: z.number(),
//     description: z.string().max(100).nullable(),
//     date: z.coerce.date(),
//     type: z.enum(["INCOME", "EXPENSE"]),
//     created_at: z.coerce.date().optional(),
//     update_at: z.coerce.date().optional(), 
//     paymentCategoryName: z.string(),
//     paymentMethodName: z.string()
// });

export async function deleteTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/transactions/:userId/:transactionId',{
        schema: {
            params: z.object({
                userId: z.string().uuid(), 
                transactionId: z.string().uuid(), 
            })
        }
    }, async (request) => {
        const { userId, transactionId } = request.params

       

        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId: userId
            }
        })
        if(!transaction) {
            throw new Error("Transaction not found");
        }
        await prisma.transaction.delete({
            where: { id: transactionId }
        });
        return {transactionId: transaction.id}
    })
}