import { NextFunction, Request, Response } from "express";
import asynchandler from "express-async-handler";
import {
    userRegister,
    verifyOtpUser,
    deleteOtp,
    login,
    sendResetVerificationCode,
    verifyTokenAndRestPassword,
    authenticateGoogleSignInUser,
} from "../app/use-cases/user/auth/userAuth";
import { getUserProfile, updateUser, getWalletUser, WalletTransactions } from "../app/use-cases/user/auth/read & update/profile";
import { getDoctors, getSingleDoctor } from '../app/use-cases/admin/adminRead';
import { doctorDbInterface } from '../app/interfaces/doctorDBRepository';
import { userRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/userRepositoryMongodb";
import { AuthService } from "../frameworks/services/authService";
import { AuthServiceInterfaceType } from "../app/service-interface/authServiceInterface";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { HttpStatus } from "../types/httpStatus";
import { GoogleResponseType } from "../types/googleResponseType";
import { doctorRepositoryMongodbType } from '../frameworks/database/mongodb/repositories/doctorRepositoryMongodb';
import { listDepartments } from "../app/use-cases/admin/adminDepartment";
import { IDepartmentRepository } from "../app/interfaces/departmentRepositoryInterface";
import { TimeSlotDbInterface } from "../app/interfaces/timeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/timeSlotRepositoryMongodb";
import { getTimeSlotsByDoctorId, getDateSlotsByDoctorId, getAllTimeSlotsByDoctorId } from "../app/use-cases/doctor/timeslot";
import { getAllTimeSlot } from "../app/use-cases/user/auth/timeSlots/getAndUpdate";
import { departmentRepositoryMongodb } from "../frameworks/database/mongodb/repositories/departmentRepositoryMongodb";

const userController = (
    authServiceInterface: AuthServiceInterfaceType,
    authServiceImpl: AuthService,
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    departmentDbRepository: IDepartmentRepository,
    departmentDbRepositoryImpl: ReturnType<typeof departmentRepositoryMongodb>,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
) => {
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl);

    // Register User POST - Method
    const registerUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.body;
            const { createdUser } = await userRegister(user, dbRepositoryUser, authService);
            res.json({
                message: "User registration successful, please verify email",
                newUser: createdUser,
            });
        } catch (error) {
            next(error);
        }
    };

    // Verify Otp Method POST
    const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { otp, userId } = req.body;
            const isVerified = await verifyOtpUser(otp, userId, dbRepositoryUser);
            if (isVerified) {
                return res.status(HttpStatus.OK)
                    .json({ message: "User account verified, please login" });
            }
        } catch (error) {
            next(error);
        }
    };

    // Resend Otp method : POST
    const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.body;
            await deleteOtp(userId, dbRepositoryUser, authService);
            res.json({ message: "New otp sent to mail" });
        } catch (error) {
            next(error);
        }
    };

    // User login method: Post
    const userLogin = asynchandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { accessToken, refreshToken, isEmailExist } = await login(
                    req.body,
                    dbRepositoryUser,
                    authService
                );
                res.status(HttpStatus.OK)
                    .json({
                        message: "login success", user: isEmailExist,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
            } catch (error) {
                next(error);
            }
        }
    );

    // Forgot password method post
    const forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.body;
            await sendResetVerificationCode(email, dbRepositoryUser, authService);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Reset password code sent to your mail",
            });
        } catch (error) {
            next(error);
        }
    }

    // Reset password method post
    const resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { password } = req.body;
            const { token } = req.params;
            await verifyTokenAndRestPassword(
                token,
                password,
                dbRepositoryUser,
                authService
            );
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Reset password success, you can login with your new password",
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
            const userData: GoogleResponseType = req.body.user;
            const { accessToken, refreshToken, isEmailExist, createdUser } =
                await authenticateGoogleSignInUser(
                    userData,
                    dbRepositoryUser,
                    authService
                );
            const user = isEmailExist ? isEmailExist : createdUser;
            res.status(HttpStatus.OK).json({
                message: "login success", user,
                access_token: accessToken,
                refresh_token: refreshToken
            });
        } catch (error) {
            next(error);
        }
    };

    const userProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user;
            const user = await getUserProfile(
                userId,
                dbRepositoryUser
            );
            res.status(200).json({ success: true, user });
        } catch (error) {
            next(error);
        }
    };

    const updateUserInfo = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user;
            const updateData = req.body;
            const user = await updateUser(userId, updateData, dbRepositoryUser);
            res.status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        } catch (error) {
            next(error);
        }
    };

    // const doctorPage = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const doctors = await getDoctors(dbDoctorRepository);
    //         return res.status(HttpStatus.OK).json({ success: true, doctors });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    const doctorPage = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const { searchQuery, department, selectedDate, selectedTimeSlot} = req.query;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 8;
          
    
          const searchQueryStr = searchQuery as string | undefined;
          const departmentStr = department as string | undefined;
          const selectedDateStr = selectedDate as string | undefined;
          const selectedTimeSlotStr = selectedTimeSlot as string | undefined;
          
          
          const doctors = await getDoctors({
            searchQuery: searchQueryStr,
            department: departmentStr,
            selectedDate: selectedDateStr,
            selectedTimeSlot: selectedTimeSlotStr,
            page,
            limit,
          }, dbDoctorRepository);
    
          return res.status(200).json({ success: true, ...doctors });
        } catch (error) {
          next(error);
        }
      };

    const doctorDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const doctor = await getSingleDoctor(id, dbDoctorRepository);
            return res.status(HttpStatus.OK).json({ success: true, doctor });
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

    const getAllTimeSlots = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const timeslots = await getAllTimeSlot(dbTimeSlotRepository);
            return res.status(HttpStatus.OK).json({ success: true, timeslots });
        } catch (error) {
            next(error);
        }
    };

    const getTimeslots = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const { date } = req.query;
            const timeSlots = await getAllTimeSlotsByDoctorId(
                id,
                date,
                dbTimeSlotRepository
            );
            res.status(HttpStatus.OK).json({ success: true, timeSlots });
        } catch (error) {
            next(error);
        }
    };

    const getDateSlots = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const dateSlots = await getDateSlotsByDoctorId(
                id,
                dbTimeSlotRepository
            );
            res.status(HttpStatus.OK).json({ success: true, dateSlots });
        } catch (error) {
            next(error);
        }
    }

//     **
//    * * METHOD :GET
//    * * Retrieve  user wallet
//    */
const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    
    const getWallet = await getWalletUser(id,dbRepositoryUser);
    res.status(200).json({ success: true, getWallet});
  } catch (error) {
    next(error);
  }
};

/**Method Get fetch transactions */

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const transaction = await WalletTransactions(userId, dbRepositoryUser);
    res.status(200).json({
      success: true,
      transaction,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

    return {
        registerUser,
        verifyOtp,
        resendOtp,
        userLogin,
        forgotPassword,
        resetPassword,
        googleSignIn,
        userProfile,
        updateUserInfo,
        doctorPage,
        doctorDetails,
        listDepartmentsHandler,
        getAllTimeSlots,
        getTimeslots,
        getDateSlots,
        getWallet,
        getTransactions,


    };
};

export default userController;
