import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import nodemailer from "nodemailer";

import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjf";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().min(4),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new ClientError("Trip not found.");

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

      const message = await mail.sendMail({
        from: {
          name: "Equipe Plann.er",
          address: "noreply@plann.er",
        },
        to: `${participant.email}`,
        subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado para participar de viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}.</strong></p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p><a href="${confirmationLink}"> Confirmar Viagem </a></p>
              <p></p>
              <p>Caso não saiba do que se trata, apenas ignore o email!</p>
            </div>
            `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { message: "Paricipant invited", participantId: participant.id };
    }
  );
}
