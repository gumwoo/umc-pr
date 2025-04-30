export const bodyToMission = (body) => {
  const deadline = body.deadline ? new Date(body.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 기본값: 현재로부터 1주일
  
  return {
    storeId: body.storeId,
    title: body.title || "가게 미션",
    reward: body.reward || "500포인트",
    deadline,
    totalProgress: body.totalProgress || 1
  };
};

export const bodyToMissionChallenge = (body) => {
  return {
    memberId: body.memberId,
    missionId: body.missionId
  };
};

export const responseFromMission = (mission) => {
  return {
    missionId: mission.id,
    storeId: mission.store_id,
    title: mission.title,
    reward: mission.reward,
    deadline: mission.deadline,
    totalProgress: mission.total_progress,
    createdAt: mission.created_at
  };
};
