/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AnalyseBody = {
  text: string;
  mode: 'grammar' | 'adjust' | 'rate';
  tone?: string;
};

export async function POST(request: NextRequest) {
  const { text, mode, tone } = (await request.json()) as AnalyseBody;
  let prompt: string;

  if (mode === 'grammar') {
    prompt = `Correct the grammar of the following text, returning only the corrected version:\n\n${text}`;
  } else if (mode === 'adjust') {
    prompt = `Rewrite the text in a ${tone ?? 'neutral'} tone, preserving meaning:\n\n${text}`;
  } else {
    prompt = `Rate the tone of this message on a scale 1–10 and briefly explain your score:\n\n${text}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
