"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTheTimeslot = exports.UpdateTimeslot = exports.getTimeSlotsByDoctorIdAndDate = exports.getDateSlotsByDoctorId = exports.deleteTimeSlot = exports.getTimeSlotsByDoctorId = exports.addTimeSlot = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const customError_1 = __importDefault(require("../../../utils/customError"));
const addTimeSlot = (doctorId, timeData, // Object containing both time and date
dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { slotTime, date } = timeData; // Destructure time and date from timeData
    const isTimeSlotExists = yield dbTimeSlotRepository.isTimeSlotExist(doctorId, slotTime, date);
    if (isTimeSlotExists) {
        throw new customError_1.default("Time slot already exists", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const newSlot = yield dbTimeSlotRepository.addtimeSlot(doctorId, slotTime, date);
    return newSlot;
});
exports.addTimeSlot = addTimeSlot;
const getTimeSlotsByDoctorId = (doctorId, 
// date:any,
dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.getAllTimeSlots(doctorId); });
exports.getTimeSlotsByDoctorId = getTimeSlotsByDoctorId;
const deleteTimeSlot = (timeSlotId, dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.removeTimeSlotbyId(timeSlotId); });
exports.deleteTimeSlot = deleteTimeSlot;
const getDateSlotsByDoctorId = (doctorId, dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.getAllDateSlots(doctorId); });
exports.getDateSlotsByDoctorId = getDateSlotsByDoctorId;
const getTimeSlotsByDoctorIdAndDate = (doctorId, date, dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.getTimeSlotsByDate(doctorId, date); });
exports.getTimeSlotsByDoctorIdAndDate = getTimeSlotsByDoctorIdAndDate;
const UpdateTimeslot = (doctorId, timeSlot, date, dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.UpdateTimeslot(doctorId, timeSlot, date); });
exports.UpdateTimeslot = UpdateTimeslot;
const UpdateTheTimeslot = (doctorId, timeSlot, date, dbTimeSlotRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield dbTimeSlotRepository.UpdateTheTimeslot(doctorId, timeSlot, date); });
exports.UpdateTheTimeslot = UpdateTheTimeslot;
