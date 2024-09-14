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
    paymentCategoryName: z.string(),
    paymentMethodName: z.string()
});

export async function createTransactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/transactions/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid() 
            }),
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
            paymentCategoryName,
            paymentMethodName,
        } = request.body
        const { userId } = request.params

        const category = await prisma.paymentCategory.findFirst({
            where: { name: paymentCategoryName, userId: userId }
        })
        if(!category){
            throw new Error("Erro ao criar a transação por conta da categoria")
        }
        const method = await prisma.paymentMethod.findFirst({
            where: { name: paymentMethodName, userId: userId }
        })
        if(!method){
            throw new Error("Erro ao criar a transação por conta do metodo")
        }

        const transaction = await prisma.transaction.create({
            data: {
                name,
                amount,
                date,
                type,
                created_at,
                description,
                update_at,
                userId,
                paymentCategoryId: category.id,
                paymentMethodId: method.id
            }
        })
        if(!transaction) {
            throw new Error("Transaction not found");
        }
        return {transactionId: transaction.id}
    })
}