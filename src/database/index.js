import mongoose from "mongoose";

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `SuccessFully connected to mongoDB with ${connection.connection.host}`
    );
  } catch (error) {
    console.error("The Error", error.message);
  }
};
export default connect;
