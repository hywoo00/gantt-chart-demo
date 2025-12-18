"use client";

import React, { useState } from "react";
import { Gantt, Task, ViewMode } from "./gantt-task-react";
import "gantt-task-react/dist/index.css";

// 커스텀 TaskListHeader - 차트 디자인과 일치
const CustomTaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, rowWidth, fontFamily, fontSize }) => {
  return (
    <div
      style={{
        display: "flex",
        width: rowWidth,
        height: headerHeight,
        fontFamily: fontFamily,
        fontSize: fontSize,
        borderBottom: "1px solid #E5E7EB",
        backgroundColor: "#F9FAFB",
        color: "#374151",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          minWidth: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          paddingLeft: "12px",
          fontSize: "13px",
        }}
      >
        작업 이름
      </div>
    </div>
  );
};

export default function GanttTaskReactChart() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = useState(true);
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    // 모든 날짜를 명시적으로 Date 객체로 생성
    // 프로젝트-작업 계층 구조로 구성 (collapsible 지원)
    const tasksData: Task[] = [
      // 프로젝트 A (부모) - 2025년 11월 ~ 2026년 2월
      {
        start: new Date(2025, 10, 1), // 2025년 11월 1일
        end: new Date(2026, 1, 28), // 2026년 2월 28일
        name: "프로젝트 A",
        id: "project-a",
        type: "project",
        progress: 50,
        isDisabled: false,
        hideChildren: false,
      },
      // 프로젝트 A의 자식 작업들
      {
        start: new Date(2025, 10, 1), // 2025년 11월 1일
        end: new Date(2025, 10, 7), // 2025년 11월 7일
        name: "시장 조사 및 분석",
        id: "research",
        type: "task",
        progress: 100,
        isDisabled: false,
        project: "project-a",
        dependencies: [],
        assignee: "김팀장",
      },
      {
        start: new Date(2025, 10, 8), // 2025년 11월 8일
        end: new Date(2025, 10, 14), // 2025년 11월 14일
        name: "UI/UX 디자인",
        id: "design",
        type: "task",
        progress: 100,
        isDisabled: false,
        project: "project-a",
        dependencies: ["research"],
        assignee: "이디자이너",
      },
      {
        start: new Date(2025, 10, 15), // 2025년 11월 15일
        end: new Date(2025, 10, 21), // 2025년 11월 21일
        name: "프론트엔드 개발",
        id: "frontend",
        type: "task",
        progress: 75,
        isDisabled: false,
        project: "project-a",
        dependencies: ["design"],
        assignee: ["박프론트", "최프론트"],
      },
      {
        start: new Date(2025, 10, 15), // 2025년 11월 15일
        end: new Date(2025, 10, 21), // 2025년 11월 21일
        name: "백엔드 개발",
        id: "backend",
        type: "task",
        progress: 80,
        isDisabled: false,
        project: "project-a",
        dependencies: ["design"],
        assignee: "정백엔드",
      },
      {
        start: new Date(2025, 10, 22), // 2025년 11월 22일
        end: new Date(2025, 10, 28), // 2025년 11월 28일
        name: "데이터베이스 설계 및 구축",
        id: "database",
        type: "task",
        progress: 90,
        isDisabled: false,
        project: "project-a",
        dependencies: ["design"],
        assignee: "강DBA",
      },
      {
        start: new Date(2025, 10, 29), // 2025년 11월 29일
        end: new Date(2025, 11, 4), // 2025년 12월 4일
        name: "API 개발 및 통합",
        id: "api",
        type: "task",
        progress: 60,
        isDisabled: false,
        project: "project-a",
        dependencies: ["backend", "database"],
        assignee: "정백엔드",
      },
      {
        start: new Date(2025, 11, 5), // 2025년 12월 5일
        end: new Date(2025, 11, 11), // 2025년 12월 11일
        name: "테스트 및 QA",
        id: "testing",
        type: "task",
        progress: 50,
        isDisabled: false,
        project: "project-a",
        dependencies: ["frontend", "backend"],
        assignee: ["윤QA", "임QA"],
      },
      {
        start: new Date(2025, 11, 12), // 2025년 12월 12일
        end: new Date(2025, 11, 18), // 2025년 12월 18일
        name: "보안 검토 및 강화",
        id: "security",
        type: "task",
        progress: 40,
        isDisabled: false,
        project: "project-a",
        dependencies: ["api"],
        assignee: "조보안",
      },
      {
        start: new Date(2025, 11, 19), // 2025년 12월 19일
        end: new Date(2025, 11, 25), // 2025년 12월 25일
        name: "성능 최적화",
        id: "performance",
        type: "task",
        progress: 30,
        isDisabled: false,
        project: "project-a",
        dependencies: ["testing"],
        assignee: "정백엔드",
      },
      {
        start: new Date(2025, 11, 26), // 2025년 12월 26일
        end: new Date(2026, 0, 4), // 2026년 1월 4일
        name: "문서화 작업",
        id: "documentation",
        type: "task",
        progress: 20,
        isDisabled: false,
        project: "project-a",
        dependencies: ["api"],
        assignee: "김문서",
      },
      {
        start: new Date(2026, 0, 5), // 2026년 1월 5일
        end: new Date(2026, 0, 11), // 2026년 1월 11일
        name: "사용자 교육 및 매뉴얼 작성",
        id: "training",
        type: "task",
        progress: 10,
        isDisabled: false,
        project: "project-a",
        dependencies: ["documentation"],
        assignee: "이교육",
      },
      {
        start: new Date(2026, 0, 12), // 2026년 1월 12일
        end: new Date(2026, 0, 18), // 2026년 1월 18일
        name: "배포 및 런칭",
        id: "deploy",
        type: "task",
        progress: 0,
        isDisabled: false,
        project: "project-a",
        dependencies: ["performance", "security"],
        assignee: ["김팀장", "정백엔드"],
      },
    ];
    
    // 모든 작업의 날짜가 유효한지 검증하고 dependencies 검증
    const taskIds = new Set(tasksData.map(t => t.id));
    const validTasks = tasksData
      .filter(task => {
        const isValid = task.start instanceof Date && 
                        task.end instanceof Date && 
                        !isNaN(task.start.getTime()) && 
                        !isNaN(task.end.getTime()) &&
                        task.start.getTime() <= task.end.getTime();
        if (!isValid) {
          console.warn(`Invalid date for task ${task.id}:`, task);
          return false;
        }
        return true;
      })
      .map(task => {
        // dependencies가 존재하는 작업만 참조하도록 필터링
        if (task.dependencies && task.dependencies.length > 0) {
          const validDeps = task.dependencies.filter(depId => taskIds.has(depId));
          if (validDeps.length !== task.dependencies.length) {
            console.warn(`Task ${task.id} has invalid dependencies:`, task.dependencies);
          }
          return {
            ...task,
            dependencies: validDeps,
          };
        }
        return task;
      });
    
    return validTasks;
  });

  const handleTaskChange = (task: Task, children: Task[]) => {
    console.log("On date change Id:", task.id);
    // Date 객체가 아닌 경우 변환하고 유효성 검사
    const startDate = task.start instanceof Date 
      ? task.start 
      : task.start 
        ? new Date(task.start) 
        : new Date();
    const endDate = task.end instanceof Date 
      ? task.end 
      : task.end 
        ? new Date(task.end) 
        : new Date();
    
    // 유효한 날짜인지 확인
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid date for task:", task.id, task.start, task.end);
      return false; // 변경 취소
    }
    
    const updatedTask: Task = {
      ...task,
      start: startDate,
      end: endDate,
    };
    const newTasks = allTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setAllTasks(newTasks);
    return true;
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("작업을 삭제하시겠습니까? \n" + task.name);
    if (conf) {
      setAllTasks(allTasks.filter((t) => t.id !== task.id));
    }
  };

  const handleProgressChange = async (task: Task, children: Task[]) => {
    // Date 객체가 아닌 경우 변환
    const updatedTask: Task = {
      ...task,
      start: task.start instanceof Date ? task.start : new Date(task.start),
      end: task.end instanceof Date ? task.end : new Date(task.end),
    };
    setAllTasks(allTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    console.log("On progress change Id:", task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("작업을 두 번 클릭했습니다: " + task.name);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "been" : "not been") + " selected.");
  };

  const handleExpanderClick = (task: Task) => {
    // hideChildren 상태를 토글 (undefined는 false로 처리)
    setAllTasks((prevTasks) => {
      return prevTasks.map((t) => {
        if (t.id === task.id) {
          const currentHideChildren = t.hideChildren ?? false;
          const newHideChildren = !currentHideChildren;
          console.log(`Task ${task.id} hideChildren: ${currentHideChildren} -> ${newHideChildren}`);
          return { ...t, hideChildren: newHideChildren };
        }
        return t;
      });
    });
  };

  // 커스텀 TaskListTable - From/To 컬럼 제거 및 collapsible 지원
  // 컴포넌트 내부에 정의하여 allTasks를 직접 참조
  const CustomTaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }> = ({
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks: propTasks,
    selectedTaskId,
    setSelectedTask,
    onExpanderClick,
  }) => {
    // 원본 allTasks를 사용하여 필터링 (propTasks는 라이브러리가 필터링한 것일 수 있음)
    // hideChildren이 true인 프로젝트의 자식 작업 필터링
    const visibleTasks = allTasks.filter((task) => {
      if (task.project) {
        const parentTask = allTasks.find((t) => t.id === task.project);
        if (parentTask?.hideChildren === true) {
          return false; // 부모가 접혀있으면 자식 숨김
        }
      }
      return true;
    });

    return (
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          backgroundColor: "#FFFFFF",
        }}
      >
        {visibleTasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const hasChildren = allTasks.some((t) => t.project === task.id);
          const indent = task.type === "project" ? 0 : 20;
          // hideChildren 상태 확인 (undefined는 false로 처리)
          const isCollapsed = task.hideChildren === true;
          
          // 깔끔한 스타일: 모든 행 흰색 배경
          const rowIndex = visibleTasks.indexOf(task);
          
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task.id)}
              style={{
                display: "flex",
                width: rowWidth,
                height: rowHeight,
                backgroundColor: isSelected 
                  ? "#EEF2FF" 
                  : "#FFFFFF",
                borderBottom: "1px solid #E5E7EB",
                borderRight: "1px solid #E5E7EB",
                cursor: "pointer",
                alignItems: "center",
                transition: "background-color 0.15s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }
              }}
            >
              <div
                style={{
                  minWidth: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: hasChildren ? "pointer" : "default",
                  color: "#6366F1",
                  fontSize: "10px",
                  fontWeight: 600,
                  transition: "color 0.15s ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) {
                    onExpanderClick(task);
                  }
                }}
                onMouseEnter={(e) => {
                  if (hasChildren) {
                    e.currentTarget.style.color = "#4F46E5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasChildren) {
                    e.currentTarget.style.color = "#6366F1";
                  }
                }}
              >
                {hasChildren ? (isCollapsed ? "▶" : "▼") : ""}
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: `${12 + indent}px`,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: isSelected ? "#4F46E5" : "#111827",
                  fontSize: "14px",
                  fontWeight: task.type === "project" ? 600 : 400,
                  transition: "color 0.15s ease",
                }}
              >
                {task.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          gantt-task-react Gantt Chart
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          gantt-task-react 라이브러리를 사용한 간트 차트 데모
        </p>
        
        {/* 뷰 모드 선택 */}
        <div className="mb-4 flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm text-gray-700">뷰 모드:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(Number(e.target.value) as unknown as ViewMode)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={ViewMode.QuarterDay}>Quarter Day</option>
              <option value={ViewMode.HalfDay}>Half Day</option>
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
              <option value={ViewMode.Year}>Year</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">작업 목록 표시</span>
          </label>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-x-auto gantt-container">
        {allTasks.length > 0 ? (
          <Gantt
            tasks={(() => {
              // hideChildren이 true인 프로젝트의 자식 작업 필터링
              const filteredTasks = allTasks.filter((task) => {
                if (task.project) {
                  const parentTask = allTasks.find((t) => t.id === task.project);
                  if (parentTask?.hideChildren === true) {
                    return false; // 부모가 접혀있으면 자식 숨김
                  }
                }
                return true;
              });

              return filteredTasks
                .map(t => {
                  // Date 객체 보장 및 유효성 검사
                  const start = t.start instanceof Date ? t.start : new Date(t.start);
                  const end = t.end instanceof Date ? t.end : new Date(t.end);
                  
                  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    console.error(`Invalid date for task ${t.id}`);
                    return null;
                  }
                  
                  return {
                    ...t,
                    start,
                    end,
                    // dependencies는 유효한 작업 ID만 포함 (필터링된 tasks 기준)
                    dependencies: (t.dependencies || []).filter(depId => 
                      filteredTasks.some(task => task.id === depId)
                    ),
                  } as Task;
                })
                .filter((t): t is Task => t !== null);
            })()}
            viewMode={viewMode}
            viewDate={(() => {
              // 오늘 날짜에서 약 2주 전으로 설정하여 오늘 날짜가 차트의 적당한 위치에 오도록 함
              const today = new Date();
              const viewDate = new Date(today);
              viewDate.setDate(today.getDate() - 3); // 3일 전
              return viewDate;
            })()}
            locale="ko"
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "155px" : ""}
            // 현대적이고 세련된 색상 팔레트
            barProgressColor="#4F46E5" // 인디고 (진한)
            barProgressSelectedColor="#4338CA" // 인디고 (더 진한)
            barBackgroundColor="#6366F1" // 인디고 (밝은)
            barBackgroundSelectedColor="#5B21B6" // 인디고 (선택)
            projectProgressColor="#7C3AED" // 보라색 (진한)
            projectProgressSelectedColor="#6D28D9" // 보라색 (더 진한)
            projectBackgroundColor="#A78BFA" // 보라색 (밝은)
            projectBackgroundSelectedColor="#8B5CF6" // 보라색 (선택)
            milestoneBackgroundColor="#EC4899" // 핑크
            milestoneBackgroundSelectedColor="#DB2777" // 핑크 (진한)
            columnWidth={65}
            rowHeight={50}
            ganttHeight={600}
            todayColor="#F3F4F6" // 연한 회색
            barCornerRadius={6}
            preStepsCount={1}
            TaskListHeader={CustomTaskListHeader}
            TaskListTable={CustomTaskListTable}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            작업 데이터가 없습니다.
          </div>
        )}
      </div>
      
    </div>
  );
}

