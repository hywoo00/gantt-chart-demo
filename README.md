# Gantt Chart Demo

Next.js + Tailwind CSS + react-google-charts를 사용한 간트 차트 데모 프로젝트입니다.

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **react-google-charts** - Google Charts 라이브러리

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
gantt-chart-demo/
├── app/
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 메인 페이지
│   └── globals.css     # 전역 스타일
├── components/
│   └── GanttChart.tsx  # 간트 차트 컴포넌트
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

## 기능

- 프로젝트 일정을 시각화하는 간트 차트
- 작업 간 의존성 표시
- 진행률 표시
- 반응형 디자인
- 다크 모드 지원