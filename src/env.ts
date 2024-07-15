import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  //A PORTA PODE ESTAR EM STRING OU NUM, SÓ QUE EU QUERO QUE VC CONVERTA PRA NUM
});

export const env = envSchema.parse(process.env);
