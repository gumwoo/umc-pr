import logger from '../utils/logger.js';
import { 
  addMission, 
  getMissionById, 
  addMissionChallenge,
  getMissionChallengeByUserAndMission,
  getMissionsByStoreId,
  getMissionChallengesByUserId,
  getMissionChallengeById,
  updateMissionChallengeStatus
} from '../repositories/mission.repository.js';
import { getStoreById } from '../repositories/store.repository.js';
import { missionToResponse, missionChallengeToResponse, missionsToResponseWithCursor, missionChallengesToResponseWithCursor } from '../dtos/mission.dto.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors.js';

/**
 * 가게에 미션을 추가하는 서비스
 * @param {Object} missionData - 미션 데이터
 * @returns {Promise<Object>} 생성된 미션 정보
 */
export const createMission = async (missionData) => {
  logger.info('미션 생성 서비스 시작', { 
    title: missionData.title, 
    storeId: missionData.store_id 
  });
  
  // 가게 존재 여부 확인
  const store = await getStoreById(missionData.store_id);
  if (!store) {
    logger.warn('존재하지 않는 가게에 미션을 추가하려고 시도', { storeId: missionData.store_id });
    throw new NotFoundError(`가게 ID ${missionData.store_id}에 해당하는 가게가 존재하지 않습니다.`);
  }
  
  try {
    // 미션 추가
    const mission = await addMission(missionData);
    logger.info('미션 생성 성공', { missionId: mission.id });
    
    return missionToResponse(mission);
  } catch (error) {
    logger.error('미션 생성 서비스 오류', { error: error.message });
    throw error;
  }
};

/**
 * 특정 가게의 미션 목록을 조회하는 서비스
 * @param {number} storeId - 가게 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 미션 ID)
 * @param {number} limit - 한 페이지에 조회할 미션 수
 * @returns {Promise<Object>} 조회된 미션 목록과 다음 페이지 커서
 */
