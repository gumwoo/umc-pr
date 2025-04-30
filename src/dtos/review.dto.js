export const bodyToReview = (body) => {
  return {
    storeId: body.storeId,
    memberId: body.memberId,
    body: body.body || "",
    score: parseFloat(body.score) || 0,
    images: body.images || []
  };
};

export const responseFromReview = (review) => {
  return {
    reviewId: review.id,
    storeId: review.store_id,
    memberId: review.member_id,
    body: review.body,
    score: review.score,
    images: review.images || [],
    createdAt: review.created_at
  };
};
