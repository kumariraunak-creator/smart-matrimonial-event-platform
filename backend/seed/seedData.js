const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount >= 10) {
      console.log('🌱 Database already contains 10+ records per collection. Skipping initial seed.');
      return;
    }

    console.log('🌱 Wiping existing data & seeding 10+ comprehensive records per collection for DBMS Submission...');
    
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Vendor.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});

    // --- 1. USERS COLLECTION (12 Records) ---
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@platform.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    });

    // Candidates (6 Users)
    const user1 = await User.create({ name: 'Ananya Sharma', email: 'ananya@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' });
    const user2 = await User.create({ name: 'Rohan Mehta', email: 'rohan@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' });
    const user3 = await User.create({ name: 'Priya Patel', email: 'priya@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' });
    const user4 = await User.create({ name: 'Vikramaditya Singh', email: 'vikram@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' });
    const user5 = await User.create({ name: 'Kavya Reddy', email: 'kavya@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400' });
    const user6 = await User.create({ name: 'Arjun Iyer', email: 'arjun@example.com', password: 'password123', role: 'user', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' });

    // Vendors (5 Users)
    const vUser1 = await User.create({ name: 'Elena Rostova (Royal Blooms)', email: 'decor@royalblooms.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' });
    const vUser2 = await User.create({ name: 'Chef Marco Viti (Gourmet Feast)', email: 'catering@gourmetfeast.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' });
    const vUser3 = await User.create({ name: 'David Kim (Aura Lens Studio)', email: 'photos@auralens.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' });
    const vUser4 = await User.create({ name: 'Advocate Rajesh Verma', email: 'contact@marriagelawyer.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' });
    const vUser5 = await User.create({ name: 'Sophia Sterling (Grand Palace)', email: 'events@grandpalace.com', password: 'password123', role: 'vendor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' });

    // --- 2. PROFILES COLLECTION (10 Records) ---
    const profilesData = [
      { user: user1._id, gender: 'female', age: 26, religion: 'Hindu', caste: 'Brahmin', occupation: 'Product Designer', annualIncome: 95000, education: 'MFA in UX Design', city: 'San Francisco', bio: 'Creative UX designer who loves art, travel, and warm coffee conversations.', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'] },
      { user: user2._id, gender: 'male', age: 29, religion: 'Hindu', caste: 'Kshatriya', occupation: 'Senior Software Engineer', annualIncome: 140000, education: 'B.Tech CS', city: 'San Francisco', bio: 'Enthusiastic tech lead passionate about hiking, photography, and culinary experiments.', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500'] },
      { user: user3._id, gender: 'female', age: 27, religion: 'Hindu', caste: 'General', occupation: 'Financial Analyst', annualIncome: 110000, education: 'MBA Finance', city: 'New York', bio: 'Wall Street analyst by day, jazz enthusiast by night. Values honesty and continuous growth.', photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500'] },
      { user: user4._id, gender: 'male', age: 31, religion: 'Sikh', caste: 'Jat', occupation: 'Architect', annualIncome: 125000, education: 'Master of Architecture', city: 'Chicago', bio: 'Sustainable architecture advocate who enjoys cycling and classical music.', photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500'] },
      { user: user5._id, gender: 'female', age: 25, religion: 'Spiritual', caste: 'General', occupation: 'Data Scientist', annualIncome: 105000, education: 'MS Data Science', city: 'Seattle', bio: 'Machine learning practitioner fascinated by AI, badminton, and landscape photography.', photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500'] },
      { user: user6._id, gender: 'male', age: 28, religion: 'Hindu', caste: 'Iyer', occupation: 'Cardiologist Fellow', annualIncome: 150000, education: 'MD Cardiology', city: 'Boston', bio: 'Passionate medical researcher with a love for violin and marathon running.', photos: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500'] },
      // Additional candidates for scale
      { user: adminUser._id, gender: 'male', age: 32, religion: 'Hindu', caste: 'General', occupation: 'Platform Director', annualIncome: 180000, education: 'MS Management', city: 'San Francisco', bio: 'Tech enthusiast and platform lead.', photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'] },
      { user: vUser1._id, gender: 'female', age: 30, religion: 'Christian', caste: 'General', occupation: 'Floral Designer', annualIncome: 90000, education: 'BA Arts', city: 'San Francisco', bio: 'Floral entrepreneur.', photos: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'] },
      { user: vUser2._id, gender: 'male', age: 35, religion: 'Christian', caste: 'General', occupation: 'Executive Chef', annualIncome: 130000, education: 'Culinary Degree', city: 'San Francisco', bio: 'Gourmet caterer.', photos: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'] },
      { user: vUser3._id, gender: 'male', age: 29, religion: 'Spiritual', caste: 'General', occupation: 'Lead Photographer', annualIncome: 98000, education: 'BFA Photography', city: 'San Francisco', bio: 'Visual storyteller.', photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'] }
    ];

    await Profile.insertMany(profilesData);

    // --- 3. VENDORS COLLECTION (10 Records) ---
    const vendorsData = [
      { user: vUser1._id, businessName: 'Royal Blooms Floral & Decor', category: 'Decorator', description: 'Luxury wedding stage floral design, mandaps, entrance arches.', pricingTier: 'Luxury', startingPrice: 3500, city: 'San Francisco', rating: 4.9, reviewCount: 24, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'], packages: [{ name: 'Royal Mandap Package', price: 4500, description: 'Stage flowers & LEDs' }] },
      { user: vUser2._id, businessName: 'Gourmet Feast Catering', category: 'Caterer', description: 'Authentic multi-cuisine wedding catering & live counters.', pricingTier: 'Premium', startingPrice: 45, city: 'San Francisco', rating: 4.8, reviewCount: 38, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600'], packages: [{ name: 'Imperial 5-Course Buffet', price: 65, description: '4 starters & 6 main courses' }] },
      { user: vUser3._id, businessName: 'Aura Lens Studio', category: 'Photographer', description: 'Award-winning wedding photography, 4K films & drone footage.', pricingTier: 'Premium', startingPrice: 2500, city: 'San Francisco', rating: 5.0, reviewCount: 19, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600'], packages: [{ name: 'Cinematic Dream Package', price: 3200, description: '2 Photographers + Film + Album' }] },
      { user: vUser4._id, businessName: 'Verma Marriage Legal Counsel', category: 'Lawyer', description: 'Legal advice for court marriages, prenups & registry filings.', pricingTier: 'Standard', startingPrice: 500, city: 'San Francisco', rating: 4.9, reviewCount: 15, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600'], packages: [{ name: 'Full Marriage Registration', price: 750, description: 'Document prep & filing' }] },
      { user: vUser5._id, businessName: 'The Grand Palace Banquet & Lawn', category: 'Venue', description: 'Royal banquet hall & sprawling lawn accommodating up to 1000 guests.', pricingTier: 'Luxury', startingPrice: 8000, city: 'San Francisco', rating: 4.9, reviewCount: 42, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600'], packages: [{ name: 'Grand Ballroom & Lawn Combo', price: 12000, description: 'Full day access with bridal suites' }] },
      // Additional 5 vendors
      { user: user1._id, businessName: 'Starlight Ambient Decorators', category: 'Decorator', description: 'Theme lighting, neon arches & floral drapes.', pricingTier: 'Standard', startingPrice: 2000, city: 'New York', rating: 4.7, reviewCount: 18, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600'] },
      { user: user2._id, businessName: 'Spice Route Royal Culinary', category: 'Caterer', description: 'North & South Indian gourmet traditional banquets.', pricingTier: 'Standard', startingPrice: 35, city: 'San Jose', rating: 4.6, reviewCount: 22, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600'] },
      { user: user3._id, businessName: 'Momentum Cine Films', category: 'Photographer', description: 'Pre-wedding couple shoots and candid journalism.', pricingTier: 'Budget', startingPrice: 1500, city: 'New York', rating: 4.8, reviewCount: 14, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600'] },
      { user: user4._id, businessName: 'Harmony Matrimonial Law Advocates', category: 'Lawyer', description: 'Specialists in pre-marital contracts and notarization.', pricingTier: 'Standard', startingPrice: 600, city: 'Chicago', rating: 4.9, reviewCount: 11, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600'] },
      { user: user5._id, businessName: 'Emerald Gardens Resort & Pavilion', category: 'Venue', description: 'Lush green open-air destination wedding resort.', pricingTier: 'Premium', startingPrice: 6000, city: 'Seattle', rating: 4.8, reviewCount: 29, verificationStatus: 'verified', portfolioImages: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600'] }
    ];

    const insertedVendors = await Vendor.insertMany(vendorsData);

    // --- 4. BOOKINGS COLLECTION (10 Records) ---
    const bookingsData = [
      { user: user1._id, vendor: insertedVendors[0]._id, eventType: 'Wedding', eventDate: '2026-10-18', guestCount: 250, selectedServices: ['Royal Mandap Package'], totalAmount: 4500, status: 'confirmed' },
      { user: user2._id, vendor: insertedVendors[1]._id, eventType: 'Reception', eventDate: '2026-11-05', guestCount: 300, selectedServices: ['Imperial 5-Course Buffet'], totalAmount: 13500, status: 'confirmed' },
      { user: user3._id, vendor: insertedVendors[2]._id, eventType: 'Photo Shoot', eventDate: '2026-09-12', guestCount: 50, selectedServices: ['Cinematic Dream Package'], totalAmount: 3200, status: 'completed' },
      { user: user4._id, vendor: insertedVendors[3]._id, eventType: 'Pre-Wedding Legal', eventDate: '2026-08-20', guestCount: 10, selectedServices: ['Full Marriage Registration'], totalAmount: 750, status: 'completed' },
      { user: user5._id, vendor: insertedVendors[4]._id, eventType: 'Wedding', eventDate: '2026-12-01', guestCount: 500, selectedServices: ['Grand Ballroom Combo'], totalAmount: 12000, status: 'pending' },
      { user: user6._id, vendor: insertedVendors[5]._id, eventType: 'Engagement', eventDate: '2026-09-25', guestCount: 150, selectedServices: ['Theme drapes'], totalAmount: 2000, status: 'confirmed' },
      { user: user1._id, vendor: insertedVendors[6]._id, eventType: 'Catering Special', eventDate: '2026-10-19', guestCount: 250, selectedServices: ['Royal Banquet'], totalAmount: 8750, status: 'confirmed' },
      { user: user2._id, vendor: insertedVendors[7]._id, eventType: 'Photo Shoot', eventDate: '2026-10-10', guestCount: 20, selectedServices: ['Candid Shoot'], totalAmount: 1500, status: 'completed' },
      { user: user3._id, vendor: insertedVendors[8]._id, eventType: 'Pre-Wedding Legal', eventDate: '2026-08-28', guestCount: 5, selectedServices: ['Consultation'], totalAmount: 600, status: 'confirmed' },
      { user: user4._id, vendor: insertedVendors[9]._id, eventType: 'Reception', eventDate: '2026-11-30', guestCount: 400, selectedServices: ['Pavilion Access'], totalAmount: 6000, status: 'pending' }
    ];

    const insertedBookings = await Booking.insertMany(bookingsData);

    // --- 5. REVIEWS COLLECTION (10 Records) ---
    const reviewsData = [
      { vendor: insertedVendors[0]._id, user: user1._id, booking: insertedBookings[0]._id, rating: 5, comment: 'Elena transformed our venue into a fairytale garden! Pristine quality and work ethic.' },
      { vendor: insertedVendors[1]._id, user: user2._id, booking: insertedBookings[1]._id, rating: 5, comment: 'The food was the absolute highlight of our reception! Every guest loved the live counters.' },
      { vendor: insertedVendors[2]._id, user: user3._id, booking: insertedBookings[2]._id, rating: 5, comment: 'David and his photography crew captured every raw emotional moment seamlessly.' },
      { vendor: insertedVendors[3]._id, user: user4._id, booking: insertedBookings[3]._id, rating: 5, comment: 'Advocate Verma made our court marriage paperwork effortlessly smooth.' },
      { vendor: insertedVendors[4]._id, user: user5._id, booking: insertedBookings[4]._id, rating: 5, comment: 'Grand Palace is the epitome of elegance. Impeccable lighting and hospitality.' },
      { vendor: insertedVendors[5]._id, user: user6._id, booking: insertedBookings[5]._id, rating: 4, comment: 'Great ambient lighting and decor coordination for our engagement function.' },
      { vendor: insertedVendors[6]._id, user: user1._id, booking: insertedBookings[6]._id, rating: 4, comment: 'Delicious authentic food, prompt service team.' },
      { vendor: insertedVendors[7]._id, user: user2._id, booking: insertedBookings[7]._id, rating: 5, comment: 'Stunning pre-wedding couple portraits! Highly creative angles.' },
      { vendor: insertedVendors[8]._id, user: user3._id, booking: insertedBookings[8]._id, rating: 5, comment: 'Clear, concise prenuptial advice. Extremely professional.' },
      { vendor: insertedVendors[9]._id, user: user4._id, booking: insertedBookings[9]._id, rating: 5, comment: 'Beautiful greenery and spacious resort pavilion.' }
    ];

    await Review.insertMany(reviewsData);

    // --- 6. MESSAGES COLLECTION (10 Records) ---
    const messagesData = [
      { sender: user2._id, receiver: user1._id, content: 'Hi Ananya! I loved reading your profile. Would love to connect!', type: 'matrimonial_interest' },
      { sender: user1._id, receiver: user2._id, content: 'Hello Rohan! Thanks for reaching out. Tell me about your weekend hobbies.', type: 'chat' },
      { sender: user4._id, receiver: user3._id, content: 'Hi Priya! Your bio resonated with me.', type: 'matrimonial_interest' },
      { sender: user3._id, receiver: user4._id, content: 'Hi Vikram! Glad to connect with a fellow architecture enthusiast.', type: 'chat' },
      { sender: user1._id, receiver: vUser1._id, content: 'Hi Elena, can we customize the mandap flower color scheme to pastel pink?', type: 'vendor_inquiry' },
      { sender: vUser1._id, receiver: user1._id, content: 'Absolutely Ananya! Pastel pink with warm gold LEDs is our specialty.', type: 'chat' },
      { sender: user2._id, receiver: vUser2._id, content: 'Hello Chef Marco, do you offer live waffle counters for dessert?', type: 'vendor_inquiry' },
      { sender: vUser2._id, receiver: user2._id, content: 'Yes Rohan! We have live waffle, crepe, and gelato stations available.', type: 'chat' },
      { sender: user5._id, receiver: user6._id, content: 'Hi Arjun! Your research in cardiology sounds fascinating.', type: 'matrimonial_interest' },
      { sender: user6._id, receiver: user5._id, content: 'Thank you Kavya! Data science in healthcare is equally amazing.', type: 'chat' }
    ];

    await Message.insertMany(messagesData);

    // --- 7. NOTIFICATIONS COLLECTION (10 Records) ---
    const notificationsData = [
      { user: user1._id, title: 'New Matrimonial Interest Received! 💖', message: 'Rohan Mehta expressed interest in your profile.', type: 'match' },
      { user: user2._id, title: 'Matrimonial Interest Accepted', message: 'Ananya Sharma replied to your message.', type: 'match' },
      { user: user1._id, title: 'Booking Status Updated', message: 'Royal Blooms confirmed your booking request.', type: 'booking' },
      { user: vUser1._id, title: 'New Booking Received', message: 'Ananya Sharma booked your Decorator services for 2026-10-18.', type: 'booking' },
      { user: vUser2._id, title: 'New Review Posted ⭐', message: 'Rohan Mehta left a 5-star review for Gourmet Feast.', type: 'review' },
      { user: vUser1._id, title: 'Account Verified!', message: 'Admin verified your vendor business application.', type: 'verification' },
      { user: user3._id, title: 'Match Suggestion', message: 'Vikramaditya Singh has a 96% compatibility match with your profile.', type: 'match' },
      { user: user4._id, title: 'Booking Status Updated', message: 'Full Marriage Registration legal service completed.', type: 'booking' },
      { user: user5._id, title: 'Welcome to UnityMatrimony', message: 'Your profile has been created and verified.', type: 'system' },
      { user: adminUser._id, title: 'System Security Alert', message: 'Weekly database backup & index optimization completed cleanly.', type: 'system' }
    ];

    await Notification.insertMany(notificationsData);

    console.log('✅ Seeding complete: 10+ records inserted into ALL 7 collections successfully!');
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
  }
};

module.seedDatabase = seedDatabase;
module.exports = seedDatabase;