export const getStoreMissions = async (storeId, cursor, limit) => {
  logger.info('가게 미션 목록 조회 서비스 시작', { storeId, cursor, limit });
  
  // 가게 존재 여부 확인
  const store = await getStoreById(storeId);
  if (!store) {
    logger.warn('존재하지 않는 가게의 미션을 조회하려고 시도', { storeId });
    throw new NotFoundError(`가게 ID ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
  }
  
  try {
    // 미션 목록 조회
    const missions = await getMissionsByStoreId(storeId, cursor, limit);
    
    // DTO 변환
    const result = missionsToResponseWithCursor(missions, limit);
    
    logger.info('가게 미션 목록 조회 성공', { 
      storeId, 
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    return result;
  } catch (error) {
    logger.error('가게 미션 목록 조회 서비스 오류', { error: error.message, storeId });
    throw error;
  }
};

/**
 * 사용자가 진행 중인 미션 목록을 조회하는 서비스
 * @param {number} userId - 사용자 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 미션 도전 ID)
 * @param {number} limit - 한 페이지에 조회할 미션 도전 수
 * @returns {Promise<Object>} 조회된 미션 도전 목록과 다음 페이지 커서
 */
export const getUserMissions = async (userId, cursor, limit) => {
  logger.info('사용자 미션 목록 조회 서비스 시작', { userId, cursor, limit });
  
  try {
    // 미션 도전 목록 조회
    const challenges = await getMissionChallengesByUserId(userId, cursor, limit);
    
    // DTO 변환
    const result = missionChallengesToResponseWithCursor(challenges, limit);
    
    logger.info('사용자 미션 목록 조회 성공', { 
      userId, 
      count: result.data.length,
      hasMore: result.cursor !== null
    });
    
    return result;
  } catch (error) {
    logger.error('사용자 미션 목록 조회 서비스 오류', { error: error.message, userId });
    throw error;
  }
};

/**
 * 미션에 도전하는 서비스 (도전 중인 미션에 추가)
 * @param {number} missionId - 미션 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 생성된 미션 도전 정보
 */
export const challengeMission = async (missionId, userId) => {
  logger.info('미션 도전 서비스 시작', { missionId, userId });
  
  // 미션 존재 여부 확인
  const mission = await getMissionById(missionId);
  if (!mission) {
    logger.warn('존재하지 않는 미션에 도전하려고 시도', { missionId });
    throw new NotFoundError(`미션 ID ${missionId}에 해당하는 미션이 존재하지 않습니다.`);
  }
  
  // 이미 도전 중인 미션인지 확인
  const existingChallenge = await getMissionChallengeByUserAndMission(userId, missionId);
  if (existingChallenge) {
    logger.warn('이미 도전 중인 미션에 다시 도전하려고 시도', { 
      missionId, 
      userId,
      challengeId: existingChallenge.id
    });
    throw new ConflictError('이미 도전 중인 미션입니다.');
  }
  
  try {
    // 미션 도전 추가
    const challenge = await addMissionChallenge({
      mission_id: missionId,
      user_id: userId
    });
    
    logger.info('미션 도전 성공', { challengeId: challenge.id });
    return missionChallengeToResponse(challenge);
  } catch (error) {
    logger.error('미션 도전 서비스 오류', { error: error.message });
    throw error;
  }
};

/**
 * 진행 중인 미션을 완료하는 서비스
 * @param {number} challengeId - 미션 도전 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 업데이트된 미션 도전 정보
 */
export const completeMission = async (challengeId, userId) => {
  logger.info('미션 완료 서비스 시작', { challengeId, userId });
  
  // 미션 도전 존재 여부 확인
  const challenge = await getMissionChallengeById(challengeId);
  if (!challenge) {
    logger.warn('존재하지 않는 미션 도전을 완료하려고 시도', { challengeId });
    throw new NotFoundError(`미션 도전 ID ${challengeId}에 해당하는 도전이 존재하지 않습니다.`);
  }
  
  // 자신의 미션 도전인지 확인
  if (challenge.user_id !== userId) {
    logger.warn('다른 사용자의 미션 도전을 완료하려고 시도', { 
      challengeId, 
      userId, 
      ownerUserId: challenge.user_id 
    });
    throw new ForbiddenError('해당 미션에 대한 접근 권한이 없습니다.');
  }
  
  // 이미 완료된 미션인지 확인
  if (challenge.status === 'COMPLETED') {
    logger.warn('이미 완료된 미션 도전을 다시 완료하려고 시도', { challengeId });
    throw new ConflictError('이미 완료된 미션입니다.');
  }
  
  try {
    // 미션 도전 상태 업데이트
    const updatedChallenge = await updateMissionChallengeStatus(challengeId, 'COMPLETED');
    
    logger.info('미션 완료 성공', { challengeId });
    return missionChallengeToResponse(updatedChallenge);
  } catch (error) {
    logger.error('미션 완료 서비스 오류', { error: error.message });
    throw error;
  }
}; userId });
  
  // 미션 존재 여부 확인
  const mission = await getMissionById(missionId);
  if (!mission) {
    logger.warn('존재하지 않는 미션에 도전하려고 시도', { missionId });
    throw new NotFoundError(`미션 ID ${missionId}에 해당하는 미션이 존재하지 않습니다.`);
  }
  
  // 이미 도전 중인 미션인지 확인
  const existingChallenge = await getMissionChallengeByUserAndMission(userId, missionId);
  if (existingChallenge) {
    logger.warn('이미 도전 중인 미션에 다시 도전하려고 시도', { 
      missionId, 
      userId,
      challengeId: existingChallenge.id
    });
    throw new ConflictError('이미 도전 중인 미션입니다.');
  }
  
  try {
    // 미션 도전 추가
    const challenge = await addMissionChallenge({
      mission_id: missionId,
      user_id: userId
    });
    
    logger.info('미션 도전 성공', { challengeId: challenge.id });
    return missionChallengeToResponse(challenge);
  } catch (error) {
    logger.error('미션 도전 서비스 오류', { error: error.message });
    throw error;
  }
};
