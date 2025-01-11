const express = require('express');
const { casbinMiddleware } = require('../middlewares/casbin');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const verifyToken = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const Availability = require('../models/Availability');


const router = express.Router();

// View Appointments
router.get('/appointments', verifyToken, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.id }).populate('patientId', 'name email');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/appointments/:doctorId', verifyToken, roleMiddleware(['Doctor']), async (req, res) => {
    try {
        const { doctorId } = req.params; // Extract doctor ID from URL params
        const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name email');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Route: Add Availability (Doctor Only)
router.post('/availability', verifyToken, roleMiddleware(['Doctor']), async (req, res) => {
    const { date, slots } = req.body;

    if (!date || !slots) {
        return res.status(400).json({ error: 'Date and slots are required' });
    }

    try {
        const availability = new Availability({
            doctorId: req.user.id, // Make sure `req.user` is populated by `verifyToken`
            date,
            slots,
        });

        const savedAvailability = await availability.save();
        res.status(201).json({
            message: 'Availability added successfully',
            availability: savedAvailability,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
