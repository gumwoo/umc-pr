import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const addReviewToStore = async (req, res, next) => {
  try {
    console.log("가게 리뷰 추가 요청!");
    console.log("Body:", req.body);
    console.log("가게 ID:", req.params.storeId);

    const storeId = parseInt(req.params.storeId);
    const memberId = req.body.memberId || 1; // 만약 회원 ID가 제공되지 않으면 기본값 사용
    
    const reviewData = bodyToReview({
      ...req.body,
      storeId,
      memberId
    });
    
    const result = await addReview(reviewData);
    
    res.status(StatusCodes.CREATED).json({
      review_id: result.reviewId,
      message: "리뷰가 성공적으로 등록되었습니다."
    });
  } catch (error) {
    next(error);
  }
};
