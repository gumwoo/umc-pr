import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import userRouter from "./routes/user.routes.js";
import storeRouter from "./routes/store.routes.js";
import reviewRouter from "./routes/review.routes.js";
import missionRouter from "./routes/mission.routes.js";
import missionRouter from "./routes/mission.routes.js";
import logger from "./utils/logger.js";
import { fileURLToPath } from 'url';
import path from 'path';

// ES 모듈에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
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

// 라우터 설정
app.use('/api/users', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/missions', missionRouter);
app.use('/api/missions', missionRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("UMC PR API Server is running");
});

// 404 에러 핸들러
app.use((req, res, next) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.status(StatusCodes.NOT_FOUND).json({ 
    success: false,
    error: "Not Found", 
    message: "요청하신 경로를 찾을 수 없습니다.",
    path: req.originalUrl
  });
});

// 오류 핸들러 - JSON 응답으로 개선
app.use((err, req, res, next) => {
  logger.error('서버 오류 발생', { 
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({
    success: false,
    error: err.name || "Error",
    message: err.message || "서버 내부 오류가 발생했습니다.",
    path: req.originalUrl
  });
});

// 서버 시작
app.listen(port, () => {
  logger.info(`서버가 포트 ${port}에서 실행 중입니다.`);
  console.log(`UMC PR API Server listening on port ${port}`);
});