# EMR Core Frontend Agent Rules

> 목적: AI 에이전틱 코딩이 EMR Core 프론트엔드를 일관된 방향으로 생성하도록 하는 작업 규칙이다.
> 이 프론트엔드는 백엔드 중심 포트폴리오 프로젝트의 API 기능을 검증하고 시연하는 관리자형 EMR 화면이다.

---

## 0. 최상위 필수 규칙

### 0.1 작업 전 필수 참고 문서

모든 작업 수행 전 반드시 아래 두 문서를 먼저 읽고 현재 작업이 그 내용과 일치하는지 확인한다.

1. `create.md`
   - 프로젝트 생성 기획
   - 기술 스택
   - 화면 구조
   - API 연결 방향
   - 권한/역할 설계

2. `generate.md`
   - 마일스톤
   - 태스크
   - 작업 순서
   - 완료 조건

작업 중 설계가 흔들리거나 구현 범위가 모호하면 반드시 `create.md`와 `generate.md`를 다시 확인한다.

---

## 1. 프로젝트 방향 규칙

### 1.1 이 프로젝트의 프론트엔드 성격

이 프론트엔드는 병원 홍보용 웹사이트가 아니다.

다음 목적을 가진다.

- Spring Boot 백엔드 API 기능 검증
- JWT 인증/인가 흐름 시연
- 역할 기반 접근 제어 시연
- 환자 관리 CRUD 시연
- 간호 의무기록 CRUD 시연
- 의무기록 통합 조회 및 환자별 이력 조회 시연

따라서 디자인보다 기능 흐름, API 연결, 권한 제어, 데이터 표시 정확성을 우선한다.

### 1.2 MVP 우선 원칙

초기 구현은 1차 스코프에 한정한다.

포함한다.

- 로그인
- 회원가입
- 로그아웃
- 토큰 재발급 대응
- 환자 등록/검색/상세/수정/삭제
- 간호기록 작성/조회/수정/삭제
- 입퇴원기록 작성/조회/수정/삭제
- 의사 의무기록 조회 전용 화면
- 통합 의무기록 검색
- 환자별 의무기록 이력
- 역할별 메뉴/버튼 제어

초기 구현에서 제외한다.

- 처방 CRUD
- 구두처방 컨펌 워크플로우
- 알림 기능
- 임상관찰기록 8종
- 예약/검사결과/약국 연동
- 복잡한 통계 대시보드

---

## 2. 기술 스택 규칙

### 2.1 기본 스택

다음 스택을 기준으로 구현한다.

- React
- Vite
- TypeScript
- React Router
- Axios
- TanStack Query
- Zustand 또는 Context API
- React Hook Form
- Tailwind CSS

### 2.2 우선 선택

상태 관리가 단순하면 Zustand를 사용한다.
폼은 React Hook Form을 사용한다.
서버 상태는 TanStack Query를 사용한다.
HTTP 요청은 Axios 인스턴스를 통해서만 수행한다.

---

## 3. 코드 작성 규칙

### 3.1 TypeScript 우선

모든 컴포넌트와 API 함수는 TypeScript로 작성한다.
`any` 사용은 피한다.
API 응답 타입과 요청 타입은 `src/types`에 정의한다.

### 3.2 파일 분리 원칙

한 파일에 모든 로직을 몰아넣지 않는다.

기준 구조는 다음과 같다.

```txt
src/
 ├── app/
 ├── api/
 ├── features/
 ├── layouts/
 ├── components/
 ├── types/
 └── utils/
```

### 3.3 컴포넌트 분리 기준

다음 기준 중 하나라도 해당하면 컴포넌트를 분리한다.

- 2개 이상의 페이지에서 재사용된다.
- JSX가 과도하게 길어진다.
- 테이블, 모달, 폼, 검색 필터처럼 의미 단위가 명확하다.
- 권한 제어 로직이 들어간다.

### 3.4 하드코딩 금지

다음 값은 상수 또는 환경변수로 분리한다.

- API Base URL
- 역할명
- 기록 타입
- 라우트 경로
- 메뉴 목록

