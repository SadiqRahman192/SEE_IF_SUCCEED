const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
// const authMiddleware = require("../middleware/auth"); // Removed as middleware will be applied in server.js


// PATCH /api/events/:id
router.patch('/:id', async (req, res) => {
  try {
    const { reminderSent } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { reminderSent },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   POST api/events
// @desc    Create a new event
// @access  Public (for now)
router.post('/', async (req, res) => { // Removed authMiddleware here
  try {
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      cateringNeeded: req.body.cateringNeeded,
      venueNeeded: req.body.venueNeeded,
      organizer: req.body.organizer, // 
      userId: req.user._id, // Associate with authenticated user

    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Public (for now)
router.get('/', async (req, res) => { // Removed authMiddleware here
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ date: -1 });    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public (for now)

router.get('/:id', async (req, res) => { // Removed authMiddleware here
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id
// @desc    Update an event by ID
// @access  Public (for now)
router.put('/:id', async (req, res) => { // Removed authMiddleware here
  const { title, description, date, location, cateringNeeded, venueNeeded, organizer } = req.body;

  // Build event object
  const eventFields = {};
  if (title) eventFields.title = title;
  if (description) eventFields.description = description;
  if (date) eventFields.date = date;
  if (location) eventFields.location = location;
  if (cateringNeeded) eventFields.cateringNeeded = cateringNeeded;
  if (venueNeeded) eventFields.venueNeeded = venueNeeded;
  if (organizer) eventFields.organizer = organizer;



  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event by ID
// @access  Public (for now)
router.delete('/:id', async (req, res) => { // Removed authMiddleware here
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;



//
