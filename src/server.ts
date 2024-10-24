import 'dotenv/config';
import fastify from 'fastify';
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { env } from './env';
import { getTransactions } from './routes/get-transactions';
import { createTransactions } from './routes/create-transaction';
import { createUser } from './routes/create-user';
import { createCategory } from './routes/create-category';
import { createMethod } from './routes/create-method';
import { createReminder } from './routes/create-reminder';
import { getUser } from './routes/get-user';
import { getReminder } from './routes/get-reminder';
import { getMethod } from './routes/get-method';
import { getCategoty } from './routes/get-category';
import { getColors } from './routes/get-colors';
import { getIcons } from './routes/get-icons';
import { deleteTransactions } from './routes/delete-transaction';
import { deleteReminder } from './routes/delete-reminder';
import { deleteCategory } from './routes/delete-category';
import { deleteMethod } from './routes/delete-method';
import { deleteUser } from './routes/delete-user';

import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';   

const prisma = new PrismaClient();
const execPromise = util.promisify(exec);

const runMigrations = async () => {
    try {
      const { stdout, stderr } = await execPromise('npx prisma migrate deploy');
      console.log('Migration stdout:', stdout);
      if (stderr) {
        console.error('Migration stderr:', stderr);
      }
    } catch (err) {
      console.error('Failed to run migrations:', err);
      process.exit(1);
    }
}

const runSeed = async () => {
    try {
        const { stdout, stderr } = await execPromise('npx tsx src/seed.ts');
        console.log('Seed stdout:', stdout);
        if (stderr) {
            console.error('Seed stderr:', stderr);
        }
    } catch (err) {
        console.error('Failed to run seed:', err);
        process.exit(1);
    }
};

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    // origin: `${env.WEB_BASE_URL}`
    origin: `*`
})
app.register(createTransactions)
app.register(createUser)
app.register(createCategory)
app.register(createMethod)
app.register(createReminder)
app.register(getTransactions)
app.register(getUser)
app.register(getReminder)
app.register(getMethod)
app.register(getCategoty)
app.register(getColors)
app.register(getIcons)
app.register(deleteTransactions)
app.register(deleteReminder)
app.register(deleteCategory)
app.register(deleteMethod)
app.register(deleteUser)

app.get('/teste', () => {
    return "hello"
})

const start = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await runMigrations();
            await runSeed();
        }

        await app.listen({ port: Number(process.env.PORT) || 10000, host: '0.0.0.0' }).then(() => {
            console.log('SERVER RUNNING on port ' + env.PORT)
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
start();

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});