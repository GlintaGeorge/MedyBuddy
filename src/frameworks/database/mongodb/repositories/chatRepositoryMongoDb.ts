import { clearNotification } from './../../../../app/use-cases/chat/read';
import { newMessageInterface } from "../../../../types/chat";
import Conversation from "../../models/conversations";
import Message from "../../models/messages";

export const chatRepositoryMongodb = () => {
     
    const isChatExists = async (senderId: string, recieverId: string) =>
        await Conversation.findOne({ members: { $all: [senderId, recieverId] } });

    const addNewChat = async (members: string[]) => {
        return await Conversation.create({ members });
      };
    
    const getConversationById = async (id: string) =>
        await Conversation.findById(id);  

    const getChatsByMembers = async (id: string) =>
        await Conversation.find({ members: { $in: [id] } });

    const addNewMessage = async (newMessageData: newMessageInterface) =>
        await Message.create(newMessageData);

    const messages = async (filter: Record<string, any>) =>
        await Message.find(filter);
    
    const paginatedMessages = async (conversationId:string) =>
        await Message.find({conversationId:conversationId})

    const notification = async(userId:string) => 
        await Message.find({
            receiver: userId,
            notificationSeen: false,
          }).sort({
            createdAt: -1,
          });

          const clearNotification = async(userId:string) => 
          await Message.updateMany(
            { receiver: userId },
            { $set: { notificationSeen: true } }
          );


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

      }
};

export type ChatRepositoryMongodbType = typeof chatRepositoryMongodb;