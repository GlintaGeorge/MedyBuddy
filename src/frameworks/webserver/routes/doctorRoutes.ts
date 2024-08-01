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
import { bookingDbRepository } from "../../../app/interfaces/bookingrepository";
import bookingController from "../../../adapters/bookingController";
import { bookingRepositoryMongodb } from "../../database/mongodb/repositories/bookingRepositoryMongodb";
import { prescriptionDbRepository } from "../../../app/interfaces/prescriptionDbRepositort";
import { PrescriptionRepositoryMongodbType, prescriptionRepositoryMongodb } from "../../database/mongodb/repositories/prescriptionRepositoryMongodb";

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
        bookingDbRepository,
        bookingRepositoryMongodb,
        prescriptionDbRepository,
        prescriptionRepositoryMongodb,
        departmentRepositoryMongodb,
    );

    
    const _bookingController = bookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
    )

   


    router.post("/signup", controller.signup);
    router.post("/verify_token/:token", controller.verifyToken);
    router.post("/login", controller.login);
    router.post("/google_signIn", controller.googleSignIn);
    router.get("/profile",authenticateDoctor,controller.doctorProfile);
    router.patch("/profile/edit",authenticateDoctor,controller.updateDoctorInfo);
    router.get("/status",authenticateDoctor,controller.doctorStatus);

    // router.post("/addSlot",authenticateDoctor,controller.addSlot); 
    // router.post("/getTimeSlots",authenticateDoctor,controller.getTimeSlots);
    // router.delete("/deleteSlot/:id",authenticateDoctor,controller.deleteSlot);


    router.post("/schedule",authenticateDoctor,controller.scheduleTime);
    router.get("/timeslots",authenticateDoctor,controller.getTimeSlots)
    router.delete("/deleteTime/:id",authenticateDoctor,controller.removeTimeSlot)

    
    router.get('/departments', controller.listDepartmentsHandler);
    router.get("/doctorDetails/:id",authenticateDoctor,controller.getDoctorDetails);
    router.put("/reapply_verification/:id",authenticateDoctor,controller.getDoctorRejected)
    router.get("/user/:id", authenticateDoctor,controller.userDetails);
    router.get("/patients",authenticateDoctor,controller.getPatientList);
    router.get("/patients/:id",authenticateDoctor,controller.getPatientDetails);
    router.post("/addPrescription",authenticateDoctor,controller.addPrescription);
    router.get("/prescription/:id",authenticateDoctor,controller.fetchPrescription);
    router.delete("/prescription/:id",authenticateDoctor,controller.deletePrescription);
    router.get("/bookingdetails/:id",authenticateDoctor,_bookingController.getAppoinmentList)
    

    return router;
}

export default doctorRoute;
