import prisma from '../prisma.js';
import logger from '../utils/logger.js';

/**
 * 모든 지역 정보 조회
 * @returns {Promise<Array>} 지역 목록
 */
export const getAllRegions = async () => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    logger.info('지역 목록 조회 성공');
    return regions;
  } catch (err) {
    logger.error('지역 목록 조회 중 오류 발생', { error: err.message });
    throw new Error(`지역 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};

/**
 * 지역 ID로 지역 정보 조회
 * @param {number} regionId - 지역 ID
 * @returns {Promise<Object|null>} 지역 정보 또는 null
 */
export const getRegionById = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: {
        id: regionId
      }
    });
    
    if (!region) {
      logger.warn('존재하지 않는 지역을 조회', { regionId });
      return null;
    }
    
    logger.info('지역 정보 조회 성공', { regionId });
    return region;
  } catch (err) {
    logger.error('지역 정보 조회 중 오류 발생', { error: err.message, regionId });
    throw new Error(`지역 정보를 조회하는 데 실패했습니다: ${err.message}`);
  }
};
