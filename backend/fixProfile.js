const mongoose = require('mongoose');
const Profile = require('./models/Profile');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const profile = await Profile.findOne();
  if (profile) {
    let updated = false;
    if (profile.title === 'Cloud Enginner') {
      profile.title = 'Cloud Engineer';
      updated = true;
    }
    if (profile.name === 'Suraj prakash') {
      profile.name = 'Suraj Prakash';
      updated = true;
    }
    if (updated) {
      await profile.save();
      console.log("Profile updated successfully!");
    } else {
      console.log("Profile already correct or no matching typos.");
    }
  } else {
    console.log("No profile found.");
  }
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
