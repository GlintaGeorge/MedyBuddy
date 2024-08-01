import { NextFunction, Request, Response } from "express";
import { AuthService } from "../frameworks/services/authService";
import { HttpStatus } from "../types/httpStatus";
import {loginAdmin} from "../app/use-cases/admin/adminAuth";

import {getUsers,
    getDoctors,
    getSingleDoctor,
    getDoctor,
    getDoctorRejected,
    getAllDoctors,
    getAllTheAppoinments,
    getAllThePayments,

    
  } from "../app/use-cases/admin/adminRead";

  import { AuthServiceInterfaceType } from "../app/service-interface/authServiceInterface";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { userRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/userRepositoryMongodb";
import { doctorDbInterface } from "../app/interfaces/doctorDBRepository";
import { doctorRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/doctorRepositoryMongodb";
import { blockUser, blockDoctor} from "../app/use-cases/admin/adminUpdate";
import doctor from "../frameworks/database/models/doctor";

import {
  addDepartment,
  blockDepartment,
  getAllDepartments,
  listDepartments,
  unblockDepartment,
  unlistDepartments,
  updateDepartment,
} from "../../src/app/use-cases/admin/adminDepartment";
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";

export default (
    authServiceInterface: AuthServiceInterfaceType,
    authServiceImpl: AuthService,
    userDbRepository: userDbInterface,
    userDbRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    departmentDbRepository: IDepartmentRepository,
  departmentDbRepositoryImpl: () => any

) => {
    const dbUserRepository = userDbRepository(userDbRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbDepartmentRepository = departmentDbRepository(
      departmentDbRepositoryImpl()
    );
    const adminLogin = async(
        req:Request,
        res:Response,
        next:NextFunction
    )=>{
        try{
            const {email,password} = req.body;
            const {accessToken,refreshToken} = await loginAdmin(
                email,
                password,
                authService
            );
           
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Admin login success",
                admin: { name: "Admin User", role: "admin" },
                access_token:accessToken,
                refresh_token: refreshToken,

              });
        }catch(error){
            next(error);
        }
        
    }

    /*
   * METHOD:GET
   * Retrieve all the users from db
   */
const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await getUsers(dbUserRepository);
      return res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  /*
   * METHOD:GET
   * Retrieve all the doctors from db
   */
const getAllTheDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const doctors = await getAllDoctors(dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctors });
    } catch (error) {
      next(error);
    }
  };

  /*
   * METHOD:PATCH
   * Block or Unblock user
   */
  const userBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedUser = await blockUser(id, dbUserRepository);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User block status updated successfully",
        user:updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };

  /**method get fetch all appoinments */

const getAllAppoinments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const appoinments = await getAllTheAppoinments(dbDoctorRepository);
    
    return res.status(HttpStatus.OK).json({ success: true, appoinments });
  } catch (error) {
    next(error);
  }
};


/**method get fetch all appoinments */

const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const payments = await getAllThePayments(dbDoctorRepository);

    
    return res.status(HttpStatus.OK).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

  /*
   * METHOD:PATCH
   * Block or Unblock user
   */
  const doctorBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedDoctor =await blockDoctor(id, dbDoctorRepository);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "doctor block status updated successfully",
        doctor: updatedDoctor 
      });
    } catch (error) {
      next(error);
    }
  };


  /* method get doctor details */
  const doctorDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const doctor = await getSingleDoctor(id,dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctor });
    } catch (error) {
      next(error);
    }
  };

  /* method patch verify in admin */
  const VerifyDoctor = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {id} = req.params;
      const {status} = req.body;
      const doctor = await getDoctor(id,status,dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctor,message:"Verified Successfully" });
    } catch (error) {
      next(error);
    }
  }
  /* method patch rejection in admin */
  const rejectionDoctor = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {id} = req.params;
      const {status} = req.body;
      const {reason} = req.body;
      const doctor = await getDoctorRejected(id,status,reason,dbDoctorRepository);
      return res.status(HttpStatus.OK).json({ success: true, doctor,message:"Verified Successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Department management handlers

    //post : adds a new department.
    const addDepartmentHandler = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { departmentName } = req.body;
        const newDept =  await addDepartment({departmentName}, dbDepartmentRepository);
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Department added successfully",newDept});
      } catch (error) {
        next(error);
      }
    };
    //get : gets all departments.(islisted true as well as false )
  const getAllDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await getAllDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };

  //post :updates a department by ID.
  const updateDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const departmentName = req.body;
     const update =  await updateDepartment(id, departmentName, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, update,message: "Department updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  //patch:  blocks a department by ID.
  const blockDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const { id } = req.params;
      await blockDepartment(id, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department blocked successfully" });
    } catch (error) {
      next(error);
    }
  };

  //patch: unblocks a department by ID.
  const unblockDepartmentHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await unblockDepartment(id, dbDepartmentRepository);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Department unblocked successfully" });
    } catch (error) {
      next(error);
    }
  };

  // get : lists a department by ID.
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

  // get:  unlists a department by ID.
  const unlistDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await unlistDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };



    

    
    return {
        adminLogin,
        getAllUser,
        getAllTheDoctors,
        userBlock,
        doctorBlock,
        doctorDetails,
        VerifyDoctor,
        rejectionDoctor,
        addDepartmentHandler,
        getAllDepartmentsHandler,
       updateDepartmentHandler,
       blockDepartmentHandler,
       unblockDepartmentHandler,
       listDepartmentsHandler,
       unlistDepartmentsHandler,
       getAllAppoinments,
       getAllPayments,











    }
}
