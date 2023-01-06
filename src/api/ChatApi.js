import AxiosFacade from "./AxiosFacade";
import config from "../config";


function ChatApi() {

    const chatApi = AxiosFacade( config.chatApi + '/chat')


    return {
        getChatsForUser: async (userId) => {
            return chatApi.GET('/all/' + userId)
        },

        getChat: async (chatId) => {
            return chatApi.GET('/' + chatId)
        },

        postChatMessage: async (message) => {
            return chatApi.POST('', message)
        },

        postNewChatMessage: async (message) => {
            return chatApi.POST('/new', message)
        },
    }
}

export default ChatApi
