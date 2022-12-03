import { useRouter } from "next/router";
import {
  Button,
  Box,
  Card,
  CardBody,
  CardFooter,
  Icon,
  Text,
  Flex,
  Wrap,
  WrapItem,
  Stack,
  Heading,
  Divider,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { NextPage } from "next";
import type { GetServerSideProps } from 'next';
import prisma from 'lib/prisma';
import { Company, CompanyProfile } from "@prisma/client";

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const usersRaw = await prisma.company.findMany()
  const users = JSON.parse(JSON.stringify(usersRaw));
  const profilesRaw = await prisma.companyProfile.findMany()
  const profiles = JSON.parse(JSON.stringify(profilesRaw));
  return {
    props: {
      users,
      profiles,
    },
  };
};

type Props = {
  users: Company[];
  profiles: CompanyProfile[]
};

const Index: NextPage<Props> = ({ users, profiles }) => {
  const router = useRouter();

  if(users && profiles) return (
    <>
      <Box maxW="85%" mx="auto">
        <Wrap spacing="5" my="10">
          {users.map((user: Company, key: number) => {
            let profile = profiles.find(p => p.companyId === user.id)
            console.log(profile);
            if(!profile) return
            return (
              <>
                <WrapItem key={key}>
                  <Card maxW="sm">
                    <CardBody>
                      <LivepeerPlayer
                        url={
                          profile.videoPath
                        }
                        autoPlay={true}
                      />
                      <Stack mt="6" spacing="3">
                        <Flex alignItems={"center"}>
                          <Heading size="md">{user.nickname}</Heading>
                          {user.isVerified && (
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
                                  color="#1C9BEF"
                                  ml="10px"
                                  fontSize="20px"
                                  as={BsFillPatchCheckFill}
                                />
                              </Box>
                            </Tooltip>
                          )}
                        </Flex>
                        <Text>
                          {user.description}
                        </Text>
                      </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Button
                        variant="ghost"
                        colorScheme="blue"
                        m="auto"
                        onClick={() =>
                          router.push(`/company/profile?id=${user.id}`)
                        }
                      >
                        Learn More & Contact
                      </Button>
                    </CardFooter>
                  </Card>
                </WrapItem>
              </>
            )
          })}
        </Wrap>
      </Box>
    </>
  );

  return (
    <></>
  )
}

export default Index;
