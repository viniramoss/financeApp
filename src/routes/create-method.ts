import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const methodSchema = z.object({
    name: z.string().min(4),
});

export async function createMethod(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/method/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: methodSchema
        }
    }, async (request) => {
        try {
            const {
                name,
            } = request.body
            const { userId } = request.params

            const method = await prisma.paymentMethod.create({
                data: {
                    name,
                    userId
                }
            });
            return {methodId: method.id}
        } catch (error) {
            throw new Error("Não foi possivel criar o metodo ->   " + error);
            
        }
    })
}