'use client';

import { useState } from 'react';

type Mode = 'grammar' | 'adjust' | 'rate';
type ToneOption = { value: string; label: string };

const TONE_OPTIONS: ToneOption[] = [
  { value: 'Professional', label: '💼 Professional' },
  { value: 'Casual',       label: '🏖️ Casual' },
  { value: 'Friendly',     label: '😊 Friendly' },
  { value: 'Formal',       label: '🎩 Formal' },
  { value: 'Humorous',     label: '😂 Humorous' },
];

const ProgressBar = ({ value, max = 10 }: { value: number; max?: number }) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
    </div>
  );
};

export default function Home() {
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<Mode>('grammar');
  const [tone, setTone] = useState<string>('Friendly');
  const [output, setOutput] = useState<string>('');
  const [origRate, setOrigRate] = useState<number | null>(null);
  const [adjRate, setAdjRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const analyseRate = async (input: string): Promise<number | null> => {
    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode: 'rate' }),
      });
      const { result = '' } = await res.json();
      const m = result.match(/(\d+(\.\d+)?)/);
      return m ? Math.round(parseFloat(m[1])) : null;
    } catch {
      return null;
    }
  };

  const adjustTone = async (chosenTone: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setOrigRate(null);
    setAdjRate(null);

    // 1) Rate original
    const original = await analyseRate(text);
    setOrigRate(original);

    // 2) Get adjusted text
    try {
      const adjRes = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: 'adjust', tone: chosenTone }),
      });
      const { result: adjText = '' } = await adjRes.json();
      setOutput(adjText);
      setTone(chosenTone);

      // 3) Rate adjusted
      const newRating = await analyseRate(adjText);
      setAdjRate(newRating);
    } catch {
      setOutput('Error adjusting tone');
    }

    setLoading(false);
  };

  const simpleAnalyse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setOrigRate(null);
    setAdjRate(null);
    setOutput('');

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, tone }),
      });
      const { result = '', error } = await res.json();
      const finalText = error ?? result;
      setOutput(finalText);

      if (mode === 'rate') {
        const m = finalText.match(/(\d+(\.\d+)?)/);
        setOrigRate(m ? Math.round(parseFloat(m[1])) : null);
      }
    } catch {
      setOutput('Error analysing text');
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Grammar & Tone Tool</h1>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-blue-200 focus:outline-none"
        rows={5}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Your message here…"
      />

      <select
        className="mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-200 focus:outline-none"
        value={mode}
        onChange={e => {
          setMode(e.target.value as Mode);
          setOutput('');
          setOrigRate(null);
          setAdjRate(null);
        }}
      >
        <option value="grammar">Grammar Review</option>
        <option value="adjust">Tone Adjustment</option>
        <option value="rate">Rate Tone</option>
      </select>

      {mode === 'adjust' ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {TONE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => adjustTone(opt.value)}
              disabled={loading}
              className="flex items-center gap-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={simpleAnalyse}
          disabled={loading}
          className="mb-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Analysing…' : 'Analyse'}
        </button>
      )}

      {output && (
        <section className="mt-6 space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 whitespace-pre-wrap">
            {output}
          </div>

          {mode === 'adjust' && (
            <>
              {origRate !== null && (
                <div>
                  <p className="text-sm mb-1">Original: {origRate}/10</p>
                  <ProgressBar value={origRate} />
                </div>
              )}
              {adjRate !== null && (
                <div>
                  <p className="text-sm mb-1">Adjusted: {adjRate}/10</p>
                  <ProgressBar value={adjRate} />
                </div>
              )}
            </>
          )}

          {mode === 'rate' && origRate !== null && (
            <div>
              <p className="text-sm mb-1">Rating: {origRate}/10</p>
              <ProgressBar value={origRate} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}
