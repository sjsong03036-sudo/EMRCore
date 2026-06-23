# EMR Core Frontend Generate Plan

> 목적: AI 에이전틱 코딩이 EMR Core 프론트엔드를 안정적으로 생성할 수 있도록 마일스톤과 태스크를 정의한다.
> 작업 전 반드시 `AGENT_RULES.md`와 `create.md`를 읽고 진행한다.

---

## 전체 진행 원칙

1. 한 번에 전체를 만들지 않는다.
2. 마일스톤 순서대로 진행한다.
3. 각 태스크는 실행 가능한 작은 단위로 완료한다.
4. 백엔드 API가 준비되지 않은 경우 Mock 데이터를 임시로 사용할 수 있다.
5. Mock은 실제 API 연결 구조를 해치지 않아야 한다.
6. 각 태스크 완료 후 TypeScript 오류와 화면 렌더링을 확인한다.
7. 권한이 필요한 작업은 DOCTOR, NURSE, ADMIN_STAFF 기준으로 UI 표시를 확인한다.

---

# Milestone 0. 프로젝트 초기화

## 목표

React + Vite + TypeScript 기반 프로젝트를 생성하고 기본 개발 환경을 구성한다.

## Task 0.1 Vite 프로젝트 생성

### 작업

- React + TypeScript 템플릿으로 프로젝트 생성
- 기본 실행 확인

### 완료 조건

```txt
[ ] npm install 완료
[ ] npm run dev 실행 가능
[ ] 기본 화면 렌더링 확인
```

---

## Task 0.2 필수 라이브러리 설치

### 작업

다음 라이브러리를 설치한다.

```txt
react-router-dom
axios
@tanstack/react-query
zustand
react-hook-form
```

Tailwind CSS도 설정한다.

### 완료 조건

```txt
[ ] 라우터 라이브러리 설치 완료
[ ] axios 설치 완료
[ ] TanStack Query 설치 완료
[ ] Zustand 설치 완료
[ ] React Hook Form 설치 완료
[ ] Tailwind CSS 적용 확인
```

---

## Task 0.3 기본 폴더 구조 생성

### 작업

다음 구조를 생성한다.

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

### 완료 조건

```txt
[ ] 폴더 구조 생성 완료
[ ] 불필요한 초기 파일 정리 완료
```

---

# Milestone 1. 앱 뼈대와 라우팅

## 목표

로그인 전/후 화면을 구분하고 보호 라우팅 구조를 만든다.

---

## Task 1.1 라우터 구성

### 작업

다음 경로를 등록한다.

