import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";

// 컨트롤러 불러오기
import { addStoreToRegion } from "./src/controllers/store.controller.js";
import { addReviewToStore } from "./src/controllers/review.controller.js";
import { addMissionToStore, challengeMission } from "./src/controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 경로
app.get("/", (req, res) => {
  res.send("UMC Node.js Chapter 5 API 서버");
});

// 3주차에서 설계한 API 경로
// API #1: 특정 지역에 가게 추가하기 API
app.post("/api/regions/:regionId/stores", addStoreToRegion);

// API #2: 가게에 리뷰 추가하기 API (필수)
app.post("/api/stores/:storeId/reviews", addReviewToStore);

// API #3: 가게에 미션 추가하기 API
app.post("/api/stores/:storeId/missions", addMissionToStore);

// API #4: 가게의 미션을 도전 중인 미션에 추가(미션 도전하기) API (필수)
app.post("/api/members/:memberId/missions/:missionId/challenge", challengeMission);

// 전역 에러 핸들러 (시니어 미션 - JSON 형태의 에러 응답)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: err.message || "예상치 못한 오류가 발생했습니다."
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    message: "요청한 경로를 찾을 수 없습니다."
  });
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
