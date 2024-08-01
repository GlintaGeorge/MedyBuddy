import { TimeSlotEntityType } from "../../../../entities/timeSlotEntity";
import TimeSlot from "../../models/timeSlots";

export const timeSlotRepositoryMongodb = () => {
    const addTimeSlots = async (doctorId:string,slotTime:string,date:string) =>
      {

      const res = await TimeSlot.create({
        doctorId: doctorId,
        slotTime: slotTime,
        date: date,
        available:true,
      });

      return res
    }

   const getSlotByTime = async (
    doctorId: string,
    slotTime:string,
    date:string,
   ) => {
    const res = await TimeSlot.findOne({ doctorId,date,slotTime});
    return res
  }

  
  const getAllTimeSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId }).sort({ slotTime: -1 });

  const getAllDateSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId  }).sort({ date: -1 });


  const getTimeSlotsByDate = async (doctorId: string, date: string) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
  
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
  
    return await TimeSlot.find({
      doctorId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ date: -1 });
  };

  // UpdateTimeslot

  const UpdateTimeslot = async (doctorId: string, timeSlot: string, date: string) => {
    try {
        const result = await TimeSlot.findOneAndUpdate(
            { 
                doctorId:doctorId,
                slotTime: timeSlot,
                date: new Date(date),
            },
            { $set: { available: false } },
            { new: true }
        );
        return result;
    } catch (error) {
        console.error("Error updating timeslot availability:", error);
        throw error;
    }
};


  

  const UpdateTheTimeslot = async (doctorId: string, timeSlot: string, date: string) => {
    try {
        const result = await TimeSlot.findOneAndUpdate(
            { 
                doctorId:doctorId,
                slotTime: timeSlot,
                date: new Date(date),
            },
            { $set: { available: true } },
            { new: true }
        );

        return result;
    } catch (error) {
        console.error("Error updating timeslot availability:", error);
        throw error;
    }
};

  const removeTimeSlotbyId = async (id: string) =>
    await TimeSlot.findByIdAndDelete(id);

  return {
    addTimeSlots,
    getAllTimeSlots,
    getSlotByTime,
    removeTimeSlotbyId,
    getAllDateSlots,
    getTimeSlotsByDate,
    UpdateTimeslot,
    UpdateTheTimeslot
    
  };
};

export type TimeSlotRepositoryMongodbType = typeof timeSlotRepositoryMongodb;