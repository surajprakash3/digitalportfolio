import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    message: { 
      type: String, 
      required: [true, 'Message content is required'],
      minlength: [5, 'Message must be at least 5 characters long']
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
