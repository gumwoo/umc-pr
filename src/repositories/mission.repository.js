import prisma from '../prisma.js';
import logger from '../utils/logger.js';

/**
 * 미션 추가
 * @param {Object} data - 미션 데이터
 * @returns {Promise<Object>} 생성된 미션 정보
 */
export const addMission = async (data) => {
  try {
    const mission = await prisma.mission.create({
      data: {
        title: data.title,
        content: data.content,
        reward: data.reward,
        deadline: data.deadline,
        store_id: data.store_id
      },
      include: {
        store: true
      }
    });
    
    logger.info('미션 추가 성공', { missionId: mission.id, storeId: data.store_id });
    return mission;
  } catch (err) {
    logger.error('미션 추가 중 오류 발생', { error: err.message, data });
    throw new Error(`미션을 추가하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 미션 ID로 미션 정보 조회
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object|null>} 미션 정보 또는 null
 */
export const getMissionById = async (missionId) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId
      },
      include: {
        store: true
      }
    });
    
    if (!mission) {
      logger.warn('존재하지 않는 미션을 조회', { missionId });
      return null;
    }
    
    logger.info('미션 정보 조회 성공', { missionId });
    return mission;
  } catch (err) {
    logger.error('미션 정보 조회 중 오류 발생', { error: err.message, missionId });
    throw new Error(`미션 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 가게 ID로 미션 목록 조회
 * @param {number} storeId - 가게 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 미션 ID)
 * @param {number} limit - 한 페이지에 조회할 미션 수
 * @returns {Promise<Array>} 미션 목록
 */
export const getMissionsByStoreId = async (storeId, cursor, limit) => {
  try {
    // 쿼리 조건 구성
    const whereCondition = {
      store_id: storeId
    };
    
    // 커서가 있는 경우, 해당 ID보다 작은 항목만 조회 (ID 내림차순이므로)
    if (cursor) {
      whereCondition.id = {
        lt: cursor
      };
    }
    
    // 미션 조회
    const missions = await prisma.mission.findMany({
      where: whereCondition,
      include: {
        store: true
      },
      orderBy: {
        id: 'desc' // 최신순으로 정렬
      },
      take: limit + 1 // 다음 페이지 확인을 위해 limit보다 하나 더 조회
    });
    
    logger.info('가게별 미션 목록 조회 성공', { 
      storeId, 
      count: missions.length,
      cursor,
      limit
    });
    
    return missions;
  } catch (err) {
    logger.error('가게별 미션 목록 조회 중 오류 발생', { error: err.message, storeId });
    throw new Error(`가게별 미션 목록을 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 미션 도전 추가
 * @param {Object} data - 미션 도전 데이터
 * @returns {Promise<Object>} 생성된 미션 도전 정보
 */
export const addMissionChallenge = async (data) => {
  try {
    const challenge = await prisma.missionChallenge.create({
      data: {
        status: 'ONGOING',
        mission_id: data.mission_id,
        user_id: data.user_id
      },
      include: {
        mission: {
          include: {
            store: true
          }
        },
        user: true
      }
    });
    
    logger.info('미션 도전 추가 성공', { challengeId: challenge.id, missionId: data.mission_id, userId: data.user_id });
    return challenge;
  } catch (err) {
    logger.error('미션 도전 추가 중 오류 발생', { error: err.message, data });
    throw new Error(`미션 도전을 추가하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 사용자 ID와 미션 ID로 진행 중인 미션 도전 조회
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {Promise<Object|null>} 미션 도전 정보 또는 null
 */
export const getMissionChallengeByUserAndMission = async (userId, missionId) => {
  try {
    const challenge = await prisma.missionChallenge.findFirst({
      where: {
        user_id: userId,
        mission_id: missionId
      },
      include: {
        mission: {
          include: {
            store: true
          }
        },
        user: true
      }
    });
    
    logger.info('미션 도전 조회 결과', { 
      userId, 
      missionId, 
      exists: challenge !== null 
    });
    
    return challenge;
  } catch (err) {
    logger.error('미션 도전 조회 중 오류 발생', { error: err.message, userId, missionId });
    throw new Error(`미션 도전 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 사용자 ID로 미션 도전 목록 조회
 * @param {number} userId - 사용자 ID
 * @param {number|null} cursor - 페이지네이션 커서 (이전 페이지의 마지막 미션 도전 ID)
 * @param {number} limit - 한 페이지에 조회할 미션 도전 수
 * @returns {Promise<Array>} 미션 도전 목록
 */
export const getMissionChallengesByUserId = async (userId, cursor, limit) => {
  try {
    // 쿼리 조건 구성
    const whereCondition = {
      user_id: userId
    };
    
    // 커서가 있는 경우, 해당 ID보다 작은 항목만 조회 (ID 내림차순이므로)
    if (cursor) {
      whereCondition.id = {
        lt: cursor
      };
    }
    
    // 미션 도전 조회
    const challenges = await prisma.missionChallenge.findMany({
      where: whereCondition,
      include: {
        mission: {
          include: {
            store: true
          }
        },
        user: true
      },
      orderBy: {
        id: 'desc' // 최신순으로 정렬
      },
      take: limit + 1 // 다음 페이지 확인을 위해 limit보다 하나 더 조회
    });
    
    logger.info('사용자별 미션 도전 목록 조회 성공', { 
      userId, 
      count: challenges.length,
      cursor,
      limit
    });
    
    return challenges;
  } catch (err) {
    logger.error('사용자별 미션 도전 목록 조회 중 오류 발생', { error: err.message, userId });
    throw new Error(`사용자별 미션 도전 목록을 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 미션 도전 ID로 미션 도전 정보 조회
 * @param {number} challengeId - 미션 도전 ID
 * @returns {Promise<Object|null>} 미션 도전 정보 또는 null
 */
export const getMissionChallengeById = async (challengeId) => {
  try {
    const challenge = await prisma.missionChallenge.findUnique({
      where: {
        id: challengeId
      },
      include: {
        mission: {
          include: {
            store: true
          }
        },
        user: true
      }
    });
    
    if (!challenge) {
      logger.warn('존재하지 않는 미션 도전을 조회', { challengeId });
      return null;
    }
    
    logger.info('미션 도전 정보 조회 성공', { challengeId });
    return challenge;
  } catch (err) {
    logger.error('미션 도전 정보 조회 중 오류 발생', { error: err.message, challengeId });
    throw new Error(`미션 도전 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 미션 도전 상태 업데이트
 * @param {number} challengeId - 미션 도전 ID
 * @param {string} status - 업데이트할 상태 ('ONGOING', 'COMPLETED', 'FAILED')
 * @returns {Promise<Object>} 업데이트된 미션 도전 정보
 */
export const updateMissionChallengeStatus = async (challengeId, status) => {
  try {
    const challenge = await prisma.missionChallenge.update({
      where: {
        id: challengeId
      },
      data: {
        status: status,
        end_at: status === 'ONGOING' ? null : new Date() // 'COMPLETED' 또는 'FAILED'인 경우 종료 시간 설정
      },
      include: {
        mission: {
          include: {
            store: true
          }
        },
        user: true
      }
    });
    
    logger.info('미션 도전 상태 업데이트 성공', { challengeId, status });
    return challenge;
  } catch (err) {
    logger.error('미션 도전 상태 업데이트 중 오류 발생', { error: err.message, challengeId, status });
    throw new Error(`미션 도전 상태를 업데이트하는 데 실패했습니다: ${err.message}`);
  }
};