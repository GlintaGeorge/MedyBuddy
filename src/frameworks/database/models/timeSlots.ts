import mongoose from 'mongoose';

// const timeSlotSchema = new mongoose.Schema({
//   doctorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Doctor',
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   time: String,
//   isAvailable: {
//     type: Boolean,
//     default: true,
//   },
// });

// export default mongoose.model('TimeSlot', timeSlotSchema);



const timeSlotSchema = new mongoose.Schema({
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: Date,
      required: true
    },
    slotTime: {
      type: String, 
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  
  
  });
  // timeSlotSchema.index({ doctorId: 1, date: 1, slotTime: 1 }, { unique: true });
  // timeSlotSchema.index({ doctor: 1, date: 1  }, { unique: true });
  
  
  export default mongoose.model('TimeSlot', timeSlotSchema);
