

class CasesService {
    async getClientActiveCase() {
        try {
            const res = await fetch(`/api/cases/client/active`, {
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

    async getAttorneytActiveCase() {
        try {
            const res = await fetch(`/api/cases/attorney/active`, {
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

    async getAllAttorneyCases() {
        try {
            const res = await fetch(`/api/cases/attorney/all`, {
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

    async createCase({
        title,
        summary,
        practice_area,
        court,
        client_id,
    }) {
        try {
            const res = await fetch(`/api/cases`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    summary,
                    practice_area,
                    court,
                    client_id,
                })
            })
            const data = await res.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }
}

export default new CasesService()