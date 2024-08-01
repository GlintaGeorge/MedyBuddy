import express from "express";
import { userDbRepository } from "../../../app/interfaces/userDbRepository";
import { authService } from "../../services/authService";
import { userRepositoryMongodb } from "../../database/mongodb/repositories/userRepositoryMongodb";
import { authServiceInterface } from "../../../app/service-interface/authServiceInterface";
import userController from "../../../adapters/userController";
import authenticateUser from "../middlewares/authMiddleware";
import { doctorRepositoryMongodb } from '../../database/mongodb/repositories/doctorRepositoryMongodb';
import { doctorDbRepository } from './../../../app/interfaces/doctorDBRepository';
import { departmentDbRepository } from "../../../app/interfaces/departmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../database/mongodb/repositories/departmentRepositoryMongodb";
import { timeSlotDbRepository } from "../../../app/interfaces/timeSlotDbRepository";
import { timeSlotRepositoryMongodb } from "../../database/mongodb/repositories/timeSlotRepositoryMongodb";
import bookingController from "../../../adapters/bookingController";
import { bookingDbRepository } from "../../../app/interfaces/bookingrepository";
import { bookingRepositoryMongodb } from "../../database/mongodb/repositories/bookingRepositoryMongodb";
import { prescriptionDbRepository } from "../../../app/interfaces/prescriptionDbRepositort";
import { prescriptionRepositoryMongodb } from "../../database/mongodb/repositories/prescriptionRepositoryMongodb";

const userRoutes = () => {
    const router = express.Router();
    
    const departmentRepo = departmentRepositoryMongodb();


    const controller = userController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        departmentDbRepository,
        departmentRepo,  // Instantiate here
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        prescriptionDbRepository,
        prescriptionRepositoryMongodb,
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

    router.post("/register", controller.registerUser);
    router.post("/google_signIn", controller.googleSignIn);
    router.post("/verify_otp", controller.verifyOtp);
    router.post("/resend_otp", controller.resendOtp);
    router.post("/login", controller.userLogin);
    router.post("/forgot_password", controller.forgotPassword);
    router.post("/reset_password/:token", controller.resetPassword);

    router.get("/profile", authenticateUser, controller.userProfile);
    router.patch("/profile/edit", authenticateUser, controller.updateUserInfo);

    router.get("/doctors", controller.doctorPage);
    router.get("/doctors/:id", controller.doctorDetails);
    router.get('/departments', controller.listDepartmentsHandler);
    
    router.get("/time-slots/:id",authenticateUser,controller.getTimeslots);
    router.get("/time-slots/:id/dates",authenticateUser,controller.getDateSlots);
    
    router.get("/fetchWallet/:id",authenticateUser,controller.getWallet);
    router.get("/transactions", authenticateUser, controller.getTransactions);
    router.post("/fetchPrescription",authenticateUser,controller.fetchPrescription);
    router.post("/downloadPrescription", authenticateUser, controller.downloadPrescription);



    /*  Booking Routes for booking Controller  */

router.post("/appointments",authenticateUser,_bookingController.BookAppoinment);
router.get("/allAppoinments",authenticateUser,_bookingController.getAllAppoinments);
router.patch("/payment/status/:id",authenticateUser,_bookingController.updatePaymentStatus);
router.post("/walletPayment",authenticateUser,_bookingController.walletPayment);
router.put("/updateWallet",authenticateUser,_bookingController.changeWalletAmount);
router.get("/bookingdetails/:id",authenticateUser,_bookingController.getBookingDetails);
router.get("/bookings/:id",authenticateUser,_bookingController.getAllBookingDetails);
router.put("/bookingdetails/:id",authenticateUser,_bookingController.cancelAppoinment);


    return router;
};

export default userRoutes;
