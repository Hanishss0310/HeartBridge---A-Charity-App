import mongoose from 'mongoose';

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  mobile: String,
  signupDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  signupTime: {
    type: String,
    default: () => new Date().toTimeString().split(' ')[0],
  },
});
const UsersModel = mongoose.models.Users || mongoose.model('Users', UserSchema);

// ✅ Event Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 30 },
  description: { type: String, required: true, maxlength: 81 },
  dateTime: { type: String, required: true },
  address: { type: String, required: true, maxlength: 60 },
  locationUrl: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });
const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);

// ✅ Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  mobile: String,
  location: String,
  pincode: String,
  joinedOn: { type: Date, default: Date.now },
});
const VolunteerModel = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema, 'volunteers');

// ✅ Trust Registration Schema
const TrustRegistrationSchema = new mongoose.Schema({
  trustName: String,
  ownerName: String,
  contactNumber: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String,
  creationDate: String,
  trustType: String,
  objectives: String,
  witnessDetails: String,
  accountantDetails: String,
  legalDocs: [String],
  panCard: String,
  trusteePhotos: [String],
  noc: String,
  idProof: [String]
}, { timestamps: true });
const TrustRegistrationModel = mongoose.models.TrustRegistration || mongoose.model('TrustRegistration', TrustRegistrationSchema);

// ✅ Trustee Schema (NEW)
const TrusteeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true }
}, { timestamps: true });
const TrusteeModel = mongoose.models.Trustee || mongoose.model('Trustee', TrusteeSchema);

// ✅ Export all models
export {
  UsersModel,
  EventModel,
  VolunteerModel,
  TrustRegistrationModel,
  TrusteeModel,
};
