const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Update vendor rating average post save
reviewSchema.post('save', async function () {
  try {
    const Vendor = mongoose.model('Vendor');
    const reviews = await this.model('Review').find({ vendor: this.vendor });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Vendor.findByIdAndUpdate(this.vendor, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      });
    }
  } catch (err) {
    console.error('Error updating vendor average rating:', err);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
