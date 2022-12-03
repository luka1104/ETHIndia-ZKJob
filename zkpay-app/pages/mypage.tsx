import React, { useRef } from "react";
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
  Icon,
} from '@chakra-ui/react';
import { BsFillCloudUploadFill } from 'react-icons/bs'
import { useDropzone } from "react-dropzone";

const Mypage: NextPage = () => {
  const inputRef = useRef(null);

  const onDrop = (e: any) => {
    deploy(e)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4'],
    },
    maxFiles: 1,
    onDrop,
  });

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

  const deploy = async(e: any) =>{
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
    /*
      output:
        {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

      console.log('Visit at https://ipfs.io/ipfs/' + output.data.Hash);
  }

  return (
    <Center mt='40px'>
      <Center w='60%'>
        <Text fontSize='20px'>
          Upload your Intro Video
        </Text>
        <Input onChange={e=>deploy(e)} type="file" />
      </Center>
    </Center>
    // <Center {...getRootProps()} w="100%" h="400px" p="0 20%">
    //   <Center
    //     bg="#F0F0F0"
    //     h="100%"
    //     w="100%"
    //     border="1px dotted #CACACA"
    //     onClick={() => {
    //       //@ts-ignore
    //       inputRef.current ? inputRef.current.click() : null;
    //     }}
    //   >
    //     <Box as={Input} hidden ref={inputRef} {...getInputProps()} />
    //     <Box>
    //       <Text color="#777777">Drag and drop your video here</Text>
    //       <Center>
    //         <Icon
    //           mt="20px"
    //           textAlign="center"
    //           color="#777777"
    //           fontSize="40px"
    //           as={BsFillCloudUploadFill}
    //         />
    //       </Center>
    //     </Box>
    //   </Center>
    // </Center>
  );
}

export default Mypage;
