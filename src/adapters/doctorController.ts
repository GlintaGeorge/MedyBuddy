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
import { getSingleUser } from "../app/use-cases/admin/adminRead";
import { getPatients,getPatientFullDetails} from "../app/use-cases/doctor/doctorRead";
import { BookingDbRepositoryInterface} from "../app/interfaces/bookingrepository";
import { addPrescriptionToUser, deletePrescriptionData, fetchPrescriptionForDoctor, fetchPrescriptionUsecase } from "../app/use-cases/prescription/prescriptionUsecase";
import { PrescriptionDbInterface } from "../app/interfaces/prescriptionDbRepositort";
import { PrescriptionRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/prescriptionRepositoryMongodb";
import { BookingRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/bookingRepositoryMongodb";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/timeSlotRepositoryMongodb";
import {
    addNewDoctor,
    verifyAccount,
    doctorLogin,
    authenticateGoogleSignInUser,
    
} from "../app/use-cases/doctor/authDoctor"
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";
import { listDepartments } from "../app/use-cases/admin/adminDepartment";

import { addTimeSlot, deleteTimeSlot, getTimeSlotsByDoctorId } from "../app/use-cases/doctor/timeslot";

import {getDoctorProfile,
  updateDoctor,
  DoctorRejected
 
    } from "../../src/app/use-cases/doctor/read&update/profile";

    import { TimeSlotEntityType } from "../entities/timeSlotEntity";

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
    bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
    prescriptionDbRepository:PrescriptionDbInterface,
    prescriptionDbRepositoryImpl:PrescriptionRepositoryMongodbType,
  departmentDbRepositoryImpl: () => any
   
   

) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
    

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
   * * METHOD :POST
   * adding a time slot
   */
  const scheduleTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const {slotTime , date } = req.body // Destructure time and date from req.body
  
      const newTimeSlot = await addTimeSlot(
        doctorId,
        {
          slotTime,  date,
          isAvailable:true,
        }, // Pass time and date as an object
        dbTimeSlotRepository
      );
  
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Time slot added successfully",
        newTimeSlot,
      });
    } catch (error) {
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
        // const { date } = req.params; 
        const timeSlots = await getTimeSlotsByDoctorId(
          doctorId,
          // date,
          dbTimeSlotRepository
        );
        res.status(HttpStatus.OK).json({ success: true, timeSlots });
      } catch (error) {
        next(error);
      }
    };
  
      /*
   * * METHOD :DELETE
   * removing the timeslot to the doctor
   */
    const removeTimeSlot = async (
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
  const listDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
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

  /* method get doctor details */
  const userDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const {id} = req.params;
      const user = await getSingleUser(id,dbRepositoryUser);
      return res.status(HttpStatus.OK).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  const getPatientList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patients = await getPatients(dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patients });
    } catch (error) {
      next(error);
    }
  }

  const getPatientDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const patient = await getPatientFullDetails(id,dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patient });
    } catch (error) {
      next(error);
    }
  }

  /* method post - add prescription */
  const addPrescription = async (
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {appointmentId,prescriptionDate, medicines }=req.body
      const data={appointmentId,prescriptionDate,medicines}
      const response = await addPrescriptionToUser(
        data,
        dbPrescriptionRepository
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "add Prescription successfully",response });
    } catch (error) {
      next(error);
    }
  }

  /**get Method fetch Prescription */
const fetchPrescription = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const { id } = req.params;
    const data =  id 
    const response = await fetchPrescriptionForDoctor(data,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error)
  }
}

/**method delete - delete prescription */
const deletePrescription = async (
  req:Request,
  res:Response,
  next:NextFunction,
)=>{
  try {
    const prescriptionId = req.params.id;
    const response = await deletePrescriptionData(prescriptionId,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
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
        scheduleTime,
        getTimeSlots,
        removeTimeSlot,

        listDepartmentsHandler,
        getDoctorDetails,
        getDoctorRejected,
        userDetails,
        getPatientList,
        getPatientDetails,
        addPrescription,
        fetchPrescription,
        deletePrescription,
        





        






        



    }
}






export default doctorController;