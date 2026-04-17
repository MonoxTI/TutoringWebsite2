import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not set in environment");

    mongoose.connection.on("connected", () => console.log("MongoDB connected"));
    mongoose.connection.on("error", (err) => console.error(`MongoDB error: ${err}`));
    mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));

    await mongoose.connect(mongoUri, {
      dbName: "MERN",
      autoIndex: process.env.NODE_ENV !== "production", // disable in prod
      maxPoolSize: 10,
    });

    console.log("MongoDB connection established");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.stack);
    process.exit(1);
  }
};

export default connectDB;
