/**
 * 클라이언트 요청 본문에서 미션 데이터로 변환
 * @param {Object} body - 요청 본문
 * @returns {Object} 미션 데이터 객체
 */
export const bodyToMission = (body) => {
  return {
    title: body.title,
    content: body.content,
    reward: body.reward || 0,
    deadline: body.deadline ? new Date(body.deadline) : null,
    store_id: body.storeId
  };
};

/**
 * 미션 데이터를 응답 형식으로 변환
 * @param {Object} mission - 미션 데이터
 * @returns {Object} 응답 형식의 미션 데이터
 */
export const missionToResponse = (mission) => {
  return {
    id: mission.id,
    title: mission.title,
    content: mission.content,
    reward: mission.reward,
    deadline: mission.deadline,
    store: {
      id: mission.store.id,
      name: mission.store.name
    },
    created_at: mission.created_at
  };
};

/**
 * 미션 목록을 커서 페이지네이션이 포함된 응답 형식으로 변환
 * @param {Array} missions - 미션 목록
 * @param {number} limit - 요청한 미션 개수 제한
 * @returns {Object} 페이지네이션이 포함된 응답 데이터
 */
export const missionsToResponseWithCursor = (missions, limit) => {
  // 다음 페이지가 있는지 확인 (요청한 개수보다 많은 결과가 있는 경우)
  const hasNextPage = missions.length > limit;
  
  // 실제로 반환할 데이터 (limit까지만)
  const limitedMissions = hasNextPage ? missions.slice(0, limit) : missions;
  
  // 미션 데이터 변환
  const data = limitedMissions.map(mission => ({
    id: mission.id,
    title: mission.title,
    content: mission.content,
    reward: mission.reward,
    deadline: mission.deadline,
    store: {
      id: mission.store.id,
      name: mission.store.name
    },
    created_at: mission.created_at
  }));
  
  // 다음 페이지 커서 설정 (페이지가 있으면 마지막 항목의 ID, 없으면 null)
  const nextCursor = hasNextPage && limitedMissions.length > 0 
    ? limitedMissions[limitedMissions.length - 1].id 
    : null;
  
  return {
    data: data,
    cursor: nextCursor
  };
};

/**
 * 미션 챌린지 데이터를 응답 형식으로 변환
 * @param {Object} challenge - 미션 챌린지 데이터
 * @returns {Object} 응답 형식의 미션 챌린지 데이터
 */
export const missionChallengeToResponse = (challenge) => {
  return {
    id: challenge.id,
    status: challenge.status,
    start_at: challenge.start_at,
    end_at: challenge.end_at,
    mission: {
      id: challenge.mission.id,
      title: challenge.mission.title,
      reward: challenge.mission.reward
    },
    user: {
      id: challenge.user.id,
      name: challenge.user.name
    },
    created_at: challenge.created_at
  };
};

/**
 * 미션 챌린지 목록을 커서 페이지네이션이 포함된 응답 형식으로 변환
 * @param {Array} challenges - 미션 챌린지 목록
 * @param {number} limit - 요청한 미션 챌린지 개수 제한
 * @returns {Object} 페이지네이션이 포함된 응답 데이터
 */
export const missionChallengesToResponseWithCursor = (challenges, limit) => {
  // 다음 페이지가 있는지 확인 (요청한 개수보다 많은 결과가 있는 경우)
  const hasNextPage = challenges.length > limit;
  
  // 실제로 반환할 데이터 (limit까지만)
  const limitedChallenges = hasNextPage ? challenges.slice(0, limit) : challenges;
  
  // 미션 챌린지 데이터 변환
  const data = limitedChallenges.map(challenge => ({
    id: challenge.id,
    status: challenge.status,
    start_at: challenge.start_at,
    end_at: challenge.end_at,
    mission: {
      id: challenge.mission.id,
      title: challenge.mission.title,
      reward: challenge.mission.reward,
      store: {
        id: challenge.mission.store.id,
        name: challenge.mission.store.name
      }
    },
    created_at: challenge.created_at
  }));
  
  // 다음 페이지 커서 설정 (페이지가 있으면 마지막 항목의 ID, 없으면 null)
  const nextCursor = hasNextPage && limitedChallenges.length > 0 
    ? limitedChallenges[limitedChallenges.length - 1].id 
    : null;
  
  return {
    data: data,
    cursor: nextCursor
  };
};
