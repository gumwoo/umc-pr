import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import logger from "../utils/logger.js";

export const handleUserSignUp = async (req, res, next) => {
  logger.info("회원가입을 요청했습니다!");
  logger.debug("요청 본문:", { body: req.body }); // 값이 잘 들어오나 확인하기 위한 테스트용

  try {
    const user = await userSignUp(bodyToUser(req.body));
    logger.info("회원가입 성공", { userId: user.member_id });
    res.status(StatusCodes.OK).json({ result: user });
  } catch (error) {
    logger.error("회원가입 처리 중 오류 발생", { error: error.message });
    next(error); // 오류 핸들러로 전달
  }
};