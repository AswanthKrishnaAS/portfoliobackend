require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/user.model");

// Auto seed function
const seedAdminUser = async () => {
  try {
    const adminEmail = 'aswanth@1234';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const adminUser = new User({ email: adminEmail, password: '123' });
      await adminUser.save();
      console.log(`Auto-seeded admin user: ${adminEmail}`);
    } else {
      console.log(`Admin user ${adminEmail} already exists`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
};

connectDB().then(() => {
  seedAdminUser();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});