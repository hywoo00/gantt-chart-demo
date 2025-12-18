"use client";

import { Chart } from "react-google-charts";
import { useMemo } from "react";

export default function GanttChart() {
  const data = useMemo(() => {
    return [
      [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
      ],
      [
        "Research",
        "시장 조사 및 분석",
        "연구팀",
        new Date(2024, 0, 1),
        new Date(2024, 0, 14),
        null,
        100,
        null,
      ],
      [
        "Design",
        "UI/UX 디자인",
        "디자인팀",
        new Date(2024, 0, 15),
        new Date(2024, 1, 5),
        null,
        100,
        "Research",
      ],
      [
        "Frontend",
        "프론트엔드 개발",
        "개발팀",
        new Date(2024, 1, 6),
        new Date(2024, 2, 20),
        null,
        75,
        "Design",
      ],
      [
        "Backend",
        "백엔드 개발",
        "개발팀",
        new Date(2024, 1, 6),
        new Date(2024, 2, 15),
        null,
        80,
        "Design",
      ],
      [
        "Database",
        "데이터베이스 설계 및 구축",
        "개발팀",
        new Date(2024, 1, 10),
        new Date(2024, 2, 10),
        null,
        90,
        "Design",
      ],
      [
        "API",
        "API 개발 및 통합",
        "개발팀",
        new Date(2024, 2, 1),
        new Date(2024, 3, 15),
        null,
        60,
        "Backend,Database",
      ],
      [
        "Testing",
        "테스트 및 QA",
        "QA팀",
        new Date(2024, 2, 16),
        new Date(2024, 3, 5),
        null,
        50,
        "Frontend,Backend",
      ],
      [
        "Security",
        "보안 검토 및 강화",
        "보안팀",
        new Date(2024, 3, 1),
        new Date(2024, 3, 20),
        null,
        40,
        "API",
      ],
      [
        "Performance",
        "성능 최적화",
        "개발팀",
        new Date(2024, 3, 6),
        new Date(2024, 4, 10),
        null,
        30,
        "Testing",
      ],
      [
        "Documentation",
        "문서화 작업",
        "기획팀",
        new Date(2024, 3, 15),
        new Date(2024, 4, 30),
        null,
        20,
        "API",
      ],
      [
        "Training",
        "사용자 교육 및 매뉴얼 작성",
        "교육팀",
        new Date(2024, 4, 1),
        new Date(2024, 5, 15),
        null,
        10,
        "Documentation",
      ],
      [
        "Deploy",
        "배포 및 런칭",
        "운영팀",
        new Date(2024, 5, 1),
        new Date(2024, 5, 10),
        null,
        0,
        "Performance,Security",
      ],
      [
        "Monitoring",
        "모니터링 시스템 구축",
        "운영팀",
        new Date(2024, 5, 5),
        new Date(2024, 6, 5),
        null,
        0,
        "Deploy",
      ],
      [
        "Maintenance",
        "유지보수 및 업데이트",
        "운영팀",
        new Date(2024, 6, 1),
        new Date(2024, 8, 30),
        null,
        0,
        "Monitoring",
      ],
      [
        "Enhancement",
        "기능 개선 및 확장",
        "개발팀",
        new Date(2024, 7, 1),
        new Date(2024, 10, 30),
        null,
        0,
        "Maintenance",
      ],
      [
        "Review",
        "프로젝트 리뷰 및 평가",
        "관리팀",
        new Date(2024, 11, 1),
        new Date(2024, 11, 31),
        null,
        0,
        "Enhancement",
      ],
    ];
  }, []);

  // 작업 수에 따라 동적으로 높이 계산 (헤더 제외한 데이터 행 수)
  const taskCount = data.length - 1; // 헤더 행 제외
  const trackHeight = 50;
  const headerHeight = 60; // 헤더 영역 높이
  const padding = 40; // 상하 여유 공간
  const calculatedHeight = taskCount * trackHeight + headerHeight + padding;

  const options = {
    height: calculatedHeight,
    width: 2000,
    gantt: {
      trackHeight: trackHeight,
      barHeight: 30,
      barCornerRadius: 5,
      labelStyle: {
        fontName: "Arial",
        fontSize: 14,
        color: "#333",
      },
      arrow: {
        angle: 45,
        width: 5,
        color: "#666",
        radius: 0,
      },
      defaultStartDate: new Date(2024, 0, 1),
    },
    backgroundColor: "#f9fafb",
    tooltip: {
      isHtml: true,
    },
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          프로젝트 일정표
        </h2>
        <p className="text-sm text-gray-600">
          각 작업의 시작일, 종료일, 진행률을 확인할 수 있습니다.
        </p>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg p-4 bg-white">
        <Chart
          chartType="Gantt"
          width="2000px"
          height={`${calculatedHeight}px`}
          data={data}
          options={options}
        />
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          범례
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-700">완료된 작업</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-700">진행 중</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
            <span className="text-gray-700">예정된 작업</span>
          </div>
        </div>
      </div>
    </div>
  );
}

