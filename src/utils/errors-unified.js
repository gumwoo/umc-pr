import { StatusCodes } from 'http-status-codes';

/**
 * 기본 API 오류 클래스
 * 상태 코드, 오류 코드, 이유, 데이터를 포함한 확장된 오류 클래스
 */
export class ApiError extends Error {
  /**
   * @param {string} reason - 오류 이유
   * @param {Object} data - 추가 오류 데이터 (선택 사항)
   * @param {string} errorCode - 오류 식별 코드 (선택 사항)
   * @param {number} statusCode - HTTP 상태 코드 (선택 사항)
   */
  constructor(reason, data = null, errorCode = "UNKNOWN", statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 사용자 관련 오류
 */

// 중복된 사용자 이메일 오류
export class DuplicateUserEmailError extends ApiError {
  constructor(reason = '이미 존재하는 이메일입니다.', data = null) {
    super(reason, data, "U001", StatusCodes.CONFLICT);
  }
}

// 사용자를 찾을 수 없는 오류
export class UserNotFoundError extends ApiError {
  constructor(reason = '사용자를 찾을 수 없습니다.', data = null) {
    super(reason, data, "U002", StatusCodes.NOT_FOUND);
  }
}

// 유효하지 않은 사용자 데이터 오류
export class InvalidUserDataError extends ApiError {
  constructor(reason = '유효하지 않은 사용자 데이터입니다.', data = null) {
    super(reason, data, "U003", StatusCodes.BAD_REQUEST);
  }
}

/**
 * 리소스 관련 오류
 */

// 리소스를 찾을 수 없는 오류
export class ResourceNotFoundError extends ApiError {
  constructor(reason = '요청한 리소스를 찾을 수 없습니다.', data = null) {
    super(reason, data, "R001", StatusCodes.NOT_FOUND);
  }
}

// 이미 존재하는 리소스 오류
export class DuplicateResourceError extends ApiError {
  constructor(reason = '이미 존재하는 리소스입니다.', data = null) {
    super(reason, data, "R002", StatusCodes.CONFLICT);
  }
}

/**
 * 가게 관련 오류
 */

// 가게를 찾을 수 없는 오류
export class StoreNotFoundError extends ApiError {
  constructor(reason = '가게를 찾을 수 없습니다.', data = null) {
    super(reason, data, "S001", StatusCodes.NOT_FOUND);
  }
}

// 중복된 가게 오류
export class DuplicateStoreError extends ApiError {
  constructor(reason = '이미 존재하는 가게입니다.', data = null) {
    super(reason, data, "S002", StatusCodes.CONFLICT);
  }
}

/**
 * 리뷰 관련 오류
 */

// 리뷰를 찾을 수 없는 오류
export class ReviewNotFoundError extends ApiError {
  constructor(reason = '리뷰를 찾을 수 없습니다.', data = null) {
    super(reason, data, "V001", StatusCodes.NOT_FOUND);
  }
}

// 중복된 리뷰 오류
export class DuplicateReviewError extends ApiError {
  constructor(reason = '이미 해당 가게에 리뷰를 작성하셨습니다.', data = null) {
    super(reason, data, "V002", StatusCodes.CONFLICT);
  }
}

/**
 * 미션 관련 오류
 */

// 미션을 찾을 수 없는 오류
export class MissionNotFoundError extends ApiError {
  constructor(reason = '미션을 찾을 수 없습니다.', data = null) {
    super(reason, data, "M001", StatusCodes.NOT_FOUND);
  }
}

// 중복된 미션 도전 오류
export class DuplicateMissionChallengeError extends ApiError {
  constructor(reason = '이미 도전 중인 미션입니다.', data = null) {
    super(reason, data, "M002", StatusCodes.CONFLICT);
  }
}

// 미션 도전을 찾을 수 없는 오류
export class MissionChallengeNotFoundError extends ApiError {
  constructor(reason = '미션 도전 정보를 찾을 수 없습니다.', data = null) {
    super(reason, data, "M003", StatusCodes.NOT_FOUND);
  }
}

// 이미 완료된 미션 도전 오류
export class MissionAlreadyCompletedError extends ApiError {
  constructor(reason = '이미 완료된 미션입니다.', data = null) {
    super(reason, data, "M004", StatusCodes.CONFLICT);
  }
}

/**
 * 요청 관련 오류
 */

// 잘못된 요청 오류
export class InvalidRequestError extends ApiError {
  constructor(reason = '잘못된 요청입니다.', data = null) {
    super(reason, data, "Q001", StatusCodes.BAD_REQUEST);
  }
}

/**
 * 인증 관련 오류
 */

// 인증 실패 오류
export class AuthenticationError extends ApiError {
  constructor(reason = '인증에 실패했습니다.', data = null) {
    super(reason, data, "A001", StatusCodes.UNAUTHORIZED);
  }
}

// 권한 부족 오류
export class PermissionDeniedError extends ApiError {
  constructor(reason = '접근 권한이 없습니다.', data = null) {
    super(reason, data, "A002", StatusCodes.FORBIDDEN);
  }
}

/**
 * 데이터베이스 관련 오류
 */

// 데이터베이스 오류
export class DatabaseError extends ApiError {
  constructor(reason = '데이터베이스 작업 중 오류가 발생했습니다.', data = null) {
    super(reason, data, "D001", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 외부 서비스 관련 오류
 */

// 외부 서비스 오류
export class ExternalServiceError extends ApiError {
  constructor(reason = '외부 서비스 호출 중 오류가 발생했습니다.', data = null) {
    super(reason, data, "E001", StatusCodes.BAD_GATEWAY);
  }
}
