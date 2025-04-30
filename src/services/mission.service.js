import { StatusCodes } from "http-status-codes";
import { responseFromMission } from "../dtos/mission.dto.js";
import { 
  addMissionToStore, 
  checkMissionExists, 
  checkStoreExists,
  checkMissionAlreadyChallenged,
  startMissionChallengeForMember
} from "../repositories/mission.repository.js";

export const addMission = async (missionData) => {
  // 가게가 존재하는지 확인
  const storeExists = await checkStoreExists(missionData.storeId);
  
  if (!storeExists) {
    const error = new Error("존재하지 않는 가게입니다.");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  
  // 가게에 미션 추가
  const missionId = await addMissionToStore(missionData);
  
  if (!missionId) {
    const error = new Error("미션 추가에 실패했습니다.");
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
  
  return { missionId };
};

export const startMissionChallenge = async (challengeData) => {
  // 미션이 존재하는지 확인
  const missionExists = await checkMissionExists(challengeData.missionId);
  
  if (!missionExists) {
    const error = new Error("존재하지 않는 미션입니다.");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  
  // 이미 도전 중인 미션인지 확인
  const alreadyChallenged = await checkMissionAlreadyChallenged(challengeData.memberId, challengeData.missionId);
  
  if (alreadyChallenged) {
    const error = new Error("이미 도전 중인 미션입니다.");
    error.statusCode = StatusCodes.CONFLICT;
    throw error;
  }
  
  // 미션 도전 시작
  const challengeId = await startMissionChallengeForMember(challengeData);
  
  if (!challengeId) {
    const error = new Error("미션 도전 시작에 실패했습니다.");
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
  
  return { challengeId };
};
