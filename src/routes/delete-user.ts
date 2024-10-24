import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";

export async function deleteUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/user/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid(), 
            })
        }
    }, async (request) => {
        const { userId } = request.params

       

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if(!user) {
            throw new Error("User not found");
        }
        await prisma.user.delete({
            where: { id: userId }
        });
        return {userId: user.id}
    })
}