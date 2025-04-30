import { StatusCodes } from "http-status-codes";
import { bodyToMission, bodyToMissionChallenge } from "../dtos/mission.dto.js";
import { addMission, startMissionChallenge } from "../services/mission.service.js";

export const addMissionToStore = async (req, res, next) => {
  try {
    console.log("가게 미션 추가 요청!");
    console.log("Body:", req.body);
    console.log("가게 ID:", req.params.storeId);

    const storeId = parseInt(req.params.storeId);
    
    const missionData = bodyToMission({
      ...req.body,
      storeId
    });
    
    const result = await addMission(missionData);
    
    res.status(StatusCodes.CREATED).json({
      mission_id: result.missionId,
      message: "미션이 성공적으로 등록되었습니다."
    });
  } catch (error) {
    next(error);
  }
};

export const challengeMission = async (req, res, next) => {
  try {
    console.log("미션 도전 요청!");
    console.log("회원 ID:", req.params.memberId);
    console.log("미션 ID:", req.params.missionId);

    const memberId = parseInt(req.params.memberId);
    const missionId = parseInt(req.params.missionId);
    
    const challengeData = bodyToMissionChallenge({
      memberId,
      missionId
    });
    
    const result = await startMissionChallenge(challengeData);
    
    res.status(StatusCodes.OK).json({
      mission_id: missionId,
      status: "in_progress",
      message: "미션 도전이 시작되었습니다."
    });
  } catch (error) {
    next(error);
  }
};
