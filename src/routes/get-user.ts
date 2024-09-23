import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";

const transactionSchema = z.object({
    id: z.string().uuid(),
    amount: z.number(),
    type: z.enum(["INCOME", "EXPENSE"]),
    created_at: z.coerce.date(),
    update_at: z.coerce.date().optional(),
  });
  
const paymentMethodSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

const paymentCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    colorId: z.string().uuid(),
    iconId: z.string().uuid(),
});
  
const reminderSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    date: z.coerce.date(),
});
const settingsSchema = z.object({
    id: z.string().uuid(),
    theme: z.string(),
    notifications: z.boolean(),
});

const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    created_at: z.coerce.date(),
    budget: z.number(),
    transaction: z.array(transactionSchema).optional(),
    PaymentMethod: z.array(paymentMethodSchema),
    PaymentCategory: z.array(paymentCategorySchema),
    Reminder: z.array(reminderSchema).optional(),
    Settings: z.array(settingsSchema).optional(),
});

export async function getUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/user/:userId',{
        schema: {
            params: z.object({
                userId: z.string().uuid()
            })
        }
    }, async (request, reply) => {
        const { userId } = request.params
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    transaction: true,
                    PaymentMethod: true,
                    PaymentCategory: true,
                    Reminder: true,
                    Settings: true
                }
            })
            if(!user) {
                throw new Error("User not found");
            }
            const validatedUser = userSchema.parse(user);
            return {user: validatedUser}
        } catch (error) {
            throw new Error("Cannot get user ->  " + error)
        } 
    })};
