import AxiosFacade from "./AxiosFacade";
import config from "../config";

function FeedApi() {

    const feedApi = AxiosFacade( config.feedApi + '/feed')


    return {
        getHomeFeed: async () => {
            return feedApi.GET('')
        },

        getUserFeed: async (userId) => {
            return feedApi.GET('/' + userId)
        },

        createPost: async (post) => {
            return feedApi.POST('/post', post)
        },


    }
}

export default FeedApi
