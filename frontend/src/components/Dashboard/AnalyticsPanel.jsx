import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { BarChart3, Briefcase, FileText, Mic, TrendingUp } from "lucide-react";
import { api } from "../../hooks/useApi";

// Dynamic import for ApexCharts (requires window - not SSR compatible)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

  // Chart data for interview scores
  const scoreChartOptions = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: "60%", distributed: true },
    },
    colors: interviewStats?.recent_scores?.map((s) =>
      s.score >= 7 ? "#22c55e" : s.score >= 5 ? "#f59e0b" : "#ef4444"
    ) || [],
    dataLabels: { enabled: true, formatter: (v) => v.toFixed(1), style: { fontSize: "11px" } },
    xaxis: {
      categories: interviewStats?.recent_scores?.map((s) =>
        s.date ? new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""
      ) || [],
      labels: { style: { fontSize: "11px", colors: "#9ca3af" } },
    },
    yaxis: { min: 0, max: 10, labels: { style: { fontSize: "11px", colors: "#9ca3af" } } },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    tooltip: { theme: "light" },
    legend: { show: false },
  };

  const scoreChartSeries = [
    {
      name: "Score",
      data: interviewStats?.recent_scores?.map((s) => s.score) || [],
    },
  ];

  // Pipeline donut chart
  const pipelineData = jobStats?.by_status || {};
  const pipelineChartOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    labels: ["Saved", "Applied", "Interviewing", "Offered", "Rejected"],
    colors: ["#d1d5db", "#93c5fd", "#fcd34d", "#86efac", "#fca5a5"],
    dataLabels: { enabled: true, style: { fontSize: "12px" } },
    legend: { position: "bottom", fontSize: "12px" },
    plotOptions: { pie: { donut: { size: "55%" } } },
  };

  const pipelineSeries = [
    pipelineData.saved || 0,
    pipelineData.applied || 0,
    pipelineData.interviewing || 0,
    pipelineData.offered || 0,
    pipelineData.rejected || 0,
  ];

  const hasPipelineData = pipelineSeries.some((v) => v > 0);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
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
          value={interviewStats?.average_score ? interviewStats.average_score.toFixed(1) : "-"}
          subtitle="out of 10"
          color="text-green-600 bg-green-100"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Application Pipeline */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Application Pipeline
          </h3>
          {hasPipelineData ? (
            <Chart
              options={pipelineChartOptions}
              series={pipelineSeries}
              type="donut"
              height={260}
            />
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No job applications tracked yet
            </div>
          )}
        </div>

        {/* Interview Scores */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Recent Interview Scores
          </h3>
          {interviewStats?.recent_scores?.length > 0 ? (
            <Chart
              options={scoreChartOptions}
              series={scoreChartSeries}
              type="bar"
              height={240}
            />
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Complete mock interviews to see scores
            </div>
          )}
        </div>
      </div>

      {/* Pipeline breakdown (detailed) */}
      {hasPipelineData && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Pipeline Breakdown
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
                    {jobStats?.by_status?.[key] || 0}
                  </p>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
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
