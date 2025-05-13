# UMC PR API 서버

UMC Node.js를 활용한 백엔드 서버 프로젝트로, 사용자 관리, 가게 정보 관리, 리뷰 및 미션 기능을 제공하는 RESTful API 서버입니다.

## 주요 기능

- **사용자 관리**: 회원가입, 선호 음식 카테고리 설정
- **가게 관리**: 특정 지역에 가게 추가, 가게 정보 조회
- **리뷰 시스템**: 가게에 리뷰 추가, 내가 작성한 리뷰 목록 조회
- **미션 시스템**: 가게에 미션 추가, 미션 도전 및 완료
- **표준화된 API 응답**: 성공/실패 응답 형식 통일
- **체계적인 오류 처리**: 오류 코드 및 상세 정보 제공
- **응답 압축**: 네트워크 대역폭 최적화

## 기술 스택

- **백엔드**: Node.js, Express
- **데이터베이스**: MySQL
- **ORM**: Prisma
- **유틸리티**: dotenv(환경변수), cors(CORS 처리), compression(응답 압축)
- **로깅**: winston 기반 커스텀 로거
- **API 응답**: 표준화된 JSON 응답 형식

## 시작하기

### 필수 조건

- Node.js 14.x 이상
- MySQL 8.0 이상
- npm 6.x 이상

### 설치 방법

1. 저장소 클론하기
   ```bash
   git clone <repository-url>
   cd umc-pr
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. `.env` 파일 설정
   ```
   PORT=5000
   DATABASE_URL="mysql://username:password@localhost:3306/umc_db"
   ```

4. Prisma 클라이언트 생성 및 DB 마이그레이션
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. 서버 실행
   ```bash
   # 개발 모드 (nodemon)
   npm run dev
   
   # 프로덕션 모드
   npm start
   ```

## API 표준 응답 형식

### 성공 응답
```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    // 실제 응답 데이터
  }
}
```

### 실패 응답
```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "E001",
    "reason": "오류 원인 메시지",
    "data": {
      // 오류 관련 추가 데이터 (선택적)
    }
  },
  "success": null
}
```

## API 엔드포인트

### 1. 사용자 API

#### 회원가입
- **URL**: `/api/users/signup`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "사용자명",
    "gender": "Male/Female",
    "birth": "YYYY-MM-DD",
    "address": "주소",
    "detailAddress": "상세주소",
    "phoneNumber": "전화번호",
    "preferences": [1, 2, 3] // 음식 카테고리 ID 배열
  }
  ```
- **성공 응답**:
  ```json
  {
    "resultType": "SUCCESS",
    "error": null,
    "success": {
      "member_id": 1,
      "email": "user@example.com",
      "name": "사용자명",
      "gender": "Male/Female",
      "birth": "YYYY-MM-DD",
      "address": "주소",
      "detailAddress": "상세주소",
      "phoneNumber": "전화번호",
      "preferences": [
        { "id": 1, "name": "한식" },
        { "id": 2, "name": "중식" },
        { "id": 3, "name": "일식" }
      ]
    }
  }
  ```

### 2. 가게 API

#### 가게 추가
- **URL**: `/api/stores`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "가게명",
    "address": "가게 주소",
    "contact": "연락처",
    "categoryId": 1,
    "regionId": 1,
    "description": "가게 설명",
    "openingHours": "영업시간"
  }
  ```

### 3. 리뷰 API

#### 리뷰 추가
- **URL**: `/api/reviews`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "content": "리뷰 내용",
    "score": 4.5,
    "imageUrl": "이미지URL",
    "storeId": 1
  }
  ```

#### 내 리뷰 목록 조회
- **URL**: `/api/reviews/my`
- **Method**: GET
- **Query Parameters**:
  - `cursor`: 페이지네이션 커서 (이전 페이지의 마지막 리뷰 ID)
  - `limit`: 한 페이지에 조회할 리뷰 수 (기본값: 5)

### 4. 미션 API

