

class AuthService {
    async login(email, password) {
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async signup({ name, email, password, gender, birthDate, phone, userType }) {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, gender, birthDate, phone, userType }),
            });

            const data = await res.json();

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async me() {
        try {
            const req = await fetch("/api/auth/me")
            const data = await req.json()

            return [data, null]
        } catch (error) {
            console.log(error.message)
            return [null, error]
        }
    }

    async logout() {
        try {
            const res = await fetch("/api/auth/logout", {
              method: "POST",
            });
            const data = await res.json()
            
            return [data, null]
        } catch(error) {
            console.log(error.message)
            return [null, error]
        }
      }
}

export default new AuthService()