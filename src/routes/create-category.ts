import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const userSchema = z.object({
    name: z.string().min(4),
    iconName: z.string(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export async function createCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/category/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            }),
            body: userSchema
        }
    }, async (request) => {
        try {
            const {
                name,
                iconName,
                color,
            } = request.body
            const { userId } = request.params

                const icon = await prisma.icon.findUnique({
                    where: { name: iconName }
                });
                if (!icon) {
                    throw new Error(`Icon with name '${iconName}' not found`);
                }

                const colorRecord = await prisma.color.findUnique({
                    where: { hex: color }
                });
                if (!colorRecord) {
                    throw new Error(`Color with hex '${color}' not found`);
                }
    
                // Cria a nova categoria
                const category = await prisma.paymentCategory.create({
                    data: {
                        name,
                        iconId: icon.id,
                        colorId: colorRecord.id,
                        userId
                    }
                });
            return {categoryId: category.id}
        } catch (error) {
            throw new Error("Não foi possivel criar a categoria ->   " + error);
            
        }
    })
}