import express from 'express';
import { 
  handleCreateMission, 
  handleChallengeMission, 
  handleListStoreMissions,
  handleListMyMissions,
  handleCompleteMission
} from '../controllers/mission.controller.js';
import logger from '../utils/logger.js';

const router = express.Router();

// 가게에 미션 추가하기 API
router.post('/', async (req, res, next) => {
  logger.info('미션 추가 요청 수신', { 
    path: req.path, 
    method: req.method
  });
  
  try {
    await handleCreateMission(req, res, next);
  } catch (error) {
    logger.error('미션 추가 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    next(error);
  }
});

// 가게의 미션 목록 조회 API
router.get('/store/:storeId', async (req, res, next) => {
  logger.info('가게 미션 목록 조회 요청 수신', { 
    path: req.path, 
    method: req.method,
    storeId: req.params.storeId,
    cursor: req.query.cursor,
    limit: req.query.limit
  });
  
  try {
    await handleListStoreMissions(req, res, next);
  } catch (error) {
    logger.error('가게 미션 목록 조회 중 오류 발생', { 
      error: error.message,
      stack: error.stack,
      storeId: req.params.storeId
    });
    
    next(error);
  }
});

// 내가 진행 중인 미션 목록 조회 API
router.get('/my', async (req, res, next) => {
  logger.info('내 미션 목록 조회 요청 수신', { 
    path: req.path, 
    method: req.method,
    cursor: req.query.cursor,
    limit: req.query.limit
  });
  
  try {
    await handleListMyMissions(req, res, next);
  } catch (error) {
    logger.error('내 미션 목록 조회 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    next(error);
  }
});

// 미션에 도전하기 API
router.post('/:missionId/challenges', async (req, res, next) => {
  logger.info('미션 도전 요청 수신', { 
    path: req.path, 
    method: req.method,
    missionId: req.params.missionId
  });
  
  try {
    await handleChallengeMission(req, res, next);
  } catch (error) {
    logger.error('미션 도전 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack,
      missionId: req.params.missionId
    });
    
    next(error);
  }
});

// 내 미션 완료하기 API
router.patch('/challenges/:challengeId/complete', async (req, res, next) => {
  logger.info('미션 완료 요청 수신', { 
    path: req.path, 
    method: req.method,
    challengeId: req.params.challengeId
  });
  
  try {
    await handleCompleteMission(req, res, next);
  } catch (error) {
    logger.error('미션 완료 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack,
      challengeId: req.params.challengeId
    });
    
    next(error);
  }
});

export default router;