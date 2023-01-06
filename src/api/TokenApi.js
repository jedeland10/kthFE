import axios from "axios";
import config from "../config";

function TokenApi() {
    const baseUrl = config.userApi

    function getApi(token) {
        return axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': '*/*'
            }
        });
    }

    return {

        getToken: async (user) => {
            try {
                const response = await getApi(null).post('/authenticate', user)
                console.log(response)
                return response.data
            } catch (e) {
                console.log(e)
                return null
            }
        },

    }

}

export default TokenApi