---

## 4. API 연동 규칙

### 4.1 API Prefix

백엔드 API는 `/api/v1` 프리픽스를 기준으로 한다.

예시:

```txt
/api/v1/auth/login
/api/v1/patients
/api/v1/medical-records
```

### 4.2 Axios 인스턴스 사용

모든 API 요청은 `axiosInstance.ts`를 통해 수행한다.
개별 컴포넌트에서 직접 `axios.get`, `axios.post`를 호출하지 않는다.

### 4.3 Access Token 처리

로그인 성공 후 Access Token을 저장하고, 모든 인증 요청의 Authorization 헤더에 포함한다.

```txt
Authorization: Bearer {accessToken}
```

### 4.4 401 처리

401 응답 발생 시 다음 흐름을 따른다.

1. Access Token 만료 여부 확인
2. Refresh Token 기반 재발급 요청
3. 재발급 성공 시 원래 요청 재시도
4. 재발급 실패 시 로그아웃 처리 후 로그인 페이지 이동

### 4.5 403 처리

403 응답은 권한 부족으로 처리한다.
사용자에게 다음과 같은 메시지를 표시한다.

```txt
현재 계정 권한으로는 이 작업을 수행할 수 없습니다.
```

---

## 5. 인증/인가 규칙

### 5.1 역할 종류

역할은 다음 3개를 기준으로 한다.

```txt
DOCTOR
NURSE
ADMIN_STAFF
```

### 5.2 프론트 권한 제어

백엔드 권한 제어가 최종 기준이다.
프론트에서는 사용자 경험을 위해 메뉴와 버튼을 제어한다.

### 5.3 역할별 UI 규칙

#### DOCTOR

- 환자 조회 가능
- 의무기록 조회 가능
- 간호기록 작성/수정/삭제 불가
- 의사기록 작성/수정/삭제는 1차 스코프에서 제외

#### NURSE

- 환자 조회 가능
- 환자 일부 수정 가능 여부는 백엔드 정책에 따른다.
- 간호기록 CRUD 가능
- 입퇴원기록 CRUD 가능
- 의사기록 조회 가능

#### ADMIN_STAFF

- 환자 등록/수정/삭제 가능
- 의무기록 조회 가능
- 의무기록 작성/수정/삭제 불가

---

## 6. 화면 설계 규칙

### 6.1 레이아웃

로그인 후 화면은 다음 구조를 따른다.

```txt
상단 헤더
좌측 사이드바
메인 콘텐츠 영역
```

### 6.2 필수 페이지

다음 페이지를 구현한다.

```txt
/login
/signup
/app/dashboard
/app/patients
/app/patients/new
/app/patients/:patientId
/app/patients/:patientId/edit
/app/patients/:patientId/records
/app/medical-records
/app/medical-records/:recordId
/app/medical-records/nursing/new
/app/medical-records/nursing/:recordId/edit
/app/medical-records/admission-discharge/new
/app/medical-records/admission-discharge/:recordId/edit
```

### 6.3 화면 우선순위

아래 화면을 가장 중요하게 다룬다.

1. 환자 관리 화면
2. 환자별 의무기록 타임라인
3. 의무기록 통합 검색 화면
4. 간호기록 작성/수정 화면
5. 입퇴원기록 작성/수정 화면

---

## 7. UI/UX 규칙

### 7.1 디자인 톤

병원 EMR 관리자 시스템 느낌을 유지한다.

- 흰색 배경
- 연한 회색 구분선
- 초록/청록 포인트 컬러
- 표 중심 레이아웃
- 검색 필터 중심 화면
- 과도한 애니메이션 금지

### 7.2 데이터 입력 UX

의료 기록 입력 화면은 다음 규칙을 따른다.

- 저장 전 확인 모달 표시
- 필수값 누락 시 명확한 오류 표시
- 저장 성공 후 관련 상세/목록 화면으로 이동
- 환자는 ID 직접 입력보다 검색 후 선택 방식 우선

### 7.3 빈 데이터 처리

목록 데이터가 없으면 빈 화면 메시지를 표시한다.

