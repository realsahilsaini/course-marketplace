const mongoose = require('mongoose');
const {Schema} = mongoose;

const User = new Schema({
  email: {type: String, unique: true},
  username: {type: String, unique: true},
  password: String,
  firstName: String,
  lastName: String,
});

const Admin = new Schema({
  email: {type: String, unique: true},
  username: {type: String, unique: true},
  password: String,
  firstName: String,
  lastName: String,
});

const Course = new Schema({
  title: String,
  description: String,
  prince: Number,
  imageURL: String,
  creatorId: {type: Schema.Types.ObjectId, ref: 'users'},
});

const Purchase = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'users'},
  courseId: {type: Schema.Types.ObjectId, ref: 'courses'},
  purchaseDate: {type: Date, default: Date.now},
});




//In the userId field, we are referencing the users collection. This is how we establish a relationship between two collections in MongoDB.


const UserModel = mongoose.model('users', User);
const CourseModel = mongoose.model('courses', Course);
const AdminModel = mongoose.model('admin', Admin);
const PurchaseModel = mongoose.model('purchases', Purchase);


module.exports = {
  UserModel:UserModel,
  CourseModel:CourseModel,
  AdminModel:AdminModel,
  PurchaseModel:PurchaseModel
};