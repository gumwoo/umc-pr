import express from 'express';
import { handleUserSignUp } from '../controllers/user.controller.js';
import logger from '../utils/logger.js';

const router = express.Router();

// 회원가입 엔드포인트
router.post('/signup', async (req, res, next) => {
  logger.info('회원가입 요청 수신', { 
    path: req.path, 
    method: req.method,
    ip: req.ip
  });
  
  try {
    await handleUserSignUp(req, res, next);
  } catch (error) {
    logger.error('회원가입 처리 중 오류 발생', { 
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      error: '서버 오류가 발생했습니다.',
      message: error.message
    });
  }
});

export default router;
