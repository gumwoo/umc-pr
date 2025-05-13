import { StatusCodes } from 'http-status-codes';

/**
 * API 에러 클래스
 * 상태 코드와 메시지를 포함한 에러를 생성
 */
export class ApiError extends Error {
  /**
   * @param {string} message - 에러 메시지
   * @param {number} statusCode - HTTP 상태 코드
   * @param {string} name - 에러 이름
   */
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, name = 'ApiError') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 리소스를 찾을 수 없는 경우의 에러
 */
export class NotFoundError extends ApiError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(message, StatusCodes.NOT_FOUND, 'NotFoundError');
  }
}

/**
 * 잘못된 요청 형식이나 내용인 경우의 에러
 */
export class BadRequestError extends ApiError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, StatusCodes.BAD_REQUEST, 'BadRequestError');
  }
}

/**
 * 요청 처리 중 중복된 데이터가 발생한 경우의 에러
 */
export class ConflictError extends ApiError {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message, StatusCodes.CONFLICT, 'ConflictError');
  }
}

/**
 * 인증되지 않은 요청인 경우의 에러
 */
export class UnauthorizedError extends ApiError {
  constructor(message = '인증이 필요합니다.') {
    super(message, StatusCodes.UNAUTHORIZED, 'UnauthorizedError');
  }
}

/**
 * 권한이 없는 경우의 에러
 */
export class ForbiddenError extends ApiError {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, StatusCodes.FORBIDDEN, 'ForbiddenError');
  }
}
