# UMC PR 프로젝트

UMC Node.js 백엔드 서버 프로젝트로, 사용자 관리 및 음식 카테고리 선호도 설정 기능을 제공합니다.

## 주요 기능

- 사용자 회원가입 및 관리
- 음식 카테고리 선호도 설정
- Prisma ORM을 이용한 데이터 관리
- 로깅 시스템

## 기술 스택

- **백엔드**: Node.js, Express
- **데이터베이스**: MySQL
- **ORM**: Prisma
- **기타 라이브러리**: dotenv, cors 등

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
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=umc_7th
   PORT=3000
   DATABASE_URL="mysql://root:your_password@localhost:3306/umc_7th"
   ```

4. Prisma 클라이언트 생성
   ```bash
   npx prisma generate
   ```

5. 데이터베이스 마이그레이션 실행
   ```bash
   npx prisma migrate dev --name init
   ```

6. 서버 실행
   ```bash
   npm run dev
   ```

## API 사용법

### 사용자 회원가입

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
│   ├── app.js           # Express 앱 설정
│   ├── db.config.js     # 데이터베이스 설정 (MySQL)
│   ├── index.js         # 앱 진입점
│   └── prisma.js        # Prisma 클라이언트 설정
├── .env                 # 환경 변수
├── .gitignore           # Git 무시 파일
├── package.json         # 프로젝트 메타데이터
└── README.md            # 프로젝트 설명
```

## 개발 가이드

### 코드 스타일

- ES 모듈 형식 사용 (`import`/`export`)
- 비동기 작업은 async/await 패턴 사용
- 에러 핸들링은 try-catch 구문 사용
- 로그 남기기 (`logger` 객체 사용)

### 데이터베이스 접근

기존 MySQL 직접 연결 방식:
```javascript
import { pool } from "../db.config.js";

const [result] = await pool.query(
  `INSERT INTO user (email, name) VALUES (?, ?);`,
  [data.email, data.name]
);
```

Prisma ORM 사용 방식:
```javascript
import prisma from "../prisma.js";

const result = await prisma.user.create({
  data: {
    email: data.email,
    name: data.name
  }
});
```

### 로깅

로깅 레벨:
- `error`: 오류 및 예외 상황
- `warn`: 경고 및 주의가 필요한 상황
- `info`: 일반적인 정보성 로그
- `debug`: 디버깅을 위한 상세 정보

사용 예시:
```javascript
import logger from "../utils/logger.js";

// 정보 로깅
logger.info("작업이 시작되었습니다", { userId: 123 });

// 오류 로깅
try {
  // 코드 실행
} catch (error) {
  logger.error("오류가 발생했습니다", { 
    error: error.message,
    stack: error.stack
  });
}
```

## 기여 방법

1. 이슈 생성 또는 기존 이슈 선택
2. 개발 브랜치 생성 (`feature/기능명`)
3. 변경사항 개발
4. 테스트 실행
5. Pull Request 제출

## 라이센스

이 프로젝트는 MIT 라이센스 하에 제공됩니다.
