"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepositoryMongodb = void 0;
const conversations_1 = __importDefault(require("../../models/conversations"));
const messages_1 = __importDefault(require("../../models/messages"));
const chatRepositoryMongodb = () => {
    const isChatExists = (senderId, recieverId) => __awaiter(void 0, void 0, void 0, function* () { return yield conversations_1.default.findOne({ members: { $all: [senderId, recieverId] } }); });
    const addNewChat = (members) => __awaiter(void 0, void 0, void 0, function* () {
        return yield conversations_1.default.create({ members });
    });
    const getConversationById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield conversations_1.default.findById(id); });
    const getChatsByMembers = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield conversations_1.default.find({ members: { $in: [id] } }); });
    const addNewMessage = (newMessageData) => __awaiter(void 0, void 0, void 0, function* () { return yield messages_1.default.create(newMessageData); });
    const messages = (filter) => __awaiter(void 0, void 0, void 0, function* () { return yield messages_1.default.find(filter); });
    const paginatedMessages = (conversationId) => __awaiter(void 0, void 0, void 0, function* () { return yield messages_1.default.find({ conversationId: conversationId }); });
    const notification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield messages_1.default.find({
            receiver: userId,
            notificationSeen: false,
        }).sort({
            createdAt: -1,
        });
    });
    const clearNotification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield messages_1.default.updateMany({ receiver: userId }, { $set: { notificationSeen: true } });
    });
    return {
        isChatExists,
        addNewChat,
        getConversationById,
        getChatsByMembers,
        addNewMessage,
        messages,
        paginatedMessages,
        notification,
        clearNotification,
    };
};
exports.chatRepositoryMongodb = chatRepositoryMongodb;
