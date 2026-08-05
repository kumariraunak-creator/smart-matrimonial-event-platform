const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics & summary counts
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ verificationStatus: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Aggregation 1: Total Revenue Calculation
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProfiles,
        totalVendors,
        pendingVendors,
        totalBookings,
        totalReviews,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADVANCED MONGODB AGGREGATION ANALYTICS ENDPOINTS (DBMS FINAL SUBMISSION) ---

// @route   GET /api/admin/analytics/revenue-by-category
// @desc    Advanced Aggregation 1: Join Bookings with Vendors to calculate revenue per category
router.get('/analytics/revenue-by-category', async (req, res) => {
  try {
    const analytics = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      { $unwind: '$vendorInfo' },
      {
        $group: {
          _id: '$vendorInfo.category',
          totalRevenue: { $sum: '$totalAmount' },
          bookingCount: { $sum: 1 },
          avgBookingValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/analytics/demographics
// @desc    Advanced Aggregation 2: Demographics metrics by gender, average income & age distribution
router.get('/analytics/demographics', async (req, res) => {
  try {
    const demographics = await Profile.aggregate([
      {
        $group: {
          _id: '$gender',
          avgAge: { $avg: '$age' },
          avgIncome: { $avg: '$annualIncome' },
          count: { $sum: 1 }
        }
      }
    ]);

    const religionBreakdown = await Profile.aggregate([
      {
        $group: {
          _id: '$religion',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, demographics, religionBreakdown });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/analytics/top-vendors
// @desc    Advanced Aggregation 3: Top Performing Vendors by Rating & Review Volume
router.get('/analytics/top-vendors', async (req, res) => {
  try {
    const topVendors = await Vendor.aggregate([
      { $match: { verificationStatus: 'verified' } },
      {
        $project: {
          businessName: 1,
          category: 1,
          city: 1,
          rating: 1,
          reviewCount: 1,
          startingPrice: 1,
          score: { $multiply: ['$rating', '$reviewCount'] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 5 }
    ]);

    res.json({ success: true, data: topVendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all registered users for moderation
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PATCH /api/admin/users/:id/status
// @desc    Toggle user status (active / suspended)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/vendors
// @desc    Get all vendors with verification status filter
router.get('/vendors', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.verificationStatus = status;

    const vendors = await Vendor.find(query).populate('user', 'name email phone avatar');
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PATCH /api/admin/vendors/:id/verify
// @desc    Approve or reject vendor verification application
router.patch('/vendors/:id/verify', async (req, res) => {
  try {
    const { verificationStatus } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid verification status' });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id, 
      { verificationStatus }, 
      { new: true }
    ).populate('user', 'name email');

    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- INTERACTIVE DATABASE EXPLORER ENDPOINTS ---

// @route   GET /api/admin/db-explorer/collections
// @desc    List all database collections with document counts & schema names
router.get('/db-explorer/collections', async (req, res) => {
  try {
    const models = [
      { name: 'User', collectionName: 'users' },
      { name: 'Profile', collectionName: 'profiles' },
      { name: 'Vendor', collectionName: 'vendors' },
      { name: 'Booking', collectionName: 'bookings' },
      { name: 'Review', collectionName: 'reviews' },
      { name: 'Message', collectionName: 'messages' },
      { name: 'Notification', collectionName: 'notifications' }
    ];

    const collectionsInfo = await Promise.all(models.map(async m => {
      const modelClass = mongoose.model(m.name);
      const count = await modelClass.countDocuments();
      return {
        modelName: m.name,
        collection: m.collectionName,
        documentCount: count,
        schemaFields: Object.keys(modelClass.schema.paths)
      };
    }));

    res.json({ success: true, collections: collectionsInfo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/admin/db-explorer/records/:modelName
// @desc    Fetch raw documents for a collection
router.get('/db-explorer/records/:modelName', async (req, res) => {
  try {
    const modelName = req.params.modelName;
    if (!mongoose.models[modelName]) {
      return res.status(404).json({ success: false, error: `Model '${modelName}' not found` });
    }

    const records = await mongoose.model(modelName).find().limit(50).lean();
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/admin/db-explorer/query
// @desc    Execute custom MongoDB query filter
router.post('/db-explorer/query', async (req, res) => {
  try {
    const { modelName, filter, limit } = req.body;
    if (!mongoose.models[modelName]) {
      return res.status(400).json({ success: false, error: `Invalid model name: ${modelName}` });
    }

    let parsedFilter = {};
    if (filter) {
      parsedFilter = typeof filter === 'string' ? JSON.parse(filter) : filter;
    }

    const records = await mongoose.model(modelName)
      .find(parsedFilter)
      .limit(Number(limit) || 30)
      .lean();

    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(400).json({ success: false, error: `Query execution error: ${err.message}` });
  }
});

// @route   DELETE /api/admin/db-explorer/records/:modelName/:id
// @desc    Delete a raw document from database explorer
router.delete('/db-explorer/records/:modelName/:id', async (req, res) => {
  try {
    const { modelName, id } = req.params;
    if (!mongoose.models[modelName]) {
      return res.status(400).json({ success: false, error: `Invalid model name: ${modelName}` });
    }

    await mongoose.model(modelName).findByIdAndDelete(id);
    res.json({ success: true, message: `Document ${id} removed from ${modelName}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
