'use server';
/**
 * @fileOverview A Genkit flow for generating historical character ideas based on a chosen era and user input.
 *
 * - generateHistoricalCharacterIdeas - A function that generates character ideas.
 * - GenerateHistoricalCharacterIdeasInput - The input type for the generateHistoricalCharacterIdeas function.
 * - GenerateHistoricalCharacterIdeasOutput - The return type for the generateHistoricalCharacterIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHistoricalCharacterIdeasInputSchema = z.object({
  era: z
    .string()
    .describe(
      'The chosen historical period (e.g., Ancient Egypt, Roman Empire, Medieval Knights).'
    ),
  userIdeas: z
    .string()
    .optional()
    .describe('Vivanta\u0027s initial thoughts or ideas for the character.'),
});
export type GenerateHistoricalCharacterIdeasInput = z.infer<
  typeof GenerateHistoricalCharacterIdeasInputSchema
>;

const GenerateHistoricalCharacterIdeasOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the historical character.'),
    appearance: z.string().describe('A description of the character\u0027s appearance.'),
    role: z.string().describe('The role or occupation of the character.'),
    personalityTraits: z
      .array(z.string())
      .describe('A list of simple personality traits for the character.'),
  })
);
export type GenerateHistoricalCharacterIdeasOutput = z.infer<
  typeof GenerateHistoricalCharacterIdeasOutputSchema
>;

const generateHistoricalCharacterIdeasPrompt = ai.definePrompt({
  name: 'generateHistoricalCharacterIdeasPrompt',
  input: {schema: GenerateHistoricalCharacterIdeasInputSchema},
  output: {schema: GenerateHistoricalCharacterIdeasOutputSchema},
  prompt: `You are a creative assistant helping an 8-year-old named Vivanta create historical characters.

Generate a list of 1-3 historical character ideas based on the following era and Vivanta's initial ideas.
Each character idea should include a name, a description of their appearance, their role in that era, and 2-3 simple personality traits.
Ensure the suggestions are child-friendly and inspiring for an 8-year-old.

Historical Era: {{{era}}}
Vivanta's Ideas: {{{userIdeas}}}

Output your response as a JSON array of character objects, each with 'name', 'appearance', 'role', and 'personalityTraits' (an array of strings).`,
});

const generateHistoricalCharacterIdeasFlow = ai.defineFlow(
  {
    name: 'generateHistoricalCharacterIdeasFlow',
    inputSchema: GenerateHistoricalCharacterIdeasInputSchema,
    outputSchema: GenerateHistoricalCharacterIdeasOutputSchema,
  },
  async (input) => {
    const {output} = await generateHistoricalCharacterIdeasPrompt(input);
    return output!;
  }
);

export async function generateHistoricalCharacterIdeas(
  input: GenerateHistoricalCharacterIdeasInput
): Promise<GenerateHistoricalCharacterIdeasOutput> {
  return generateHistoricalCharacterIdeasFlow(input);
}
