'use server';

import { generateText, streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: anthropic('claude-3-haiku-20240307'),
    prompt: question,
  });

  return { text, finishReason, usage };
}

export async function generate(input: string) {
    const stream = createStreamableValue('');
  
    (async () => {
      const { textStream } = await streamText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: input,
      });
  
      for await (const delta of textStream) {
        stream.update(delta);
      }
  
      stream.done();
    })();
  
    return { output: stream.value };
}

export async function generateConversation(history: Message[]) {
  'use server';

  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: anthropic('claude-3-haiku-20240307'),
      system: 'You are a friendly assistant!',
      messages: history,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}