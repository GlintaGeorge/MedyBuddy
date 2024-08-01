import { clearNotification } from './../app/use-cases/chat/read';
import { Request, Response, NextFunction } from "express";
import { ChatDbRepositoryInterace } from "../app/interfaces/chatDbRepository";
import { ChatRepositoryMongodbType } from "../frameworks/database/mongodb/repositories/chatRepositoryMongoDb";
import { HttpStatus } from "../types/httpStatus";
import { get } from "mongoose";
import { addNewChat, newMessage } from "../app/use-cases/chat/add";
import { getChats, getMessages, notification, } from "../app/use-cases/chat/read";

const chatController = (
    chatDbRepository: ChatDbRepositoryInterace,
    chatDbRepositoryImpl: ChatRepositoryMongodbType
) => {
    const chatRepository = chatDbRepository(chatDbRepositoryImpl());

    /*
    * METHOD:POST
    * create new chats with two users
    */
    const createNewChat = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { senderId, recieverId } = req.body;

            const chats = await addNewChat(senderId, recieverId, chatRepository);
            res.status(HttpStatus.OK).json({ success: true, chats });
        } catch (error) {
            next(error);
        }
    };

    /*
    * METHOD:GET
    * Retrieve all the conversations/chats between the users
    */
    const fetchChats = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { senderId } = req.params;
            const chats = await getChats(senderId, chatRepository);
            res.status(HttpStatus.OK).json(chats);
        } catch (error) {
            next(error);
        }
    };

    /*
    * METHOD:POST
    * create new send messages to the users
    */
    const createNewMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const message = await newMessage(req.body, chatRepository);
            res.status(HttpStatus.OK).json(message);
        } catch (error) {
            next(error);
        }
    };

    /*
    * METHOD:GET
    * Retrieve all messages from the users
    */
    const fetchMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { conversationId } = req.params;

            const messages = await getMessages(
                conversationId,
                chatRepository
            );
            res
                .status(HttpStatus.OK)
                .json({ success: true, messages });
        } catch (error) {
            next(error);
        }
    };

    const getNotification = async (req: Request, res: Response) => {
     
      const { senderId, recieverId } = req.body;

      const {userId}=req.params;
        try {
            const Notification = await notification(
                userId,
                chatRepository
            );


            if (Notification) {
                res.status(200).json(Notification);
            } else {
                res.status(404).json({ message: "No message found for the given room" });
            }
        } catch (error) {
            console.log(error);
            console.log("Internal Server Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    const clearNotifications = async (req: Request, res: Response) => {
        const {userId} = req.params;
        try {
            const NotificationSeen = await clearNotification(
                userId,
                chatRepository
            );
            if (NotificationSeen) {
                res.status(200).json(NotificationSeen);
            } else {
                res
                    .status(404)
                    .json({ message: "No messages found for the given room." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    return {
        createNewChat,
        fetchChats,
        createNewMessage,
        fetchMessages,
        getNotification,
        clearNotifications,
    }
};

export default chatController;
