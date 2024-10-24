import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";

export async function deleteReminder(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().delete('/reminder/:userId/:reminderId',{
        schema: {
            params: z.object({
                userId: z.string().uuid(), 
                reminderId: z.string().uuid(), 
            })
        }
    }, async (request) => {
        const { userId, reminderId } = request.params

       

        const reminder = await prisma.reminder.findFirst({
            where: {
                id: reminderId,
                userId: userId
            }
        })
        if(!reminder) {
            throw new Error("reminder not found");
        }
        await prisma.reminder.delete({
            where: { id: reminderId }
        });
        return {reminderId: reminder.id}
    })
}