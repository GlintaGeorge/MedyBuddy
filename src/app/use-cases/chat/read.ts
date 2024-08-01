import { ChatDbRepositoryInterace } from "../../interfaces/chatDbRepository";

export const getChats = async (
  senderId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => await chatRepository.getAllConversations(senderId);


export const getMessages = async (
    conversationID: string,
    chatRepository: ReturnType<ChatDbRepositoryInterace>
  ) =>
    await chatRepository.getPaginatedMessage(
        conversationID
    );

    export const notification = async (
      userId: string,
      chatRepository: ReturnType<ChatDbRepositoryInterace>
    ) =>
      await chatRepository.notification(
        userId
      );

      export const clearNotification = async (
        userId: string,
        chatRepository: ReturnType<ChatDbRepositoryInterace>
      ) =>
        await chatRepository.clearNotification(
          userId
        );
  
//   export const getLatestMessages = async (
//     recieverId: string,
//     chatRepository: ReturnType<ChatDbRepositoryInterace>,
//     conversationID?: string
//   ) => {
//     const filter: Record<string, any> = {
//       senderId: recieverId,
//       isRead: false,
//     };
//     conversationID && (filter.conversationId = conversationID);
//     const messages = await chatRepository.getLatestMessage(filter);
//     return messages;
//   };conversationId: string, conversationID: string