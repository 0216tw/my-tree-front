# my-tree-front

React + Vite 기반 프론트엔드 기본 구조입니다. 별도 Spring Boot 프로젝트인 `my-tree-back`와 연동할 수 있도록 개발 프록시와 API 클라이언트를 포함했습니다.

## 시작 방법

```bash
npm install
npm run dev
```

PowerShell 실행 정책 때문에 `npm`이 막히면 아래처럼 실행하면 됩니다.

```bash
npm.cmd install
npm.cmd run dev
```

## 환경 변수

`.env.example`를 참고해서 `.env`를 만들면 됩니다.

- `VITE_API_BASE_URL`: 프론트엔드에서 사용할 API 기본 경로
- `API_PROXY_TARGET`: Vite 개발 서버가 프록시할 Spring Boot 주소

기본값은 다음과 같습니다.

- Frontend: `http://localhost:5173`
- Backend Proxy: `http://localhost:8080`
- API Base URL: `/api`

## 기본 구조

```text
src
├─ app          # 앱 진입점, 라우터
├─ apis         # axios 클라이언트, API 함수
├─ layouts      # 공통 레이아웃
├─ pages        # 페이지 단위 컴포넌트
└─ styles       # 전역 스타일
```
