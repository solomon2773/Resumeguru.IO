import { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Dashboard/Sidebar";
import ChatPanel from "../components/Dashboard/ChatPanel";
import ResumePanel from "../components/Dashboard/ResumePanel";
import JobsPanel from "../components/Dashboard/JobsPanel";
import InterviewPanel from "../components/Dashboard/InterviewPanel";
import AnalyticsPanel from "../components/Dashboard/AnalyticsPanel";
import SettingsPanel from "../components/Dashboard/SettingsPanel";
import { api } from "../hooks/useApi";

const panels = {
  chat: ChatPanel,
  resumes: ResumePanel,
  jobs: JobsPanel,
  interview: InterviewPanel,
  analytics: AnalyticsPanel,
  settings: SettingsPanel,
};

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState("chat");
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    api.getStatus()
      .then(setSystemStatus)
      .catch(() => {
        // Backend not ready yet, retry
        const timer = setInterval(() => {
          api.getStatus()
            .then((data) => {
              setSystemStatus(data);
              clearInterval(timer);
            })
            .catch(() => {});
        }, 3000);
        return () => clearInterval(timer);
      });
  }, []);

  const ActivePanel = panels[activePanel] || ChatPanel;

  return (
    <>
      <Head>
        <title>CareerOS - AI Career Assistant</title>
        <meta name="description" content="AI-powered career assistant with PersonaPlex" />
      </Head>

      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activePanel={activePanel}
          onNavigate={setActivePanel}
          systemStatus={systemStatus}
        />
        <main className="flex-1 overflow-hidden">
          <ActivePanel />
        </main>
      </div>
    </>
  );
}
