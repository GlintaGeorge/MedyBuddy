import { Router } from "express";
import adminController from "../../../adapters/adminController";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import { authService } from "../../services/authService";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { userRepositoryMongodb } from "../../database/mongodb/repositories/userRepositoryMongodb";
import { doctorDbRepository } from "../../../app/interfaces/doctorDBRepository";
import { doctorRepositoryMongodb } from "../../database/mongodb/repositories/doctorRepositoryMongodb";
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../database/mongodb/repositories/departmentRepositoryMongodb";

export default () =>{
    const router = Router();

    const controller = adminController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        departmentDbRepository,
        departmentRepositoryMongodb
    );

    router.post("/login", controller.adminLogin);
    router.get("/users", authenticateAdmin,controller.getAllUser);
    router.get("/doctors", authenticateAdmin,controller.getAllTheDoctors);
    router.patch("/block_user/:id", authenticateAdmin,controller.userBlock);
    router.patch("/block_doctor/:id", authenticateAdmin,controller.doctorBlock);
    router.get("/doctors/:id", authenticateAdmin,controller.doctorDetails);
    router.patch("/verify_doctor/:id",authenticateAdmin, controller.VerifyDoctor);
    router.patch("/verify_doctor_rejection/:id",controller.rejectionDoctor);
    router.get("/payments",authenticateAdmin, controller.getAllPayments);
    router.get("/appoinments",authenticateAdmin, controller.getAllAppoinments);
    router.get('/department',authenticateAdmin, controller.getAllDepartmentsHandler);
    router.post('/addDepartment',authenticateAdmin, controller.addDepartmentHandler);
    router.get('/department/list',authenticateAdmin, controller.listDepartmentsHandler);
    router.put('/department/:id', authenticateAdmin,controller.updateDepartmentHandler);
    router.patch('/block_department/:id',authenticateAdmin, controller.blockDepartmentHandler);
    router.patch('/unblock_department/:id', authenticateAdmin, controller.unblockDepartmentHandler);

    







    return router;
};