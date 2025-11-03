// server/script.js  (full file – copy-paste this)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const connectDb = require("./config/connectDb");
const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const Notification = require("./models/notification");
const Nutrition = require("./models/nutrition");
const goals_model = require("./models/goals");

const app = express();

app.use(express.json());
app.use(cors());
connectDb();

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* -------------------------------------------------
   REGISTER
------------------------------------------------- */
app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const image = req.file ? req.file.filename : "";

    await reg_model.create({ name, email, password: hash, image });
    res.status(201).send({ message: "User registered successfully" });
  } catch (e) {
    if (e.code === 11000) res.status(400).send({ message: "Email already registered" });
    else res.status(500).send({ message: "Server error", error: e });
  }
});

/* -------------------------------------------------
   LOGIN
------------------------------------------------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await reg_model.findOne({ email });
    if (!user) return res.status(200).send({ message: "User doesn't exist" });

    const match = await bcrypt.compare(password, user.password);
    res.status(200).send({ message: match ? "Logged in" : "Incorrect Password", registeredUser: match ? user : null });
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

/* -------------------------------------------------
   WORKOUTS
------------------------------------------------- */
app.post("/workouts", async (req, res) => {
  try {
    const { userId, exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;
    const workout = new workout_model({
      userId,
      exerciseName,
      sets,
      reps,
      weights,
      notes,
      category,
      tags,
      date: new Date(date),
    });
    await workout.save();

    await Notification.create({
      userId,
      type: "activity",
      message: `Workout "${exerciseName}" added successfully.`,
    });

    // ----- Goal check (workouts) -----
    const goals = await goals_model.find({ userId });
    for (const g of goals) {
      let achieved = false;
      if (g.goalType === "Lift Target" && weights >= g.target) achieved = true;
      if (g.goalType === "Workout Sets" && sets >= g.target) achieved = true;
      if (g.goalType === "Workout Reps" && reps >= g.target) achieved = true;

      if (achieved) {
        await Notification.create({
          userId,
          type: "goal",
          message: `Goal "${g.goalType}" achieved with ${exerciseName}!`,
        });
      }
    }

    res.status(201).send({ message: "Workout added successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/workouts", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const list = await workout_model.find({ userId }).sort({ date: -1 }).lean();
    res.send(list);
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;
    const updated = await workout_model.findByIdAndUpdate(
      id,
      { exerciseName, sets, reps, weights, notes, category, tags, date: new Date(date) },
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: updated.userId,
      type: "activity",
      message: `Workout "${updated.exerciseName}" updated successfully.`,
    });
    res.send({ message: "Workout updated", updated });
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const del = await workout_model.findByIdAndDelete(id);
    if (!del) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: del.userId,
      type: "activity",
      message: `Workout "${del.exerciseName}" deleted.`,
    });
    res.send({ message: "Deleted" });
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

/* -------------------------------------------------
   PROGRESS   (POST instead of PUT)
------------------------------------------------- */
app.post("/progress", async (req, res) => {
  try {
    const { userId, date, weight, measurements, performance } = req.body;
    const prog = new progress_model({
      userId,
      date: new Date(date),
      weight,
      measurements,
      performance,
    });
    await prog.save();

    await Notification.create({
      userId,
      type: "reminder",
      message: `Progress updated for ${new Date(date).toLocaleDateString()}.`,
    });

    // ----- Goal check (progress) -----
    const goals = await goals_model.find({ userId });
    for (const g of goals) {
      let achieved = false;
      if (g.goalType === "Weight Loss" && weight <= g.target) achieved = true;
      if (g.goalType === "Muscle Gain" && weight >= g.target) achieved = true;
      // add more checks here if you have other goal types

      if (achieved) {
        await Notification.create({
          userId,
          type: "goal",
          message: `Goal "${g.goalType}" achieved!`,
        });
      }
    }

    res.status(201).send({ message: "Progress added successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const list = await progress_model.find({ userId }).sort({ date: 1 }).lean();
    res.send(list);
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

/*  UPDATE PROGRESS – now POST /progress/:id  */
app.post("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await progress_model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Not found" });

    // re-check goals after edit
    const goals = await goals_model.find({ userId: updated.userId });
    for (const g of goals) {
      let achieved = false;
      if (g.goalType === "Weight Loss" && updated.weight <= g.target) achieved = true;
      if (g.goalType === "Muscle Gain" && updated.weight >= g.target) achieved = true;

      if (achieved) {
        await Notification.create({
          userId: updated.userId,
          type: "goal",
          message: `Goal "${g.goalType}" achieved!`,
        });
      }
    }

    res.send(updated);
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const del = await progress_model.findByIdAndDelete(id);
    if (!del) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) {
    res.status(500).send({ message: "Server error" });
  }
});

/* -------------------------------------------------
   PREFERENCES, PROFILE, NUTRITION, NOTIFICATIONS, GOALS
   (all using res.send)
------------------------------------------------- */
app.get("/preferences", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const u = await reg_model.findById(userId).select("preferences");
    res.send(u?.preferences || {});
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.put("/preferences", async (req, res) => {
  try {
    const { userId, notifications, units, theme } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const u = await reg_model.findByIdAndUpdate(
      userId,
      { "preferences.notifications": notifications, "preferences.units": units, "preferences.theme": theme },
      { new: true }
    ).select("preferences");
    res.send(u.preferences);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const u = await reg_model.findById(userId).select("name email image");
    res.send(u);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const upd = { name, email };
    if (req.file) upd.image = req.file.filename;
    const u = await reg_model.findByIdAndUpdate(userId, upd, { new: true }).select("name email image");
    res.send(u);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.delete("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    await reg_model.findByIdAndDelete(userId);
    await Promise.all([
      workout_model.deleteMany({ userId }),
      progress_model.deleteMany({ userId }),
      Nutrition.deleteMany({ userId }),
      goals_model.deleteMany({ userId })
    ]);
    res.send({ message: "Profile deleted" });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

/* NUTRITION */
app.post("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, foodItems, date, notes } = req.body;
    if (!userId || !mealType || !Array.isArray(foodItems) || !date) return res.status(400).send({ message: "Invalid data" });
    const log = await Nutrition.create({ userId, mealType, foodItems, date: new Date(date), notes });
    res.status(201).send({ message: "Created", log });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.get("/nutrition", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const logs = await Nutrition.find({ userId }).sort({ date: -1 }).lean();
    const enriched = logs.map(l => ({
      ...l,
      totalCalories: l.foodItems.reduce((s, i) => s + i.calories, 0),
      totalProteins: l.foodItems.reduce((s, i) => s + i.proteins, 0),
      totalCarbs: l.foodItems.reduce((s, i) => s + i.carbs, 0),
      totalFats: l.foodItems.reduce((s, i) => s + i.fats, 0),
    }));
    res.send(enriched);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.put("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date, notes } = req.body;
    const u = await Nutrition.findByIdAndUpdate(id, { mealType, foodItems, date: new Date(date), notes }, { new: true });
    if (!u) return res.status(404).send({ message: "Not found" });
    res.send(u);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.delete("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const d = await Nutrition.findByIdAndDelete(id);
    if (!d) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

/* NOTIFICATIONS */
app.get("/notifications", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const list = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    res.send(list);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.post("/notifications", async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message) return res.status(400).send({ message: "userId, type, message required" });
    const n = await Notification.create({ userId, type, message });
    res.status(201).send(n);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.post("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const n = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!n) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Marked as read", n });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const d = await Notification.findByIdAndDelete(id);
    if (!d) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

/* GOALS */
app.post("/goals", async (req, res) => {
  try {
    const { userId, goalType, target, current = 0, deadline, notes } = req.body;
    const g = await goals_model.create({ userId, goalType, target, current, deadline: new Date(deadline), notes });
    res.status(201).send({ message: "Goal added", goal: g });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.get("/goals", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const list = await goals_model.find({ userId }).sort({ deadline: 1 }).lean();
    res.send(list);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.put("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { goalType, target, current, deadline, notes } = req.body;
    const u = await goals_model.findByIdAndUpdate(
      id,
      { goalType, target, current, deadline: new Date(deadline), notes },
      { new: true }
    );
    if (!u) return res.status(404).send({ message: "Not found" });
    res.send(u);
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});

app.delete("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const d = await goals_model.findByIdAndDelete(id);
    if (!d) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) { res.status(500).send({ message: "Server error" }); }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));