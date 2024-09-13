import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {prisma} from '../lib/prisma'
import z from "zod";
const transactionsSchema = z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      amount: z.number(),
      type: z.enum(["INCOME", "EXPENSE"]),
      created_at: z.coerce.date().optional(),
      update_at: z.coerce.date().optional()
    })
  );

export async function transactions(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/transactionsView', async (r, reply) => {
      
        try {
            const transactionsFromDb = await prisma.transaction.findMany({
                select: {
                    id: true,
                    name: true,
                    amount: true,
                    type: true,
                    created_at: true,
                    update_at: true
                }
            })
            if(transactionsFromDb.length === 0) {
                throw new Error("Transaction not found");
            }
            const validatedTransactions = transactionsSchema.parse(transactionsFromDb)
            return {transaction: validatedTransactions}
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                  error: "Invalid data",
                  details: error.errors
                });
            }
        } 
    })};
