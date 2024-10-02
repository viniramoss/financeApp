import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";

export async function deleteMethod(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/method/:userId/:methodId',{
        schema: {
            params: z.object({
                userId: z.string().uuid(), 
                methodId: z.string().uuid(), 
            })
        }
    }, async (request) => {
        const { userId, methodId } = request.params

       

        const method = await prisma.paymentMethod.findFirst({
            where: {
                id: methodId,
                userId: userId
            }
        })
        if(!method) {
            throw new Error("Method not found");
        }
        await prisma.paymentMethod.delete({
            where: { id: methodId }
        });
        return {methodId: method.id}
    })
}