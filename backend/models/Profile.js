const mongoose = require('mongoose');

const partnerPreferenceSchema = new mongoose.Schema({
  minAge: { type: Number, default: 21 },
  maxAge: { type: Number, default: 40 },
  religions: [{ type: String }],
  minIncome: { type: Number, default: 0 },
  occupations: [{ type: String }],
  cities: [{ type: String }],
  maritalStatus: [{ type: String }]
}, { _id: false });

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: String },
  religion: { type: String, required: true },
  caste: { type: String, default: 'General' },
  motherTongue: { type: String, default: 'English' },
  maritalStatus: { type: String, enum: ['Never Married', 'Divorced', 'Widowed'], default: 'Never Married' },
  occupation: { type: String, required: true },
  company: { type: String, default: 'Self Employed' },
  annualIncome: { type: Number, required: true }, // In USD/INR
  education: { type: String, required: true },
  heightCm: { type: Number, default: 170 },
  city: { type: String, required: true },
  country: { type: String, default: 'USA' },
  bio: { type: String, default: '' },
  photos: [{ type: String }],
  partnerPreferences: { type: partnerPreferenceSchema, default: () => ({}) },
  verified: { type: Boolean, default: true },
  interestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
