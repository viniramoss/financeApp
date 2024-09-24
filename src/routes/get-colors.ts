import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
  
const colorSchema = z.array(
    z.object({
        id: z.string().uuid(),
        hex: z.string(),
    })
)
export async function getColors(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/colors', async () => {
        try {
            const color = await prisma.color.findMany({
                select: {
                    id: true,
                    hex: true
                }
            })
            if(!color) {
                throw new Error("User not found");
            }
            const validatedcolor = colorSchema.parse(color);
            return {color: validatedcolor}
        } catch (error) {
            throw new Error("Cannot get color ->  " + error)
        } 
    })};
