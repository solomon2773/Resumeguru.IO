import { useState, useEffect, useRef } from "react";
import { Plus, Upload, FileText, Trash2, Star, Edit3, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../hooks/useApi";

export default function ResumePanel() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const data = await api.getResumes();
      setResumes(data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.uploadResume(file);
      toast.success(result.message);
      await loadResumes();
    } catch {
      toast.error("Upload failed");
    }
  }

  async function handleCreate() {
    try {
      const resume = await api.createResume({ title: "New Resume" });
      await loadResumes();
      setSelected(resume);
      setEditing(true);
      setEditData(resume);
    } catch {
      toast.error("Failed to create resume");
    }
  }

  async function handleSave() {
    if (!selected) return;
    try {
      await api.updateResume(selected.id, editData);
      toast.success("Resume saved");
      setEditing(false);
      await loadResumes();
      setSelected({ ...selected, ...editData });
    } catch {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteResume(id);
      toast.success("Resume deleted");
      if (selected?.id === id) setSelected(null);
      await loadResumes();
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="flex h-full">
      {/* Resume List */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Resumes</h2>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="btn-primary text-xs">
              <Plus size={14} /> New
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary text-xs"
            >
              <Upload size={14} /> Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && <p className="text-sm text-gray-400 p-4">Loading...</p>}
          {!loading && resumes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <FileText size={40} strokeWidth={1.5} />
              <p className="text-sm mt-2">No resumes yet</p>
              <p className="text-xs mt-1">Create one or upload a PDF/DOCX</p>
            </div>
          )}
          {resumes.map((r) => (
            <button
              key={r.id}
              onClick={() => { setSelected(r); setEditing(false); }}
              className={`w-full text-left rounded-lg p-3 transition ${
                selected?.id === r.id
                  ? "bg-brand-50 border border-brand-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-gray-500 truncate">{r.full_name || "No name set"}</p>
                </div>
                {r.is_primary && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Detail */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FileText size={56} strokeWidth={1} />
            <p className="text-sm mt-3">Select a resume to view or edit</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{selected.title}</h3>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} className="btn-primary text-xs">
                      <Save size={14} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary text-xs">
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditing(true); setEditData(selected); }}
                      className="btn-secondary text-xs"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <Field label="Title" value={editData.title} onChange={(v) => setEditData({ ...editData, title: v })} />
                <Field label="Full Name" value={editData.full_name} onChange={(v) => setEditData({ ...editData, full_name: v })} />
                <Field label="Email" value={editData.email} onChange={(v) => setEditData({ ...editData, email: v })} />
                <Field label="Phone" value={editData.phone} onChange={(v) => setEditData({ ...editData, phone: v })} />
                <Field label="Location" value={editData.location} onChange={(v) => setEditData({ ...editData, location: v })} />
                <div>
                  <label className="text-sm font-medium text-gray-700">Summary</label>
                  <textarea
                    value={editData.summary || ""}
                    onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                    rows={4}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <input
                    value={(editData.skills || []).join(", ")}
                    onChange={(e) =>
                      setEditData({ ...editData, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                    }
                    className="input mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Section title="Contact">
                  <p className="text-sm text-gray-700">{selected.full_name || "-"}</p>
                  <p className="text-sm text-gray-500">{selected.email} {selected.phone && `| ${selected.phone}`}</p>
                  <p className="text-sm text-gray-500">{selected.location}</p>
                </Section>

                {selected.summary && (
                  <Section title="Summary">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.summary}</p>
                  </Section>
                )}

                {selected.skills?.length > 0 && (
                  <Section title="Skills">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.skills.map((s, i) => (
                        <span key={i} className="badge-blue">{s}</span>
                      ))}
                    </div>
                  </Section>
                )}

                {selected.experience?.length > 0 && (
                  <Section title="Experience">
                    {selected.experience.map((exp, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <p className="text-sm font-medium text-gray-900">{exp.title} at {exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.start} - {exp.end || "Present"}</p>
                        {exp.bullets?.map((b, j) => (
                          <p key={j} className="text-sm text-gray-700 ml-4 before:content-['•'] before:mr-2">{b}</p>
                        ))}
                      </div>
                    ))}
                  </Section>
                )}

                {selected.education?.length > 0 && (
                  <Section title="Education">
                    {selected.education.map((edu, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <p className="text-sm font-medium text-gray-900">{edu.degree} in {edu.field}</p>
                        <p className="text-xs text-gray-500">{edu.school} | {edu.start} - {edu.end || "Present"}</p>
                      </div>
                    ))}
                  </Section>
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

function Section({ title, children }) {
  return (
    <div className="card">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h4>
      {children}
    </div>
  );
}
