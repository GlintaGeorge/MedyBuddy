"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function TimeSlotEntity(doctorId, time, date, isAvailable = true) {
    return {
        doctorId: () => doctorId,
        time: () => time,
        date: () => date,
        isAvailable: () => isAvailable,
    };
}
exports.default = TimeSlotEntity;
