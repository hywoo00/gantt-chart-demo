import React, { useRef, useEffect, useState, useCallback } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  // 드래그 시작
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // SVG 요소나 작업 바 관련 요소인지 확인
    const target = e.target as HTMLElement;
    
    // SVG 내부 요소인 경우 (작업 바, 핸들 등) 드래그 스크롤 비활성화
    // 작업 바의 onMouseDown에서 stopPropagation을 호출하므로 여기까지 이벤트가 오지 않음
    // 하지만 추가 안전장치로 SVG 요소 자체를 확인
    if (target.tagName === 'svg' || 
        target.closest('svg') !== null ||
        target.tagName === 'rect' ||
        target.tagName === 'polygon' ||
        target.tagName === 'g' ||
        target.tagName === 'text' ||
        target.tagName === 'image') {
      // SVG 내부 요소이지만 작업 바가 아닌 경우도 있을 수 있으므로
      // 클래스명으로 추가 확인
      const classList = target.classList;
      if (classList && (
        classList.contains('barWrapper') ||
        classList.contains('barBackground') ||
        classList.contains('barHandle') ||
        target.closest('.barWrapper') !== null
      )) {
        return; // 작업 바 관련 요소인 경우 드래그 스크롤 비활성화
      }
    }
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    if (verticalGanttContainerRef.current) {
      setDragStartScrollLeft(verticalGanttContainerRef.current.scrollLeft);
    }
    e.preventDefault();
  }, []);

  // 드래그 중
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !verticalGanttContainerRef.current) return;
    
    const deltaX = dragStartX - e.clientX;
    verticalGanttContainerRef.current.scrollLeft = dragStartScrollLeft + deltaX;
  }, [isDragging, dragStartX, dragStartScrollLeft]);

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 전역 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
