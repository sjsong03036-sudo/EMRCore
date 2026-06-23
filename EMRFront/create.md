# EMR Core Frontend 생성 기획서

> 프로젝트명: EMR Core Frontend
> 목적: Spring Boot 기반 EMR Core 백엔드 API를 검증하고 시연하기 위한 React 관리자형 프론트엔드
> 기준 문서: EMR Core 기획서 v2
> 1차 범위: 환자 관리, 인증/인가, 간호 의무기록 CRUD, 의사 의무기록 조회, 수정 이력 조회 연계

---

## 1. 프로젝트 개요

EMR Core는 전자의무기록 시스템 중 환자 관리와 간호 의무기록을 중심으로 구성된 백엔드 중심 포트폴리오 프로젝트다.
프론트엔드는 백엔드 기능을 사용자가 직접 확인할 수 있는 화면을 제공한다.

프론트엔드의 핵심은 다음과 같다.

- 로그인/회원가입을 통한 JWT 인증 흐름 제공
- 역할 기반 UI 제어 제공
- 환자 CRUD 화면 제공
- 간호기록 및 입퇴원기록 CRUD 화면 제공
- 의무기록 통합 조회 화면 제공
- 환자별 의무기록 타임라인 제공
- API 오류, 권한 부족, 토큰 만료 상황 처리

---

## 2. 제품 방향

### 2.1 만들 화면의 성격

이 프로젝트는 일반 사용자를 위한 서비스형 웹사이트가 아니다.
병원 내부 직원이 사용하는 EMR 관리자 시스템을 가정한다.

따라서 다음 성격을 따른다.

- 기능 중심
- 표 중심
- 검색 필터 중심
- 상세 화면 중심
- 권한별 메뉴 제어 중심
- 깔끔하고 차분한 병원 시스템 스타일

### 2.2 핵심 사용자

#### 의사: DOCTOR

- 환자 조회
- 의무기록 조회
- 간호기록 조회
- 의사기록 조회
- 1차 스코프에서는 의사기록 작성/수정/삭제 제외

#### 간호사: NURSE

- 환자 조회
- 간호기록 작성/수정/삭제
- 입퇴원기록 작성/수정/삭제
- 의사기록 조회
- 환자별 의무기록 이력 확인

#### 원무과: ADMIN_STAFF

- 환자 등록
- 환자 수정
- 환자 삭제
- 환자 조회
- 의무기록 조회
- 의무기록 작성/수정/삭제 제외

---

## 3. 기술 스택

### 3.1 기본 스택

```txt
React
Vite
TypeScript
React Router
Axios
TanStack Query
Zustand
React Hook Form
Tailwind CSS
```

### 3.2 선택 이유

| 기술 | 선택 이유 |
|---|---|
| React | 컴포넌트 기반 관리자 화면 구현에 적합 |
| Vite | 빠른 개발 서버와 간단한 초기 설정 |
| TypeScript | EMR 도메인의 API 요청/응답 타입 안정성 확보 |
| React Router | 로그인/환자/기록 화면 라우팅 |
| Axios | JWT 헤더와 인터셉터 처리 용이 |
| TanStack Query | 서버 상태, 목록, 상세, 캐싱 관리 |
| Zustand | 인증 사용자와 토큰 상태 관리 |
| React Hook Form | 환자/의무기록 입력 폼 처리 |
| Tailwind CSS | 빠른 관리자형 UI 구성 |

---

## 4. 전체 라우팅 설계

```txt
/
 └── /login으로 리다이렉트

/login
/signup

/app
 ├── /dashboard
 ├── /patients
 ├── /patients/new
 ├── /patients/:patientId
 ├── /patients/:patientId/edit
 ├── /patients/:patientId/records
 ├── /medical-records
 ├── /medical-records/:recordId
 ├── /medical-records/nursing/new
 ├── /medical-records/nursing/:recordId/edit
 ├── /medical-records/admission-discharge/new
 └── /medical-records/admission-discharge/:recordId/edit
```

---

## 5. 화면 상세 기획

## 5.1 로그인 화면

### 목적

JWT 인증의 시작점이다.

### 입력 필드

- loginId
- password

