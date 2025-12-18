"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export interface GanttTask {
  id: string;
  name: string;
  resource?: string;
  start: Date;
  end: Date;
  progress: number; // 0-100
  dependencies?: string[];
  sprint?: string; // 스프린트 정보
  project?: string; // 프로젝트 정보
  parentId?: string; // Collapsible을 위한 부모 ID
}

interface D3GanttChartProps {
  tasks: GanttTask[];
  width?: number;
  groupBy?: "sprint" | "project" | "none"; // 그룹화 옵션
  onTaskClick?: (task: GanttTask) => void;
}

export default function D3GanttChart({
  tasks,
  width = 2000,
  groupBy = "sprint",
  onTaskClick,
}: D3GanttChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const xAxisSvgRef = useRef<SVGSVGElement>(null);
  const yAxisSvgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  // 날짜 범위를 고정 (x좌표가 변하지 않도록)
  const dateRange = useRef<{ min: Date; max: Date } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !xAxisSvgRef.current || !yAxisSvgRef.current || tasks.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 기존 내용 제거
    
    const xAxisSvg = d3.select(xAxisSvgRef.current);
    xAxisSvg.selectAll("*").remove(); // 날짜 축 SVG 초기화
    
    const yAxisSvg = d3.select(yAxisSvgRef.current);
    yAxisSvg.selectAll("*").remove(); // Y축 SVG 초기화

    const margin = { top: 60, right: 40, bottom: 40, left: 250 };
    const chartWidth = width - margin.left - margin.right;
    const rowHeight = 50;
    const groupRowHeight = 40; // 그룹 헤더 높이
    const barHeight = 30;
    const padding = 10;

    // 날짜 범위 계산 (고정 - 처음 한 번만 계산)
    if (!dateRange.current) {
      const allDates = tasks.flatMap((task) => [task.start, task.end]);
      const minDate = d3.min(allDates) || new Date();
      const maxDate = d3.max(allDates) || new Date();
      // 최소/최대 날짜에 여유 공간 추가
      const paddingDays = 30;
      dateRange.current = {
        min: d3.timeDay.offset(minDate, -paddingDays),
        max: d3.timeDay.offset(maxDate, paddingDays),
      };
    }

    const { min: minDate, max: maxDate } = dateRange.current;

    // 날짜 스케일 (고정된 domain 사용)
    const xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, chartWidth]);
    
    // 초기 뷰 설정: 오늘 날짜를 왼쪽에 배치
    const today = new Date();
    const todayX = xScale(today);
    const viewWidth = chartWidth;
    const initialTranslate = Math.max(0, -todayX + margin.left);

    // 그룹화 및 필터링된 작업 목록 생성
    interface RowItem {
      id: string;
      type: "group" | "task";
      name: string;
      groupKey?: string;
      task?: GanttTask;
      level: number; // 들여쓰기 레벨
    }

    const rows: RowItem[] = [];

    if (groupBy !== "none") {
      // 그룹별로 작업 분류
      const groups = new Map<string, GanttTask[]>();
      tasks.forEach((task) => {
        const groupKey = groupBy === "sprint" ? task.sprint : task.project;
        if (groupKey) {
          if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
          }
          groups.get(groupKey)!.push(task);
        } else {
          // 그룹이 없는 작업은 "기타" 그룹에
          if (!groups.has("기타")) {
            groups.set("기타", []);
          }
          groups.get("기타")!.push(task);
        }
      });

      // 그룹별로 정렬된 행 생성
      Array.from(groups.entries()).forEach(([groupKey, groupTasks]) => {
        // 그룹 헤더 추가
        rows.push({
          id: `group-${groupKey}`,
          type: "group",
          name: groupKey,
          groupKey,
          level: 0,
        });

        // 그룹이 접혀있지 않으면 작업들 추가
        if (!collapsedGroups.has(groupKey)) {
          // 작업을 계층 구조로 정렬
          const rootTasks = groupTasks.filter((t) => !t.parentId);
          const addTaskWithChildren = (task: GanttTask, level: number) => {
            rows.push({
              id: task.id,
              type: "task",
              name: task.name,
              task,
              level,
            });

            // 자식 작업들 추가
            if (!collapsedItems.has(task.id)) {
              const children = groupTasks.filter((t) => t.parentId === task.id);
              children.forEach((child) => addTaskWithChildren(child, level + 1));
            }
          };

          rootTasks.forEach((task) => addTaskWithChildren(task, 1));
        }
      });
    } else {
      // 그룹화 없이 작업만 표시
      const rootTasks = tasks.filter((t) => !t.parentId);
      const addTaskWithChildren = (task: GanttTask, level: number) => {
        rows.push({
          id: task.id,
          type: "task",
          name: task.name,
          task,
          level,
        });

        if (!collapsedItems.has(task.id)) {
          const children = tasks.filter((t) => t.parentId === task.id);
          children.forEach((child) => addTaskWithChildren(child, level + 1));
        }
      };

      rootTasks.forEach((task) => addTaskWithChildren(task, 0));
    }

    // Y축 스케일
    const yScale = d3
      .scaleBand()
      .domain(rows.map((r) => r.id))
      .range([0, rows.length * rowHeight])
      .padding(0.1);

    // SVG 크기 설정
    const chartHeight = rows.length * rowHeight + margin.top + margin.bottom;
    svg.attr("width", width - margin.left).attr("height", chartHeight);
    
    // 날짜 축 SVG 설정
    xAxisSvg.attr("width", width).attr("height", 50);
    
    // Y축 SVG 설정
    yAxisSvg.attr("width", margin.left).attr("height", chartHeight);

    // 날짜 축 그룹 (별도 SVG)
    const xAxisGroup = xAxisSvg
      .append("g")
      .attr("class", "x-axis-group")
      .attr("transform", `translate(${margin.left},30)`);

    // Y축 레이블 그룹 (먼저 생성 - zoom 핸들러에서 사용)
    const yAxisGroup = yAxisSvg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // SVG 그룹 생성 (차트 영역 - zoom 적용, 왼쪽 마진 제외)
    const g = svg
      .append("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(0,${margin.top})`);

    // Zoom 및 Pan 설정
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .translateExtent([
        [-Infinity, -Infinity],
        [Infinity, Infinity],
      ])
      .on("zoom", (event) => {
        // 차트 내용만 zoom 적용
        g.attr("transform", `translate(${event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
        // 날짜 축도 함께 이동 (가로만 스케일, 세로는 고정)
        xAxisGroup.attr("transform", `translate(${margin.left + event.transform.x},30) scale(${event.transform.k}, 1)`);
        // Y축도 함께 이동 (세로만 이동, 가로는 고정)
        yAxisGroup.attr("transform", `translate(${margin.left},${margin.top + event.transform.y}) scale(1, 1)`);
      });

    // 초기 transform 설정 (오늘 날짜를 왼쪽에)
    const initialTransform = d3.zoomIdentity
      .translate(initialTranslate, 0)
      .scale(1);

    // Zoom 적용
    svg.call(zoom as any);
    svg.call(zoom.transform as any, initialTransform);

    // 배경 그리드
    const weekInterval = d3.timeWeek.every(1);
    const gridLines = weekInterval ? xScale.ticks(weekInterval) : xScale.ticks(d3.timeWeek);
    g.selectAll(".grid-line")
      .data(gridLines)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", rows.length * rowHeight)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    // X축 (날짜) - sticky 그룹에 추가
    const xAxis = d3
      .axisTop(xScale)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat("%Y년 %m월") as any);

    const xAxisG = xAxisGroup
      .append("g")
      .attr("class", "x-axis");
    
    xAxisG.call(xAxis);
    
    xAxisG.selectAll("text")
      .style("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .style("font-size", "12px");
    
    // X축 선
    xAxisGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", 10)
      .attr("x2", chartWidth)
      .attr("y2", 10)
      .attr("stroke", "#6b7280")
      .attr("stroke-width", 1);

    // Y축 레이블 (그룹 및 작업 이름) - 이미 위에서 생성됨

    rows.forEach((row) => {
      const y = yScale(row.id);
      if (y === undefined) return;

      const indent = row.level * 20;

      if (row.type === "group") {
        // 그룹 헤더
        const isCollapsed = collapsedGroups.has(row.groupKey || "");
        yAxisGroup
          .append("rect")
          .attr("x", -margin.left)
          .attr("y", y)
          .attr("width", margin.left)
          .attr("height", groupRowHeight)
          .attr("fill", "#f3f4f6")
          .attr("stroke", "#d1d5db")
          .attr("stroke-width", 1);

        yAxisGroup
          .append("text")
          .attr("x", -15)
          .attr("y", y + groupRowHeight / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text(isCollapsed ? "▶" : "▼")
          .style("cursor", "pointer")
          .style("font-size", "14px")
          .style("fill", "#4b5563")
          .style("font-weight", "bold")
          .on("click", () => {
            setCollapsedGroups((prev) => {
              const next = new Set(prev);
              if (next.has(row.groupKey || "")) {
                next.delete(row.groupKey || "");
              } else {
                next.add(row.groupKey || "");
              }
              return next;
            });
          });

        yAxisGroup
          .append("text")
          .attr("x", -padding)
          .attr("y", y + groupRowHeight / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text(row.name)
          .style("font-size", "16px")
          .style("fill", "#1f2937")
          .style("font-weight", "bold")
          .style("cursor", "pointer")
          .on("click", () => {
            setCollapsedGroups((prev) => {
              const next = new Set(prev);
              if (next.has(row.groupKey || "")) {
                next.delete(row.groupKey || "");
              } else {
                next.add(row.groupKey || "");
              }
              return next;
            });
          });
      } else if (row.task) {
        const task = row.task;
        // Collapsible 아이콘 (자식이 있는 경우)
        const hasChildren = tasks.some((t) => t.parentId === task.id);
        if (hasChildren) {
          const isCollapsed = collapsedItems.has(task.id);
          yAxisGroup
            .append("text")
            .attr("x", -15 - indent)
            .attr("y", y + rowHeight / 2)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(isCollapsed ? "▶" : "▼")
            .style("cursor", "pointer")
            .style("font-size", "12px")
            .style("fill", "#6b7280")
            .on("click", () => {
              setCollapsedItems((prev) => {
                const next = new Set(prev);
                if (next.has(task.id)) {
                  next.delete(task.id);
                } else {
                  next.add(task.id);
                }
                return next;
              });
            });
        }

        // 작업 이름 (들여쓰기 적용)
        yAxisGroup
          .append("text")
          .attr("x", -padding - indent)
          .attr("y", y + rowHeight / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .text(task.name)
          .style("font-size", "14px")
          .style("fill", "#1f2937")
          .style("cursor", "pointer")
          .on("click", () => onTaskClick?.(task));

        // 리소스 정보
        if (task.resource) {
          yAxisGroup
            .append("text")
            .attr("x", -padding - indent)
            .attr("y", y + rowHeight / 2 + 15)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .text(`(${task.resource})`)
            .style("font-size", "11px")
            .style("fill", "#9ca3af");
        }
      }
    });

    // Gantt 바 그리기
    const barsGroup = g.append("g").attr("class", "bars");

    rows.forEach((row) => {
      if (row.type !== "task" || !row.task) return;

      const task = row.task;
      const y = yScale(row.id);
      if (y === undefined) return;

      const barGroup = barsGroup.append("g").attr("class", `bar-${task.id}`);

      const barWidth = xScale(task.end) - xScale(task.start);
      const barX = xScale(task.start);

      // 배경 바 (전체 기간)
      barGroup
        .append("rect")
        .attr("x", barX)
        .attr("y", y + (rowHeight - barHeight) / 2)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("rx", 4)
        .attr("fill", "#e5e7eb")
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 1);

      // 진행률 바
      const progressWidth = (barWidth * task.progress) / 100;
      const progressColor =
        task.progress === 100
          ? "#10b981"
          : task.progress > 0
          ? "#f59e0b"
          : "#9ca3af";

      barGroup
        .append("rect")
        .attr("x", barX)
        .attr("y", y + (rowHeight - barHeight) / 2)
        .attr("width", progressWidth)
        .attr("height", barHeight)
        .attr("rx", 4)
        .attr("fill", progressColor)
        .style("cursor", "pointer")
        .on("click", () => onTaskClick?.(task))
        .on("mouseenter", function () {
          d3.select(this).attr("opacity", 0.8);
        })
        .on("mouseleave", function () {
          d3.select(this).attr("opacity", 1);
        });

      // 진행률 텍스트
      if (task.progress > 0) {
        barGroup
          .append("text")
          .attr("x", barX + progressWidth / 2)
          .attr("y", y + rowHeight / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(`${task.progress}%`)
          .style("font-size", "11px")
          .style("fill", task.progress > 50 ? "#ffffff" : "#1f2937")
          .style("font-weight", "500")
          .style("pointer-events", "none");
      }
    });

    // 화살표 머리 정의
    if (svg.select("#arrowhead").empty()) {
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#6b7280");
    }

    // 의존성 화살표 그리기 (굴곡선으로)
    const arrowsGroup = g.append("g").attr("class", "arrows");

    rows.forEach((row) => {
      if (row.type !== "task" || !row.task) return;

      const task = row.task;
      if (!task.dependencies || task.dependencies.length === 0) return;

      task.dependencies.forEach((depId) => {
        const depTask = tasks.find((t) => t.id === depId);
        if (!depTask) return;

        const isDepVisible = rows.some((r) => r.id === depId);
        if (!isDepVisible) return;

        const depY = yScale(depId);
        const taskY = yScale(task.id);
        if (depY === undefined || taskY === undefined) return;

        const depEndX = xScale(depTask.end);
        const taskStartX = xScale(task.start);
        const depYCenter = depY + rowHeight / 2;
        const taskYCenter = taskY + rowHeight / 2;

        // 중간 지점 계산 (다른 bar를 피하기 위해 위로 올라감)
        const midX = (depEndX + taskStartX) / 2;
        const offsetY = Math.min(Math.abs(taskYCenter - depYCenter) / 2, 30);
        const controlY = Math.min(depYCenter, taskYCenter) - offsetY - 20;

        // 곡선 경로 생성 (베지어 곡선)
        const path = d3.path();
        path.moveTo(depEndX, depYCenter);
        path.lineTo(depEndX + 20, depYCenter);
        path.quadraticCurveTo(midX, controlY, taskStartX - 20, taskYCenter);
        path.lineTo(taskStartX, taskYCenter);

        // 화살표 경로
        arrowsGroup
          .append("path")
          .attr("d", path.toString())
          .attr("fill", "none")
          .attr("stroke", "#6b7280")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrowhead)")
          .style("opacity", 0.6);
      });
    });

  }, [tasks, width, groupBy, collapsedItems, collapsedGroups, onTaskClick]);

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        작업 데이터가 없습니다.
      </div>
    );
  }

  // 초기 스크롤 설정 (오늘 날짜를 왼쪽에)
  useEffect(() => {
    if (!containerRef.current || !dateRange.current) return;

    const today = new Date();
    const { min: minDate, max: maxDate } = dateRange.current;
    const margin = { left: 250 };
    const chartWidth = width - margin.left - 40;
    
    const tempScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, chartWidth]);
    
    const todayX = tempScale(today);
    const scrollLeft = Math.max(0, todayX - margin.left);
    
    // 약간의 지연을 두고 스크롤 (렌더링 완료 후)
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft;
      }
    }, 100);
  }, [tasks, width]);

  return (
    <div ref={containerRef} className="w-full overflow-auto" style={{ maxHeight: "800px" }}>
      <div style={{ position: "relative" }}>
        {/* Sticky 날짜 축 */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "white",
            borderBottom: "2px solid #e5e7eb",
            height: "50px",
          }}
        >
          <svg ref={xAxisSvgRef} style={{ minWidth: width, display: "block" }}></svg>
        </div>
        
        {/* 메인 차트 영역 */}
        <div style={{ position: "relative", display: "flex" }}>
          {/* Sticky 왼쪽 작업 목록 */}
          <div
            style={{
              position: "sticky",
              left: 0,
              zIndex: 9,
              backgroundColor: "white",
              borderRight: "2px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <svg ref={yAxisSvgRef} style={{ display: "block" }}></svg>
          </div>
          
          {/* 차트 내용 */}
          <div style={{ flex: 1 }}>
            <svg ref={svgRef} style={{ minWidth: width - 250, display: "block" }}></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

