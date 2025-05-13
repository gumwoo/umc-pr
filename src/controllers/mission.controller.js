import { StatusCodes } from 'http-status-codes';
import { 
  createMission, 
  challengeMission, 
  getStoreMissions,
  getUserMissions,
  completeMission
} from '../services/mission.service.js';
import logger from '../utils/logger.js';

/**
 * 가게에 미션을 추가하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleCreateMission = async (req, res, next) => {
  try {
    const missionData = {
      title: req.body.title,
      content: req.body.content,
      reward: req.body.reward || 0,
      deadline: req.body.deadline ? new Date(req.body.deadline) : null,
      store_id: req.body.storeId
    };
    
    logger.info('미션 추가 요청', { missionData });
    
    const mission = await createMission(missionData);
    
    logger.info('미션 추가 성공', { missionId: mission.id });
    res.status(StatusCodes.CREATED).success({
      message: '미션이 성공적으로 추가되었습니다.',
      mission
    });
  } catch (error) {
    logger.error('미션 추가 처리 중 오류 발생', { error: error.message });
    next(error);
  }
};

/**
 * 특정 가게의 미션 목록을 조회하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    
    logger.info('가게 미션 목록 조회 요청', { 
      storeId,
      cursor,
      limit
    });
    
    const result = await getStoreMissions(storeId, cursor, limit);
    
    logger.info('가게 미션 목록 조회 성공', { 
      storeId,
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    res.status(StatusCodes.OK).success({
      data: result.data,
      pagination: {
        cursor: result.cursor
      }
    });
  } catch (error) {
    logger.error('가게 미션 목록 조회 중 오류 발생', { 
      error: error.message,
      storeId: req.params.storeId
    });
    next(error);
  }
};

/**
 * 내가 진행 중인 미션 목록을 조회하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleListMyMissions = async (req, res, next) => {
  try {
    // 사용자 인증 정보가 있다고 가정 (실제로는 인증 미들웨어를 통해 설정됨)
    // 테스트를 위해 임시로 사용자 ID 설정
    const userId = req.user?.id || 1; // 실제 구현에서는 인증된 사용자 ID를 사용해야 함
    
    const cursor = req.query.cursor ? parseInt(req.query.cursor, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    
    logger.info('내 미션 목록 조회 요청', { 
      userId,
      cursor,
      limit
    });
    
    const result = await getUserMissions(userId, cursor, limit);
    
    logger.info('내 미션 목록 조회 성공', { 
      userId,
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    res.status(StatusCodes.OK).success({
      data: result.data,
      pagination: {
        cursor: result.cursor
      }
    });
  } catch (error) {
    logger.error('내 미션 목록 조회 중 오류 발생', { 
      error: error.message
    });
    next(error);
  }
};

/**
 * 미션에 도전하는 컨트롤러 (도전 중인 미션에 추가)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleChallengeMission = async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.missionId, 10);
    
    // 사용자 인증 정보가 있다고 가정 (실제로는 인증 미들웨어를 통해 설정됨)
    // 테스트를 위해 임시로 사용자 ID 설정
    const userId = req.user?.id || 1; // 실제 구현에서는 인증된 사용자 ID를 사용해야 함
    
    logger.info('미션 도전 요청', { 
      missionId,
      userId
    });
    
    const challenge = await challengeMission(missionId, userId);
    
    logger.info('미션 도전 성공', { challengeId: challenge.id });
    res.status(StatusCodes.CREATED).success({
      message: '미션에 성공적으로 도전했습니다.',
      challenge
    });
  } catch (error) {
    logger.error('미션 도전 처리 중 오류 발생', { 
      error: error.message,
      missionId: req.params.missionId
    });
    next(error);
  }
};

/**
 * 진행 중인 미션을 완료하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleCompleteMission = async (req, res, next) => {
  try {
    const challengeId = parseInt(req.params.challengeId, 10);
    
    // 사용자 인증 정보가 있다고 가정 (실제로는 인증 미들웨어를 통해 설정됨)
    // 테스트를 위해 임시로 사용자 ID 설정
    const userId = req.user?.id || 1; // 실제 구현에서는 인증된 사용자 ID를 사용해야 함
    
    logger.info('미션 완료 요청', { 
      challengeId,
      userId
    });
    
    const challenge = await completeMission(challengeId, userId);
    
    logger.info('미션 완료 성공', { challengeId: challenge.id });
    res.status(StatusCodes.OK).success({
      message: '미션이 성공적으로 완료되었습니다.',
      challenge
    });
  } catch (error) {
    logger.error('미션 완료 처리 중 오류 발생', { 
      error: error.message,
      challengeId: req.params.challengeId
    });
    next(error);
  }
};