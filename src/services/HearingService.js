

class HearingService {
    async getHearing() {
        try {
            const res = await fetch(`/api/hearings`, {
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

    async createHearing({
        case_id,
        title,
        description,
        hearing_type,
        hearing_date,
        location,
    }) {
        try {
            const res = await fetch(`/api/hearings`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    case_id,
                    title,
                    description,
                    hearing_type,
                    hearing_date,
                    location,
                })
            })
            const data = await res.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async getHearingById(id) {
        try {
            const res = await fetch(`/api/hearings/${id}`, {
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

    async updateHearing({ id, title, description, status }) {
        try {
            const res = await fetch(`/api/hearings/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ title, description, status })
            })
            const data = await res.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async deleteHearing(id) {
        try {
            const res = await fetch(`/api/hearings/${id}`, {
                method: 'DELETE',
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

export default new HearingService()