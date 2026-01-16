"use client"

import Link from 'next/link'
import AuthService from '../../services/AuthService'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

const page = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [err, setError] = useState({
        email: "",
        password: "",
        server: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { refetch } = useAuth()

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const validate = () => {
        const errors = {
            email: "",
            password: "",
            server: ""
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "Invalid email address";
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        const hasErrors = Object.values(errors).some(Boolean);
        return { hasErrors, errors };
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        setError({
            email: "",
            password: "",
            server: ""
        })

        const { hasErrors, errors } = validate()

        if (hasErrors) {
            setError(errors);
            setIsLoading(false);
            return;
        }

        const [data, err] = await AuthService.login(formData.email.trim().toLowerCase(), formData.password);

        if (!data?.success || err) {
            setError(prev => ({
                ...prev,
                server: data?.message || err?.message || "Signin failed",
            }));
            setIsLoading(false)

            return
        }

        await refetch()
        router.push('/')
        router.refresh()
    }
    return (
        <div className='flex h-screen'>
            <div className='flex-1 bg-black flex justify-center items-center'>
                <div className="text-white flex flex-col gap-2">
                    <h1 className='text-[4rem]/[3.5rem] font-black l'>MRB<br />LAW FIRM</h1>
                    <p>Sign in to access your documents</p>
                </div>
            </div>
            <div className='flex-1 flex flex-col items-center justify-center gap-4'>
                <div className='text-center flex flex-col gap-2'>
                    <h1 className='text-3xl font-bold'>Sign In</h1>
                    <p className='text-gray-500'>Enter your credentials to continue</p>
                </div>
                <form className='flex flex-col w-100 gap-2' onSubmit={handleSubmit}>
                    <label htmlFor="email" className={`font-semibold ${err.email ? "text-red-500" : ""}`}>{err.email ? err.email : "Email"}</label>
                    <input type="email" name="email" id="email" placeholder='Enter email' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />
                    <label htmlFor="password" className={`font-semibold ${err.password ? "text-red-500" : ""}`}>{err.password ? err.password : "Password"}</label>
                    <input type="password" name='password' id='password' placeholder='Enter Passoword' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />
                    {err.server && <div className='text-red-500 text-sm text-center py-0 my-0'>{err.server}</div>}
                    <button type="submit" className='py-3 rounded-full btn-gradient text-white font-semibold mt-4 cursor-pointer hover:brightness-95'>Sign In</button>
                </form>
                <Link href={'/signup'} className='text-sm text-gray-500 hover:underline'>Create Account</Link>
                <Link href={'/forgot-password'} className='text-sm text-gray-500 hover:underline'>Forgot Password?</Link>
            </div>
        </div>
    )
}

export default page