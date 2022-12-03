import React, { useRef, useState, useEffect, useContext } from "react";
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
} from '@chakra-ui/react';
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { AccountContext } from "contexts/accountContext";

const Mypage: NextPage = () => {
  const [filePath, setFilePath] = useState<string>('')
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
    setFilePath('https://ipfs.io/ipfs/' + output.data.Hash)
  }

  useEffect(() => {
    if(!filePath) return
    setLoading(false)
  }, [filePath])

  return (
    <>
    {filePath ? (
      <Box maxW="700px" mx="auto" my="10">
        <LivepeerPlayer
          url={
            filePath
          }
        />
      </Box>
    ) : (
      <Center mt='40px'>
        <Center w='60%'>
          <Text fontSize='20px'>
            Upload your Intro Video
          </Text>
          <Input onChange={e=>deploy(e)} type="file" />
        </Center>
      </Center>
    )}
    </>
  );
}

export default Mypage;
