const captainModel = require("../models/captain.model");
const blacklisttokenModel = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require("../service/rabbit");
const { rideEventEmitter } = require("../service/rideEventEmitter");

// Register a new captain
module.exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if captain already exists

    const captain = await captainModel.findOne({ email });
    if (captain) {
      return res.status(400).json({ message: "captain already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new captain
    const newcaptain = new captainModel({
      name,
      email,
      password: hashedPassword,
    });
    // Save the captain to the database
    await newcaptain.save();

    const token = jwt.sign(
      { captainId: newcaptain._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token);

    res.status(201).json({ message: "captain registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    delete captain._doc.password;

    res.cookie("token", token);

    res.send({ token, captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklisttokenModel.create({ token });
    res.clearCookie("token");
    res.send({ message: "captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.profile = async (req, res) => {
  try {
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.acceptedRide = async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once("ride-accepted", (data) => {
    res.send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
    res.status(204).send();
  }, 30000);
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.requestNewRide = async (req, res) => {
  try {
    // Long polling: wait for 'new-ride' event
    rideEventEmitter.once("new-ride", (data) => {
      res.send(data);
    });

    // Set timeout for long polling (e.g., 30 seconds)
    setTimeout(() => {
      res.status(204).send();
    }, 30000);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

subscribeToQueue("new-ride", (data) => {
  console.log(JSON.parse(data));
});
