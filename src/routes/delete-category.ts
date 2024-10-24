import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";

export async function deleteCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/category/:userId/:categoryId',{
        schema: {
            params: z.object({
                userId: z.string().uuid(), 
                categoryId: z.string().uuid(), 
            })
        }
    }, async (request) => {
        const { userId, categoryId } = request.params

       

        const category = await prisma.paymentCategory.findFirst({
            where: {
                id: categoryId,
                userId: userId
            }
        })
        if(!category) {
            throw new Error("Category not found");
        }
        await prisma.paymentCategory.delete({
            where: { id: categoryId }
        });
        return {categoryId: category.id}
    })
}