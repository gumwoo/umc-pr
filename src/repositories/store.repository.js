import { pool } from "../db.config.js";

export const checkRegionExists = async (regionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM region WHERE id = ?) as regionExists;`,
      [regionId]
    );
    
    return rows[0].regionExists === 1;
  } catch (err) {
    throw new Error(`지역 존재 확인 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const addStoreToRegion = async (storeData) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await conn.query(
      `INSERT INTO store (region_id, name, address, category, score, review_count) 
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        storeData.regionId,
        storeData.name,
        storeData.address,
        storeData.category,
        storeData.score,
        storeData.reviewCount
      ]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`가게 추가 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};
