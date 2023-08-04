import mongoose from 'mongoose';

import { DuplicateKeyError } from 'server/utils/databaseErrors';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    default: 'system'
  }
});

// schema middleware to apply after saving
const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    throw new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
      errorCode: 'calendar'
    });
  } else {
    return next();
  }
};

schema.post('save', handleE11000);
schema.post('findByIdAndUpdate', handleE11000);

// schema index
schema.index({ name: 1, user_id: 1 }, { unique: true });

const Calendar = mongoose.model('Calendar', schema);

export default Calendar;
