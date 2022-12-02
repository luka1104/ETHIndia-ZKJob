import { NextPage } from 'next'
import { Input, Box, Center, Flex, Text, Radio, RadioGroup, Stack, Textarea, Button } from '@chakra-ui/react'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useAccount } from 'wagmi';
import { AccountContext } from 'contexts/accountContext';

const create: NextPage = () => {
  const { address } = useAccount();
  const { setUser, setLoading } = useContext(AccountContext)
  const [nickname, setNickname] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [value, setValue] = useState<string>('1')

  const handleSubmit = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const data = {
      address: address,
      nickname: nickname,
      isCompany: value === '1' ? false : true,
      description: description
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/postUser', data, config)
      .then(response => {
        resolve(response)
        if(response.data) setUser(response.data.user)
        if(response.status === 200) setLoading(false)
        console.log(response);
      })
      .catch(e => {
        reject(e)
        throw new Error(e)
      })
    })
  }
  return (
    <>
      <Center mt='20px'>
        <Box w='60%'>
          <Center fontSize='3xl' fontWeight='bold'>
            Create Your Account
          </Center>
          <Flex alignItems={'center'} gap={2} mt='40px'>
            <Text fontSize='18px' fontWeight='semibold'>
              Nickname:
            </Text>
            <Input onChange={(e) => {setNickname(e.target.value)}} value={nickname} type='text' />
          </Flex>
          <Flex alignItems={'center'} gap={2} mt='40px'>
            <Text fontSize='18px' fontWeight='semibold'>
              Attribute:
            </Text>
            <RadioGroup onChange={setValue} value={value}>
              <Stack direction='row'>
                <Radio value='1'>Employee</Radio>
                <Radio value='2'>Company</Radio>
              </Stack>
            </RadioGroup>
          </Flex>
          <Flex alignItems={'center'} gap={2} mt='40px'>
            <Text fontSize='18px' fontWeight='semibold'>
              Description:
            </Text>
            <Textarea onChange={(e) => {setDescription(e.target.value)}} value={description} />
          </Flex>
          <Center mt='40px'>
            <Button w='40%' colorScheme='orange' onClick={handleSubmit}>
              Create
            </Button>
          </Center>
        </Box>
      </Center>
    </>
  )
}

export default create
