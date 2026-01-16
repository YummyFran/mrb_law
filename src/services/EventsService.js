
class EventsService {
    async getUpcomingEvents() {
        try {
            const res = await fetch(`/api/events/upcoming`, {
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

    async getWeekEvents() {
        try {
            const res = await fetch(`/api/events/weekly`, {
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

export default new EventsService()