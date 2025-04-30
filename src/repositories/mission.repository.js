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

export const addMissionToStore = async (missionData) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await conn.query(
      `INSERT INTO mission (store_id, title, reward, deadline, total_progress) 
       VALUES (?, ?, ?, ?, ?);`,
      [
        missionData.storeId,
        missionData.title,
        missionData.reward,
        missionData.deadline,
        missionData.totalProgress
      ]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 추가 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const checkMissionExists = async (missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM mission WHERE id = ?) as missionExists;`,
      [missionId]
    );
    
    return rows[0].missionExists === 1;
  } catch (err) {
    throw new Error(`미션 존재 확인 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const checkMissionAlreadyChallenged = async (memberId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(
         SELECT 1 FROM mission_challenge 
         WHERE member_id = ? AND mission_id = ? AND status = 'in_progress'
       ) as alreadyChallenged;`,
      [memberId, missionId]
    );
    
    return rows[0].alreadyChallenged === 1;
  } catch (err) {
    throw new Error(`미션 도전 상태 확인 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const startMissionChallengeForMember = async (challengeData) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await conn.query(
      `INSERT INTO mission_challenge (member_id, mission_id, status, current_progress) 
       VALUES (?, ?, 'in_progress', 0);`,
      [
        challengeData.memberId,
        challengeData.missionId
      ]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 도전 시작 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};
