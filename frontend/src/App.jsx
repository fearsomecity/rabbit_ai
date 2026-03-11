import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function App() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSummary("");

    if (!file) {
      setError("Please upload a .csv or .xlsx file.");
      return;
    }
    if (!email) {
      setError("Please enter a recipient email.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/analyze-sales`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(res.data.message || "Summary generated and email sent.");
      setSummary(res.data.summary || "");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to process sales file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-2 text-slate-50">Sales Insight Automator</h1>
        <p className="text-sm text-slate-400 mb-6">
          Upload a sales CSV/XLSX file and send an AI-generated executive summary to your stakeholders.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Sales file (.csv / .xlsx)</label>
            <input
              type="file"
              accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Recipient email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="executive@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed w-full mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              "Generate & Email Summary"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-md bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md bg-emerald-900/40 border border-emerald-700 px-3 py-2 text-sm text-emerald-100">
            {success}
          </div>
        )}

        {summary && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">AI Summary (preview)</h2>
            <div className="max-h-64 overflow-auto rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

