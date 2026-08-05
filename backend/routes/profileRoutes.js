const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Helper function to calculate compatibility score (0 to 100%)
const calculateCompatibility = (targetProfile, currentProfile) => {
  if (!targetProfile || !currentProfile) return 85;
  let score = 50; // base score

  const prefs = currentProfile.partnerPreferences || {};
  if (prefs.minAge && prefs.maxAge) {
    if (targetProfile.age >= prefs.minAge && targetProfile.age <= prefs.maxAge) {
      score += 15;
    }
  } else {
    score += 10;
  }

  if (prefs.religions && prefs.religions.length > 0) {
    if (prefs.religions.includes(targetProfile.religion)) score += 15;
  } else if (targetProfile.religion === currentProfile.religion) {
    score += 15;
  }

  if (targetProfile.city === currentProfile.city) score += 10;
  if (targetProfile.annualIncome >= (prefs.minIncome || 0)) score += 10;

  return Math.min(score, 99);
};

// @route   GET /api/profiles
// @desc    Get all profiles with search & filter
router.get('/', protect, async (req, res) => {
  try {
    const { gender, minAge, maxAge, religion, city, search } = req.query;

    let query = {};
    if (req.user && req.user.role === 'user') {
      query.user = { $ne: req.user._id };
    }

    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (city) query.city = new RegExp(city, 'i');
    
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    let profiles = await Profile.find(query).populate('user', 'name email avatar phone status');

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      profiles = profiles.filter(p => 
        (p.user && searchRegex.test(p.user.name)) || 
        searchRegex.test(p.occupation) || 
        searchRegex.test(p.city) ||
        searchRegex.test(p.education)
      );
    }

    const myProfile = await Profile.findOne({ user: req.user._id });
    const formattedProfiles = profiles.map(p => {
      const pObj = p.toObject();
      pObj.matchScore = calculateCompatibility(p, myProfile);
      return pObj;
    });

    res.json({ success: true, count: formattedProfiles.length, data: formattedProfiles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/profiles/:id
// @desc    Get single profile details
router.get('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'name email avatar phone');
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const myProfile = await Profile.findOne({ user: req.user._id });
    const pObj = profile.toObject();
    pObj.matchScore = calculateCompatibility(profile, myProfile);

    res.json({ success: true, data: pObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/profiles
// @desc    Create or update profile & profile picture (avatar)
router.post('/', protect, async (req, res) => {
  try {
    const { avatar } = req.body;

    // Update avatar in User collection if provided
    if (avatar) {
      await User.findByIdAndUpdate(req.user._id, { avatar });
    }

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // If photo array is provided or avatar updated
      let updatedPhotos = req.body.photos || profile.photos;
      if (avatar && (!updatedPhotos || updatedPhotos.length === 0 || updatedPhotos[0] !== avatar)) {
        updatedPhotos = [avatar, ...(updatedPhotos || [])];
      }

      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: { ...req.body, photos: updatedPhotos } },
        { new: true, runValidators: true }
      ).populate('user', 'name email avatar phone');
    } else {
      profile = await Profile.create({
        ...req.body,
        user: req.user._id,
        photos: avatar ? [avatar] : req.body.photos || []
      });
      profile = await profile.populate('user', 'name email avatar phone');
    }

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/profiles/:id/interest
// @desc    Express matrimonial interest in a profile
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const targetProfile = await Profile.findById(req.params.id);
    if (!targetProfile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    if (!targetProfile.interestsReceived.includes(req.user._id)) {
      targetProfile.interestsReceived.push(req.user._id);
      await targetProfile.save();
    }

    const myProfile = await Profile.findOne({ user: req.user._id });
    if (myProfile && !myProfile.interestsSent.includes(targetProfile.user)) {
      myProfile.interestsSent.push(targetProfile.user);
      await myProfile.save();
    }

    await Notification.create({
      user: targetProfile.user,
      title: 'New Matrimonial Interest Received! 💖',
      message: `${req.user.name} expressed interest in your matrimonial profile.`,
      type: 'match'
    });

    res.json({ success: true, message: 'Interest sent successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
