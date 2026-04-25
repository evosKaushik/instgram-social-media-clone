import { connect, disconnect } from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
  try {
    await connect(ENV.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await disconnect();
  console.log("Client Disconnected!");
  process.exit(0);
});


export default connectDB;