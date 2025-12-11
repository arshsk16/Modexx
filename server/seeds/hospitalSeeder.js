const mongoose = require("mongoose");
require("dotenv").config();

const Hospital = require("../models/hospital");
const { hashPassword } = require("../utils/bcrypt/bcryptUtils.js");

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.PASSDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✔"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });

// Hospital data (lat & long REQUIRED by your schema)
// Note: Passwords will be hashed before insertion
const exampleHospitals = [
  {
    name: "Apollo Hospitals",
    address: "Greams Road, Chennai",
    phone: "+91-44-2829-0200",
    email: "info@apollohospitals.com",
    departments: ["Cardiology", "Oncology", "Neurology"],
    availableServices: ["Emergency", "Inpatient", "Surgery"],
    ratings: 4.8,
    password: "securepassword1",
    lat: 13.0724,
    long: 80.2518,
  },
  {
    name: "Fortis Hospital",
    address: "Shalimar Bagh, New Delhi",
    phone: "+91-11-4530-2222",
    email: "contactus@fortishealthcare.com",
    departments: ["Orthopedics", "Pediatrics", "Cardiology"],
    availableServices: ["Outpatient", "Emergency", "Diagnostic"],
    ratings: 4.7,
    password: "securepassword2",
    lat: 28.7167,
    long: 77.1667,
  },
  {
    name: "Manipal Hospitals",
    address: "HAL Airport Road, Bengaluru",
    phone: "+91-80-2502-4444",
    email: "support@manipalhospitals.com",
    departments: ["Gastroenterology", "Pulmonology", "Oncology"],
    availableServices: ["ICU", "Radiology", "Consultations"],
    ratings: 4.5,
    password: "securepassword3",
    lat: 12.9592,
    long: 77.6974,
  },
];

// Hash passwords before insertion
async function seedHospitals() {
  try {
    const hospitalsWithHashedPasswords = await Promise.all(
      exampleHospitals.map(async (hospital) => ({
        ...hospital,
        password: await hashPassword(hospital.password),
      }))
    );

    // Insert Data
    Hospital.insertMany(hospitalsWithHashedPasswords)
      .then((docs) => {
        console.log("Hospitals added successfully 🎉");
        console.log(docs);
        mongoose.connection.close();
      })
      .catch((err) => {
        console.error("Error adding hospitals ❌", err);
        mongoose.connection.close();
      });
  } catch (error) {
    console.error("Error hashing passwords:", error);
    mongoose.connection.close();
  }
}

seedHospitals();
