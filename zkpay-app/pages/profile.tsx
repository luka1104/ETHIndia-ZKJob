import { NextPage } from "next";
import { LivepeerPlayer } from "components/LivepeerPlayer";
import {
  Avatar,
  Button,
  Box,
  Center,
  Image,
  Text,
  Flex,
  useColorMode,
  Wrap,
  WrapItem,
  Icon,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { RiMailSendLine } from "react-icons/ri";
import type { GetServerSideProps } from "next";
import prisma from "../lib/prisma";
import { User, Profile } from "@prisma/client";
import { BsPatchCheckFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Chat } from "@pushprotocol/uiweb";
import { useContext } from "react";
import { AccountContext } from "contexts/accountContext";
import axios from "axios";
import { ethers } from "ethers";
import abi from "utils/pushNote.json";

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const id = JSON.parse(context.query.id as string);
  const userRaw = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  const account = JSON.parse(JSON.stringify(userRaw));
  const profileRaw = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
  });
  const profile = JSON.parse(JSON.stringify(profileRaw));
  return {
    props: {
      account,
      profile,
    },
  };
};

type Props = {
  account: User;
  profile: Profile;
};

const Profile: NextPage<Props> = ({ account, profile }) => {
  const { user, setLoading, isCompany } = useContext(AccountContext);
  const router = useRouter();
  const { address } = useAccount();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const contractABI = abi.abi;

  const createOffer = async () => {
    if (!user) return;
    setLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      userId: profile.id,
      companyId: user.id,
    };

    const { ethereum } = (window as any);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const notePushPortalContract = new ethers.Contract(
      "0x8D0f15446ea359aFD3694C3A1f01EaD02Ccd7aC0",
      contractABI,
      signer
    );
    await notePushPortalContract.SendNote(
      account.address
    );

    return new Promise((resolve, reject) => {
      axios
        .post("/api/createOffer", data, config)
        .then((response) => {
          resolve(response);
          // if(response.data) setUser(response.data.user)
          if (response.status === 200) {
            setLoading(false);
            toast({
              title: "Offer sended.",
              description: "Offer successfully sended.",
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
  return (
    <>
      <Box maxW="700px" mx="auto">
        <Box mx="auto" my="20" zIndex="base">
          <LivepeerPlayer url={profile.videoPath} autoPlay={true} />
        </Box>
        <Box>
          <Flex alignItems={"center"}>
            <Avatar
              size="lg"
              m="2"
              name={account.nickname}
              src={profile.imagePath}
            />
            <Text fontSize="lg" fontWeight="semibold" ml="10px">
              {account.nickname}
            </Text>
            <Tooltip
              ml="10px"
              hasArrow
              label={
                <Flex>
                  <Text>Verified by</Text>
                  <Image
                    w="20px"
                    src="/images/worldcoin.png"
                    alt="world coin"
                  />
                  <Text>World ID</Text>
                </Flex>
              }
            >
              <Box>
                <Icon
                  mt="5px"
                  display={account.isVerified ? "inline-block" : "none"}
                  color="#1C9BEF"
                  ml="10px"
                  fontSize="20px"
                  as={BsPatchCheckFill}
                />
              </Box>
            </Tooltip>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="md">{account.description}</Text>
        </Box>
        <Wrap spacing="5" my="10">
          <WrapItem>
            {/* <Button
              rightIcon={
                <Image
                  src={
                    colorMode === "light"
                      ? "/images/push.png"
                      : "/images/push_w.png"
                  }
                  h="25px"
                />
              }
            >
              Chat with{" "}
            </Button> */}
            {address && (
              <Box zIndex="overlay">
                <Chat
                  account={address}
                  supportAddress={account.address}
                  modalTitle={`Chat with ${account.nickname}`}
                  apiKey={process.env.NEXT_PUBLIC_HUDDLE_KEY}
                  env="staging"
                />
              </Box>
            )}
          </WrapItem>
          <WrapItem>
            <Button
              rightIcon={
                <Image
                  src={
                    colorMode === "light"
                      ? "/images/huddle01_b.png"
                      : "/images/huddle01.png"
                  }
                  h="20px"
                />
              }
              onClick={() => {
                router.push(
                  `/huddle?address=${account.address}&nickname=${account.nickname}`
                );
              }}
            >
              Meeting with{" "}
            </Button>
          </WrapItem>
          <WrapItem>
            <Button rightIcon={<RiMailSendLine />} onClick={createOffer}>
              Send a offer
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </>
  );
};

export default Profile;
