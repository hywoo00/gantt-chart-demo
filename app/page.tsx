"use client";

import { useState } from "react";
import GanttChart from "@/components/GanttChart";
import D3GanttChartDemo from "@/components/D3GanttChartDemo";
import GanttTaskReactChart from "@/components/GanttTaskReactChart";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"google" | "d3" | "gantt-task">("gantt-task");

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gantt Chart Demo
          </h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("gantt-task")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "gantt-task"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            gantt-task-react
          </button>
          <button
            onClick={() => setActiveTab("d3")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "d3"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            D3.js Gantt Chart (커스터마이징 가능)
          </button>
          <button
            onClick={() => setActiveTab("google")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "google"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Google Charts Gantt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          {activeTab === "gantt-task" ? (
            <GanttTaskReactChart />
          ) : activeTab === "d3" ? (
            <D3GanttChartDemo />
          ) : (
            <GanttChart />
          )}
        </div>
      </div>
    </main>
  );
}

