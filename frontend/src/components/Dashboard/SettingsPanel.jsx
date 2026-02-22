import { useState, useEffect } from "react";
import { Cpu, HardDrive, Volume2, Globe, RefreshCw } from "lucide-react";
import { api } from "../../hooks/useApi";
import { clsx } from "clsx";

export default function SettingsPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStatus(); }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      const data = await api.getStatus();
      setStatus(data);
    } catch {
      // Backend not reachable
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <button onClick={loadStatus} className="btn-secondary text-xs">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* System Info */}
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">System</h3>

        <InfoRow icon={Cpu} label="Compute Backend" value={status?.compute_backend || "Detecting..."} />
        <InfoRow icon={Cpu} label="GPU" value={status?.gpu_name || "None detected"} />
        {status?.gpu_vram_gb > 0 && (
          <InfoRow icon={HardDrive} label="VRAM" value={`${status.gpu_vram_gb.toFixed(1)} GB (${status.gpu_count} device${status.gpu_count > 1 ? "s" : ""})`} />
        )}
        <InfoRow icon={Globe} label="LLM Model" value={status?.llm_model || "Unknown"} />
        <InfoRow icon={HardDrive} label="Database" value={status?.database || "SQLite"} />
      </div>

      {/* PersonaPlex Status */}
      <div className="card space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">PersonaPlex</h3>

        <StatusRow label="Avatar" available={status?.personaplex?.avatar_available} />
        <StatusRow label="Text-to-Speech" available={status?.personaplex?.tts_available} />
        <StatusRow label="Speech-to-Text" available={status?.personaplex?.asr_available} />
        <StatusRow label="Audio2Face" available={status?.personaplex?.audio2face_available} />

        {status?.personaplex?.fallback_mode && status.personaplex.fallback_mode !== "none" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700">
              {status.personaplex.fallback_mode === "browser_speech"
                ? "Using browser Web Speech API for voice features. For full PersonaPlex avatar experience, run on NVIDIA GPU."
                : "Using Riva speech services only. Avatar animation requires PersonaPlex server."}
            </p>
          </div>
        )}
      </div>

      {/* Quick Guide */}
      <div className="card space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Quick Guide</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>DGX Spark / NVIDIA GPU:</strong> Full PersonaPlex avatar with Riva speech and NIM inference. Maximum performance.</p>
          <p><strong>Apple Silicon (M3/M4/M5):</strong> Local LLM via llama.cpp with Metal acceleration. Browser speech for voice. Place a .gguf model in the <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">./models/</code> directory.</p>
          <p><strong>CPU Only:</strong> Local LLM (slower) or set <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">OPENAI_API_KEY</code> in <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env</code> for external API.</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon size={16} className="text-gray-400" />
        {label}
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function StatusRow({ label, available }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={clsx(
        "badge",
        available ? "badge-green" : "badge-gray"
      )}>
        {available ? "Available" : "Unavailable"}
      </span>
    </div>
  );
}
