import { StatusCodes } from "http-status-codes";
import { responseFromStore } from "../dtos/store.dto.js";
import { addStoreToRegion, checkRegionExists } from "../repositories/store.repository.js";

export const addStore = async (storeData) => {
  // 지역이 존재하는지 확인
  const regionExists = await checkRegionExists(storeData.regionId);
  
  if (!regionExists) {
    const error = new Error("존재하지 않는 지역입니다.");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }
  
  // 지역에 가게 추가
  const storeId = await addStoreToRegion(storeData);
  
  if (!storeId) {
    const error = new Error("가게 추가에 실패했습니다.");
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    throw error;
  }
  
  return { storeId };
};
