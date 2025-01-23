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
  }
});

// New route to delete chat messages
chatRouter.delete("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    chat.messages = [];
    await chat.save();
    res.json({ message: "Messages cleared successfully" });
  } catch (err) {
    console.log("ERROR :-", err);
    res.status(500).json({ error: "Error clearing messages" });
  }
});

module.exports = chatRouter;
