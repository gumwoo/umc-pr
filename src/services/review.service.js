import { StatusCodes } from "http-status-codes";
import { responseFromReview } from "../dtos/review.dto.js";
import { addReviewToStore, checkStoreExists } from "../repositories/review.repository.js";

export const addReview = async (reviewData) => {
  // 가게가 존재하는지 확인
  const storeExists = await checkStoreExists(reviewData.storeId);
  
  if (!storeExists) {
    const error = new Error("존재하지 않는 가게입니다.");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  
  // 가게에 리뷰 추가
  const reviewId = await addReviewToStore(reviewData);
  
  if (!reviewId) {
    const error = new Error("리뷰 추가에 실패했습니다.");
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
  
  return { reviewId };
};
