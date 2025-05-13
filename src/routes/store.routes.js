import express from 'express';
import { handleCreateStore } from '../controllers/store.controller.js';
import logger from '../utils/logger.js';

const router = express.Router();

// 특정 지역에 가게 추가하기 API
router.post('/', async (req, res, next) => {
  logger.info('가게 추가 요청 수신', { 
    path: req.path, 
    method: req.method
  });
  
  try {
    await handleCreateStore(req, res, next);
  } catch (error) {
    logger.error('가게 추가 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    next(error);
  }
});

export default router;
