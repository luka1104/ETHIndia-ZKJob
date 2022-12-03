import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import ethers, { providers } from 'ethers';
//@ts-ignore
import lighthouse from '@lighthouse-web3/sdk';
import { NextPage } from "next";
import {
  Box,
  Center,
  Text,
  Input,
  Flex,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { AccountContext } from "contexts/accountContext";
import { BsFillCloudUploadFill } from 'react-icons/bs'

const Mypage: NextPage = () => {
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const [videoPath, setVideoPath] = useState<string>('')
  const [imagePath, setImagePath] = useState<string>('')
  const { setLoading } = useContext(AccountContext)

  const sign_message = async () => {
    (window as any).ethereum.request({ method: "eth_requestAccounts" }).then((res: any) => {
      console.log("Account Connected: " + res[0]);
    });
    const provider = new providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress(); //users public key
    const messageRequested = (await axios.get(`https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`)).data; //Get message
    const signedMessage = await signer.signMessage(messageRequested); //Sign message
    return({
      signedMessage: signedMessage,
      address: address
    });
  }

  const deploy = async(e: any) => {
    setLoading(true)
    console.log(e);
    // Sign message for authentication
    const signingResponse = await sign_message();

    // Get a bearer token
    const accessToken = (await axios.post(`https://api.lighthouse.storage/api/auth/verify_signer`, {
      publicKey: signingResponse.address,
      signedMessage: signingResponse.signedMessage
    })).data.accessToken;

    // Push file to lighthouse node
    const output = await lighthouse.upload(e, accessToken);
    console.log('File Status:', output);

    console.log('Visit at https://ipfs.io/ipfs/' + output.data.Hash);
    setVideoPath('https://ipfs.io/ipfs/' + output.data.Hash)
  }

  const deployImage = async(e: any) => {
    setLoading(true)
    console.log(e);
    // Sign message for authentication
    const signingResponse = await sign_message();

    // Get a bearer token
    const accessToken = (await axios.post(`https://api.lighthouse.storage/api/auth/verify_signer`, {
      publicKey: signingResponse.address,
      signedMessage: signingResponse.signedMessage
    })).data.accessToken;

    // Push file to lighthouse node
    const output = await lighthouse.upload(e, accessToken);
    console.log('File Status:', output);

    console.log('Visit at https://ipfs.io/ipfs/' + output.data.Hash);
    setImagePath('https://ipfs.io/ipfs/' + output.data.Hash)
  }

  useEffect(() => {
    if(!videoPath) return
    setLoading(false)
  }, [videoPath])

  useEffect(() => {
    if(!imagePath) return
    setLoading(false)
  }, [imagePath])

  return (
    <>
      <Box maxW="700px" mx="auto">
        {videoPath ? (
          <Box maxW="700px" mx="auto" my="20">
            <LivepeerPlayer
              url={
                videoPath
              }
            />
          </Box>
        ) : (
          <Center
            my="20"
            bg="#F0F0F0"
            h="400px"
            w="700px"
            border="1px dotted #CACACA"
            onClick={() => {
              //@ts-ignore
              videoRef.current ? videoRef.current.click() : null;
            }}
          >
            <Input ref={videoRef} hidden onChange={e=>deploy(e)} type="file" />
            <Box>
              <Text color="#777777">Click here to upload</Text>
              <Center>
                <Icon
                  mt="20px"
                  textAlign="center"
                  color="#777777"
                  fontSize="40px"
                  as={BsFillCloudUploadFill}
                />
              </Center>
            </Box>
          </Center>
        )}
        <Box>
          <Flex alignItems={"center"}>
            <Input ref={imageRef} hidden onChange={e=>deployImage(e)} type="file" />
            <Avatar
              size="lg"
              m="2"
              name="Dan Abrahmov"
              src={imagePath ? imagePath : 'https://pngimg.com/uploads/plus/plus_PNG106.png'}
              onClick={() => {
                //@ts-ignore
                imageRef.current && !imagePath ? imageRef.current.click() : null;
              }}
            />
            <Text fontSize="lg">Dan Abrahmov</Text>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="md">
            Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod
            tenpor incidunt ut labore et dolore nagna aliqua. Ut enin ad ninin
            venian, quis nostrun exercitationen ullan corporis suscipit
            laboriosan, nisi ut aliquid ex ea connodi consequatur. Quis aute
            iure reprehenderit in voluptate velit esse cillun dolore eu fugiat
            nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt
            in culpa qui officia deserunt nollit anin id est laborun.
          </Text>
        </Box>
      </Box>
    </>
  );
}

export default Mypage;
