import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // if (!newMessage) {
    //   res.status(200).json({ error: "Message Error" });
    // }
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({ message, receiverId, senderId });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([newMessage.save(), conversation.save()]);
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error In Message", error.message);
    res.status(400).json({ error: "Error In msg" });
  }
};

//This is For getting all messages
const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error In Message get", error.message);
    res.status(400).json({ error: "Error In msg get" });
  }
};
export { sendMessage, getMessage };
