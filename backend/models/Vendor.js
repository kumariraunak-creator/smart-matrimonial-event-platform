const mongoose = require('mongoose');

const servicePackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  includedFeatures: [{ type: String }]
});

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Decorator', 'Caterer', 'Photographer', 'Lawyer', 'Venue'], 
    required: true 
  },
  description: { type: String, required: true },
  pricingTier: { type: String, enum: ['Budget', 'Standard', 'Premium', 'Luxury'], default: 'Standard' },
  startingPrice: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 12 },
  portfolioImages: [{ type: String }],
  packages: [servicePackageSchema],
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'verified' },
  yearsExperience: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