```txt
/
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

### 완료 조건

```txt
[ ] / 접속 시 /login으로 이동
[ ] 각 경로별 임시 페이지 렌더링
[ ] 없는 경로 접근 시 NotFound 페이지 표시
```

---

## Task 1.2 AppLayout 생성

### 작업

- Header 생성
- Sidebar 생성
- Main 영역 생성
- Outlet 연결

### 완료 조건

```txt
[ ] /app 하위 경로에서 공통 레이아웃 표시
[ ] Header에 사용자 영역 자리 표시
[ ] Sidebar에 메뉴 영역 자리 표시
```

---

## Task 1.3 ProtectedRoute 생성

### 작업

- 인증되지 않은 사용자의 `/app` 접근 차단
- 로그인 페이지로 이동 처리

### 완료 조건

```txt
[ ] 비로그인 상태에서 /app 접근 시 /login 이동
[ ] 로그인 상태 Mock이면 /app 접근 가능
```

---

# Milestone 2. 인증 기능

## 목표

회원가입, 로그인, 로그아웃, 토큰 저장, 인증 요청 헤더 처리를 구현한다.

---

## Task 2.1 Auth 타입 정의

### 작업

`src/types/auth.ts` 작성

포함 타입:

- UserRole
- AuthUser
- LoginRequest
- LoginResponse
- SignupRequest

### 완료 조건

```txt
[ ] UserRole 타입 정의
[ ] 로그인 요청/응답 타입 정의
[ ] 회원가입 요청 타입 정의
```

---

## Task 2.2 Auth Store 생성

### 작업

`src/features/auth/authStore.ts` 작성

관리 상태:

- accessToken
- refreshToken
- user
- isAuthenticated

액션:

- setAuth
- clearAuth
- updateAccessToken

### 완료 조건

```txt
[ ] 로그인 정보 저장 가능
[ ] 로그아웃 시 정보 삭제 가능
[ ] 새로고침 후 유지 전략 결정
```

---

## Task 2.3 Axios 인스턴스 생성

### 작업

`src/api/axiosInstance.ts` 작성

기능:

- baseURL 환경변수 적용
- Authorization 헤더 자동 추가
- 401 응답 처리 기본 구조 작성
- 403 응답 처리 기본 구조 작성

### 완료 조건

```txt
[ ] API Base URL이 환경변수에서 로드됨
[ ] accessToken이 있으면 Authorization 헤더 추가
[ ] 401/403 인터셉터 구조 존재
```

---

## Task 2.4 Auth API 작성

### 작업

`src/api/authApi.ts` 작성

함수:

- signup
- login
- reissue
- logout

### 완료 조건

```txt
[ ] /auth/signup 연결 함수 작성
[ ] /auth/login 연결 함수 작성
[ ] /auth/reissue 연결 함수 작성
[ ] /auth/logout 연결 함수 작성
```

---

## Task 2.5 로그인 화면 구현

### 작업

- loginId/password 입력 폼
- 로그인 요청
- 성공 시 authStore 저장
- `/app/dashboard` 이동
- 실패 메시지 표시

### 완료 조건

```txt
[ ] 로그인 폼 렌더링
[ ] 로그인 API 호출
[ ] 성공 시 토큰 저장
[ ] 성공 시 대시보드 이동
[ ] 실패 시 오류 메시지 표시
```

---

## Task 2.6 회원가입 화면 구현

### 작업

- loginId/password/passwordConfirm/name/role 입력
- 회원가입 요청
- 성공 시 로그인 화면 이동
- 중복 오류 메시지 처리

### 완료 조건

```txt
[ ] 회원가입 폼 렌더링
[ ] role 선택 가능
[ ] 비밀번호 확인 검증
[ ] 회원가입 API 호출
[ ] 성공 시 로그인 화면 이동
```

---

## Task 2.7 로그아웃 구현

### 작업

- Header에 로그아웃 버튼 추가
- 로그아웃 API 호출
- authStore 초기화
- 로그인 화면 이동

### 완료 조건

```txt
[ ] 로그아웃 버튼 표시
[ ] 로그아웃 시 인증 정보 제거
[ ] 로그인 화면 이동
```

---

# Milestone 3. 공통 UI와 권한 제어

## 목표

반복 사용되는 UI 컴포넌트와 역할별 메뉴/버튼 제어 기반을 만든다.

---

## Task 3.1 공통 UI 컴포넌트 생성

### 작업

다음 컴포넌트를 만든다.

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

### 완료 조건

```txt
[ ] 각 컴포넌트 기본 렌더링 가능
[ ] className 확장 가능
[ ] disabled/error/loading 상태 일부 지원
```

---

## Task 3.2 메뉴 설정 생성

### 작업

`src/utils/menus.ts` 또는 유사 파일 작성

역할별 메뉴:

- 대시보드: 전 역할
- 환자 관리: 전 역할
- 의무기록 조회: 전 역할
- 간호기록 작성: NURSE
- 입퇴원기록 작성: NURSE

### 완료 조건

```txt
[ ] role별 메뉴 목록 필터링 가능
[ ] Sidebar에서 현재 사용자 role 기준 메뉴 표시
```

---

## Task 3.3 RoleGuard 구현

### 작업

특정 role만 UI를 볼 수 있게 하는 컴포넌트 작성

### 완료 조건

```txt
[ ] allowedRoles에 포함된 사용자만 children 표시
[ ] 권한 없으면 null 또는 fallback 표시
```

---

## Task 3.4 대시보드 구현

### 작업

- 로그인 사용자 정보 표시
- 주요 메뉴 카드 표시
- 역할별 카드 제어

### 완료 조건

```txt
[ ] 사용자 이름 표시
[ ] 사용자 role 표시
[ ] role별 바로가기 카드 표시
```

---

# Milestone 4. 환자 관리

## 목표

환자 등록, 검색, 상세, 수정, 삭제 화면을 구현한다.

---

## Task 4.1 Patient 타입 정의

### 작업

`src/types/patient.ts` 작성

타입:

- Patient
- PatientSearchParams
- CreatePatientRequest
- UpdatePatientRequest
- PatientListResponse

### 완료 조건

```txt
[ ] 환자 기본 타입 정의
[ ] 환자 검색 파라미터 타입 정의
[ ] 등록/수정 요청 타입 정의
```

---

## Task 4.2 Patient API 작성

### 작업

`src/api/patientApi.ts` 작성

함수:

- getPatients
- getPatient
- createPatient
- updatePatient
- deletePatient
- getPatientMedicalRecords

### 완료 조건

```txt
[ ] 환자 목록 API 함수 작성
[ ] 환자 상세 API 함수 작성
[ ] 환자 등록 API 함수 작성
[ ] 환자 수정 API 함수 작성
[ ] 환자 삭제 API 함수 작성
[ ] 환자별 의무기록 API 함수 작성
```

---

## Task 4.3 환자 검색 폼 구현

### 작업

`PatientSearchForm` 생성

입력:

- name
- phone

### 완료 조건

```txt
[ ] 이름 입력 가능
[ ] 연락처 입력 가능
[ ] 검색 버튼 클릭 시 검색 조건 전달
[ ] 초기화 가능
```

---

## Task 4.4 환자 목록 테이블 구현

### 작업

`PatientTable` 생성

컬럼:

- ID
- 이름
- 생년월일
- 성별
- 연락처
- 보험번호
- 상세

### 완료 조건

```txt
[ ] 환자 목록 표시
[ ] 상세 버튼 클릭 시 상세 페이지 이동
[ ] 빈 데이터 표시
[ ] 로딩 상태 표시
```

---

## Task 4.5 환자 목록 페이지 구현

### 작업

- 검색 폼 연결
- 목록 API 연결
- 페이지네이션 연결
- 환자 등록 버튼 권한 제어

### 완료 조건

```txt
[ ] /app/patients 화면 렌더링
[ ] 검색 조건으로 목록 조회
[ ] 상세 페이지 이동 가능
[ ] 권한 있는 사용자만 등록 버튼 표시
```

---

## Task 4.6 환자 등록 폼 구현

### 작업

`PatientForm` 생성

필드:

- name
- birthDate
- gender
- phone
- insuranceNo

### 완료 조건

```txt
[ ] 필수값 검증
[ ] 미래 생년월일 방지
[ ] 연락처 검증
[ ] 등록/수정 모드 재사용 가능
```

---

## Task 4.7 환자 등록 페이지 구현

### 작업

- PatientForm 연결
- 등록 API 연결
- 성공 시 상세 페이지 또는 목록 페이지 이동

### 완료 조건

```txt
[ ] 환자 등록 요청 가능
[ ] 성공 메시지 표시
[ ] 성공 후 이동 처리
[ ] 403/409 오류 처리
```

---

## Task 4.8 환자 상세 페이지 구현

### 작업

- 환자 상세 API 연결
- 환자 정보 카드 표시
- 최근 의무기록 영역 표시
- 수정/삭제/기록이력 버튼 표시

### 완료 조건

```txt
[ ] 환자 상세 정보 표시
[ ] 수정 페이지 이동 가능
[ ] 환자별 기록 페이지 이동 가능
[ ] 권한 있는 사용자만 삭제 버튼 표시
```

---

## Task 4.9 환자 수정 페이지 구현

### 작업

- 기존 환자 정보 로드
- PatientForm에 기본값 주입
- 수정 API 연결

### 완료 조건

```txt
[ ] 기존 환자 정보 표시
[ ] 수정 요청 가능
[ ] 성공 후 상세 페이지 이동
[ ] 403/404 오류 처리
```

---

## Task 4.10 환자 삭제 구현

### 작업

- 삭제 확인 모달
- 삭제 API 호출
- 성공 시 목록 이동

### 완료 조건

```txt
[ ] 삭제 전 확인 모달 표시
[ ] 삭제 API 호출
[ ] 성공 시 목록 이동
[ ] 권한 없는 사용자는 삭제 버튼 미표시
```

---

# Milestone 5. 의무기록 조회 기반

## 목표

의무기록 타입, API, 목록/상세 조회 기반을 만든다.

---

## Task 5.1 MedicalRecord 타입 정의

### 작업

`src/types/medicalRecord.ts` 작성

포함 타입:

- MedicalRecordType
- MedicalRecordSummary
- MedicalRecordDetail
- NursingRecordDetail
- AdmissionDischargeRecordDetail
- InitialRecordDetail
- FollowUpRecordDetail
- OperationRecordDetail
- MedicalRecordSearchParams

### 완료 조건

```txt
[ ] 의무기록 공통 타입 정의
[ ] 기록 타입 유니온 정의
[ ] 타입별 상세 타입 정의
[ ] 검색 조건 타입 정의
```

---

## Task 5.2 MedicalRecord API 작성

### 작업

`src/api/medicalRecordApi.ts` 작성

함수:

- getMedicalRecords
- getMedicalRecord
- createNursingRecord
- updateNursingRecord
- deleteNursingRecord
- createAdmissionDischargeRecord
- updateAdmissionDischargeRecord
- deleteAdmissionDischargeRecord

### 완료 조건

```txt
[ ] 통합 검색 API 함수 작성
[ ] 상세 조회 API 함수 작성
[ ] 간호기록 CUD API 함수 작성
[ ] 입퇴원기록 CUD API 함수 작성
```

---

## Task 5.3 기록 타입 배지 구현

### 작업

`MedicalRecordTypeBadge` 생성

표시명:

```txt
NURSING: 간호기록
ADMISSION_DISCHARGE: 입퇴원기록
INITIAL: 초진기록
FOLLOW_UP: 재진기록
OPERATION: 수술기록
```

### 완료 조건

```txt
[ ] 기록 타입별 한글 표시
[ ] 테이블과 상세 화면에서 재사용 가능
```

---

## Task 5.4 의무기록 검색 폼 구현

### 작업

`MedicalRecordSearchForm` 생성

검색 조건:

- startDate
- endDate
- patientKeyword
- authorKeyword
- type

### 완료 조건

```txt
[ ] 기간 입력 가능
[ ] 환자 검색어 입력 가능
[ ] 작성자 검색어 입력 가능
[ ] 타입 선택 가능
[ ] 검색 조건 전달 가능
```

---

## Task 5.5 의무기록 목록 테이블 구현

### 작업

`MedicalRecordTable` 생성

컬럼:

- 기록 ID
- 기록일시
- 환자명
- 기록 타입
- 작성자
- 상세

### 완료 조건

```txt
[ ] 의무기록 목록 표시
[ ] 상세 버튼 클릭 시 상세 페이지 이동
[ ] 로딩/빈 데이터 표시
```

---

## Task 5.6 통합 의무기록 조회 페이지 구현

### 작업

- 검색 폼 연결
- 목록 테이블 연결
- 통합 검색 API 연결

### 완료 조건

```txt
[ ] /app/medical-records 렌더링
[ ] 조건별 검색 가능
[ ] 목록 표시 가능
[ ] 상세 페이지 이동 가능
```

---

## Task 5.7 의무기록 상세 페이지 구현

### 작업

- recordId 기반 상세 조회
- 공통 필드 표시
- 타입별 상세 필드 분기 표시
- 수정/삭제 버튼 권한 제어

### 완료 조건

```txt
[ ] 공통 정보 표시
[ ] NURSING 상세 표시
[ ] ADMISSION_DISCHARGE 상세 표시
[ ] INITIAL/FOLLOW_UP/OPERATION 조회 표시
[ ] 권한 있는 경우만 수정/삭제 버튼 표시
```

---

## Task 5.8 환자별 의무기록 이력 페이지 구현

### 작업

- patientId 기반 기록 목록 조회
- 환자 정보 요약 표시
- 기록 목록 시간순 표시

### 완료 조건

```txt
[ ] /app/patients/:patientId/records 렌더링
[ ] 환자별 의무기록 조회 가능
[ ] 기록 상세 이동 가능
```

---

# Milestone 6. 간호기록 CRUD

## 목표

간호사가 간호기록을 작성, 수정, 삭제할 수 있는 화면을 구현한다.

---

## Task 6.1 환자 선택 컴포넌트 구현

### 작업

`PatientSelectSearch` 생성

기능:

- 환자 이름/연락처 검색
- 검색 결과 표시
- 환자 선택

### 완료 조건

```txt
[ ] 환자 검색 가능
[ ] 검색 결과 표시
[ ] 환자 선택 시 patientId 전달
```

---

## Task 6.2 NursingRecordForm 구현

### 작업

필드:

- patientId
- recordDate
- nursingContent
- observation

### 완료 조건

```txt
[ ] 환자 선택 가능
[ ] 기록일시 입력 가능
[ ] 간호 내용 입력 가능
[ ] 관찰 사항 입력 가능
[ ] 필수값 검증
[ ] 생성/수정 모드 재사용 가능
```

---

## Task 6.3 간호기록 작성 페이지 구현

### 작업

- NursingRecordForm 연결
- 작성 API 연결
- 저장 전 확인 모달
- 성공 후 상세 페이지 이동

### 완료 조건

```txt
[ ] NURSE만 메뉴 접근 가능
[ ] 간호기록 작성 가능
[ ] 저장 전 확인 모달 표시
[ ] 성공 후 기록 상세 이동
[ ] 403/404 오류 처리
```

---

## Task 6.4 간호기록 수정 페이지 구현

### 작업

- 기존 기록 상세 조회
- 본인 기록 여부 확인
- NursingRecordForm 기본값 주입
- 수정 API 연결

### 완료 조건

```txt
[ ] 기존 기록 정보 표시
[ ] 본인 기록이면 수정 가능
[ ] 타인 기록이면 수정 차단 또는 403 처리
[ ] 성공 후 상세 페이지 이동
```

---

## Task 6.5 간호기록 삭제 구현

### 작업

- 상세 페이지에서 삭제 버튼 표시
- 삭제 확인 모달
- 삭제 API 호출
- 성공 후 의무기록 목록 또는 환자별 기록으로 이동

### 완료 조건

```txt
[ ] 본인 기록인 경우만 삭제 버튼 표시
[ ] 삭제 전 확인 모달 표시
[ ] 삭제 API 호출
[ ] 성공 후 이동 처리
```

---

# Milestone 7. 입퇴원기록 CRUD

## 목표

간호사가 입퇴원기록을 작성, 수정, 삭제할 수 있는 화면을 구현한다.

---

## Task 7.1 AdmissionDischargeRecordForm 구현

### 작업

필드:

- patientId
- recordDate
- admissionDate
- dischargeDate
- admissionReason
- dischargeNote

### 완료 조건

```txt
[ ] 환자 선택 가능
[ ] 기록일시 입력 가능
[ ] 입원일 입력 가능
[ ] 퇴원일 입력 가능
[ ] 입원 사유 입력 가능
[ ] 퇴원 기록 입력 가능
[ ] 퇴원일이 입원일보다 빠르면 오류 표시
[ ] 생성/수정 모드 재사용 가능
```

---

## Task 7.2 입퇴원기록 작성 페이지 구현

### 작업

- AdmissionDischargeRecordForm 연결
- 작성 API 연결
- 저장 전 확인 모달
- 성공 후 상세 페이지 이동

### 완료 조건

```txt
[ ] NURSE만 메뉴 접근 가능
[ ] 입퇴원기록 작성 가능
[ ] 저장 전 확인 모달 표시
[ ] 성공 후 기록 상세 이동
```

---

## Task 7.3 입퇴원기록 수정 페이지 구현

### 작업

- 기존 기록 상세 조회
- 본인 기록 여부 확인
- AdmissionDischargeRecordForm 기본값 주입
- 수정 API 연결

### 완료 조건

```txt
[ ] 기존 기록 정보 표시
[ ] 본인 기록이면 수정 가능
[ ] 타인 기록이면 수정 차단 또는 403 처리
[ ] 성공 후 상세 페이지 이동
```

---

## Task 7.4 입퇴원기록 삭제 구현

### 작업

- 상세 페이지에서 삭제 버튼 표시
- 삭제 확인 모달
- 삭제 API 호출
- 성공 후 의무기록 목록 또는 환자별 기록으로 이동

### 완료 조건

```txt
[ ] 본인 기록인 경우만 삭제 버튼 표시
[ ] 삭제 전 확인 모달 표시
[ ] 삭제 API 호출
[ ] 성공 후 이동 처리
```

---

# Milestone 8. 에러 처리와 토큰 재발급

## 목표

실제 백엔드 연동 시 발생하는 인증/권한/데이터 오류를 사용자에게 안정적으로 표시한다.

---

## Task 8.1 공통 API 오류 파서 구현

### 작업

- 서버 오류 응답 구조 분석
- message 추출 함수 작성
- 기본 메시지 fallback 작성

### 완료 조건

```txt
[ ] 400 오류 메시지 처리
[ ] 403 오류 메시지 처리
[ ] 404 오류 메시지 처리
[ ] 409 오류 메시지 처리
[ ] 500 오류 메시지 처리
```

---

## Task 8.2 401 토큰 재발급 흐름 구현

### 작업

- Access Token 만료 시 reissue 호출
- 성공 시 원래 요청 재시도
- 실패 시 로그아웃 처리

### 완료 조건

```txt
[ ] 401 발생 시 reissue 호출
[ ] 재발급 성공 시 요청 재시도
[ ] 재발급 실패 시 로그인 화면 이동
```

---

## Task 8.3 권한 부족 UI 처리

### 작업

- 403 발생 시 공통 메시지 표시
- 권한 없는 버튼 숨김
- 권한 없는 페이지 접근 시 안내 화면 표시

### 완료 조건

```txt
[ ] 403 메시지 표시
[ ] role별 버튼 표시 제어
[ ] role별 메뉴 표시 제어
```

---

# Milestone 9. 백엔드 실제 연동 정리

## 목표

Mock 또는 임시 구조를 실제 백엔드 API 응답에 맞춰 정리한다.

---

## Task 9.1 API 응답 구조 맞춤

### 작업

- Swagger 또는 백엔드 DTO 확인
- 프론트 타입 수정
- API 응답 unwrap 함수 필요 여부 결정

### 완료 조건

```txt
[ ] Auth 응답 타입 일치
[ ] Patient 응답 타입 일치
[ ] MedicalRecord 응답 타입 일치
[ ] 페이지네이션 응답 타입 일치
```

---

## Task 9.2 CORS 및 배포 주소 확인

### 작업

- 로컬 백엔드 주소 확인
- 운영 백엔드 주소 확인
- `.env.development` 작성
- `.env.production` 작성

### 완료 조건

```txt
[ ] 로컬 API 연결 가능
[ ] 운영 API Base URL 분리
[ ] CORS 오류 없음
```

---

## Task 9.3 전체 시나리오 테스트

### 작업

아래 시나리오를 실행한다.

```txt
NURSE 로그인 → 환자 검색 → 환자 상세 → 간호기록 작성 → 기록 조회 → 기록 수정 → 기록 삭제
DOCTOR 로그인 → 환자 조회 → 기록 조회 → 수정 버튼 미노출 확인
ADMIN_STAFF 로그인 → 환자 등록 → 환자 수정 → 환자 삭제
```

### 완료 조건

```txt
[ ] 간호사 시나리오 통과
[ ] 의사 시나리오 통과
[ ] 원무과 시나리오 통과
[ ] 401/403/404 처리 확인
```

---

# Milestone 10. 포트폴리오 완성도 개선

## 목표

시연 가능한 수준으로 UI와 사용자 경험을 정리한다.

---

## Task 10.1 화면 디자인 정리

### 작업

- 여백 정리
- 표 스타일 정리
- 버튼 스타일 통일
- 배지 스타일 통일
- 색상 톤 통일

### 완료 조건

```txt
[ ] 전체 화면 톤 통일
[ ] 병원 관리자 시스템 느낌 유지
[ ] 주요 버튼 구분 명확
```

---

## Task 10.2 로딩/빈 데이터 화면 보강

### 작업

- 목록 로딩 표시
- 상세 로딩 표시
- 빈 데이터 메시지
- 실패 메시지

### 완료 조건

```txt
[ ] 환자 목록 로딩 처리
[ ] 의무기록 목록 로딩 처리
[ ] 빈 목록 메시지 표시
[ ] API 실패 메시지 표시
```

---

## Task 10.3 README용 프론트 실행 가이드 정리

### 작업

프론트 실행 방법을 정리한다.

포함 내용:

- 설치
- 실행
- 환경변수
- 주요 페이지
- 테스트 계정 예시

### 완료 조건

```txt
[ ] npm install 안내
[ ] npm run dev 안내
[ ] .env 예시 작성
[ ] 주요 기능 설명 작성
```

---

# 최종 완료 체크리스트

```txt
[ ] create.md 기준 1차 MVP 범위만 구현했다.
[ ] AGENT_RULES.md 작업 규칙을 따랐다.
[ ] 로그인/회원가입/로그아웃이 동작한다.
[ ] ProtectedRoute가 동작한다.
[ ] role별 Sidebar 메뉴가 다르게 표시된다.
[ ] 환자 목록/검색/상세/등록/수정/삭제가 동작한다.
[ ] 환자별 의무기록 이력이 동작한다.
[ ] 통합 의무기록 검색이 동작한다.
[ ] 의무기록 상세 화면이 타입별로 다르게 표시된다.
[ ] 간호기록 작성/수정/삭제가 동작한다.
[ ] 입퇴원기록 작성/수정/삭제가 동작한다.
[ ] DOCTOR는 기록 조회만 가능하다.
[ ] NURSE는 간호기록/입퇴원기록 CRUD가 가능하다.
[ ] ADMIN_STAFF는 환자 관리가 가능하다.
[ ] 401 발생 시 재발급 또는 로그아웃 흐름이 있다.
[ ] 403 발생 시 권한 부족 메시지가 표시된다.
[ ] 404 발생 시 데이터 없음 메시지가 표시된다.
[ ] 백엔드 API Base URL이 환경변수로 분리되어 있다.
[ ] TypeScript 오류가 없다.
[ ] npm run build가 성공한다.
```
