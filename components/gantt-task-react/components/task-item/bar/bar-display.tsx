import React from "react";
import style from "./bar.module.css";
import { AssigneeInfo } from "../../../types/public-types";

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  assignee?: string | string[] | AssigneeInfo | AssigneeInfo[]; // 작업 할당자
  taskId?: string; // 고유한 clipPath ID 생성을 위한 task ID
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown,
  assignee,
  taskId = "default",
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return isSelected ? styles.backgroundSelectedColor : styles.backgroundColor;
  };

  // assignee를 AssigneeInfo 배열로 정규화
  const normalizeAssignees = (): AssigneeInfo[] => {
    if (!assignee) return [];
    
    if (Array.isArray(assignee)) {
      return assignee.map(a => {
        if (typeof a === "string") {
          return { name: a, profileUrl: "/user.png" };
        }
        return { name: a.name, profileUrl: a.profileUrl || "/user.png" };
      });
    }
    
    if (typeof assignee === "string") {
      return [{ name: assignee, profileUrl: "/user.png" }];
    }
    
    return [{ name: assignee.name, profileUrl: assignee.profileUrl || "/user.png" }];
  };

  const assignees = normalizeAssignees();
  const imageSize = 16; // 프로필 이미지 크기
  const imageSpacing = 2; // 이미지 간 간격
  const showAssignee = assignees.length > 0 && width > 60; // bar가 충분히 넓을 때만 표시
  const maxVisibleAssignees = Math.floor((width - 8) / (imageSize + imageSpacing)); // 표시 가능한 최대 assignee 수
  const visibleAssignees = assignees.slice(0, maxVisibleAssignees);
  const remainingCount = assignees.length - visibleAssignees.length;

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getBarColor()}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
      {showAssignee && (
        <g>
          {visibleAssignees.map((assigneeInfo, index) => {
            const imageX = x + 4 + index * (imageSize + imageSpacing);
            const imageY = y + (height - imageSize) / 2;
            const clipPathId = `avatar-clip-${taskId}-${index}`;
            
            return (
              <g key={index}>
                <defs>
                  <clipPath id={clipPathId}>
                    <circle cx={imageX + imageSize / 2} cy={imageY + imageSize / 2} r={imageSize / 2} />
                  </clipPath>
                </defs>
                <image
                  x={imageX}
                  y={imageY}
                  width={imageSize}
                  height={imageSize}
                  href={assigneeInfo.profileUrl}
                  clipPath={`url(#${clipPathId})`}
                  style={{ pointerEvents: "none" }}
                />
                {/* 이름 툴팁용 (호버 시 표시 가능) */}
                <title>{assigneeInfo.name}</title>
              </g>
            );
          })}
          {remainingCount > 0 && (
            <text
              x={x + 4 + visibleAssignees.length * (imageSize + imageSpacing) + 2}
              y={y + height / 2 + 4}
              fontSize="10"
              fill={isSelected ? "#ffffff" : "#666666"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              +{remainingCount}
            </text>
          )}
        </g>
      )}
    </g>
  );
};