### 기능

- 로그인 요청
- Access Token 저장
- Refresh Token 저장 방식은 백엔드 정책에 맞춤
- 사용자 정보 저장
- 로그인 성공 시 `/app/dashboard` 이동
- 실패 시 오류 메시지 표시

### 오류 메시지

```txt
아이디 또는 비밀번호가 일치하지 않습니다.
```

---

## 5.2 회원가입 화면

### 입력 필드

- loginId
- password
- passwordConfirm
- name
- role

### role 선택값

```txt
DOCTOR
NURSE
ADMIN_STAFF
```

### 기능

- 회원가입 요청
- loginId 중복 오류 처리
- 성공 시 로그인 화면 이동

---

## 5.3 대시보드

### 목적

로그인 후 첫 화면이다.
간단한 시스템 진입 화면 역할을 한다.

### 표시 정보

- 로그인 사용자 이름
- 로그인 사용자 역할
- 주요 메뉴 바로가기
- 1차 MVP 범위 안내

### 예시 카드

- 환자 관리
- 의무기록 통합 조회
- 간호기록 작성
- 입퇴원기록 작성

역할에 따라 카드 노출 여부를 제어한다.

---

## 5.4 환자 목록 화면

### 경로

```txt
/app/patients
```

### 목적

환자 검색과 목록 조회를 제공한다.

### 검색 조건

- 이름
- 연락처
- 페이지
- 사이즈

### 테이블 컬럼

- ID
- 이름
- 생년월일
- 성별
- 연락처
- 보험번호
- 상세 버튼

### 기능

- 환자 목록 조회
- 이름/연락처 검색
- 페이지네이션
- 환자 상세 이동
- 권한이 있으면 환자 등록 버튼 표시

---

## 5.5 환자 등록 화면

### 경로

```txt
/app/patients/new
```

### 입력 필드

- name
- birthDate
- gender
- phone
- insuranceNo

### 검증

- 이름 필수
- 생년월일 필수
- 미래 날짜 불가
- 성별 필수
- 연락처 형식 검증

### 권한

- ADMIN_STAFF 중심
- 백엔드 정책에 따라 NURSE 일부 허용 가능

---

## 5.6 환자 상세 화면

### 경로

```txt
/app/patients/:patientId
```

### 표시 정보

- 이름
- 생년월일
- 성별
- 연락처
- 보험번호
- 최근 의무기록

### 기능

- 환자 수정 이동
- 환자 삭제
- 환자별 의무기록 이력 이동

---

## 5.7 환자 수정 화면

### 경로

```txt
/app/patients/:patientId/edit
```

### 기능

- 기존 환자 정보 조회
- 수정 폼 표시
- 수정 요청
- 성공 시 상세 페이지 이동

---

## 5.8 환자별 의무기록 이력 화면

### 경로

```txt
/app/patients/:patientId/records
```

### 목적

특정 환자의 의무기록을 시간순으로 확인한다.

### 표시 방식

타임라인 또는 테이블 중 하나를 사용한다.
초기 구현은 테이블을 우선한다.

### 컬럼

- 기록일시
- 기록 타입
- 작성자
- 요약
- 상세 버튼

---

## 5.9 의무기록 통합 검색 화면

### 경로

```txt
/app/medical-records
```

### 목적

QueryDSL 기반 복합 조회 기능을 시연하는 핵심 화면이다.

### 검색 조건

- 시작일
- 종료일
- 환자명 또는 환자 ID
- 작성자
- 기록 타입

### 기록 타입

```txt
전체
NURSING
ADMISSION_DISCHARGE
INITIAL
FOLLOW_UP
OPERATION
```

### 테이블 컬럼

- 기록 ID
- 기록일시
- 환자명
- 기록 타입
- 작성자
- 상세 버튼

---

## 5.10 의무기록 상세 화면

### 경로

```txt
/app/medical-records/:recordId
```

### 목적

의무기록 타입에 따라 상세 내용을 다르게 표시한다.

### 공통 표시 정보

- 환자
- 작성자
- 기록일시
- 기록 타입
- 생성일시

### 타입별 표시 정보

#### NURSING

