import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import { Profile, User } from '@prisma/client';
import { useAccount } from 'wagmi';

type Props = {
  children: ReactNode
}

export interface AccountContextInterface {
  user: User | undefined
  setUser: Function
  profile: Profile | undefined
  setProfile: Function
  loading: boolean
  setLoading: Function
  getUser: Function
  isCompany: boolean
}
export const AccountContext = React.createContext<AccountContextInterface>({} as AccountContextInterface);

export const AccountProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const [profile, setProfile] = useState<Profile>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isCompany, setIsCompany] = useState<boolean>(false)

  const getUser = async () => {
    setLoading(true)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/getUser', address, config)
      .then(response => {
        resolve(response)
        if(!response.data.user) {
          setLoading(false)
          router.replace('/create')
        } else {
          if(response.data) setUser(response.data.user)
          if(response.status === 200) getProfile(response.data.user, response.data.isCompany)
          if(response.data.isCompany) setIsCompany(true)
        }
      })
      .catch(e => {
        reject(e)
        setLoading(false)
        throw new Error(e)
      })
    })
  }

  const getProfile = async (user: User, isCompany: boolean) => {
    setLoading(true)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const data = {
      userId: user.id,
      isCompany: isCompany,
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/getProfile', data, config)
      .then(response => {
        resolve(response)
        if(response.data) setProfile(response.data.profile)
        if(response.status === 200) setLoading(false)
        // if(!response.data.profile) router.replace('/create')
      })
      .catch(e => {
        reject(e)
        setLoading(false)
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
        profile,
        setProfile,
        loading,
        setLoading,
        getUser,
        isCompany,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
