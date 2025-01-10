const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    additionalNotes: String,
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
