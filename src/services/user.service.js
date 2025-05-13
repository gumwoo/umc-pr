import logger from "../utils/logger.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  responseFromUser,
} from "../repositories/user.repository.prisma.js";

export const userSignUp = async (data) => {
  logger.info("사용자 회원가입 서비스 시작", { email: data.email });
  
  try {
    // 사용자 추가
    const joinUserId = await addUser({
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    });

    if (joinUserId === null) {
      logger.warn("이미 존재하는 이메일로 회원가입 시도", { email: data.email });
      throw new Error("이미 존재하는 이메일입니다.");
    }

    logger.info("사용자 선호도 설정 시작", { userId: joinUserId, preferencesCount: data.preferences.length });
    
    // 선호도 추가
    for (const preference of data.preferences) {
      await setPreference(joinUserId, preference);
    }

    // 사용자 정보 조회
    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    logger.info("사용자 회원가입 완료", { userId: joinUserId });
    
    return responseFromUser({ user, preferences });
  } catch (error) {
    logger.error("회원가입 서비스 오류", { error: error.message });
    throw error; // 컨트롤러로 에러 전파
  }
};