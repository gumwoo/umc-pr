import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const addStoreToRegion = async (req, res, next) => {
  try {
    console.log("지역에 가게 추가 요청!");
    console.log("Body:", req.body);
    console.log("지역 ID:", req.params.regionId);

    const regionId = parseInt(req.params.regionId);
    
    const storeData = bodyToStore({
      ...req.body,
      regionId
    });
    
    const result = await addStore(storeData);
    
    res.status(StatusCodes.CREATED).json({
      store_id: result.storeId,
      message: "가게가 성공적으로 등록되었습니다."
    });
  } catch (error) {
    next(error);
  }
};
