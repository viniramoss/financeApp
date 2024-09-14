import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const reminderSchema = z.object({
    name: z.string(),
    description: z.string().max(100),
    date: z.coerce.date()
});

export async function createReminder(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/reminder/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid() 
            }),
            body: reminderSchema
        }
    }, async (request) => {
        const {
            name,
            description,
            date
        } = request.body
        const { userId } = request.params


        const reminder = await prisma.reminder.create({
            data: {
                name,
                date,
                description,
                userId,
            }
        })
        if(!reminder) {
            throw new Error("Transaction not found");
        }
        return {reminderId: reminder.id}
    })
}