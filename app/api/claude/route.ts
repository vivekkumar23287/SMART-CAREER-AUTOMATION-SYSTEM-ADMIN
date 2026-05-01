import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: { message: 'GEMINI_API_KEY is missing in .env' } }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: { message: data?.error?.message || 'Gemini API error' } }, { status: response.status });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ content: [{ text }] });

  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
