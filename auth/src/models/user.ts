import mongoose from 'mongoose';
import { Password } from '../services/password'

// An interface that describe the props required to create a new user
interface UserAttrs {
  email: string;
  password: string;
};

// An interface that describes the props that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties that user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password;
      delete ret.__v;
    }
  }
});


userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));

    this.set('password', hashed);
  }

  next();
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User }