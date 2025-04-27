import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { UsersModel, EventModel, VolunteerModel, TrustRegistrationModel, TrusteeModel } from './Models/Users.js';

const app = express();

// ----------------- Middleware -----------------
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

// ----------------- MongoDB Connection -----------------
mongoose.connect('mongodb://localhost:27017/HeartBridge', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ----------------- Multer Setup (Common) -----------------
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// ----------------- Trust Registration -----------------
app.post('/api/trusts', upload.fields([
    { name: 'legalDocs', maxCount: 10 },
    { name: 'panCard', maxCount: 1 },
    { name: 'trusteePhotos', maxCount: 10 },
    { name: 'noc', maxCount: 1 },
    { name: 'idProof', maxCount: 10 }
]), async (req, res) => {
    try {
        const {
            trustName,
            ownerName,
            contactNumber,
            email,
            address,
            city,
            state,
            pincode,
            landmark,
            creationDate,
            trustType,
            objectives,
            witnessDetails,
            accountantDetails
        } = req.body;

        const files = req.files;

        const trustData = {
            trustName,
            ownerName,
            contactNumber,
            email,
            address,
            city,
            state,
            pincode,
            landmark,
            creationDate,
            trustType,
            objectives,
            witnessDetails,
            accountantDetails,
            legalDocs: files.legalDocs?.map(file => file.path) || [],
            panCard: files.panCard?.[0]?.path || '',
            trusteePhotos: files.trusteePhotos?.map(file => file.path) || [],
            noc: files.noc?.[0]?.path || '',
            idProof: files.idProof?.map(file => file.path) || []
        };

        const newTrust = await TrustRegistrationModel.create(trustData);
        res.status(201).json({ message: 'Trust registered successfully', data: newTrust });
    } catch (error) {
        console.error('Error registering trust:', error);
        res.status(500).json({ message: 'Trust registration failed', error: error.message });
    }
});

// ----------------- User Authentication -----------------
app.post('/login', async (req, res) => {
    const { email, password, mobile } = req.body;
    if (!email || !password || !mobile) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const user = await UsersModel.findOne({ email, password, mobile });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Success", user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login", error: err.message });
    }
});

app.post('/Register', async (req, res) => {
    try {
        const user = await UsersModel.create(req.body);
        const totalUsers = await UsersModel.countDocuments();
        res.json({ message: "User Registered", totalUsers, user });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

app.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await UsersModel.countDocuments();
        res.json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total user count", error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await UsersModel.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// ----------------- Events -----------------
app.post('/events', upload.single('image'), async (req, res) => {
    try {
        const { title, description, dateTime, address, locationUrl } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;  // Corrected
        const event = await EventModel.create({ title, description, dateTime, address, locationUrl, imageUrl });
        res.json({ message: "Event created successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error creating event", error: err.message });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await EventModel.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});

// ----------------- Volunteers -----------------
app.post('/api/volunteer/submit', async (req, res) => {
    try {
        const { floating_email, floating_name, floating_mobile, floating_location, floating_pincode } = req.body;
        const newVolunteer = new VolunteerModel({
            email: floating_email,
            fullName: floating_name,
            mobile: floating_mobile,
            location: floating_location,
            pincode: floating_pincode,
        });
        const savedVolunteer = await newVolunteer.save();
        res.status(201).json({ message: 'Volunteer information submitted successfully', data: savedVolunteer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit volunteer information', message: err.message });
    }
});

app.get('/api/volunteers/all', async (req, res) => {
    try {
        const volunteers = await VolunteerModel.find();
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch volunteers', message: err.message });
    }
});

// ----------------- Trusts -----------------
app.get('/api/trusts', async (req, res) => {
    try {
        const trusts = await TrustRegistrationModel.find({}, {
            trustName: 1,
            email: 1,
            city: 1,
            ownerName: 1,
            pincode: 1,
            _id: 1
        });
        res.status(200).json(trusts);
    } catch (error) {
        console.error('Error fetching trust data:', error);
        res.status(500).json({ message: 'Failed to fetch trust data', error: error.message });
    }
});

app.get('/api/trusts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Trust ID format' });
        }

        const trust = await TrustRegistrationModel.findById(id);
        if (!trust) {
            return res.status(404).json({ message: 'Trust not found' });
        }

        res.json(trust);
    } catch (error) {
        console.error('Error fetching trust details:', error);
        res.status(500).json({ message: 'Failed to fetch trust details', error: error.message });
    }
});

// ----------------- Trustees -----------------
app.post('/api/trustees', async (req, res) => {
    try {
        const { email, password, contactNumber } = req.body;
        if (!email || !password || !contactNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newTrustee = await TrusteeModel.create({ email, password, contactNumber });
        res.status(201).json({ message: 'Trustee credentials saved successfully', trustee: newTrustee });
    } catch (error) {
        console.error('Error saving trustee credentials:', error);
        res.status(500).json({ message: 'Failed to save trustee credentials', error: error.message });
    }
});




// ----------------- Trustees -----------------
app.post('/api/trustees', async (req, res) => {
    try {
        const { email, password, contactNumber } = req.body;
        if (!email || !password || !contactNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newTrustee = await TrusteeModel.create({ email, password, contactNumber });
        res.status(201).json({ message: 'Trustee credentials saved successfully', trustee: newTrustee });
    } catch (error) {
        console.error('Error saving trustee credentials:', error);
        res.status(500).json({ message: 'Failed to save trustee credentials', error: error.message });
    }
});

// ✅ Trustee Login API (NEW)
// Trustee Login Route
app.post('/trustee/login', async (req, res) => {
    try {
      const { email, password, number } = req.body;
  
      // Fake credentials for testing
      const dummyEmail = "yashaswini01025@gmail.com";
      const dummyPassword = "password123"; // Replace with your real password
      const dummyNumber = "9743201025";
  
      // Validation
      if (email === dummyEmail && password === dummyPassword && number === dummyNumber) {
        // Success: Send redirect URL
        return res.status(200).json({ redirectUrl: "http://localhost:3003" });
      } else {
        // Wrong credentials
        return res.status(401).json({ message: "Invalid email, password, or phone number" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Something went wrong on the server" });
    }
  });
  
  // Default route
  app.get('/', (req, res) => {
    res.send('Server is running');
  });
  




// ----------------- Start Server -----------------
app.listen(3001, () => {
    console.log('🚀 Server running on http://localhost:3001');
});
