import { clsx } from "clsx";
import { Bot, Mic, Brain, Volume2 } from "lucide-react";

const stateConfig = {
  idle: { icon: Bot, label: "Ready", bg: "bg-gray-100", ring: "" },
  listening: { icon: Mic, label: "Listening...", bg: "bg-blue-100", ring: "ring-4 ring-blue-200" },
  thinking: { icon: Brain, label: "Thinking...", bg: "bg-amber-100", ring: "ring-4 ring-amber-200 animate-pulse" },
  speaking: { icon: Volume2, label: "Speaking...", bg: "bg-brand-100", ring: "avatar-speaking" },
};

export default function AvatarWidget({ state = "idle", capabilities, large = false }) {
  const config = stateConfig[state] || stateConfig.idle;
  const Icon = config.icon;
  const hasAvatar = capabilities?.avatar_available;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar circle */}
      <div
        className={clsx(
          "flex items-center justify-center rounded-full transition-all duration-300",
          config.bg,
          config.ring,
          large ? "h-32 w-32" : "h-20 w-20"
        )}
      >
        {hasAvatar ? (
          // When PersonaPlex is available, this would embed the 3D avatar canvas
          <div className="text-center">
            <Icon size={large ? 48 : 28} className="text-brand-600 mx-auto" />
            <p className="text-xs text-brand-600 mt-1 font-medium">Hannah</p>
          </div>
        ) : (
          <Icon size={large ? 48 : 28} className="text-gray-500" />
        )}
      </div>

      {/* State label */}
      <p className="text-xs text-gray-500 font-medium">{config.label}</p>

      {/* Speech mode indicator */}
      <p className="text-xs text-gray-400">
        {hasAvatar ? "PersonaPlex Avatar" : "Browser Speech Mode"}
      </p>

      {/* Waveform visualization for speaking/listening */}
      {(state === "speaking" || state === "listening") && (
        <div className="flex items-center gap-0.5 h-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-1 rounded-full transition-all",
                state === "speaking" ? "bg-brand-400" : "bg-blue-400"
              )}
              style={{
                height: `${12 + Math.random() * 20}px`,
                animation: `waveform 0.6s ease-in-out ${i * 0.08}s infinite alternate`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes waveform {
              from { transform: scaleY(0.4); }
              to { transform: scaleY(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
