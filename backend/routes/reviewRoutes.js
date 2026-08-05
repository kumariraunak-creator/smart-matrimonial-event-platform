const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews/vendor/:vendorId
// @desc    Get all reviews for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.vendorId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review for a vendor
router.post('/', protect, async (req, res) => {
  try {
    const { vendorId, rating, comment, bookingId } = req.body;

    if (!vendorId || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Vendor ID, rating, and comment are required' });
    }

    const review = await Review.create({
      vendor: vendorId,
      user: req.user._id,
      booking: bookingId || null,
      rating: Number(rating),
      comment
    });

    const populatedReview = await review.populate('user', 'name avatar');

    // Notify vendor
    const vendorObj = await Vendor.findById(vendorId);
    if (vendorObj) {
      await Notification.create({
        user: vendorObj.user,
        title: `New ${rating}-Star Review! ⭐`,
        message: `${req.user.name} left a review: "${comment.substring(0, 40)}..."`,
        type: 'review'
      });
    }

    res.status(201).json({ success: true, data: populatedReview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
