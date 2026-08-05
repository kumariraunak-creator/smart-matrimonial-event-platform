const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get user or vendor bookings based on logged-in role
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.user = req.user._id;
    } else if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({ user: req.user._id });
      if (!vendorProfile) {
        return res.json({ success: true, count: 0, data: [] });
      }
      query.vendor = vendorProfile._id;
    }
    // Admin sees all bookings by default if no role condition applies

    const bookings = await Booking.find(query)
      .populate('user', 'name email avatar phone')
      .populate({
        path: 'vendor',
        populate: { path: 'user', select: 'name email avatar phone' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a new event booking request
router.post('/', protect, async (req, res) => {
  try {
    const { vendorId, eventType, eventDate, guestCount, selectedServices, totalAmount, notes } = req.body;

    if (!vendorId || !eventDate || !totalAmount) {
      return res.status(400).json({ success: false, error: 'Vendor ID, event date, and total amount are required' });
    }

    const vendorObj = await Vendor.findById(vendorId);
    if (!vendorObj) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      vendor: vendorId,
      eventType: eventType || 'Wedding',
      eventDate,
      guestCount: guestCount || 100,
      selectedServices: selectedServices || [],
      totalAmount,
      notes: notes || '',
      status: 'pending'
    });

    // Notify vendor
    await Notification.create({
      user: vendorObj.user,
      title: 'New Booking Request Received! 📅',
      message: `${req.user.name} booked your ${vendorObj.category} services for ${eventDate}.`,
      type: 'booking'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email avatar phone')
      .populate('vendor');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status (vendor or user)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email avatar phone')
      .populate('vendor');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Notify client user on status update
    await Notification.create({
      user: booking.user._id,
      title: `Booking Status Updated: ${status.toUpperCase()}`,
      message: `Your booking with ${booking.vendor.businessName} has been updated to '${status}'.`,
      type: 'booking'
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel/Delete booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
