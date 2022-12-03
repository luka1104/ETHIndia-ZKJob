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
} from "@chakra-ui/react";
import { RiMailSendLine } from "react-icons/ri";
import type { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import { User, Profile } from "@prisma/client";
import {
  BsPatchCheckFill,
} from "react-icons/bs";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) => {
  const id = JSON.parse(context.query.id as string);
  const userRaw = await prisma.user.findUnique({
    where: {
      id: id
    },
  })
  const user = JSON.parse(JSON.stringify(userRaw));
  const profileRaw = await prisma.profile.findUnique({
    where: {
      userId: id
    },
  })
  const profile = JSON.parse(JSON.stringify(profileRaw));
  return {
    props: {
      user,
      profile,
    },
  };
};

type Props = {
  user: User;
  profile: Profile
};

const Profile: NextPage<Props> = ({ user, profile }) => {
  const router = useRouter()
  const { colorMode } = useColorMode();
  return (
    <>
      <Box maxW="700px" mx="auto">
        <Box mx="auto" my="20">
          <LivepeerPlayer
            url={
              profile.videoPath
            }
            autoPlay={true}
          />
        </Box>
        <Box>
          <Flex alignItems={"center"}>
            <Avatar
              size="lg"
              m="2"
              name={user.nickname}
              src={profile.imagePath}
            />
            <Text fontSize="lg" fontWeight='semibold' ml='10px'>{user.nickname}</Text>
            <Tooltip
              ml='10px'
              hasArrow
              label={
                <Flex>
                  <Text>
                    Verified by
                  </Text>
                  <Image w='20px' src='/images/worldcoin.png' alt='world coin' />
                  <Text>
                    World ID
                  </Text>
                </Flex>
              }
            >
              <Box>
                <Icon
                  mt='5px'
                  display={user.isVerified ? 'inline-block' : 'none'}
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
          <Text fontSize="md">
            {user.description}
          </Text>
        </Box>
        <Wrap spacing="5" my="10">
          <WrapItem>
            <Button
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
            </Button>
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
              onClick={() => {router.push(`/huddle?address=${user.address}`)}}
            >
              Meeting with{" "}
            </Button>
          </WrapItem>
          <WrapItem>
            <Button rightIcon={<RiMailSendLine />}>Send a offer</Button>
          </WrapItem>
        </Wrap>
      </Box>
    </>
  );
};

export default Profile;
