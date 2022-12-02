import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import { User } from '@prisma/client';
import { useAccount } from 'wagmi';

type Props = {
  children: ReactNode
}

export interface AccountContextInterface {
  user: User | undefined
  setUser: Function
  loading: boolean
  setLoading: Function
  getUser: Function
}
export const AccountContext = React.createContext<AccountContextInterface>({} as AccountContextInterface);

export const AccountProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState<boolean>(false)

  const getUser = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/getUser', address, config)
      .then(response => {
        resolve(response)
        if(response.data) setUser(response.data.user)
        if(response.status === 200) setLoading(false)
        if(!response.data.user) router.replace('/create')
      })
      .catch(e => {
        reject(e)
        throw new Error(e)
      })
    })
  }

  useEffect(() => {
    if(!address) return
    getUser()
  }, [address])

  return (
    <AccountContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        getUser,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
