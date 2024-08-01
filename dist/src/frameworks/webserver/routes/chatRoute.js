"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = __importDefault(require("../../../adapters/chatController"));
const chatDbRepository_1 = __importDefault(require("../../../app/interfaces/chatDbRepository"));
const chatRepositoryMongoDb_1 = require("../../database/mongodb/repositories/chatRepositoryMongoDb");
const chatRoute = () => {
    const router = (0, express_1.Router)();
    const _chatController = (0, chatController_1.default)(chatDbRepository_1.default, chatRepositoryMongoDb_1.chatRepositoryMongodb);
    router.post("/conversations", _chatController.createNewChat);
    router.get("/conversations/:senderId", _chatController.fetchChats);
    router.post("/messages", _chatController.createNewMessage);
    router.get("/messages/:conversationId", _chatController.fetchMessages);
    // router.post("/getUserNotifications",  _chatController.getNotification);
    router.post("/getUserNotifications", _chatController.getNotification);
    router.post("/clearNotification", _chatController.clearNotifications);
    return router;
};
exports.default = chatRoute;
