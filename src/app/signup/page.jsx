"use client"

import { useAuth } from '../../contexts/AuthContext'
import AuthService from '../../services/AuthService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        birthDate: "",
        phone: "",
        userType: "client"
    })
    const [isLoading, setIsLoading] = useState(false)
    const [err, setError] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        birthDate: "",
        phone: "",
        server: ""
    })
    const router = useRouter()
    const { refetch } = useAuth()

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const validate = () => {
        const errors = {
            name: "",
            email: "",
            password: "",
            gender: "",
            birthDate: "",
            phone: "",
            server: "",
        };

        if (!formData.name.trim()) {
            errors.name = "Name is required";
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

        if (!formData.gender) {
            errors.gender = "Gender is required";
        }

        if (!formData.birthDate) {
            errors.birthDate = "Birth date is required";
        }

        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        }

        const hasErrors = Object.values(errors).some(Boolean);
        return { hasErrors, errors };
    };

    const handleSubmit = async e => {
        e.preventDefault()

        setIsLoading(true)
        setError({
            name: "",
            email: "",
            password: "",
            gender: "",
            birthDate: "",
            phone: "",
            server: "",
        });

        const { hasErrors, errors } = validate();

        if (hasErrors) {
            setError(errors);
            setIsLoading(false);
            return;
        }

        const [data, err] = await AuthService.signup({
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            userType: formData.userType == "staff" ? "attorney" : formData.userType
        })

        if (!data?.success || err) {
            setError(prev => ({
                ...prev,
                server: data?.message || apiError?.message || "Signup failed",
            }));
            setIsLoading(false)

            return
        }

        await refetch()
        router.push('/')
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
                    <h1 className='text-3xl font-bold'>Sign Up</h1>
                </div>
                <form className='flex flex-col w-100 gap-2' onSubmit={handleSubmit}>
                    <label htmlFor="name" className={`font-semibold ${err.name ? 'text-red-500' : ''}`}>{err.name ? err.name : "Name"}</label>
                    <input type="text" name="name" id="name" placeholder='Enter name' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />
                    <label htmlFor="email" className={`font-semibold ${err.email ? 'text-red-500' : ''}`}>{err.email ? err.email : "Email"}</label>
                    <input type="email" name="email" id="email" placeholder='Enter email' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />
                    <label htmlFor="password" className={`font-semibold ${err.password ? 'text-red-500' : ''}`}>{err.password ? err.password : "Password"}</label>
                    <input type="password" name='password' id='password' placeholder='Enter Passoword' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />
                    <div className='flex gap-4'>
                        <div className='flex-1 flex flex-col gap-2'>
                            <label htmlFor="gender" className={`font-semibold ${err.gender ? 'text-red-500' : ''}`}>{err.gender ? err.gender : "Geder"}</label>
                            <select name="gender" id='gender' className="appearance-none bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4" required onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-2'>
                            <label htmlFor="birth-date" className={`font-semibold ${err.birthDate ? 'text-red-500' : ''}`}>{err.birthDate ? err.birthDate : "Date of Birth"}</label>
                            <input type="date" id='birth-date' name="birthDate" className="bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4" required onChange={handleChange} />
                        </div>
                    </div>

                    <label htmlFor="phone" className={`font-semibold ${err.phone ? 'text-red-500' : ''}`}>{err.phone ? err.phone : "Phone number"}</label>
                    <input type="number" name='phone' id='phone' placeholder='Enter Phone Number' className='bg-gray-200 px-5 py-3 rounded-full focus:bg-white focus:outline-blue-200 focus:outline-4' onChange={handleChange} />

                    <label className='font-semibold'>User Type</label>
                    <div className="flex justify-between gap-4">
                        <div className='flex-1 flex'>
                            <input type="radio" className="peer hidden" name="userType" id="ut1" value='client' checked={formData.userType === 'client'} onChange={handleChange} />
                            <label className="bg-gray-200 peer-checked:bg-gray-400 peer-checked:font-semibold p-2 text-center rounded-full w-full" htmlFor="ut1">Client</label>
                        </div>
                        <div className='flex-1 flex'>
                            <input type="radio" className="peer hidden" name="userType" id="ut2" value='attorney' checked={formData.userType === 'attorney'} onChange={handleChange} />
                            <label className="bg-gray-200 peer-checked:bg-gray-400 peer-checked:font-semibold p-2 text-center rounded-full w-full" htmlFor="ut2">Attorney</label>
                        </div>
                        <div className='flex-1 flex'>
                            <input type="radio" className="peer hidden" name="userType" id="ut3" value='staff' checked={formData.userType === 'staff'} onChange={handleChange} />
                            <label className="bg-gray-200 peer-checked:bg-gray-400 peer-checked:font-semibold p-2 text-center rounded-full w-full" htmlFor="ut3">Staff</label>
                        </div>
                    </div>
                    {err.server && <div className='text-red-500 text-sm text-center py-0 my-0'>{err.server}</div>}
                    <button type="submit" className='py-3 rounded-full btn-gradient text-white font-semibold cursor-pointer hover:brightness-95' disabled={isLoading}>{isLoading ? "Signing up" : "Sign up"}</button>
                </form>
                <Link href={'/signin'} className='text-sm text-gray-500 hover:underline'>Already have an account? Sign in</Link>
            </div>
        </div>
    )
}

export default page