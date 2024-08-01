import { TimeSlotRepositoryMongodbType } from "../../frameworks/database/mongodb/repositories/timeSlotRepositoryMongodb";
import { TimeSlotEntityType } from "../../entities/timeSlotEntity";


export const timeSlotDbRepository = (
  repository: ReturnType<TimeSlotRepositoryMongodbType>
) => {
  const addtimeSlot = async (doctorId:string, slotTime:string,date:string) =>
    await repository.addTimeSlots(doctorId,slotTime,date);
  

  const isTimeSlotExist = async (
    doctorId: string,
    slotTime: string,
    date:string,
  ) => await repository.getSlotByTime(doctorId,slotTime,date);

  

  const getAllTimeSlots = async (doctorId: string) =>
    await repository.getAllTimeSlots(doctorId);

  const getAllDateSlots = async (doctorId: string) =>
    await repository.getAllDateSlots(doctorId);

  const removeTimeSlotbyId = async (timeSlotId: string) =>
    await repository.removeTimeSlotbyId(timeSlotId);

  const getTimeSlotsByDate =  async (doctorId: string, date:string) =>
    await repository.getTimeSlotsByDate(doctorId,date);

  const UpdateTimeslot =  async (doctorId: string, timeSlot: string , date:string) =>
    await repository.UpdateTimeslot(doctorId,timeSlot,date);

  const UpdateTheTimeslot =  async (doctorId: string, timeSlot: string , date:string) =>{
    const res = await repository.UpdateTheTimeslot(doctorId,timeSlot,date);
    return res

  }

  return {
    addtimeSlot,
    isTimeSlotExist,
    getAllTimeSlots,
    removeTimeSlotbyId,
    getAllDateSlots,
    getTimeSlotsByDate,
    UpdateTimeslot,
    UpdateTheTimeslot
  };
};
export type TimeSlotDbInterface = typeof timeSlotDbRepository;