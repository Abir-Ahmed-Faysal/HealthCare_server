/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";


const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findUnique({
    where: {
      stripeEventId: event.id
    }
  })

  if (existingPayment) {
    console.log(`Event ${event.id} already processed`);
  }


  switch (event.type) {
    case 'checkout.session.completed':
      {
        const session = event.data.object

        const appointmentId = session.metadata?.appointmentId;

        const paymentId = session.metadata?.paymentId

        if (!paymentId || !appointmentId) {
          console.log("missing appointmentId or paymentId in session metadata");
          return { message: "missing appointmentId or paymentId in session metadata" }
        }


        const appointment = await prisma.appointment.findUnique({
          where: {
            id: appointmentId,
          }
        })

        if (!appointment) {
          console.log("appointment not found");
          return { message: "appointment not found" }
        }

        await prisma.$transaction(async (tx) => {
          tx.appointment.update({
            where: {
              id: appointmentId
            }, data: {
              status: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            }
          })


          await tx.payment.update({
            where: {
              id: paymentId
            }, data: {
              stripeEventId: event.id,
              status: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID,
              paymentGatewayDate: session as any
            }
          })


        })

        console.log(`processed checkout.session.complete for appointment ${appointmentId} & payment ${paymentId}`);


      }
      break;
    case 'checkout.session.expired':
      {
        const session = event.data.object

        console.log(` checkout session ${session.id} expired. Marking associated payment as failed.`);

      }

      break;
    case 'payment_intent.payment_failed':
      {
        const session = event.data.object

        console.log(` payment intent ${session.id} failed. Marking associated payment as failed.`);
      }

      break;
    default:
      console.log(`unhandled event type for ${event.type}`);
      break;
  }


  return { message: `webhook Event process successfully` }
};


export const paymentService = { handlerStripeWebhookEvent } 