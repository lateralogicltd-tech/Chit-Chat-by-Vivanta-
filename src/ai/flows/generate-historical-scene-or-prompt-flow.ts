'use server';
/**
 * @fileOverview A Genkit flow that generates short, descriptive historical scene summaries or story prompts.
 *
 * - generateHistoricalSceneOrPrompt - A function that handles the generation of a historical scene or story prompt.
 * - GenerateHistoricalSceneOrPromptInput - The input type for the generateHistoricalSceneOrPrompt function.
 * - GenerateHistoricalSceneOrPromptOutput - The return type for the generateHistoricalSceneOrPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHistoricalSceneOrPromptInputSchema = z.object({
  era: z.string().describe('The chosen historical period (e.g., Ancient Egypt, Roman Empire, Medieval Knights).'),
  characterIdeas: z.string().describe('Suggestions for historical character profiles (e.g., appearance, role, simple personality traits) relevant to the chosen era.'),
  sceneDescription: z
    .string()
    .describe('A simple description of a scene, object, or concept Vivanta wants to explore within the selected historical period.'),
});
export type GenerateHistoricalSceneOrPromptInput = z.infer<typeof GenerateHistoricalSceneOrPromptInputSchema>;

const GenerateHistoricalSceneOrPromptOutputSchema = z.object({
  scenePrompt: z.string().describe('A short, descriptive historical scene summary or story prompt.'),
});
export type GenerateHistoricalSceneOrPromptOutput = z.infer<typeof GenerateHistoricalSceneOrPromptOutputSchema>;

export async function generateHistoricalSceneOrPrompt(
  input: GenerateHistoricalSceneOrPromptInput
): Promise<GenerateHistoricalSceneOrPromptOutput> {
  return generateHistoricalSceneOrPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHistoricalSceneOrPromptPrompt',
  input: {schema: GenerateHistoricalSceneOrPromptInputSchema},
  output: {schema: GenerateHistoricalSceneOrPromptOutputSchema},
  prompt: `You are a creative storyteller helping an 8-year-old named Vivanta create historical narratives.
Your task is to generate a short, descriptive historical scene summary or story prompt based on the provided information.
Make sure the prompt is engaging, imaginative, and suitable for a young child, encouraging them to visualize and develop their stories.

Era: {{{era}}}
Character Ideas: {{{characterIdeas}}}
Vivanta's Scene Description: {{{sceneDescription}}}

Create a scene summary or story prompt based on the above:
`,
});

const generateHistoricalSceneOrPromptFlow = ai.defineFlow(
  {
    name: 'generateHistoricalSceneOrPromptFlow',
    inputSchema: GenerateHistoricalSceneOrPromptInputSchema,
    outputSchema: GenerateHistoricalSceneOrPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
