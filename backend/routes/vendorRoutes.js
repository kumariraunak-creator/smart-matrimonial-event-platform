const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/vendors
// @desc    Get vendors with category, city, price tier, and search filtering
router.get('/', async (req, res) => {
  try {
    const { category, city, pricingTier, minPrice, maxPrice, search, verificationStatus } = req.query;

    let query = {};
    if (category) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (pricingTier) query.pricingTier = pricingTier;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    else query.verificationStatus = 'verified'; // Default to verified vendors for public list

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { businessName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') }
      ];
    }

    const vendors = await Vendor.find(query).populate('user', 'name email avatar phone');
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get single vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email avatar phone');
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/vendors
// @desc    Create or Update Vendor Profile (Vendor Role)
router.post('/', protect, async (req, res) => {
  try {
    let vendor = await Vendor.findOne({ user: req.user._id });

    if (vendor) {
      vendor = await Vendor.findOneAndUpdate(
        { user: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('user', 'name email avatar phone');
    } else {
      vendor = await Vendor.create({
        ...req.body,
        user: req.user._id
      });
      // Ensure user role is updated to vendor if not set
      await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });
      vendor = await vendor.populate('user', 'name email avatar phone');
    }

    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor profile (Admin or owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }

    if (vendor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this vendor' });
    }

    await vendor.deleteOne();
    res.json({ success: true, message: 'Vendor removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
