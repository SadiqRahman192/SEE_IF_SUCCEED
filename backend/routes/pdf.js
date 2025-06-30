const express = require('express');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const Event = require('../models/Event'); // Import Event model

const router = express.Router();

router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params; // Use req.params for route parameters

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const stream = new PassThrough();
    doc.pipe(stream);

    // Add styled content
    doc.font('Helvetica-Bold').fillColor('#003366').fontSize(25).text('Event Details', { align: 'center' });
    doc.moveDown();
    doc.font('Helvetica').fillColor('black').fontSize(16);
    doc.text(`Title: ${event.title}`);
    doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`); // Format date
    doc.text(`Location: ${event.location}`);
    if (event.organizer) {
      doc.text(`Organizer: ${event.organizer}`);
    }
    if (event.description) {
      doc.moveDown();
      doc.font('Helvetica-Bold').fontSize(18).text('Description:');
      doc.font('Helvetica').fontSize(12).text(event.description);
    }

    doc.end();

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${event.title.replace(/\s/g, '_') || 'event'}-details.pdf`);
    stream.pipe(res);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
});

module.exports = router;
