import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
  
const reminderSchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        status: z.enum(["PENDING", "COMPLETED", "CANCELLED"])
    })
)
export async function getReminder(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/reminder/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params
        try {
            const reminder = await prisma.reminder.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    date: true,
                    status: true,
                    
                }
            })
            if(!reminder) {
                throw new Error("User not found");
            }
            const validatedReminder = reminderSchema.parse(reminder);
            return {reminder: validatedReminder}
        } catch (error) {
            throw new Error("Cannot get reminder ->  " + error)
        } 
    })};
