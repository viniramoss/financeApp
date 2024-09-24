import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
  
const iconsSchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
    })
)
export async function getIcons(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/icons', async () => {
        try {
            const icons = await prisma.icon.findMany({
                select: {
                    id: true,
                    name: true
                }
            })
            if(!icons) {
                throw new Error("Icon not found");
            }
            const validatedIcon = iconsSchema.parse(icons);
            return {icon: validatedIcon}
        } catch (error) {
            throw new Error("Cannot get icons ->  " + error)
        } 
    })};
