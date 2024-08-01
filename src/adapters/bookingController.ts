import { Request,Response,NextFunction } from "express";
import { doctorDbInterface } from "../app/interfaces/doctorDBRepository";
import { doctorRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/doctorRepositoryMongodb";
import { userDbInterface } from "../app/interfaces/userDbRepository";
import { userRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/userRepositoryMongodb";
import { TimeSlotDbInterface } from "../app/interfaces/timeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/timeSlotRepositoryMongodb";
import { HttpStatus } from "../types/httpStatus";
import { getUserById } from "../app/use-cases/user/auth/userAuth";
import { BookingDbRepositoryInterface} from "../app/interfaces/bookingrepository";
import { BookingRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/bookingRepositoryMongodb";
import { BookingEntityType } from "../entities/bookingEntity";
import { appoinmentBooking, changeAppoinmentstaus, changeAppoinmentStatus, changeWallet, changeWalletAmounti, checkIsBooked, createPayment, getBookingByBookingId, getBookingByDoctorId, getBookingByUserId, getWalletBalance, updateBookingStatus, updateBookingStatusPayment, walletDebit } from "../app/use-cases/user/auth/booking/bookingUser";
import { UpdateTheTimeslot,UpdateTimeslot } from "../app/use-cases/doctor/timeslot";

const bookingController=(
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
)=>{
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());


    const BookAppoinment = async (
        req:Request,
        res:Response,
        next:NextFunction,
    )=>{
      

        try {

            const {userId,...data} = req.body;
        
             
            const checkBooking:any = await checkIsBooked(
              data,
              userId,
              dbBookingRepository,
            )

            if(checkBooking){
              res.status(HttpStatus.OK).json({
                success: false,
                message: "slot already booked select another slot",
              });
            }else {

              const createBooking = await appoinmentBooking(
                  data,
                  userId,
                  dbBookingRepository,
                  dbDoctorRepository,
                  
              );
  
                
              const user = await getUserById(userId,dbRepositoryUser)
              

            

              const sessionId= await createPayment(
                user?.name!,
                user?.email!,
                createBooking.id,
                createBooking.fee,  
              );

              // /make the timeslot to falsee 
              if(createBooking){
               await UpdateTimeslot(data.doctorId,data.timeSlot,data.date,dbTimeSlotRepository);
              }
                
              res.status(HttpStatus.OK).json({
                  success: true,
                  message: "Booking created successfully",
                  id:sessionId,
                });
            }

            
        } catch (error) {
            next(error);
        }

    }


    
  /**wallet payment */

  const walletPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const userId = req.user;

      const checkBooking:any = await checkIsBooked(
        data,
        userId,
        dbBookingRepository,
      )

      if(checkBooking){
        res.status(HttpStatus.OK).json({
          success: false,
          message: "slot already booked select another slot",
        });
      }else {

        const walletBalance:any|null = await getWalletBalance(userId,dbBookingRepository)

        const requiredAmount = data.fee;

        if(walletBalance >= requiredAmount){
          
          const createBooking = await appoinmentBooking(
              data,
              userId,
              dbBookingRepository,
              dbDoctorRepository,
              
          );

          const walletTransaction = await walletDebit(userId,requiredAmount,dbBookingRepository);
          const walletChange=await changeWalletAmounti(userId,requiredAmount,dbBookingRepository)

          res.status(HttpStatus.OK).json({
            success: true,
            message: "Booking successfully",
            createBooking,
          });
        }else{
          res.status(HttpStatus.OK).json({
            success: false,
            message: "Insufficient balance in wallet",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };


 /**update the wallet  */
 const changeWalletAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, fees } = req.body;

    
    
    const updateWallet = await changeWallet(
      bookingId,
      fees,
      dbBookingRepository
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Bookings details fetched successfully",
    });

  } catch (error) {
    next(error)

  }
}



     /**
   * *METHOD :PATCH
   * * Update payment status and table slot information if payment status is failed
   */

  const updatePaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const updateStatus = await updateBookingStatusPayment(
      id,
      dbBookingRepository,
      )


      await updateBookingStatus(
        id,
        paymentStatus,
        dbBookingRepository,
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Booking status updated" });
    } catch (error) {
      next(error)

    }
  }

  /* method put update cancelappoinment*/
  const cancelAppoinment = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {appoinmentStatus} = req.body;
      const {cancelReason} = req.body;
      const {id} = req.params;


      const { doctorId, timeSlot, date } = await changeAppoinmentstaus(
        appoinmentStatus,
        cancelReason,
        id,
        dbBookingRepository
      );

     
     
    if (doctorId && timeSlot && date) {
      await UpdateTheTimeslot(doctorId, timeSlot, date, dbTimeSlotRepository);
    }
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Cancel Appoinment" });

    } catch (error) {
      next(error)
    }
  }


  /*
   * * METHOD :GET
   * * Retrieve booking details by bookingId
   */
  const getBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const  data  = await getBookingByBookingId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };


  /*
   * * METHOD :GET
   * * Retrieve booking details by user id
   */
  const getAllBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  {id}  = req.params;
      const  data  = await getBookingByUserId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };


  /**
   * *METHOD :GET
   * * Retrieve all bookings done by user
   */
  const getAllAppoinments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user;
      const bookings = await getBookingByUserId(userID, dbBookingRepository);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      });
    } catch (error) {
      next(error);
    }
  };


  /*
   * * METHOD :GET
   * * Retrieve Appoinments details by doctor id
   */
  const getAppoinmentList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  {id}  = req.params;
      const  data  = await getBookingByDoctorId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

   /* method put update appoinmentStatus*/
   const appoinmentStatus = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {appoinmentStatus} = req.body;
      const {id} = req.params;


       await changeAppoinmentStatus(
        appoinmentStatus,
        id,
        dbBookingRepository
      );

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Consultation Status Updated " });

    } catch (error) {
      next(error)
    }
  }






    return {BookAppoinment,
        updatePaymentStatus,
        getBookingDetails,
        getAllBookingDetails,
        getAllAppoinments,
        cancelAppoinment,
        getAppoinmentList,
        walletPayment,
        changeWalletAmount,
        appoinmentStatus,

        }
   
}

export default bookingController;




