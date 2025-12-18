"use client";

import { useMemo, useState } from "react";
import D3GanttChart, { GanttTask } from "./D3GanttChart";

export default function D3GanttChartDemo() {
  const [groupBy, setGroupBy] = useState<"sprint" | "project" | "none">("sprint");

  const tasks: GanttTask[] = useMemo(() => {
    return [
      {
        id: "research",
        name: "시장 조사 및 분석",
        resource: "연구팀",
        start: new Date(2025, 0, 1),
        end: new Date(2025, 0, 14),
        progress: 100,
        project: "프로젝트 A",
      },
      {
        id: "design",
        name: "UI/UX 디자인",
        resource: "디자인팀",
        start: new Date(2025, 0, 15),
        end: new Date(2025, 1, 5),
        progress: 100,
        dependencies: ["research"],
        project: "프로젝트 A",
      },
      {
        id: "frontend",
        name: "프론트엔드 개발",
        resource: "개발팀",
        start: new Date(2025, 1, 6),
        end: new Date(2025, 2, 20),
        progress: 75,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "dev-sprint1", // 부모 작업
      },
      {
        id: "frontend-ui",
        name: "  - UI 컴포넌트 개발",
        resource: "개발팀",
        start: new Date(2025, 1, 6),
        end: new Date(2025, 2, 10),
        progress: 90,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "frontend", // frontend의 자식
      },
      {
        id: "frontend-integration",
        name: "  - API 통합",
        resource: "개발팀",
        start: new Date(2025, 2, 11),
        end: new Date(2025, 2, 20),
        progress: 60,
        dependencies: ["frontend-ui"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "frontend", // frontend의 자식
      },
      {
        id: "backend",
        name: "백엔드 개발",
        resource: "개발팀",
        start: new Date(2025, 1, 6),
        end: new Date(2025, 2, 15),
        progress: 80,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "dev-sprint1", // 부모 작업
      },
      {
        id: "backend-api",
        name: "  - REST API 개발",
        resource: "개발팀",
        start: new Date(2025, 1, 6),
        end: new Date(2025, 2, 5),
        progress: 100,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "backend", // backend의 자식
      },
      {
        id: "backend-auth",
        name: "  - 인증 시스템",
        resource: "개발팀",
        start: new Date(2025, 2, 6),
        end: new Date(2025, 2, 15),
        progress: 60,
        dependencies: ["backend-api"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "backend", // backend의 자식
      },
      {
        id: "database",
        name: "데이터베이스 설계 및 구축",
        resource: "개발팀",
        start: new Date(2025, 1, 10),
        end: new Date(2025, 2, 10),
        progress: 90,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
        parentId: "dev-sprint1", // 부모 작업
      },
      {
        id: "dev-sprint1",
        name: "Sprint 1 개발 작업",
        resource: "개발팀",
        start: new Date(2025, 1, 6),
        end: new Date(2025, 2, 20),
        progress: 80,
        dependencies: ["design"],
        sprint: "Sprint 1",
        project: "프로젝트 A",
      },
      {
        id: "api",
        name: "API 개발 및 통합",
        resource: "개발팀",
        start: new Date(2025, 2, 1),
        end: new Date(2025, 3, 15),
        progress: 60,
        dependencies: ["backend", "database"],
        sprint: "Sprint 2",
        project: "프로젝트 A",
      },
      {
        id: "testing",
        name: "테스트 및 QA",
        resource: "QA팀",
        start: new Date(2025, 2, 16),
        end: new Date(2025, 3, 5),
        progress: 50,
        dependencies: ["frontend", "backend"],
        sprint: "Sprint 2",
        project: "프로젝트 A",
      },
      {
        id: "security",
        name: "보안 검토 및 강화",
        resource: "보안팀",
        start: new Date(2025, 3, 1),
        end: new Date(2025, 3, 20),
        progress: 40,
        dependencies: ["api"],
        sprint: "Sprint 3",
        project: "프로젝트 A",
      },
      {
        id: "performance",
        name: "성능 최적화",
        resource: "개발팀",
        start: new Date(2025, 3, 6),
        end: new Date(2025, 4, 10),
        progress: 30,
        dependencies: ["testing"],
        sprint: "Sprint 3",
        project: "프로젝트 A",
      },
      {
        id: "documentation",
        name: "문서화 작업",
        resource: "기획팀",
        start: new Date(2025, 3, 15),
        end: new Date(2025, 4, 30),
        progress: 20,
        dependencies: ["api"],
        sprint: "Sprint 3",
        project: "프로젝트 A",
      },
      {
        id: "training",
        name: "사용자 교육 및 매뉴얼 작성",
        resource: "교육팀",
        start: new Date(2025, 4, 1),
        end: new Date(2025, 5, 15),
        progress: 10,
        dependencies: ["documentation"],
        sprint: "Sprint 4",
        project: "프로젝트 A",
      },
      {
        id: "deploy",
        name: "배포 및 런칭",
        resource: "운영팀",
        start: new Date(2025, 5, 1),
        end: new Date(2025, 5, 10),
        progress: 0,
        dependencies: ["performance", "security"],
        sprint: "Sprint 4",
        project: "프로젝트 A",
      },
      {
        id: "monitoring",
        name: "모니터링 시스템 구축",
        resource: "운영팀",
        start: new Date(2025, 5, 5),
        end: new Date(2025, 6, 5),
        progress: 0,
        dependencies: ["deploy"],
        sprint: "Sprint 5",
        project: "프로젝트 A",
      },
      {
        id: "maintenance",
        name: "유지보수 및 업데이트",
        resource: "운영팀",
        start: new Date(2025, 6, 1),
        end: new Date(2025, 8, 30),
        progress: 0,
        dependencies: ["monitoring"],
        sprint: "Sprint 5",
        project: "프로젝트 A",
      },
      {
        id: "enhancement",
        name: "기능 개선 및 확장",
        resource: "개발팀",
        start: new Date(2025, 7, 1),
        end: new Date(2025, 10, 30),
        progress: 0,
        dependencies: ["maintenance"],
        sprint: "Sprint 6",
        project: "프로젝트 A",
      },
      {
        id: "review",
        name: "프로젝트 리뷰 및 평가",
        resource: "관리팀",
        start: new Date(2025, 11, 1),
        end: new Date(2025, 11, 31),
        progress: 0,
        dependencies: ["enhancement"],
        sprint: "Sprint 7",
        project: "프로젝트 A",
      },
      // 프로젝트 B 예시
      {
        id: "project-b-research",
        name: "시장 조사",
        resource: "연구팀",
        start: new Date(2025, 2, 1),
        end: new Date(2025, 2, 15),
        progress: 100,
        project: "프로젝트 B",
        sprint: "Sprint 2",
      },
      {
        id: "project-b-design",
        name: "디자인",
        resource: "디자인팀",
        start: new Date(2025, 2, 16),
        end: new Date(2025, 3, 10),
        progress: 80,
        dependencies: ["project-b-research"],
        project: "프로젝트 B",
        sprint: "Sprint 3",
      },
    ];
  }, []);

  const handleTaskClick = (task: GanttTask) => {
    console.log("Task clicked:", task);
    // 여기에 작업 클릭 시 동작 추가 가능
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          D3.js 기반 Gantt Chart
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          커스터마이징 가능한 간트 차트 (Sprint/Project 그룹화, 계층 구조, Collapsible 지원)
        </p>
        
        {/* 그룹화 옵션 선택 */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="sprint"
              checked={groupBy === "sprint"}
              onChange={(e) => setGroupBy(e.target.value as "sprint" | "project" | "none")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Sprint별 그룹화</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="project"
              checked={groupBy === "project"}
              onChange={(e) => setGroupBy(e.target.value as "sprint" | "project" | "none")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Project별 그룹화</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="none"
              checked={groupBy === "none"}
              onChange={(e) => setGroupBy(e.target.value as "sprint" | "project" | "none")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">그룹화 없음</span>
          </label>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <D3GanttChart
          tasks={tasks}
          width={2000}
          groupBy={groupBy}
          onTaskClick={handleTaskClick}
        />
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">구현된 기능</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>✅ Sprint/Project별 그룹화 및 접기/펼치기</li>
          <li>✅ 작업 계층 구조 (parentId) 및 접기/펼치기</li>
          <li>✅ 커스텀 Node UI (색상, 모양, 진행률 표시)</li>
          <li>✅ 커스텀 Edge (의존성 화살표)</li>
          <li>✅ 작업 클릭 이벤트</li>
          <li>✅ 동적 높이 계산</li>
        </ul>
      </div>
    </div>
  );
}

