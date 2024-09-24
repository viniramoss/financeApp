import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
  
const paymentCategorySchema = z.array(
    z.object({
        id: z.string().uuid(),
        name: z.string(),
        color: z.object({
            hex: z.string(),
        }),
        icon: z.object({
            name: z.string(),
        }),
    })
)
export async function getCategoty(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/category/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params
        try {

            const categories = await prisma.paymentCategory.findMany({
                where: {
                    userId: userId
                },
                include: {
                    color: {
                        select: {
                            hex: true
                        }
                    },
                    icon: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            if(!categories) {
                throw new Error("Category not found");
            }
            const validatedCategory = paymentCategorySchema.parse(categories);
            return {category: validatedCategory}
        } catch (error) {
            throw new Error("Cannot get category ->  " + error)
        } 
    })};
