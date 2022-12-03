import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import ethers, { providers } from "ethers";
//@ts-ignore
import lighthouse from "@lighthouse-web3/sdk";
import { NextPage } from "next";
import {
  Box,
  Center,
  Text,
  Input,
  Flex,
  Avatar,
  Icon,
  Button,
  useToast,
} from "@chakra-ui/react";
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { AccountContext } from "contexts/accountContext";
import {
  BsFillCloudUploadFill,
  BsPatchCheckFill,
  BsPatchQuestion,
} from "react-icons/bs";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "@wagmi/core";
import * as jose from 'jose';

const Mypage: NextPage = () => {
  const { user, profile, getUser, setUser, setLoading } = useContext(AccountContext)
  const router = useRouter();
  const { query } = useRouter();
  const toast = useToast()
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const [nickname, setNickname] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [videoPath, setVideoPath] = useState<string>('')
  const [imagePath, setImagePath] = useState<string>('')
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const [verified, setVerified] = useState(false);
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const sign_message = async () => {
    (window as any).ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res: any) => {
        console.log("Account Connected: " + res[0]);
      });
    const provider = new providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress(); //users public key
    const messageRequested = (
      await axios.get(
        `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
      )
    ).data; //Get message
    const signedMessage = await signer.signMessage(messageRequested); //Sign message
    return {
      signedMessage: signedMessage,
      address: address,
    };
  };

  const deploy = async (e: any) => {
    setLoading(true);
    console.log(e);
    // Sign message for authentication
    const signingResponse = await sign_message();

    // Get a bearer token
    const accessToken = (
      await axios.post(
        `https://api.lighthouse.storage/api/auth/verify_signer`,
        {
          publicKey: signingResponse.address,
          signedMessage: signingResponse.signedMessage,
        }
      )
    ).data.accessToken;

    // Push file to lighthouse node
    const output = await lighthouse.upload(e, accessToken);
    console.log("File Status:", output);

    console.log("Visit at https://ipfs.io/ipfs/" + output.data.Hash);
    setVideoPath("https://ipfs.io/ipfs/" + output.data.Hash);
  };

  const deployImage = async (e: any) => {
    setLoading(true);
    console.log(e);
    // Sign message for authentication
    const signingResponse = await sign_message();

    // Get a bearer token
    const accessToken = (
      await axios.post(
        `https://api.lighthouse.storage/api/auth/verify_signer`,
        {
          publicKey: signingResponse.address,
          signedMessage: signingResponse.signedMessage,
        }
      )
    ).data.accessToken;

    // Push file to lighthouse node
    const output = await lighthouse.upload(e, accessToken);
    console.log("File Status:", output);

    console.log("Visit at https://ipfs.io/ipfs/" + output.data.Hash);
    setImagePath("https://ipfs.io/ipfs/" + output.data.Hash);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      userId: user.id,
      imagePath: imagePath,
      videoPath: videoPath,
    };
    return new Promise((resolve, reject) => {
      axios
        .post("/api/postProfile", data, config)
        .then((response) => {
          resolve(response);
          // if(response.data) setUser(response.data.user)
          if (response.status === 200) {
            setLoading(false);
            toast({
              title: "Account created.",
              description: "Account successfully created.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            // router.push('/mypage')
          }
          console.log(response);
        })
        .catch((e) => {
          reject(e);
          throw new Error(e);
        });
    });
  };

  const verifyUser = async () => {
    if(!user) return
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return new Promise((resolve, reject) => {
      axios.post('/api/verify', user.id, config)
      .then(response => {
        resolve(response)
        if(response.data) setUser(response.data.user)
        if(response.status === 200) {
          setLoading(false)
          toast({
            title: 'Account created.',
            description: 'Account successfully created.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
        console.log(response);
      })
      .catch(e => {
        reject(e)
        throw new Error(e)
      })
    })
  }
  const token = query.verification_jwt || '';

  const verify = async () => {
    const jsonKeys = await (await fetch('https://developer.worldcoin.org/api/v1/jwks')).json()
    const kid = jose.decodeProtectedHeader(token).kid;
    const jsonKey = jsonKeys.keys.find((key: any) => key.kid === kid);
    const publicKey = await jose.importJWK(jsonKey, "PS256")
    //@ts-ignore
    const { payload } = await jose.jwtVerify(token, publicKey, { issuer: 'https://developer.worldcoin.org' });
    console.log(payload.verified);
    console.log(payload.signal);
    const signal = payload.signal as string;
    if(payload.verified === true) {
      setVerified(payload.verified);
      verifyUser()
    }
  }

  useEffect(() => {
    if (!videoPath) return;
    setLoading(false);
    if (videoPath !== profile?.videoPath) setIsUpdated(true);
  }, [videoPath]);

  useEffect(() => {
    if (!imagePath) return;
    setLoading(false);
    if (imagePath !== profile?.imagePath) setIsUpdated(true);
  }, [imagePath]);

  useEffect(() => {
    if (!isConnected) connect();
  }, []);

  useEffect(() => {
    if (!user) return;
    setNickname(user.nickname);
    setDescription(user.description);
  }, [user]);

  useEffect(() => {
    if (!profile) return;
    setImagePath(profile.imagePath);
    setVideoPath(profile.videoPath);
    if(query.success) {
      setLoading(true)
      verify();
      console.log('verifing');
    }
  }, [profile]);

  return (
    <>
      <Box maxW="700px" mx="auto">
        <Center fontSize="3xl" fontWeight="bold" mt="20px">
          Profile
        </Center>
        {videoPath ? (
          <Box maxW="700px" mx="auto" my="10">
            <LivepeerPlayer url={videoPath} autoPlay={true} />
          </Box>
        ) : (
          <Center
            my="10"
            bg="#F0F0F0"
            h="400px"
            w="700px"
            border="1px dotted #CACACA"
            onClick={() => {
              //@ts-ignore
              videoRef.current ? videoRef.current.click() : null;
            }}
          >
            <Input
              ref={videoRef}
              hidden
              onChange={(e) => deploy(e)}
              type="file"
            />
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
            <Input
              ref={imageRef}
              hidden
              onChange={(e) => deployImage(e)}
              type="file"
            />
            <Avatar
              size="lg"
              m="2"
              name={nickname}
              src={
                imagePath
                  ? imagePath
                  : "https://pngimg.com/uploads/plus/plus_PNG106.png"
              }
              onClick={() => {
                //@ts-ignore
                imageRef.current ? imageRef.current.click() : null;
              }}
            />
            <Text fontSize="lg" fontWeight="semibold" ml="10px">
              {nickname}
            </Text>
            {profile && (
              <Icon
                color={user?.isVerified ? "#1C9BEF" : "red"}
                ml="10px"
                fontSize="20px"
                as={user?.isVerified ? BsPatchCheckFill : BsPatchQuestion}
                onClick={() => {
                  user &&
                    !user.isVerified &&
                    router.push(
                      `${process.env.NEXT_PUBLIC_WORLD_ID_URI}${user.address}`
                    );
                }}
              />
            )}
          </Flex>
        </Box>
        <Box>
          <Text fontSize="md">{description}</Text>
        </Box>
        {isUpdated && (
          <Center mt="40px" mb="40px">
            <Button
              colorScheme="orange"
              disabled={!imagePath || !videoPath}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </Center>
        )}
      </Box>
    </>
  );
};

export default Mypage;
