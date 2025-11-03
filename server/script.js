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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const profilePic = req.file ? req.file.filename : "";

    await reg_model.create({
      name,
      email,
      password: hashPassword,
      image: profilePic,
    });

    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: "Email already registered" });
    } else {
      console.error("Register error:", error);
      res.status(500).send({ message: "Server error", error });
    }
  }
});

// ========================= LOGIN =========================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registeredUser = await reg_model.findOne({ email });
    if (!registeredUser) {
      return res.status(200).send({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    if (isMatch) {
      res.status(200).send({ message: "Logged in", registeredUser });
    } else {
      res.status(200).send({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= WORKOUTS =========================
app.post("/workouts", async (req, res) => {
  try {
    const { userId, exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;

    const newWorkout = new workout_model({
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
    await newWorkout.save();

    // Notify workout added
    await Notification.create({
      userId,
      type: "activity",
      message: `Workout "${exerciseName}" added successfully.`,
    });

    // === GOAL ACHIEVEMENT CHECK ===
    const goals = await goals_model.find({ userId });
    for (const goal of goals) {
      let achieved = false;

      if (goal.goalType === "Lift Target" && weights >= goal.target) {
        achieved = true;
      }
      if (goal.goalType === "Workout Sets" && sets >= goal.target) {
        achieved = true;
      }
      if (goal.goalType === "Workout Reps" && reps >= goal.target) {
        achieved = true;
      }

      if (achieved) {
        await Notification.create({
          userId,
          type: "goal",
          message: `Goal "${goal.goalType}" achieved with ${exerciseName}!`,
        });
      }
    }

    res.status(201).send({ message: "Workout added successfully" });
  } catch (error) {
    console.error("Workout POST error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/workouts", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const workouts = await workout_model.find({ userId }).sort({ date: -1 }).lean();
    res.send(workouts);
  } catch (error) {
    console.error("Workout GET error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;

    const updated = await workout_model.findByIdAndUpdate(
      id,
      {
        exerciseName,
        sets,
        reps,
        weights,
        notes,
        category,
        tags,
        date: new Date(date),
      },
      { new: true }
    );

    if (!updated) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: updated.userId,
      type: "activity",
      message: `Workout "${updated.exerciseName}" updated successfully.`,
    });

    res.send({ message: "Workout updated", updated });
  } catch (error) {
    console.error("Workout post error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await workout_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: deleted.userId,
      type: "activity",
      message: `Workout "${deleted.exerciseName}" deleted.`,
    });

    res.send({ message: "Deleted" });
  } catch (error) {
    console.error("Workout DELETE error:", error);
    res.status(500).send({ message: "Server error" });
  }
});


app.post("/progress", async (req, res) => {
  try {
    const { userId, date, weight, measurements, performance } = req.body;
    const newProgress = new progress_model({
      userId,
      date: new Date(date),
      weight,
      measurements,
      performance,
    });
    await newProgress.save();

    await Notification.create({
      userId,
      type: "reminder",
      message: `Progress updated for ${new Date(date).toLocaleDateString()}.`,
    });

    const goals = await goals_model.find({ userId });
    for (const goal of goals) {
      let achieved = false;
      if (goal.goalType === "Weight Loss" && weight <= goal.target) {
        achieved = true;
      } else if (goal.goalType === "Muscle Gain" && weight >= goal.target) {
        achieved = true;
      } 

      if (achieved) {
        await Notification.create({
          userId,
          type: "goal",
          message: `Congratulations! Goal "${goal.goalType}" achieved.`,
        });
      }
    }

    res.status(201).send({ message: "Progress added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});


app.get("/progress", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const entries = await progress_model.find({ userId }).sort({ date: 1 }).lean();
    res.send(entries);
  } catch (error) {
    console.error("Progress GET error:", error);
    res.status(500).send({ message: "Server error" });
  }
});


app.post("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await progress_model.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Not found" });

    const goals = await goals_model.find({ userId: updated.userId });
    for (const goal of goals) {
      let achieved = false;
      if (goal.goalType === "Weight Loss" && updated.weight <= goal.target) {
        achieved = true;
      } else if (goal.goalType === "Muscle Gain" && updated.weight >= goal.target) {
        achieved = true;
      } 

      if (achieved) {
        await Notification.create({
          userId: updated.userId,
          type: "goal",
          message: `Congratulations! Goal "${goal.goalType}" achieved.`,
        });
      }
    }

    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/progress/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await progress_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (error) {
    console.error("Progress DELETE error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= PREFERENCES =========================
app.get("/preferences", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select("preferences");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user.preferences || {});
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/preferences", async (req, res) => {
  try {
    const { userId, notifications, units, theme } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const updated = await reg_model
      .findByIdAndUpdate(
        userId,
        {
          "preferences.notifications": notifications,
          "preferences.units": units,
          "preferences.theme": theme,
        },
        { new: true }
      )
      .select("preferences");

    if (!updated) return res.status(404).send({ message: "User not found" });
    res.send(updated.preferences);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= PROFILE =========================
app.get("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select("name email image");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const updateData = { name, email };
    if (req.file) updateData.image = req.file.filename;

    const updated = await reg_model.findByIdAndUpdate(userId, updateData, { new: true }).select("name email image");
    if (!updated) return res.status(404).send({ message: "User not found" });
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/profile", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const user = await reg_model.findByIdAndDelete(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    await Promise.all([
      workout_model.deleteMany({ userId }),
      progress_model.deleteMany({ userId }),
      Nutrition.deleteMany({ userId }),
      goals_model.deleteMany({ userId }),
    ]);

    res.send({ message: "Profile deleted" });
  } catch (error) {
    console.error("Profile DELETE error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= NUTRITION =========================
app.post("/nutrition", async (req, res) => {
  try {
    const { userId, mealType, foodItems, date, notes } = req.body;
    if (!userId || !mealType || !Array.isArray(foodItems) || foodItems.length === 0 || !date)
      return res.status(400).send({ message: "Invalid data" });

    const log = await Nutrition.create({
      userId,
      mealType,
      foodItems,
      date: new Date(date),
      notes,
    });
    res.status(201).send({ message: "Created", log });
  } catch (e) {
    console.error("Nutrition POST error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/nutrition", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const logs = await Nutrition.find({ userId }).sort({ date: -1 }).lean();
    const enriched = logs.map(log => ({
      ...log,
      totalCalories: log.foodItems.reduce((s, i) => s + i.calories, 0),
      totalProteins: log.foodItems.reduce((s, i) => s + i.proteins, 0),
      totalCarbs: log.foodItems.reduce((s, i) => s + i.carbs, 0),
      totalFats: log.foodItems.reduce((s, i) => s + i.fats, 0),
    }));
    res.send(enriched);
  } catch (e) {
    console.error("Nutrition GET error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, foodItems, date, notes } = req.body;
    const updated = await Nutrition.findByIdAndUpdate(
      id,
      { mealType, foodItems, date: new Date(date), notes },
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Not found" });
    res.send(updated);
  } catch (e) {
    console.error("Nutrition post error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/nutrition/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Nutrition.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) {
    console.error("Nutrition DELETE error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= NOTIFICATIONS =========================
app.get("/notifications", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
    res.send(notifications);
  } catch (err) {
    console.error("GET /notifications error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/notifications", async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (!userId || !type || !message)
      return res.status(400).send({ message: "userId, type, and message required" });

    const notif = await Notification.create({ userId, type, message });
    res.status(201).send(notif);
  } catch (err) {
    console.error("POST /notifications error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notif) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Marked as read", notif });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Notification deleted" });
  } catch (err) {
    console.error("DELETE notification error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

// ========================= GOALS =========================
app.post("/goals", async (req, res) => {
  try {
    const { userId, goalType, target, current = 0, deadline, notes } = req.body;
    const newGoal = await goals_model.create({
      userId,
      goalType,
      target,
      current,
      deadline: new Date(deadline),
      notes,
    });
    res.status(201).send({ message: "Goal added", goal: newGoal });
  } catch (error) {
    console.error("Goal POST error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/goals", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const goals = await goals_model.find({ userId }).sort({ deadline: 1 }).lean();
    res.send(goals);
  } catch (error) {
    console.error("Goal GET error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { goalType, target, current, deadline, notes } = req.body;
    const updated = await goals_model.findByIdAndUpdate(
      id,
      { goalType, target, current, deadline: new Date(deadline), notes },
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Not found" });
    res.send(updated);
  } catch (error) {
    console.error("Goal post error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await goals_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (error) {
    console.error("Goal DELETE error:", error);
    res.status(500).send({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});