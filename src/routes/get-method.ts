import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
  
const paymentMethodSchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
    })
)
export async function getMethod(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/method/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params
        try {
            const method = await prisma.paymentMethod.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    name: true
                }
            })
            if(!method) {
                throw new Error("User not found");
            }
            const validatedMethod = paymentMethodSchema.parse(method);
            return {method: validatedMethod}
        } catch (error) {
            throw new Error("Cannot get method ->  " + error)
        } 
    })};
