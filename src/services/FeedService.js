function FeedService() {
    let instance = {
        url: 'http://localhost:8082/feed'
    }

    return {
        fetchFeed: async function(token) {
            const response = await fetch(instance.url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            return await response.json()
        }
    }
}

export default FeedService
