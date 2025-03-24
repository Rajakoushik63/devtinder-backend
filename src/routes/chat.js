// const express = require("express");
// const { userAuth } = require("../middlewares/auth");
// const { Chat } = require("../models/Chat");

// const chatRouter = express.Router();

// chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
//   const { targetUserId } = req.params;
//   const userId = req.user._id;

//   try {
//     let chat = await Chat.findOne({
//       participants: { $all: [userId, targetUserId] },
//     }).populate({
//       path: "messages.senderId",
//       select: "firstName lastName photourl",
//     });
//     if (!chat) {
//       chat = new Chat({
//         participants: [userId, targetUserId],
//         messages: [],
//       });
//       await chat.save();
//     }
//     res.json(chat);
//   } catch (err) {
//     console.log("ERROR :-", err);
//   }
// });

// module.exports = chatRouter;


const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/Chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photourl",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log("ERROR :-", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE endpoint to delete a chat and its embedded messages
chatRouter.delete("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    await Chat.findOneAndDelete({
      participants: { $all: [userId, targetUserId] },
    });
    res
      .status(200)
      .json({ message: "Chat and associated messages deleted successfully" });
  } catch (err) {
    console.log("ERROR :-", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = chatRouter;
