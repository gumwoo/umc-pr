/**
 * 오류 처리를 통합된 오류 클래스로 리다이렉션합니다.
 * 프로젝트 일관성을 위해 utils/errors-unified.js 파일의 오류 클래스를 사용하세요.
 * 
 * 이 파일은 기존 코드와의 호환성을 위해 유지됩니다.
 */

// 통합 오류 클래스 가져오기
import * as unifiedErrors from './errors-unified.js';

// 호환성을 위한 재내보내기
export const ApiError = unifiedErrors.ApiError;
export const NotFoundError = unifiedErrors.ResourceNotFoundError;  // 호환성을 위한 이름 변경
export const BadRequestError = unifiedErrors.InvalidRequestError;  // 호환성을 위한 이름 변경
export const ConflictError = unifiedErrors.DuplicateResourceError; // 호환성을 위한 이름 변경
export const UnauthorizedError = unifiedErrors.AuthenticationError; // 호환성을 위한 이름 변경
export const ForbiddenError = unifiedErrors.PermissionDeniedError;  // 호환성을 위한 이름 변경

// 나머지 오류 클래스도 내보내기
export * from './errors-unified.js';

/**
 * @deprecated utils/errors-unified.js의 클래스를 사용하세요.
 */
console.warn('src/utils/errors.js는 더 이상 사용되지 않습니다. 대신 utils/errors-unified.js를 사용하세요.');
