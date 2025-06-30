const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 60000, // 60 seconds
      socketTimeoutMS: 60000, // 60 seconds
      serverSelectionTimeoutMS: 30000, // 30 seconds
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.stack);
    process.exit(1);
  }
};

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  organizer: { type: String }, // Assuming this is the email
  createdAt: { type: Date, default: Date.now },
  reminderSent: { type: Boolean, default: true }, // Added
});

// const Event = mongoose.model('Event', EventSchema);
module.exports = connectDB;
