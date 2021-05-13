import mongoose from 'mongoose';

const CalendarSchema = new mongoose.Schema ({
  name: { type: String, required: true },
  visibility: { type: Boolean, required: true, default: true }
});

let CalendarsModel = mongoose.model('Event', CalendarSchema);

export default CalendarsModel;