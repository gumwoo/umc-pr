import logger from '../utils/logger.js';
import { addStore, getStoreById } from '../repositories/store.repository.js';
import { getRegionById } from '../repositories/region.repository.js';
import { storeToResponse } from '../dtos/store.dto.js';
import { 
  ResourceNotFoundError, 
  StoreNotFoundError,
  InvalidRequestError,
  DatabaseError,
  DuplicateStoreError
} from '../utils/errors-unified.js';

/**
 * 특정 지역에 가게를 추가하는 서비스
 * @param {Object} storeData - 가게 데이터
 * @returns {Promise<Object>} 생성된 가게 정보
 */
export const createStore = async (storeData) => {
  logger.info('가게 생성 서비스 시작', { name: storeData.name, regionId: storeData.region_id });
  
  // 기본 데이터 유효성 검사
  if (!storeData.name || !storeData.region_id) {
    logger.warn('유효하지 않은 가게 데이터', { storeData });
    throw new InvalidRequestError('가게 이름과 지역 ID는 필수 입력 항목입니다.', storeData);
  }
  
  try {
    // 지역 존재 여부 확인
    const region = await getRegionById(storeData.region_id);
    if (!region) {
      logger.warn('존재하지 않는 지역에 가게를 추가하려고 시도', { regionId: storeData.region_id });
      throw new ResourceNotFoundError(`지역 ID ${storeData.region_id}에 해당하는 지역이 존재하지 않습니다.`, { regionId: storeData.region_id });
    }
    
    // 가게 추가
    const store = await addStore(storeData);
    logger.info('가게 생성 성공', { storeId: store.id });
    
    return storeToResponse(store);
  } catch (error) {
    logger.error('가게 생성 서비스 오류', { 
      error: error.message,
      name: error.name,
      code: error.errorCode
    });
    
    // 이미 커스텀 오류인 경우 그대로 전파
    if (error instanceof ResourceNotFoundError || error instanceof InvalidRequestError) {
      throw error;
    }
    
    // 중복 오류 감지 (가게 이름, 주소 등으로 중복 발생 가능)
    if (error.message && error.message.includes('Unique constraint')) {
      throw new DuplicateStoreError('이미 동일한 이름 또는 주소의 가게가 존재합니다.', {
        name: storeData.name,
        address: storeData.address
      });
    }
    
    // 기타 데이터베이스 오류 등은 DatabaseError로 변환
    throw new DatabaseError('가게 생성 처리 중 오류가 발생했습니다.', { originalError: error.message });
  }
};

/**
 * 가게 ID로 가게 정보를 조회하는 서비스
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Object>} 가게 정보
 */
export const getStore = async (storeId) => {
  logger.info('가게 조회 서비스 시작', { storeId });
  
  if (!storeId || isNaN(storeId)) {
    logger.warn('유효하지 않은 가게 ID', { storeId });
    throw new InvalidRequestError('유효한 가게 ID를 입력해주세요.', { storeId });
  }
  
  try {
    const store = await getStoreById(storeId);
    if (!store) {
      logger.warn('존재하지 않는 가게를 조회', { storeId });
      throw new StoreNotFoundError(`가게 ID ${storeId}에 해당하는 가게가 존재하지 않습니다.`, { storeId });
    }
    
    logger.info('가게 조회 성공', { storeId });
    return storeToResponse(store);
  } catch (error) {
    logger.error('가게 조회 서비스 오류', { 
      error: error.message,
      name: error.name,
      code: error.errorCode
    });
    
    // 이미 커스텀 오류인 경우 그대로 전파
    if (error instanceof StoreNotFoundError || error instanceof InvalidRequestError) {
      throw error;
    }
    
    // 기타 데이터베이스 오류 등은 DatabaseError로 변환
    throw new DatabaseError('가게 조회 처리 중 오류가 발생했습니다.', { originalError: error.message });
  }
};
