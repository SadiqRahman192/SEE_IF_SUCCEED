const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Event = require('../models/Event');
const auth = require('../middleware/auth'); // Import auth middleware

// @route   GET api/tasks/pending
// @desc    Get all pending tasks for the authenticated user
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    // Find all events created by the authenticated user
    const userEvents = await Event.find({ userId: req.user.id }).select('_id');
    const eventIds = userEvents.map(event => event._id);

    // Find all tasks associated with these events that are not completed
    const pendingTasks = await Task.find({
      eventId: { $in: eventIds },
      completed: false
    }).sort({ createdAt: 1 });

    res.json(pendingTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:eventId/tasks
// @desc    Get all tasks for a specific event
// @access  Private (changed from Public)
router.get('/:eventId', auth, async (req, res) => {
  try {
    // Ensure the event belongs to the authenticated user
    const event = await Event.findById(req.params.eventId);
    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Event not found or unauthorized' });
    }

    const tasks = await Task.find({ eventId: req.params.eventId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events/:eventId/tasks
// @desc    Create a new task for a specific event
// @access  Private (changed from Public)
router.post('/:eventId', auth, async (req, res) => {
  const { title } = req.body;
  try {
    const event = await Event.findById(req.params.eventId);
    // Ensure the event belongs to the authenticated user
    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Event not found or unauthorized' });
    }

    const newTask = new Task({
      title,
      eventId: req.params.eventId,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task by ID
// @access  Private (changed from Public)
router.put('/:id', auth, async (req, res) => {
  const { title, completed } = req.body;
  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Ensure the task's event belongs to the authenticated user
    const event = await Event.findById(task.eventId);
    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task by ID
// @access  Private (changed from Public)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Ensure the task's event belongs to the authenticated user
    const event = await Event.findById(task.eventId);
    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
