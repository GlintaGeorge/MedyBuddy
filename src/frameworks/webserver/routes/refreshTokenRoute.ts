import express from "express";
import { authService } from "../../services/authService";
import tokenContoller from "../../../adapters/tokenController";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { userRepositoryMongodb } from "../../database/mongodb/repositories/userRepositoryMongodb";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { doctorRepositoryMongodb } from "../../database/mongodb/repositories/doctorRepositoryMongodb";

const refreshTokenRoute = () => {
  const router = express.Router();
  const controller = tokenContoller(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongodb,
    doctorDbRepository,
    doctorRepositoryMongodb,
  );

  
  router.get("/accessToken", controller.returnAccessToClient);
  router.post("/refresh_token", controller.getNewAccessToken);

  return router;
};
export default refreshTokenRoute;