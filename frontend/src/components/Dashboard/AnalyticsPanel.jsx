import { useState, useEffect } from "react";
import { BarChart3, Briefcase, FileText, Mic, TrendingUp } from "lucide-react";
import { api } from "../../hooks/useApi";

export default function AnalyticsPanel() {
  const [jobStats, setJobStats] = useState(null);
  const [interviewStats, setInterviewStats] = useState(null);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getJobStats().catch(() => null),
      api.getInterviewStats().catch(() => null),
      api.getResumes().catch(() => []),
    ]).then(([jobs, interviews, resumes]) => {
      setJobStats(jobs);
      setInterviewStats(interviews);
      setResumeCount(resumes?.length || 0);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p className="text-sm">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Resumes"
          value={resumeCount}
          color="text-purple-600 bg-purple-100"
        />
        <StatCard
          icon={Briefcase}
          label="Jobs Tracked"
          value={jobStats?.total || 0}
          color="text-blue-600 bg-blue-100"
        />
        <StatCard
          icon={Mic}
          label="Interviews"
          value={interviewStats?.total || 0}
          subtitle={`${interviewStats?.completed || 0} completed`}
          color="text-brand-600 bg-brand-100"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Score"
          value={interviewStats?.average_score || "-"}
          subtitle="out of 10"
          color="text-green-600 bg-green-100"
        />
      </div>

      {/* Job pipeline */}
      {jobStats && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Application Pipeline
          </h3>
          <div className="flex gap-2">
            {[
              { key: "saved", label: "Saved", color: "bg-gray-200" },
              { key: "applied", label: "Applied", color: "bg-blue-200" },
              { key: "interviewing", label: "Interviewing", color: "bg-yellow-200" },
              { key: "offered", label: "Offered", color: "bg-green-200" },
              { key: "rejected", label: "Rejected", color: "bg-red-200" },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex-1 text-center">
                <div className={`${color} rounded-lg py-6 mb-2`}>
                  <p className="text-2xl font-bold text-gray-800">
                    {jobStats.by_status?.[key] || 0}
                  </p>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent interview scores */}
      {interviewStats?.recent_scores?.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Recent Interview Scores
          </h3>
          <div className="flex items-end gap-2 h-40">
            {interviewStats.recent_scores.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <p className="text-xs font-medium text-gray-600 mb-1">{s.score}</p>
                <div
                  className="w-full rounded-t-md bg-brand-400 transition-all"
                  style={{ height: `${(s.score / 10) * 100}%` }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {s.date ? new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
