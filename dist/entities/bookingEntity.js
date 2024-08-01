"use strict";
// src/entities/Booking.ts
Object.defineProperty(exports, "__esModule", { value: true });
function bookingEntity(userId, doctorId, patientName, patientAge, patientNumber, patientGender, patientProblem, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot) {
    return {
        getUserId: () => userId,
        getDoctorId: () => doctorId,
        getPatientName: () => patientName,
        getPatientAge: () => patientAge,
        getPatientNumber: () => patientNumber,
        getPatientGender: () => patientGender,
        getPatientProblem: () => patientProblem,
        getFee: () => fee,
        getPaymentStatus: () => paymentStatus,
        getAppoinmentStatus: () => appoinmentStatus,
        getAppoinmentCancelReason: () => appoinmentCancelReason,
        getDate: () => date,
        getTimeSlot: () => timeSlot,
    };
}
exports.default = bookingEntity;
