import cors from "@fastify/cors";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmParticipant } from "./routes/confirm-participant";
import { confirmTrip } from "./routes/confirm-trip";
import { createActivity } from "./routes/create-activity";
import { createTrip } from "./routes/create-trip";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipantDetails } from "./routes/get-participant-details";
import { errorHandler } from "./error-handler";

const app = fastify();

//GARANTIA DE QUALQUER UM CONSEGUE ACESSAR A API
app.register(cors, {
  origin: "*",
});

//ERROR HANDLER
app.setErrorHandler(errorHandler);

//ENDPOINTS
app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);
app.register(getParticipantDetails);

//VALIDATORS
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//EXECUTIONS
app.listen({ port: 3333 }).then(() => {
  console.log("Server running...");
});
