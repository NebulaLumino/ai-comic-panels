"use client";
import { useState } from "react";

export default function ComicPanelsPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No result");
    } catch {
      setResult("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-rose-400 mb-2">🎨 AI Comic Book Panel Writer</h1>
          <p className="text-gray-400">Describe your scene and watch AI craft vivid panel descriptions</p>
        </div>

        <textarea
          className="w-full bg-gray-800 border border-rose-500/30 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
          rows={5}
          placeholder="Describe your comic panel idea... (e.g., A cyberpunk street fight between a rogue AI and a street samurai in Neon Tokyo)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className="mt-4 w-full bg-rose-600 hover:bg-rose-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Generating..." : "Generate Panel Description"}
        </button>

        {result && (
          <div className="mt-6 bg-gray-800/60 border border-rose-500/20 rounded-xl p-5">
            <h3 className="text-rose-400 font-semibold mb-3">Panel Description</h3>
            <pre className="whitespace-pre-wrap text-gray-200 text-sm font-mono">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