예시:

```txt
조회된 환자가 없습니다.
작성된 의무기록이 없습니다.
```

### 7.4 로딩 처리

API 요청 중에는 로딩 상태를 표시한다.
테이블은 스켈레톤 또는 로딩 텍스트를 사용한다.

---

## 8. 데이터 타입 규칙

### 8.1 Patient 타입

```ts
export interface Patient {
  id: number;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | string;
  phone: string;
  insuranceNo?: string;
  deletedAt?: string | null;
}
```

### 8.2 MedicalRecord 타입

```ts
export type MedicalRecordType =
  | 'NURSING'
  | 'ADMISSION_DISCHARGE'
  | 'INITIAL'
  | 'FOLLOW_UP'
  | 'OPERATION';

export interface MedicalRecordSummary {
  id: number;
  patientId: number;
  patientName: string;
  authorId: number;
  authorName: string;
  recordDate: string;
  type: MedicalRecordType;
  createdAt: string;
}
```

### 8.3 Auth 타입

```ts
export type UserRole = 'DOCTOR' | 'NURSE' | 'ADMIN_STAFF';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    loginId: string;
    name: string;
    role: UserRole;
  };
}
```

백엔드 실제 응답 구조가 확정되면 이 타입은 백엔드 DTO에 맞춰 수정한다.

---

## 9. 작업 진행 규칙

### 9.1 작은 단위로 커밋 가능한 결과 만들기

한 번에 전체 프로젝트를 만들지 않는다.
각 태스크는 실행 가능한 작은 결과물을 만든다.

예시:

- 라우터만 구현
- 로그인 화면만 구현
- 환자 목록 API만 연결
- 간호기록 작성 폼만 구현

### 9.2 작업 완료 후 확인할 것

각 태스크 완료 시 다음을 확인한다.

- TypeScript 오류 없음
- 화면 렌더링 정상
- 라우팅 정상
- API 호출 경로 정상
- 권한별 버튼 표시 정상
- 에러 메시지 표시 정상

### 9.3 백엔드 미완성 시 Mock 허용

백엔드 API가 아직 준비되지 않았으면 임시 Mock 데이터를 사용할 수 있다.
단, API 함수 구조는 실제 엔드포인트 기준으로 작성한다.

Mock 사용 시 반드시 주석으로 표시한다.

```ts
// TODO: 백엔드 API 연결 후 mock 제거
```

---

## 10. 금지 사항

다음을 금지한다.

- 1차 스코프 밖 기능을 먼저 구현하기
- 처방/구두처방/알림을 초기 MVP에 포함하기
- 컴포넌트 내부에 API URL 직접 작성하기
- 인증 토큰 없이 보호 페이지 접근 허용하기
- role 체크 없이 작성/수정/삭제 버튼 노출하기
- CSS를 무분별하게 인라인으로 작성하기
- 백엔드 응답 구조를 근거 없이 단정하기

---

## 11. 작업 시작 전 체크리스트

작업을 시작하기 전 매번 확인한다.

```txt
[ ] create.md를 읽었다.
[ ] generate.md를 읽었다.
[ ] 현재 작업이 1차 MVP 범위에 포함된다.
[ ] 현재 작업의 마일스톤과 태스크 번호를 확인했다.
[ ] API 경로가 /api/v1 기준인지 확인했다.
[ ] role 기반 UI 제어가 필요한 작업인지 확인했다.
[ ] 완료 조건을 알고 있다.
```

---

## 12. 최종 목표

최종적으로 다음 시나리오가 자연스럽게 수행되어야 한다.

```txt
1. NURSE 계정 로그인
2. 환자 검색
3. 환자 상세 조회
4. 간호기록 작성
5. 환자별 의무기록 이력에서 작성 기록 확인
6. 간호기록 수정
7. 통합 의무기록 검색에서 수정 기록 확인
8. DOCTOR 계정 로그인
9. 같은 기록을 조회만 가능하고 수정 버튼은 보이지 않음
10. ADMIN_STAFF 계정 로그인
11. 환자 등록/수정/삭제 가능 확인
```
