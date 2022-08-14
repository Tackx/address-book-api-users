import Mongoose from 'mongoose';

export const userSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  }
});

export default Mongoose.model('User', userSchema);
