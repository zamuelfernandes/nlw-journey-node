import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify();

//GARANTIA DE QUEM CONSEGUE ACESSAR A API
app.register(cors, {
  origin: "*",
});

app.register(createTrip);
app.register(confirmTrip);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running...");
});
