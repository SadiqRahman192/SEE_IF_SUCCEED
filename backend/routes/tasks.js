const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Event = require('../models/Event'); // Needed to verify event existence

// @route   GET api/events/:eventId/tasks
// @desc    Get all tasks for a specific event
// @access  Public (for now)
router.get('/:eventId', async (req, res) => {
  try {
    const tasks = await Task.find({ eventId: req.params.eventId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events/:eventId/tasks
// @desc    Create a new task for a specific event
// @access  Public (for now)
router.post('/:eventId', async (req, res) => {
  const { title } = req.body;
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
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
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  const { title, completed } = req.body;
  const taskFields = {};
  if (title !== undefined) taskFields.title = title;
  if (completed !== undefined) taskFields.completed = completed;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
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
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
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
