import logger from "../utils/logger.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  responseFromUser,
} from "../repositories/user.repository.prisma.js";
import { 
  DuplicateUserEmailError, 
  DatabaseError, 
  InvalidUserDataError 
} from "../utils/errors-unified.js";

export const userSignUp = async (data) => {
  logger.info("사용자 회원가입 서비스 시작", { email: data.email });
  
  try {
    // 기본 데이터 유효성 검사
    if (!data.email || !data.name) {
      logger.warn("유효하지 않은 사용자 데이터로 회원가입 시도", { data });
      throw new InvalidUserDataError("이메일과 이름은 필수 입력 항목입니다.", data);
    }
    
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
      throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", { email: data.email });
    }

    logger.info("사용자 선호도 설정 시작", { userId: joinUserId, preferencesCount: data.preferences?.length || 0 });
    
    // 선호도 추가
    if (data.preferences && Array.isArray(data.preferences)) {
      for (const preference of data.preferences) {
        await setPreference(joinUserId, preference);
      }
    }

    // 사용자 정보 조회
    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    logger.info("사용자 회원가입 완료", { userId: joinUserId });
    
    return responseFromUser({ user, preferences });
  } catch (error) {
    logger.error("회원가입 서비스 오류", { 
      error: error.message, 
      name: error.name,
      code: error.errorCode
    });
    
    // 이미 커스텀 오류인 경우 그대로 전파
    if (error instanceof DuplicateUserEmailError || error instanceof InvalidUserDataError) {
      throw error;
    }
    
    // 기타 데이터베이스 오류 등은 DatabaseError로 변환
    throw new DatabaseError("회원가입 처리 중 오류가 발생했습니다.", { originalError: error.message });
  }
};