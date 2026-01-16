
class ClientService {
    async getTotalClients() {
        try {
            const res = await fetch(`/api/clients`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async getAllClients() {
        try {
            const res = await fetch(`/api/clients/all`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }
}

export default new ClientService()