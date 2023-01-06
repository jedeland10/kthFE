
import AxiosFacade from "./AxiosFacade";
import config from "../config";

const userCache = []

function UserApi() {
    const userApi = AxiosFacade(config.userApi + '/users')


    return {

        getUser: async (userId) => {

            let user = userCache.find(u => u.id === userId)

            if (user) {
                console.log('CACHE USED!!!!!')
                return user
            }
            return userApi.GET('/' + userId)
                .then(u => {
                    if (u) {
                        userCache.push(u)
                    }
                    return u
                })
        },

        searchUsers: async (searchString) => {
            return userApi.GET('/search/' + searchString)
        },

        getFriends: async () => {
            return userApi.GET('/friends')
        },

        getFriendRequests: async () => {
            return userApi.GET('/friends/requests')
        },

        createUser: async (user) => {
            return userApi.POST('/create', user)
        },

        addFriend: async (friend) => {
            return userApi.POST('/friends', friend)
        },

        removeFriend: async (friend) => {
            return userApi.POST('/friends/remove', friend)
        },

        acceptFriendRequest: async (friend) => {
            return userApi.POST('/friends/accept', friend)
        },

        denyFriendRequest: async (friend) => {
            return userApi.POST('/friends/deny', friend)
        },

    }

}

export default UserApi
