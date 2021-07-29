import db from '../models';
import { AuthorizationError } from '../utils/userFacingErrors';

const Event = db.event;
const User = db.user;

const allAccess = (req, res) => {
  res.status(200).send("Public content")
};

const userAccess = (req, res) => {
  res.status(200).send("User content")
};

const adminAccess = (req, res) => {
  res.status(200).send("Admin content")
};

const moderatorAccess = (req, res) => {
  res.status(200).send("Moderator content")
};

const retrieveEvents = async (req, res) => {
  const events = await Event.find({}).sort({ start: -1 });

  return res.status(200).send({ data: events });
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);

  const createdEvent = await event.save();

  const trimmed = {
    _id: createdEvent._id,
    title: createdEvent.title,
    desc: createdEvent.desc,
    start: createdEvent.start,
    end: createdEvent.end
  }

  return res.status(200).send({ data: trimmed });
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  const deletedEvent = await Event.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(eventId) });

  return res.status(200).send({ data: deletedEvent, message: 'Deleted event' });
};

const updateEvent = async (req, res) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);
  payload.start = new Date(payload.start)
  payload.end = new Date(payload.end)

  const updatedEvent = await Event.findOneAndUpdate({ '_id': payload._id }, payload, { new: true });

  const trimmed = {
    _id: updatedEvent._id,
    title: updatedEvent.title,
    desc: updatedEvent.desc,
    start: updatedEvent.start,
    end: updatedEvent.end
  }

  return res.status(200).send({ data: trimmed, message: 'Updated event' });
};

const updateUsername = async (req, res) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);
  const updatedUser = await User.findOneAndUpdate({ '_id': payload._id }, { 'username': payload.username }, { new: true });

  const trimmed = {
    id: updatedUser._id,
    username: updatedUser.username
  }

  return res.status(200).send({ data: trimmed, message: 'Updated username' });
};

const updatePassword = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

  User.findOne({
    '_id': payload._id
  })
    .exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      const passwordIsValid = await user.validatePassword(payload.password);

      if (!passwordIsValid) {
        return next(
          new AuthorizationError(
            'Invalid password',
            { errorCode: 'password' }
          )
        );
      }

      // If password is valid, update with new password
      user.password = payload.password;

      user.save(err => {
        if (err) {
          return next(err);
        }

        res.status(200).send({
          message: "Password updated successfully!"
        });
      });
    });
};

const userController = {
  allAccess,
  userAccess,
  adminAccess,
  moderatorAccess,
  retrieveEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  updateUsername,
  updatePassword
}

export default userController;