- nursingContent
- observation

#### ADMISSION_DISCHARGE

- admissionDate
- dischargeDate
- admissionReason
- dischargeNote

#### INITIAL

- chiefComplaint
- presentIllness
- diagnosis

#### FOLLOW_UP

- progressNote
- plan

#### OPERATION

- operationName
- surgeon
- anesthesiaType

### 버튼 제어

NURSE가 본인 간호기록 또는 입퇴원기록을 조회할 때만 수정/삭제 버튼을 표시한다.

---

## 5.11 간호기록 작성/수정 화면

### 생성 경로

```txt
/app/medical-records/nursing/new
```

### 수정 경로

```txt
/app/medical-records/nursing/:recordId/edit
```

### 입력 필드

- patientId
- recordDate
- nursingContent
- observation

### UX

- 환자 검색 후 선택
- 기록일시는 현재 시간 기본값
- 저장 전 확인 모달
- 성공 시 기록 상세 또는 환자별 기록 화면 이동

---

## 5.12 입퇴원기록 작성/수정 화면

### 생성 경로

```txt
/app/medical-records/admission-discharge/new
```

### 수정 경로

```txt
/app/medical-records/admission-discharge/:recordId/edit
```

### 입력 필드

- patientId
- recordDate
- admissionDate
- dischargeDate
- admissionReason
- dischargeNote

### UX

- 환자 검색 후 선택
- 입원일 필수
- 퇴원일은 선택 가능
- 퇴원일이 입원일보다 빠르면 오류 표시

---

## 6. API 설계

## 6.1 Base URL

환경변수로 관리한다.

