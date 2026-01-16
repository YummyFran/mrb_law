"use client"

import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ClientCases from '../../components/client/ClientCases'
import AttorneyCases from '../../components/attorney/AttorneyCases'

const page = () => {
  const { user } = useAuth()

  return (
    <div>
        {user?.userType == "client" ? <ClientCases /> : <AttorneyCases />}
    </div>
  )
}

export default page