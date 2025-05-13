import logger from '../utils/logger.js';
import { addStore, getStoreById } from '../repositories/store.repository.js';
import { getRegionById } from '../repositories/region.repository.js';
import { storeToResponse } from '../dtos/store.dto.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

/**
 * 특정 지역에 가게를 추가하는 서비스
 * @param {Object} storeData - 가게 데이터
 * @returns {Promise<Object>} 생성된 가게 정보
 */
export const createStore = async (storeData) => {
  logger.info('가게 생성 서비스 시작', { name: storeData.name, regionId: storeData.region_id });
  
  // 지역 존재 여부 확인
  const region = await getRegionById(storeData.region_id);
  if (!region) {
    logger.warn('존재하지 않는 지역에 가게를 추가하려고 시도', { regionId: storeData.region_id });
    throw new NotFoundError(`지역 ID ${storeData.region_id}에 해당하는 지역이 존재하지 않습니다.`);
  }
  
  try {
    // 가게 추가
    const store = await addStore(storeData);
    logger.info('가게 생성 성공', { storeId: store.id });
    
    return storeToResponse(store);
  } catch (error) {
    logger.error('가게 생성 서비스 오류', { error: error.message });
    throw error;
  }
};

/**
 * 가게 ID로 가게 정보를 조회하는 서비스
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Object>} 가게 정보
 */
export const getStore = async (storeId) => {
  logger.info('가게 조회 서비스 시작', { storeId });
  
  try {
    const store = await getStoreById(storeId);
    if (!store) {
      logger.warn('존재하지 않는 가게를 조회', { storeId });
      throw new NotFoundError(`가게 ID ${storeId}에 해당하는 가게가 존재하지 않습니다.`);
    }
    
    logger.info('가게 조회 성공', { storeId });
    return storeToResponse(store);
  } catch (error) {
    logger.error('가게 조회 서비스 오류', { error: error.message });
    throw error;
  }
};