```txt
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 6.2 Auth API

```txt
POST /auth/signup
POST /auth/login
POST /auth/reissue
POST /auth/logout
```

### 프론트 함수

```ts
signup(data)
login(data)
reissue(refreshToken)
logout()
```

---

## 6.3 Patient API

```txt
GET /patients
POST /patients
GET /patients/{id}
PATCH /patients/{id}
DELETE /patients/{id}
GET /patients/{id}/medical-records
```

### 프론트 함수

```ts
getPatients(params)
createPatient(data)
getPatient(id)
updatePatient(id, data)
deletePatient(id)
getPatientMedicalRecords(id)
```

---

## 6.4 Medical Record API

```txt
GET /medical-records
GET /medical-records/{id}
POST /medical-records/nursing
POST /medical-records/admission-discharge
PATCH /medical-records/nursing/{id}
DELETE /medical-records/nursing/{id}
PATCH /medical-records/admission-discharge/{id}
DELETE /medical-records/admission-discharge/{id}
```

### 프론트 함수

```ts
getMedicalRecords(params)
getMedicalRecord(id)
createNursingRecord(data)
updateNursingRecord(id, data)
deleteNursingRecord(id)
createAdmissionDischargeRecord(data)
updateAdmissionDischargeRecord(id, data)
deleteAdmissionDischargeRecord(id)
```

---

## 7. 상태 관리 설계

## 7.1 Auth Store

관리할 상태:

- accessToken
- refreshToken
- user
- isAuthenticated

제공할 액션:

- setAuth
- clearAuth
- updateAccessToken

---

## 8. 컴포넌트 설계

## 8.1 공통 컴포넌트

```txt
Button
Input
Select
Textarea
Modal
ConfirmModal
Table
Pagination
Badge
LoadingSpinner
EmptyState
ErrorMessage
```

## 8.2 도메인 컴포넌트

```txt
PatientSearchForm
PatientTable
PatientForm
PatientSummaryCard
MedicalRecordSearchForm
MedicalRecordTable
MedicalRecordTypeBadge
NursingRecordForm
AdmissionDischargeRecordForm
RoleGuard
ProtectedRoute
```

---

## 9. 권한 설계

## 9.1 메뉴 표시

```ts
const menus = [
  { label: '대시보드', path: '/app/dashboard', roles: ['DOCTOR', 'NURSE', 'ADMIN_STAFF'] },
  { label: '환자 관리', path: '/app/patients', roles: ['DOCTOR', 'NURSE', 'ADMIN_STAFF'] },
  { label: '의무기록 조회', path: '/app/medical-records', roles: ['DOCTOR', 'NURSE', 'ADMIN_STAFF'] },
  { label: '간호기록 작성', path: '/app/medical-records/nursing/new', roles: ['NURSE'] },
  { label: '입퇴원기록 작성', path: '/app/medical-records/admission-discharge/new', roles: ['NURSE'] },
];
```

## 9.2 버튼 표시

### 환자 등록 버튼

- ADMIN_STAFF 우선 표시

### 환자 삭제 버튼

- ADMIN_STAFF만 표시

### 간호기록 수정/삭제 버튼

다음 조건을 모두 만족할 때 표시한다.

```txt
role === NURSE
record.type === NURSING 또는 ADMISSION_DISCHARGE
record.authorId === loginUser.id
```

---

## 10. 에러 처리 설계

## 10.1 공통 오류

| 상태코드 | 처리 |
|---|---|
| 400 | 입력값 확인 메시지 |
| 401 | 토큰 재발급 또는 로그인 이동 |
| 403 | 권한 부족 메시지 |
| 404 | 데이터 없음 메시지 |
| 409 | 중복 데이터 메시지 |
| 500 | 서버 오류 메시지 |

## 10.2 사용자 메시지

```txt
입력값을 확인해주세요.
로그인이 필요합니다.
현재 계정 권한으로는 이 작업을 수행할 수 없습니다.
요청한 데이터를 찾을 수 없습니다.
이미 존재하는 값입니다.
서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
```

---

## 11. 디자인 시스템

## 11.1 색상 방향

```txt
Primary: emerald/teal 계열
Background: white, slate-50
Border: slate-200
Text: slate-900, slate-600
Danger: red 계열
Warning: amber 계열
Success: emerald 계열
```

## 11.2 화면 밀도

EMR 화면은 정보량이 많으므로 다음 기준을 따른다.

- 카드보다 테이블 우선
- 넓은 검색 필터 영역
- 작은 배지로 상태/타입 표시
- 버튼은 명확하고 단순하게

---

## 12. 최종 사용자 시나리오

## 12.1 간호사 시나리오

```txt
1. NURSE 계정 로그인
2. 환자 목록 이동
3. 환자 이름으로 검색
4. 환자 상세 조회
5. 간호기록 작성
6. 환자별 의무기록 이력에서 작성 기록 확인
7. 간호기록 수정
8. 통합 의무기록 검색에서 수정 결과 확인
```

## 12.2 의사 시나리오

```txt
1. DOCTOR 계정 로그인
2. 환자 목록 이동
3. 환자 상세 조회
4. 환자별 의무기록 이력 조회
5. 간호기록 상세 조회
6. 수정/삭제 버튼이 보이지 않는지 확인
```

## 12.3 원무과 시나리오

```txt
1. ADMIN_STAFF 계정 로그인
2. 환자 등록
3. 환자 검색
4. 환자 수정
5. 환자 삭제
6. 의무기록 조회 가능 확인
```

---

## 13. 생성 완료 기준

이 프로젝트의 1차 프론트 생성 완료 기준은 다음과 같다.

```txt
[ ] 로그인 가능
[ ] 회원가입 가능
[ ] 로그아웃 가능
[ ] 인증 사용자만 /app 접근 가능
[ ] 환자 목록 조회 가능
[ ] 환자 검색 가능
[ ] 환자 상세 조회 가능
[ ] 환자 등록 가능
[ ] 환자 수정 가능
[ ] 환자 삭제 가능
[ ] 간호기록 작성 가능
[ ] 간호기록 상세 조회 가능
[ ] 간호기록 수정 가능
[ ] 간호기록 삭제 가능
[ ] 입퇴원기록 작성 가능
[ ] 입퇴원기록 상세 조회 가능
[ ] 입퇴원기록 수정 가능
[ ] 입퇴원기록 삭제 가능
[ ] 의무기록 통합 검색 가능
[ ] 환자별 의무기록 이력 조회 가능
[ ] 역할별 메뉴 제어 가능
[ ] 역할별 버튼 제어 가능
[ ] 401/403/404/409 에러 메시지 처리 가능
```
