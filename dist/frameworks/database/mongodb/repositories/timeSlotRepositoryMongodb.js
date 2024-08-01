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
exports.timeSlotRepositoryMongodb = void 0;
const timeSlots_1 = __importDefault(require("../../models/timeSlots"));
const timeSlotRepositoryMongodb = () => {
    const addTimeSlots = (doctorId, slotTime, date) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield timeSlots_1.default.create({
            doctorId: doctorId,
            slotTime: slotTime,
            date: date,
            available: true,
        });
        return res;
    });
    const getSlotByTime = (doctorId, slotTime, date) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield timeSlots_1.default.findOne({ doctorId, date, slotTime });
        return res;
    });
    const getAllTimeSlots = (doctorId) => __awaiter(void 0, void 0, void 0, function* () { return yield timeSlots_1.default.find({ doctorId }).sort({ slotTime: -1 }); });
    const getAllDateSlots = (doctorId) => __awaiter(void 0, void 0, void 0, function* () { return yield timeSlots_1.default.find({ doctorId }).sort({ date: -1 }); });
    const getTimeSlotsByDate = (doctorId, date) => __awaiter(void 0, void 0, void 0, function* () {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        return yield timeSlots_1.default.find({
            doctorId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).sort({ date: -1 });
    });
    // UpdateTimeslot
    const UpdateTimeslot = (doctorId, timeSlot, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield timeSlots_1.default.findOneAndUpdate({
                doctorId: doctorId,
                slotTime: timeSlot,
                date: new Date(date),
            }, { $set: { available: false } }, { new: true });
            return result;
        }
        catch (error) {
            console.error("Error updating timeslot availability:", error);
            throw error;
        }
    });
    const UpdateTheTimeslot = (doctorId, timeSlot, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield timeSlots_1.default.findOneAndUpdate({
                doctorId: doctorId,
                slotTime: timeSlot,
                date: new Date(date),
            }, { $set: { available: true } }, { new: true });
            return result;
        }
        catch (error) {
            console.error("Error updating timeslot availability:", error);
            throw error;
        }
    });
    const removeTimeSlotbyId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield timeSlots_1.default.findByIdAndDelete(id); });
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
exports.timeSlotRepositoryMongodb = timeSlotRepositoryMongodb;