#### 미션 추가
- **URL**: `/api/missions`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "title": "미션 제목",
    "content": "미션 내용",
    "reward": 1000,
    "deadline": "2025-06-30T23:59:59.999Z",
    "storeId": 1
  }
  ```

#### 미션 도전
- **URL**: `/api/missions/:missionId/challenges`
- **Method**: POST

#### 미션 완료
- **URL**: `/api/missions/challenges/:challengeId/complete`
- **Method**: PATCH

## 오류 코드 체계

- **U001~U999**: 사용자 관련 오류 (예: U001 - 중복된 이메일)
- **S001~S999**: 가게 관련 오류 (예: S001 - 가게를 찾을 수 없음)
- **V001~V999**: 리뷰 관련 오류 (예: V001 - 리뷰를 찾을 수 없음)
- **M001~M999**: 미션 관련 오류 (예: M001 - 미션을 찾을 수 없음)
- **R001~R999**: 리소스 관련 오류 (예: R001 - 리소스를 찾을 수 없음)
- **Q001~Q999**: 요청 관련 오류 (예: Q001 - 유효하지 않은 요청)
- **A001~A999**: 인증/권한 관련 오류 (예: A001 - 인증 실패)
- **D001~D999**: 데이터베이스 관련 오류
- **E001~E999**: 외부 서비스 관련 오류

## 프로젝트 구조

```
umc-pr/
├── docs/                # 프로젝트 문서
├── logs/                # 애플리케이션 로그
├── prisma/              # Prisma 설정 및 스키마
├── public/              # 정적 파일
├── src/                 # 소스 코드
│   ├── controllers/     # 컨트롤러 레이어
│   ├── dtos/            # 데이터 전송 객체
│   ├── repositories/    # 데이터 접근 레이어
│   ├── routes/          # API 라우트 정의
│   ├── services/        # 비즈니스 로직 레이어
│   ├── utils/           # 유틸리티 함수
│   │   ├── errors-unified.js  # 오류 클래스 통합
│   │   └── logger.js    # 로깅 설정
│   ├── index.js         # 앱 진입점
│   └── prisma.js        # Prisma 클라이언트 설정
├── .env                 # 환경 변수
├── package.json         # 프로젝트 메타데이터
└── README.md            # 프로젝트 설명
```

## 개발 가이드

### API 응답 형식 사용하기

컨트롤러에서 API 응답을 반환할 때는 `res.success()`와 `res.error()` 메서드를 사용하여 표준화된 응답 형식을 유지하세요:

```javascript
// 성공 응답
res.status(StatusCodes.OK).success({
  message: '작업이 성공적으로 완료되었습니다.',
  data: result
});

// 실패 응답
res.status(StatusCodes.BAD_REQUEST).error({
  errorCode: 'Q001',
  reason: '유효하지 않은 요청입니다.',
  data: { field: 'email' }
});
```

### 오류 처리하기

서비스 레이어에서는 통합된 오류 클래스를 사용하여 구체적인 오류 정보를 제공하세요:

```javascript
import { 
  InvalidRequestError, 
  DuplicateUserEmailError 
} from '../utils/errors-unified.js';

// 유효성 검사 실패 시
if (!email) {
  throw new InvalidRequestError('이메일은 필수 입력 항목입니다.');
}

// 중복 데이터 발생 시
if (existingUser) {
  throw new DuplicateUserEmailError('이미 사용 중인 이메일입니다.', { email });
}
```

### 로깅 사용하기

다양한 로깅 레벨을 활용하여 적절한 로그를 남기세요:

```javascript
import logger from '../utils/logger.js';

// 정보 로그
logger.info('사용자 로그인 시도', { email });

// 경고 로그
logger.warn('잘못된 비밀번호 입력', { email, attempts: 3 });

// 오류 로그
logger.error('데이터베이스 연결 실패', { 
  error: error.message,
  stack: error.stack
});

// 디버그 로그
logger.debug('요청 데이터', { body: req.body });
```

## 성능 최적화

이 프로젝트는 다음과 같은 성능 최적화 기법을 적용하고 있습니다:

1. **응답 압축**: `compression` 미들웨어를 사용하여 0.5kb 이상의 응답을 자동으로 압축
2. **데이터베이스 최적화**: Prisma ORM을 활용한 효율적인 쿼리 실행
3. **커스텀 로거**: 프로덕션 환경에서 필요한 로그만 남기도록 설정

## 기여 방법

1. 이슈 생성 또는 기존 이슈 선택
2. 개발 브랜치 생성 (`feature/기능명`)
3. 변경사항 개발 및 테스트
4. Pull Request 제출

## 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.
