import { useState, useEffect } from "react";
import { Plus, Briefcase, Trash2, ExternalLink, Edit3, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../hooks/useApi";
import { clsx } from "clsx";

const statusConfig = {
  saved: { label: "Saved", class: "badge-gray" },
  applied: { label: "Applied", class: "badge-blue" },
  interviewing: { label: "Interviewing", class: "badge-yellow" },
  offered: { label: "Offered", class: "badge-green" },
  rejected: { label: "Rejected", class: "badge-red" },
};

export default function JobsPanel() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadJobs(); }, [filter]);

  async function loadJobs() {
    try {
      const data = await api.getJobs(filter);
      setJobs(data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const job = await api.createJob({ job_title: "New Position", company: "" });
      await loadJobs();
      setSelected(job);
      setEditing(true);
      setEditData(job);
    } catch {
      toast.error("Failed to create job");
    }
  }

  async function handleSave() {
    if (!selected) return;
    try {
      await api.updateJob(selected.id, editData);
      toast.success("Job saved");
      setEditing(false);
      await loadJobs();
      setSelected({ ...selected, ...editData });
    } catch {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteJob(id);
      toast.success("Job deleted");
      if (selected?.id === id) setSelected(null);
      await loadJobs();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex h-full">
      {/* Job List */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="border-b border-gray-100 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Job Tracker</h2>
            <button onClick={handleCreate} className="btn-primary text-xs">
              <Plus size={14} /> Add Job
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {["", "saved", "applied", "interviewing", "offered", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={clsx(
                  "rounded-full px-2.5 py-1 text-xs transition",
                  filter === s ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && <p className="text-sm text-gray-400 p-4">Loading...</p>}
          {!loading && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <Briefcase size={40} strokeWidth={1.5} />
              <p className="text-sm mt-2">No jobs tracked yet</p>
            </div>
          )}
          {jobs.map((j) => (
            <button
              key={j.id}
              onClick={() => { setSelected(j); setEditing(false); }}
              className={`w-full text-left rounded-lg p-3 transition ${
                selected?.id === j.id ? "bg-brand-50 border border-brand-200" : "hover:bg-gray-50"
              }`}
            >
              <p className="text-sm font-medium text-gray-900 truncate">{j.job_title || "Untitled"}</p>
              <p className="text-xs text-gray-500 truncate">{j.company || "No company"}</p>
              <span className={clsx("mt-1 inline-block", statusConfig[j.status]?.class || "badge-gray")}>
                {statusConfig[j.status]?.label || j.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Job Detail */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Briefcase size={56} strokeWidth={1} />
            <p className="text-sm mt-3">Select a job to view details</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selected.job_title}</h3>
                <p className="text-sm text-gray-500">{selected.company} {selected.location && `| ${selected.location}`}</p>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} className="btn-primary text-xs"><Save size={14} /> Save</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary text-xs"><X size={14} /> Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(true); setEditData(selected); }} className="btn-secondary text-xs"><Edit3 size={14} /> Edit</button>
                    <button onClick={() => handleDelete(selected.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <Field label="Job Title" value={editData.job_title} onChange={(v) => setEditData({ ...editData, job_title: v })} />
                <Field label="Company" value={editData.company} onChange={(v) => setEditData({ ...editData, company: v })} />
                <Field label="Location" value={editData.location} onChange={(v) => setEditData({ ...editData, location: v })} />
                <Field label="URL" value={editData.url} onChange={(v) => setEditData({ ...editData, url: v })} />
                <Field label="Salary Range" value={editData.salary_range} onChange={(v) => setEditData({ ...editData, salary_range: v })} />
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editData.status || "saved"}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="input mt-1"
                  >
                    {Object.entries(statusConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={8}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editData.notes || ""}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={3}
                    className="input mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <span className={clsx(statusConfig[selected.status]?.class || "badge-gray")}>
                    {statusConfig[selected.status]?.label || selected.status}
                  </span>
                  {selected.salary_range && <span className="text-sm text-gray-500">{selected.salary_range}</span>}
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {selected.description && (
                  <div className="card">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.description}</p>
                  </div>
                )}

                {selected.extracted_skills?.length > 0 && (
                  <div className="card">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.extracted_skills.map((s, i) => (
                        <span key={i} className="badge-blue">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.notes && (
                  <div className="card">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="input mt-1" />
    </div>
  );
}
