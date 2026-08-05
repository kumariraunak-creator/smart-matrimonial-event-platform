const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  eventType: { 
    type: String, 
    enum: ['Wedding', 'Engagement', 'Reception', 'Pre-Wedding Legal', 'Catering Special', 'Photo Shoot'], 
    default: 'Wedding' 
  },
  eventDate: { type: String, required: true }, // Format YYYY-MM-DD
  guestCount: { type: Number, default: 100 },
  selectedServices: [{ type: String }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'deposit_paid', 'fully_paid'], default: 'deposit_paid' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
