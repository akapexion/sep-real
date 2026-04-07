const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cron = require('node-cron');

const connectDb = require("./config/connectDb");
const reg_model = require("./models/register");
const workout_model = require("./models/workout");
const progress_model = require("./models/progress");
const Notification = require("./models/notification");
const Nutrition = require("./models/nutrition");
const goals_model = require("./models/goals");
const Reminder = require("./models/reminder");
const Feedback_model = require("./models/feedback")

const jwt = require("jsonwebtoken");
const JWT_SECRET = "fallback_secret_key_12345";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
    if (err) return res.status(403).send({ message: "Invalid Token" });
    
    try {
      // Check if the user exists and is still active
      const dbUser = await reg_model.findById(decodedUser.userId);
      if (!dbUser) return res.status(404).send({ message: "User not found" });
      if (dbUser.isActive === false) return res.status(403).send({ message: "Account deactivated" });
      
      req.user = decodedUser;
      next();
    } catch (error) {
      return res.status(500).send({ message: "Server error during authentication" });
    }
  });
};

const app = express();

app.use(express.json());
app.use(cors());
connectDb();

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    console.log(`Checking reminders at ${currentTime}`);

    const users = await reg_model.find({
      $and: [
        { "preferences.notifications.push": true },
        {
          $or: [
            { "preferences.reminders.workout": currentTime },
            { "preferences.reminders.meal": currentTime }
          ]
        }
      ]
    });

    for (const user of users) {
      const isWorkout = user.preferences.reminders.workout === currentTime;

      const message = isWorkout
        ? "💪 Workout time! Let's get moving and crush those fitness goals!"
        : "🍎 Meal time! Fuel your body with healthy nutrition!";

      await Notification.create({
        userId: user._id,
        type: "reminder",
        message,
      });

      console.log(`Push notification sent to user: ${user.name}`);
    }

    // Process custom reminders from Reminder model
    const dueReminders = await Reminder.find({
      date: { $lte: now },
      notified: false,
      isActive: true
    });

    for (const reminder of dueReminders) {
      await Notification.create({
        userId: reminder.userId,
        type: reminder.category || "reminder",
        message: `⏰ Reminder: ${reminder.title}`,
      });

      reminder.notified = true;
      await reminder.save();
      console.log(`Custom reminder sent for: ${reminder.title}`);
    }

  } catch (error) {
    console.error("1-minute reminder cron error:", error);
  }
});

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

    const newUser = await reg_model.create({
      name,
      email,
      password: hashPassword,
      image: profilePic,
    });
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).send({ message: "User registered successfully", token, registeredUser: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: "Email already registered" });
    } else {
      console.log(error);
      res.status(500).send({ message: "Server error", error });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registeredUser = await reg_model.findOne({ email: email });
    if (registeredUser) {
      if (registeredUser.isActive === false) {
        return res.status(200).send({ message: "Account deactivated" });
      }
      const isMatch = await bcrypt.compare(password, registeredUser.password);
      if (isMatch) {
        const token = jwt.sign({ userId: registeredUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({ message: "Logged in", token, registeredUser });
      } else {
        res.status(200).send({ message: "Incorrect Password" });
      }
    } else {
      res.status(200).send({ message: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/workouts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { exerciseName, sets, reps, weights, notes, category, tags, date } = req.body;

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

    await Notification.create({
      userId,
      type: "activity",
      message: `Workout "${exerciseName}" added successfully.`,
    });

    res.status(201).send({ message: "Workout added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/workouts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const workouts = await workout_model.find({ userId }).sort({ date: -1 }).lean();
    res.send(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/workouts/:id", authenticateToken, async (req, res) => {
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

    res.send({ message: "Workout updated successfully", updated });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/workouts/:id", authenticateToken, async (req, res) => {
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
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/progress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date, weight, measurements, performance } = req.body;
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

    // Check for goal achievements
    const goals = await goals_model.find({ userId });

    for (const goal of goals) {
      if (goal.goalType === "weight" && weight) {
        if (weight <= goal.target) {
          await Notification.create({
            userId,
            type: "goal",
            message: `🎯 Congratulations! You achieved your weight goal of ${goal.target} kg. Current weight: ${weight} kg.`,
          });
        }
      }

      if (goal.goalType === "measurements" && measurements) {
        if (measurements.waist && measurements.waist <= goal.target) {
          await Notification.create({
            userId,
            type: "goal",
            message: `🎯 Congratulations! You achieved your waist measurement goal of ${goal.target} cm. Current: ${measurements.waist} cm.`,
          });
        }
      }
    }

    res.status(201).send({ message: "Progress added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/progress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const entries = await progress_model.find({ userId }).sort({ date: 1 }).lean();
    res.send(entries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/progress/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { weight, measurements, performance } = req.body;

    const updatedProgress = await progress_model.findByIdAndUpdate(
      id,
      { weight, measurements, performance },
      { new: true }
    );

    if (!updatedProgress) {
      return res.status(404).send({ message: "Progress not found" });
    }

    await Notification.create({
      userId,
      type: "reminder",
      message: `Progress updated on ${new Date().toLocaleDateString()}.`,
    });

    const goals = await goals_model.find({ userId });

    for (const goal of goals) {
      if (goal.goalType === "weight") {
        if (updatedProgress.weight <= goal.target) {
          await Notification.create({
            userId,
            type: "goal",
            message: `🎯 Congratulations! You achieved your weight goal of ${goal.target} kg.`,
          });
        }
      }
    }

    res.status(200).send({
      message: "Progress updated successfully",
      updatedProgress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/progress/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await progress_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/preferences", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select("preferences");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user.preferences);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/preferences", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notifications, units, theme, language, reminders } = req.body;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const updated = await reg_model.findByIdAndUpdate(
      userId,
      {
        preferences: {
          notifications: {
            push: notifications?.push ?? true
          },
          units: units || 'metric',
          theme: theme || 'dark',
          language: language || 'en',
          reminders: reminders || { workout: "07:00", meal: "12:00" }
        }
      },
      { new: true }
    ).select("preferences");

    if (!updated) return res.status(404).send({ message: "User not found" });
    res.send(updated.preferences);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });
    const user = await reg_model.findById(userId).select("name email image");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/profile", authenticateToken, upload.single("profilePic"), async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId)
    const { name, email } = req.body;
    const updateData = { name, email };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await reg_model.findByIdAndUpdate(userId, updateData, {
      new: true
    }).select("name email image");

    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const user = await reg_model.findByIdAndDelete(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    await workout_model.deleteMany({ userId });
    await progress_model.deleteMany({ userId });
    await Nutrition.deleteMany({ userId });
    await reg_model.deleteMany({ userId });

    res.send({ message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/nutrition", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mealType, foodItems, date, notes } = req.body;
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
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/nutrition", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
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
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/nutrition/:id", authenticateToken, async (req, res) => {
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
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/nutrition/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Nutrition.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/notifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const notifications = await Notification.find({ userId }).sort({ date: -1 }).lean();
    res.send(notifications);
  } catch (err) {
    console.error("GET /notifications error:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

app.post("/notifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, message } = req.body;
    if (!userId || !type || !message)
      return res.status(400).send({ message: "userId, type, and message required" });

    const notif = new Notification({ userId, type, message });
    await notif.save();
    res.status(201).send(notif);
  } catch (err) {
    console.error("POST /notifications error:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

app.post("/notifications/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notif) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Marked as read", notif });
  } catch (err) {
    console.error("POST /notifications/:id error:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

app.delete("/notifications/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Notification not found" });
    res.send({ message: "Notification deleted" });
  } catch (err) {
    console.error("DELETE /notifications/:id error:", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

app.post("/goals", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { goalType, target, current, deadline, notes } = req.body;
    const newGoal = new goals_model({
      userId,
      goalType,
      target,
      current,
      deadline: new Date(deadline),
      notes,
    });
    await newGoal.save();
    res.status(201).send({ message: "Goal added", goal: newGoal });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/goals", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const goals = await goals_model.find({ userId }).sort({ deadline: 1 }).lean();
    res.send(goals);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/goals/:id", authenticateToken, async (req, res) => {
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
    res.status(500).send({ message: "Server error" });
  }
});

app.delete("/goals/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await goals_model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });
    res.send({ message: "Deleted" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/reminders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, date, type, category, priority, notes } = req.body;
    if (!userId || !title || !date) return res.status(400).send({ message: "Missing fields" });

    const reminder = await Reminder.create({
      userId,
      title,
      date: new Date(date),
      type,
      category: category || 'reminder',
      priority: category === 'alert' ? (priority || 'medium') : 'none',
      notes,
    });

    await Notification.create({
      userId,
      type: category || 'reminder',
      message: `${category === 'alert' ? '🚨 Alert' : '⏰ Reminder'} set: ${title} on ${new Date(date).toLocaleString()}`,
    });

    res.status(201).send({ message: `${category === 'alert' ? 'Alert' : 'Reminder'} created`, reminder });
  } catch (e) {
    console.error("POST /reminders error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/reminders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const list = await Reminder.find({ userId }).sort({ date: -1 }).lean();
    res.send(list);
  } catch (e) {
    console.error("GET /reminders error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/reminders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, type, category, priority, notes, isActive } = req.body;

    const updateData = {
      title,
      date: new Date(date),
      type,
      notes,
      isActive
    };

    if (category) {
      updateData.category = category;
      updateData.priority = category === 'alert' ? (priority || 'medium') : 'none';
    }

    const updated = await Reminder.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: updated.userId,
      type: updated.category,
      message: `${updated.category === 'alert' ? 'Alert' : 'Reminder'} updated: ${title}`,
    });

    res.send(updated);
  } catch (e) {
    console.error("POST /reminders/:id error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.patch('/reminders/:id', async (req, res) => {
  try {
    const { isActive } = req.body;
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!reminder) return res.status(404).send({ message: "Reminder not found" });
    res.json(reminder);
  } catch (error) {
    console.error("PATCH /reminders/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/reminders/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reminder.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Not found" });

    await Notification.create({
      userId: deleted.userId,
      type: deleted.category,
      message: `${deleted.category === 'alert' ? 'Alert' : 'Reminder'} removed: ${deleted.title}`,
    });

    res.send({ message: "Deleted" });
  } catch (e) {
    console.error("DELETE /reminders/:id error:", e);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/feedback", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, message, rating } = req.body;

    console.log("Received body:", req.body); // <-- IMPORTANT

    const newGoal = new Feedback_model({
      userId,
      name,
      email,
      message,
      rating
    });

    await newGoal.save();  // <-- FIXED

    res.status(201).send({ message: "Feedback added", goal: newGoal });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/feedback", authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback_model.find().sort({ createdAt: -1 }); // latest first
    res.status(200).send({ feedback });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});


// =========== NEW SOCIAL & SEARCH ENDPOINTS ===========

app.get("/users", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const users = await reg_model.find({ _id: { $ne: userId } })
      .select("name email image followers following")
      .lean();

    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.post("/users/:id/follow", authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userId = req.user.userId;

    const targetUser = await reg_model.findById(targetUserId);
    const currentUser = await reg_model.findById(userId);

    if (!targetUser || !currentUser) return res.status(404).send({ message: "User not found" });

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(userId);
      await currentUser.save();
      await targetUser.save();
      res.send({ message: "Unfollowed successfully", isFollowing: false });
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(userId);
      await currentUser.save();
      await targetUser.save();

      await Notification.create({
        userId: targetUserId,
        type: "alert",
        message: `${currentUser.name} started following you!`,
      });

      res.send({ message: "Followed successfully", isFollowing: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/feed", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).send({ message: "userId required" });

    const user = await reg_model.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const followingIds = user.following;

    if (!followingIds || followingIds.length === 0) return res.send([]);

    const workouts = await workout_model.find({ userId: { $in: followingIds } })
      .sort({ date: -1 }).limit(20).populate('userId', 'name image');

    const nutrition = await Nutrition.find({ userId: { $in: followingIds } })
      .sort({ date: -1 }).limit(20).populate('userId', 'name image');

    const goals = await goals_model.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 }).limit(20).populate('userId', 'name image');

    let feed = [];

    workouts.forEach(w => {
      feed.push({
        _id: w._id,
        type: 'workout',
        user: w.userId,
        date: w.date,
        content: `Completed a ${w.category} workout: ${w.exerciseName} (${w.sets} sets x ${w.reps} reps).`,
      });
    });

    nutrition.forEach(n => {
      feed.push({
        _id: n._id,
        type: 'nutrition',
        user: n.userId,
        date: n.date,
        content: `Logged ${n.mealType}: ${n.foodItems.map(i => i.name).join(', ')}.`,
      });
    });

    goals.forEach(g => {
      if (g.createdAt) {
        feed.push({
          _id: g._id,
          type: 'goal',
          user: g.userId,
          date: g.createdAt,
          content: `Set a new goal for ${g.goalType}: ${g.target}.`,
        });
      }
    });

    feed.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.send(feed.slice(0, 30));
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.get("/search", authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.send({ workouts: [], nutrition: [], users: [] });

    const regex = new RegExp(q, 'i');

    const workouts = await workout_model.find({
      $or: [{ exerciseName: regex }, { category: regex }, { tags: regex }, { notes: regex }]
    }).limit(20).populate('userId', 'name image');

    const nutrition = await Nutrition.find({
      $or: [{ mealType: regex }, { 'foodItems.name': regex }, { notes: regex }]
    }).limit(20).populate('userId', 'name image');

    const users = await reg_model.find({
      $or: [{ name: regex }, { email: regex }]
    }).select("name email image followers following").limit(20);

    res.send({ workouts, nutrition, users });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

const PORT = 3000;
app.post("/profile/weight", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentWeight } = req.body;
    if (!userId || currentWeight === undefined) return res.status(400).send({ message: "userId and currentWeight required" });

    // reg_model usage since register models map to reg_model globally here
    const updatedUser = await reg_model.findByIdAndUpdate(userId, { currentWeight }, { new: true });
    if (!updatedUser) return res.status(404).send({ message: "User not found" });

    res.send({ message: "Weight updated successfully", currentWeight: updatedUser.currentWeight });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

// Admin routes
app.get("/admin/users", authenticateToken, async (req, res) => {
  try {
    const user = await reg_model.findById(req.user.userId);
    if (!user || user.role !== "admin") return res.status(403).send({ message: "Forbidden" });
    const users = await reg_model.find().select("-password");
    res.send(users);
  } catch (error) {
    console.error("DEBUG 500:", error);
    res.status(500).send({ message: "Server Error: " + error.message });
  }
});

app.patch("/admin/users/:id/status", authenticateToken, async (req, res) => {
  try {
    const user = await reg_model.findById(req.user.userId);
    if (!user || user.role !== "admin") return res.status(403).send({ message: "Forbidden" });

    const { isActive } = req.body;
    const updatedUser = await reg_model.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));