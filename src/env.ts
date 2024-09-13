import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    API_BASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
    WEB_BASE_URL:  z.string().url(),
})



export const env = envSchema.parse(process.env)