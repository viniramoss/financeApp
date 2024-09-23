import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import { dayjs } from "../lib/dayjs";
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
        try {
            const {
                name,
                description,
                date
            } = request.body
            const { userId } = request.params

            if(dayjs(date).isBefore(new Date())){
                return "Cannot create reminder, invalid date!"
            }
    
    
            const reminder = await prisma.reminder.create({
                data: {
                    name,
                    date,
                    description,
                    userId
                }
            })
            return {reminderId: reminder.id}
        } catch (error) {
            throw new Error("Cannot create reminder!  " + error);
        }
    })
}