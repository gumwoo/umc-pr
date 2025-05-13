import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import compression from "compression";
import { StatusCodes } from "http-status-codes";
import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js";
import reviewRouter from "./routes/review.routes.js";
import missionRouter from "./routes/mission.routes.js";
import logger from "./utils/logger.js";
import { fileURLToPath } from 'url';
import path from 'path';
// 통합된 오류 클래스 가져오기
import { ResourceNotFoundError } from "./utils/errors-unified.js";

// ES 모듈에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
// 응답 압축 미들웨어 (threshold: 0.5kb = 512 bytes)
app.use(compression({
  threshold: 512, // 0.5kb(512 bytes) 이상의 응답만 압축
  level: 6,       // 압축 레벨 (0-9, 기본값: 6, 높을수록 더 압축되지만 CPU 사용량 증가)
  filter: (req, res) => {
    // 이미지, 비디오 등 이미 압축된 형식은 압축하지 않음
    if (req.headers['x-no-compression']) {
      return false;
    }
    // 기본 압축 필터 사용 (text/*, application/json 등만 압축)
    return compression.filter(req, res);
  }
}));
app.use(cors());                            // cors 방식 허용
app.use(express.static(path.join(__dirname, '..', 'public')));  // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 로깅 미들웨어
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

/**
 * 공통 응답 형식을 위한 미들웨어
 * success와 error 메서드를 res 객체에 추가하여 응답 형식 통일
 */
app.use((req, res, next) => {
  // 성공 응답을 위한 메서드
  res.success = (success) => {
    return res.json({
      resultType: "SUCCESS",
      error: null,
      success
    });
  };
  
  // 실패 응답을 위한 메서드
  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null
    });
  };
  
  next();
});

// 라우터 설정
app.use('/api/users', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/missions', missionRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("UMC PR API Server is running");
});

// 404 에러 핸들러
app.use((req, res, next) => {
  const notFoundError = new ResourceNotFoundError(
    `요청하신 경로(${req.originalUrl})를 찾을 수 없습니다.`,
    { path: req.originalUrl }
  );
  
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(notFoundError.statusCode).error({
    errorCode: notFoundError.errorCode,
    reason: notFoundError.reason,
    data: notFoundError.data
  });
});

// 전역 오류 핸들러
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  
  logger.error('서버 오류 발생', { 
    name: err.name,
    error: err.message || err.reason,
    errorCode: err.errorCode,
    stack: err.stack,
    path: req.path
  });
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || "서버 내부 오류가 발생했습니다.",
    data: err.data || { path: req.originalUrl }
  });
});

// 서버 시작
app.listen(port, () => {
  logger.info(`서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`UMC PR API Server listening on port ${port}`);
});