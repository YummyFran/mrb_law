"use client"

import AuthService from "../services/AuthService";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext({
    user: null,
    isLoading: true,
    error: null,
    refetch: async () => {}
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const refetch = async () => {
        const [data, err] = await AuthService.me()

        if(err) {
            setError(err)
            setUser(null)
        } else {
            setUser(data.user)
            setError(null)
        }
    }

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
            try {
        
                if (!isMounted) return;
        
                await refetch()
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || "Something went wrong");
                setUser(null);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        
        fetchData();
    
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, error, refetch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)