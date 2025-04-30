import { pool } from "../db.config.js";

export const checkStoreExists = async (storeId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) as storeExists;`,
      [storeId]
    );
    
    return rows[0].storeExists === 1;
  } catch (err) {
    throw new Error(`가게 존재 확인 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const addReviewToStore = async (reviewData) => {
  const conn = await pool.getConnection();
  
  try {
    // 트랜잭션 시작
    await conn.beginTransaction();
    
    // 리뷰 삽입
    const [result] = await conn.query(
      `INSERT INTO review (store_id, member_id, body, score) 
       VALUES (?, ?, ?, ?);`,
      [
        reviewData.storeId,
        reviewData.memberId,
        reviewData.body,
        reviewData.score
      ]
    );
    
    const reviewId = result.insertId;
    
    // 이미지가 있는 경우 처리
    if (reviewData.images && reviewData.images.length > 0) {
      for (const imageUrl of reviewData.images) {
        await conn.query(
          `INSERT INTO review_image (review_id, image_url) VALUES (?, ?);`,
          [reviewId, imageUrl]
        );
      }
    }
    
    // 가게 평균 평점 및 리뷰 수 업데이트
    await conn.query(
      `UPDATE store SET 
         score = (SELECT AVG(score) FROM review WHERE store_id = ?),
         review_count = review_count + 1
       WHERE id = ?;`,
      [reviewData.storeId, reviewData.storeId]
    );
    
    // 트랜잭션 커밋
    await conn.commit();
    
    return reviewId;
  } catch (err) {
    // 오류 발생 시 롤백
    await conn.rollback();
    throw new Error(`리뷰 추가 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};
