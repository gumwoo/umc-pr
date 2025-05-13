import prisma from '../prisma.js';
import logger from '../utils/logger.js';

/**
 * 가게 추가
 * @param {Object} data - 가게 데이터
 * @returns {Promise<Object>} 생성된 가게 정보
 */
export const addStore = async (data) => {
  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        contact: data.contact,
        category_id: data.category_id,
        region_id: data.region_id,
        description: data.description,
        opening_hours: data.opening_hours
      },
      include: {
        category: true,
        region: true
      }
    });
    
    logger.info('가게 추가 성공', { storeId: store.id });
    return store;
  } catch (err) {
    logger.error('가게 추가 중 오류 발생', { error: err.message, data });
    throw new Error(`가게를 추가하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 가게 ID로 가게 정보 조회
 * @param {number} storeId - 가게 ID
 * @returns {Promise<Object|null>} 가게 정보 또는 null
 */
export const getStoreById = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId
      },
      include: {
        category: true,
        region: true
      }
    });
    
    if (!store) {
      logger.warn('존재하지 않는 가게를 조회', { storeId });
      return null;
    }
    
    logger.info('가게 정보 조회 성공', { storeId });
    return store;
  } catch (err) {
    logger.error('가게 정보 조회 중 오류 발생', { error: err.message, storeId });
    throw new Error(`가게 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 지역 ID로 가게 목록 조회
 * @param {number} regionId - 지역 ID
 * @returns {Promise<Array>} 가게 목록
 */
export const getStoresByRegionId = async (regionId) => {
  try {
    const stores = await prisma.store.findMany({
      where: {
        region_id: regionId
      },
      include: {
        category: true,
        region: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    logger.info('지역별 가게 목록 조회 성공', { regionId, count: stores.length });
    return stores;
  } catch (err) {
    logger.error('지역별 가게 목록 조회 중 오류 발생', { error: err.message, regionId });
    throw new Error(`지역별 가게 목록을 조회하는 데 실패했습니다: ${err.message}`);
  }
};
