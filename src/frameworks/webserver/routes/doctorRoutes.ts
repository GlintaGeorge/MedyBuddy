import express from "express";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { authService } from "../../services/authService";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { doctorRepositoryMongodb, doctorRepositoryMongodbType } from "../../database/mongodb/repositories/doctorRepositoryMongodb";
import doctorController from "../../../adapters/doctorController";
import {authenticateDoctor} from "../middlewares/authMiddleware";
import { timeSlotDbRepository } from "../../../app/interfaces/timeSlotDbRepository";
import {  timeSlotRepositoryMongodb } from "../../database/mongodb/repositories/timeSlotRepositoryMongodb";
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface";
import { userRepositoryMongodb } from '../../database/mongodb/repositories/userRepositoryMongodb';
import { userDbRepository } from '../../../app/interfaces/userDbRepository';
import { departmentRepositoryMongodb } from "../../database/mongodb/repositories/departmentRepositoryMongodb";

const doctorRoute = () => {
    const router = express.Router();

    //doctor controller
    const controller = doctorController(
        authServiceInterface,
        authService,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        userDbRepository,
        userRepositoryMongodb, 
        departmentDbRepository,
        departmentRepositoryMongodb
    );

   


    router.post("/signup", controller.signup);
    router.post("/verify_token/:token", controller.verifyToken);
    router.post("/login", controller.login);
    router.post("/google_signIn", controller.googleSignIn);
    router.get("/profile",authenticateDoctor,controller.doctorProfile);
    router.patch("/profile/edit",authenticateDoctor,controller.updateDoctorInfo);
    router.get("/status",authenticateDoctor,controller.doctorStatus);

    router.post("/addSlot",authenticateDoctor,controller.addSlot); 
    router.post("/getTimeSlots",authenticateDoctor,controller.getTimeSlots);
    router.delete("/deleteSlot/:id",authenticateDoctor,controller.deleteSlot);
    router.get('/departments', controller.listDepartmentsHandler);
    router.get("/doctorDetails/:id",authenticateDoctor,controller.getDoctorDetails);
    router.put("/reapply_verification/:id",authenticateDoctor,controller.getDoctorRejected)
    

    return router;
}

export default doctorRoute;
