import 'dotenv/config';
import fastify from 'fastify';
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { env } from "../src/env";
import { transactions } from './routes/get-transactions';
import { createTransactions } from './routes/create-transaction';
import { createUser } from './routes/create-user';
import { createCategory } from './routes/create-category';
import { createMethod } from './routes/create-method';
import { createReminder } from './routes/create-reminder';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: `${env.WEB_BASE_URL}`
})
app.register(transactions)
app.register(createTransactions)
app.register(createUser)
app.register(createCategory)
app.register(createMethod)
app.register(createReminder)

app.get('/teste', () => {
    return "hello"
})

const start = async () => {
    try {
        await app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
            console.log('SERVER RUNNING on port ' + env.PORT)
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
start();