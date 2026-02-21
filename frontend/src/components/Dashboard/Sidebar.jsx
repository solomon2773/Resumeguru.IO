import { clsx } from "clsx";
import {
  MessageSquare,
  FileText,
  Briefcase,
  Mic,
  BarChart3,
  Settings,
  Cpu,
} from "lucide-react";

const navItems = [
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "resumes", label: "Resumes", icon: FileText },
  { id: "jobs", label: "Job Tracker", icon: Briefcase },
  { id: "interview", label: "Mock Interview", icon: Mic },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePanel, onNavigate, systemStatus }) {
  const computeLabel = {
    dgx_spark: "DGX Spark",
    nvidia_gpu: "NVIDIA GPU",
    apple_silicon: "Apple Silicon",
    cpu: "CPU",
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
          C
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">CareerOS</h1>
          <p className="text-xs text-gray-400">AI Career Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Cpu size={14} />
          <span>{computeLabel[systemStatus?.compute_backend] || "Detecting..."}</span>
        </div>
        {systemStatus?.gpu_name && systemStatus.gpu_name !== "unknown" && (
          <p className="mt-1 text-xs text-gray-400 truncate">
            {systemStatus.gpu_name}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1">
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              systemStatus?.status === "running"
                ? "bg-green-400"
                : "bg-gray-300"
            )}
          />
          <span className="text-xs text-gray-400">
            {systemStatus?.status === "running" ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>
    </aside>
  );
}
