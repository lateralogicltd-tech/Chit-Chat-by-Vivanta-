'use server';
/**
 * @fileOverview A Genkit flow for handling contact form submissions.
 * 
 * This flow currently saves the message to Firestore. 
 * To send real emails, you would integrate an email provider (like SendGrid) inside this flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

const HandleContactMessageInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  message: z.string().describe('The message content.'),
});
export type HandleContactMessageInput = z.infer<typeof HandleContactMessageInputSchema>;

const HandleContactMessageOutputSchema = z.object({
  success: z.boolean().describe('Whether the message was handled successfully.'),
  reply: z.string().describe('A friendly confirmation message for the user.'),
});
export type HandleContactMessageOutput = z.infer<typeof HandleContactMessageOutputSchema>;

export async function handleContactMessage(input: HandleContactMessageInput): Promise<HandleContactMessageOutput> {
  return handleContactMessageFlow(input);
}

const handleContactMessageFlow = ai.defineFlow(
  {
    name: 'handleContactMessageFlow',
    inputSchema: HandleContactMessageInputSchema,
    outputSchema: HandleContactMessageOutputSchema,
  },
  async (input) => {
    try {
      // 1. Save to Firestore
      const { firestore } = initializeFirebase();
      const messagesRef = collection(firestore, "messages");
      await addDoc(messagesRef, {
        name: input.name,
        message: input.message,
        timestamp: Date.now(),
      });

      // 2. NOTE FOR VIVANTA: 
      // To get real emails, you would add your email service code right here!
      // Example: await sendEmailUsingService({ to: "your-email@example.com", ...input });
      
      console.log(`Message received from ${input.name}: ${input.message}`);

      return {
        success: true,
        reply: `Thanks ${input.name}! Your message is safely in my magic mailbox! 📮✨`,
      };
    } catch (error) {
      console.error("Error handling contact message:", error);
      throw new Error("Oops! My mailbox is a bit full. Try again in a minute! 🌈");
    }
  }
);
