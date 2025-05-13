import prisma from '../prisma.js';
import logger from '../utils/logger.js';

// User 데이터 삽입
export const addUser = async (data) => {
  try {
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (existingUser) {
      logger.warn('이미 존재하는 이메일입니다.', { email: data.email });
      return null;
    }

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address || '',
        detail_address: data.detailAddress || '',
        phone_number: data.phoneNumber
      }
    });

    logger.info('사용자가 성공적으로 생성되었습니다.', { userId: newUser.id });
    return newUser.id;
  } catch (err) {
    logger.error('사용자 추가 중 오류 발생', { error: err.message });
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      logger.warn('사용자를 찾을 수 없습니다.', { userId });
      return null;
    }

    return [user]; // 기존 MySQL 호환성을 위해 배열로 반환
  } catch (err) {
    logger.error('사용자 조회 중 오류 발생', { error: err.message, userId });
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  try {
    await prisma.userFavorCategory.create({
      data: {
        user_id: userId,
        food_category_id: foodCategoryId
      }
    });

    logger.info('사용자 선호도가 설정되었습니다.', { userId, foodCategoryId });
    return;
  } catch (err) {
    logger.error('선호도 설정 중 오류 발생', { error: err.message, userId, foodCategoryId });
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.userFavorCategory.findMany({
      where: {
        user_id: userId
      },
      include: {
        food_category: true
      },
      orderBy: {
        food_category_id: 'asc'
      }
    });

    // 기존 형식으로 변환
    return preferences.map(pref => ({
      id: pref.id,
      food_category_id: pref.food_category_id,
      user_id: pref.user_id,
      name: pref.food_category.name
    }));
  } catch (err) {
    logger.error('사용자 선호도 조회 중 오류 발생', { error: err.message, userId });
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`
    );
  }
};

export const responseFromUser = ({ user, preferences }) => {
  const u = user[0]; // user는 SELECT 결과로 배열 형태

  return {
    member_id: u.id,
    email: u.email,
    name: u.name,
    gender: u.gender,
    birth: u.birth,
    address: u.address,
    detailAddress: u.detail_address,
    phoneNumber: u.phone_number,
    preferences: preferences.map((pref) => ({
      id: pref.food_category_id,
      name: pref.name,
    })),
    message: "회원 가입이 성공적으로 완료되었습니다.",
  };
};
