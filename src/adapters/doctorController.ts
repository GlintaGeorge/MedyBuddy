import {Request,Response,NextFunction} from "express";
import DoctorEntity,{doctorEntityType,googleSignInUserEntity,googleSignInUserEntityType} from "../entities/doctorEntity"
import asynchandler from "express-async-handler";
import { AuthServiceInterfaceType, authServiceInterface } from "../app/service-interface/authServiceInterface";
import { AuthService } from "../frameworks/services/authService";
import { HttpStatus } from "../types/httpStatus";
import { GoogleResponseDoctorType } from "../types/googleResponseType";
import { doctorDbInterface } from "../app/interfaces/doctorDBRepository";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { userRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/userRepositoryMongodb";
import { doctorRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/doctorRepositoryMongodb";
import { TimeSlotDbInterface } from "../app/interfaces/timeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/timeSlotRepositoryMongodb";
import {
    addNewDoctor,
    verifyAccount,
    doctorLogin,
    authenticateGoogleSignInUser,
    
} from "../app/use-cases/doctor/authDoctor"
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";
import { listDepartments } from "../app/use-cases/admin/adminDepartment";

import { addTimeSlot, deleteTimeSlot, getTimeSlotsByDoctorId, } from "../app/use-cases/doctor/timeslot";

import {getDoctorProfile,
  updateDoctor,
  DoctorRejected
 
    } from "../../src/app/use-cases/doctor/read&update/profile";

const doctorController = (
    authServiceInterface:AuthServiceInterfaceType,
    authServiceImpl : AuthService,
    doctorDbRepository :doctorDbInterface,
    doctorDbRepositoryImpl:doctorRepositoryMongodbType,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    departmentDbRepository: IDepartmentRepository,
  departmentDbRepositoryImpl: () => any
   
   

) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());

    // doctor signup method POST

    const signup = async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const doctordata = req.body;
            const registerDoctor = await addNewDoctor(
                doctordata,
                dbRepositoryDoctor,
                authService
            );
            if(registerDoctor){
                return res.status(HttpStatus.OK).json({
                    success:true,
                    message:"Registration success, please verify your email that we sent to your mail"
                });
            }
        }catch(error){
            next(error);
        };
    }
    //verify account of doctor

    const verifyToken = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const { token } = req.params;
    
          const verifying = await verifyAccount(token, dbRepositoryDoctor);
          if (verifying)
            return res.status(HttpStatus.OK).json({
              success: true,
              message: "Account is verified, you can login.",
            });
        } catch (error) {
          next(error);
        }
      };

      const googleSignIn = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {

          
          const doctorData: GoogleResponseDoctorType = req.body.doctor;

          const { accessToken, refreshToken, isEmailExist, createdUser } =
            await authenticateGoogleSignInUser(
              doctorData,
              dbRepositoryDoctor,
              authService
            );
          
          const user = isEmailExist ? isEmailExist : createdUser;
          res.status(HttpStatus.OK).json({ message: "login success",
           user,
           access_token: accessToken,
          refresh_token : refreshToken});
        } catch (error) {
          next(error);
        }
      };


      // login doctor method POST

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
  
      // Assuming doctorLogin, dbRepositoryDoctor, and authService are defined elsewhere
      const { accessToken,refreshToken, isEmailExist } = await doctorLogin(
        email,
        password,
        dbRepositoryDoctor,
        authService
      );
  
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Login successful",
        doctor: isEmailExist,
        access_token: accessToken,
        refresh_token : refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  /**method get retrieve doctor profile */
  const doctorProfile = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try{
      console.log("haiiiiiiiiiiiiii");
      const doctorId = req.doctor;
      const doctor = await getDoctorProfile(
        doctorId,
        dbRepositoryDoctor
      );
      console.log(doctor,".......................................................")
      console.log(doctor?.department,"poiuytrewq");
      res.status(200).json({success:true,doctor});

    }catch(error){
      next(error);
    }

  };

  /**
   * * METHOD :PATCH
   * * update doctor profile
   */
  const updateDoctorInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const updateData = req.body;
      const doctor = await updateDoctor(doctorId, updateData, dbRepositoryDoctor);
      res
        .status(200)
        .json({ success: true, doctor, message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  /**method get retrieve doctor status */
  const doctorStatus = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try{
      const doctorId = req.doctor;
      const doctor = await getDoctorProfile(
        doctorId,
        dbRepositoryDoctor
      );
      res.status(200).json({success:true,doctor});
    }catch(error){
      next(error);
    }
  };

  /*
   * * METHOD :GET
   * return all time slot to the doctor
   */
  const getTimeSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const timeSlots = await getTimeSlotsByDoctorId(
        doctorId,
        dbTimeSlotRepository
      );
      res.status(HttpStatus.OK).json({ success: true, timeSlots });
    } catch (error) {
      next(error);
    }
  };

   /* add slot Method post*/ 
   
   const addSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { doctorId, startDate, endDate, slotTime } = req.body;
      console.log('slot adddddddddddddddd');
      
      const data = { doctorId, startDate, endDate, slotTime };
      const response = await addTimeSlot(
        data,
        dbTimeSlotRepository
      );
  
      console.log('====================================');
      console.log('slot adddddddddddddddddddddddddddddddddddddddddddddd');
      console.log('====================================');
      res.status(HttpStatus.OK).json({
        success: true,
        message: "slots added successfully",
        response, 
        
      });
    } catch (error) {
      next(error);
    }
  };

  /* Method Delete - slot delete*/
  const deleteSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const{ id } = req.params;
      await deleteTimeSlot(id, dbTimeSlotRepository);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Slot deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // list department - get
  // get : lists a department by ID.
  const listDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("qwertyuiopasdfghjkl,mnbvcx")
      const departments = await listDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };

  /**method get doctor details */
  const getDoctorDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const doctor = await getDoctorProfile(id,dbRepositoryDoctor);
      return res.status(HttpStatus.OK).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }

  /*method put doctor rejected */
  const getDoctorRejected = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const doctor = await DoctorRejected(id,dbRepositoryDoctor);
      return res.status(HttpStatus.OK).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  }

  




    return {
        signup,
        verifyToken,
        login,
        doctorProfile,
        updateDoctorInfo,
        doctorStatus,
        googleSignIn,
        getTimeSlots,
        addSlot,
        deleteSlot,
        listDepartmentsHandler,
        getDoctorDetails,
        getDoctorRejected,

        






        



    }
}






export default doctorController;