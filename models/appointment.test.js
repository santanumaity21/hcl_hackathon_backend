const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Appointment = require('../models/Appointment'); // Adjust the path to your model

let mongoServer;

beforeAll(async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Appointment Model Test Suite', () => {
    test('should create an appointment successfully', async () => {
        const appointmentData = {
            doctorId: new mongoose.Types.ObjectId(),
            patientId: new mongoose.Types.ObjectId(),
            date: '2023-10-15',
            timeSlot: '10:00 AM - 11:00 AM',
            reason: 'General Checkup',
            additionalNotes: 'Bring previous reports',
        };

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();

        expect(savedAppointment._id).toBeDefined();
        expect(savedAppointment.doctorId).toEqual(appointmentData.doctorId);
        expect(savedAppointment.patientId).toEqual(appointmentData.patientId);
        expect(savedAppointment.date).toBe(appointmentData.date);
        expect(savedAppointment.timeSlot).toBe(appointmentData.timeSlot);
        expect(savedAppointment.reason).toBe(appointmentData.reason);
        expect(savedAppointment.additionalNotes).toBe(appointmentData.additionalNotes);
    });

    test('should fail to create an appointment without required fields', async () => {
        const invalidData = {
            date: '2023-10-15', // Missing doctorId, patientId, timeSlot, and reason
        };

        let err;
        try {
            const appointment = new Appointment(invalidData);
            await appointment.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.doctorId).toBeDefined();
        expect(err.errors.patientId).toBeDefined();
        expect(err.errors.timeSlot).toBeDefined();
        expect(err.errors.reason).toBeDefined();
    });

    test('should allow optional additionalNotes', async () => {
        const appointmentData = {
            doctorId: new mongoose.Types.ObjectId(),
            patientId: new mongoose.Types.ObjectId(),
            date: '2023-10-15',
            timeSlot: '2:00 PM - 3:00 PM',
            reason: 'Consultation',
        };

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();

        expect(savedAppointment._id).toBeDefined();
        expect(savedAppointment.additionalNotes).toBeUndefined(); // Field should be optional
    });
});
