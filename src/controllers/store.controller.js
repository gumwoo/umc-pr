import { StatusCodes } from 'http-status-codes';
import { bodyToStore } from '../dtos/store.dto.js';
import { createStore } from '../services/store.service.js';
import logger from '../utils/logger.js';

/**
 * 특정 지역에 가게를 추가하는 컨트롤러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - Express 다음 미들웨어 함수
 */
export const handleCreateStore = async (req, res, next) => {
  logger.info('가게 추가 요청을 받았습니다', { path: req.path });
  logger.debug('요청 본문:', { body: req.body });
  
  try {
    const storeData = bodyToStore(req.body);
    const store = await createStore(storeData);
    
    logger.info('가게 추가 성공', { storeId: store.id });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '가게가 성공적으로 추가되었습니다.',
      data: store
    });
  } catch (error) {
    logger.error('가게 추가 처리 중 오류 발생', { error: error.message });
    next(error);
  }
};
