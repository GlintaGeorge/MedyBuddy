"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
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
const timeSlotSchema = new mongoose_1.default.Schema({
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('TimeSlot', timeSlotSchema);
