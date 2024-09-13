import 'dotenv/config';
import fastify from 'fastify';
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { env } from "../src/env";
import { transactions } from './routes/get-transactions';
import { createTransactions } from './routes/create-transaction';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: `${env.WEB_BASE_URL}`
})
app.register(transactions)
app.register(createTransactions)

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