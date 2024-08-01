import { HttpStatus } from "../../../types/httpStatus";
import { TimeSlotDataInterface } from "../../../types/timeSlotInterface";
import CustomError from "../../../utils/customError";
import { TimeSlotDbInterface } from "../../interfaces/timeSlotDbRepository";



export const addTimeSlot = async (
  doctorId: string,
  timeData: TimeSlotDataInterface, // Object containing both time and date
  dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
) => {
  const { slotTime, date } = timeData; // Destructure time and date from timeData
  const isTimeSlotExists = await dbTimeSlotRepository.isTimeSlotExist(
    doctorId,
    slotTime,
    date
  );

  if (isTimeSlotExists){
    throw new CustomError("Time slot already exists", HttpStatus.BAD_REQUEST);
  }

  const newSlot = await dbTimeSlotRepository.addtimeSlot(doctorId, slotTime, date);
  return newSlot;
};


  export const getTimeSlotsByDoctorId = async (
    doctorId: string,
    // date:any,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllTimeSlots(doctorId);


  export const deleteTimeSlot = async (
    timeSlotId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.removeTimeSlotbyId(timeSlotId);


  export const getDateSlotsByDoctorId = async (
    doctorId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllDateSlots(doctorId);


  export const getTimeSlotsByDoctorIdAndDate = async (
    doctorId: string,
    date: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getTimeSlotsByDate(doctorId, date);
  

  export const UpdateTimeslot = async (
    doctorId: string,
    timeSlot:string,
    date: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.UpdateTimeslot(doctorId,timeSlot,date);

  export const UpdateTheTimeslot = async (
    doctorId: string,
    timeSlot:string,
    date: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.UpdateTheTimeslot(doctorId,timeSlot,date);
  
  