import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import mongoose from 'mongoose';
import Event from '../../models/Event';

export default async function handler(req, res) {
  const { eventId } = req.query;
  await mongoose.connect(process.env.MONGODB_URI);
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const doc = new PDFDocument();
  const stream = new PassThrough();

  doc.pipe(stream);

  doc.fontSize(25).text('Event Details', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`Title: ${event.title}`);
  doc.text(`Date: ${event.date}`);
  doc.text(`Location: ${event.location}`);

  doc.end();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=event-details.pdf');
  stream.pipe(res);
}