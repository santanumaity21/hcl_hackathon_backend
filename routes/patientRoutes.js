const express = require('express');
const { casbinMiddleware } = require('../middlewares/casbin');
const verifyToken = require('../middlewares/authMiddleware.js');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Book Appointment
router.post('/book', verifyToken, roleMiddleware(['Patient']), async (req, res) => {
    const { doctorId, date, timeSlot, reason, additionalNotes } = req.body;

    if (!doctorId || !date || !timeSlot || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const appointment = new Appointment({
            doctorId,
            patientId: req.user.id, // Ensure `req.user` is populated by `verifyToken`
            date,
            timeSlot,
            reason,
            additionalNotes,
        });

        const savedAppointment = await appointment.save();
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: savedAppointment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
