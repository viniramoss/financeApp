import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import z from "zod";

const userSchema = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    password: z.string(),
    budget: z.number(),
});

const defaultCategories = [
    { name: 'Mercado', iconName: 'shopping-basket', colorHex: '#FFD699' },
    { name: 'Transporte', iconName: 'bus', colorHex: '#FF99CC' },
    { name: 'Entretenimento', iconName: 'party-popper', colorHex: '#99CCFF' },
    { name: 'Roupas', iconName: 'shirt', colorHex: '#99FFCC' },
    { name: 'Manutenção', iconName: 'hammer', colorHex: '#FFA852' },
];

export async function createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user', {
        schema: {
            body: userSchema
        }
    }, async (request) => {
        try {
            const { name, email, password, budget } = request.body;

            // Cria o usuário
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    budget
                }
            });

            // Busca os IDs de ícones e cores
            const icons = await prisma.icon.findMany();
            const colors = await prisma.color.findMany();

            // Cria as categorias padrão
            await Promise.all(defaultCategories.map(async (category) => {
                const icon = icons.find(icon => icon.name === category.iconName);
                const color = colors.find(color => color.hex === category.colorHex);

                if (!icon || !color) {
                    throw new Error(`Ícone ou cor não encontrado para a categoria ${category.name}`);
                }

                await prisma.paymentCategory.create({
                    data: {
                        name: category.name,
                        iconId: icon.id,
                        colorId: color.id,
                        userId: user.id
                    }
                });
            }));

            return { userId: user.id };
        } catch (error) {
            throw new Error("Não foi possível criar o usuário: " + error);
        }
    });
}
