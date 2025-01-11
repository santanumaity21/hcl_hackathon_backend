const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Availability = require('../models/Availability'); // Adjust the path to your Availability model

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

describe('Availability Model Test Suite', () => {
    test('should create an availability successfully', async () => {
        const availabilityData = {
            doctorId: new mongoose.Types.ObjectId(),
            date: '2023-10-15',
            slots: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'],
        };

        const availability = new Availability(availabilityData);
        const savedAvailability = await availability.save();

        expect(savedAvailability._id).toBeDefined();
        expect(savedAvailability.doctorId).toEqual(availabilityData.doctorId);
        expect(savedAvailability.date).toBe(availabilityData.date);
        expect(savedAvailability.slots).toEqual(availabilityData.slots);
    });

    test('should fail to create an availability without required fields', async () => {
        const invalidData = {
            date: '2023-10-15', // Missing doctorId and slots
        };

        let err;
        try {
            const availability = new Availability(invalidData);
            await availability.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.doctorId).toBeDefined();
        expect(err.errors.slots).toBeDefined();
    });

    test('should fail to create an availability with empty slots array', async () => {
        const invalidData = {
            doctorId: new mongoose.Types.ObjectId(),
            date: '2023-10-15',
            slots: [], // Empty slots array
        };

        let err;
        try {
            const availability = new Availability(invalidData);
            await availability.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.slots).toBeDefined();
    });

    test('should allow multiple slots', async () => {
        const availabilityData = {
            doctorId: new mongoose.Types.ObjectId(),
            date: '2023-10-15',
            slots: ['9:00 AM - 10:00 AM', '1:00 PM - 2:00 PM', '4:00 PM - 5:00 PM'],
        };

        const availability = new Availability(availabilityData);
        const savedAvailability = await availability.save();

        expect(savedAvailability._id).toBeDefined();
        expect(savedAvailability.slots.length).toBe(3); // Validate multiple slots
    });
});
