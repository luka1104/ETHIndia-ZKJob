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
} from "@chakra-ui/react";

const Profile: NextPage = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Box maxW="700px" mx="auto">
        <Box mx="auto" my="20">
          <LivepeerPlayer
            url={
              "https://ipfs.io/ipfs/QmWY8DSGsqsiJYs3dab5mYFwTcp2YiUMecYn1h8iVqHwjB"
            }
            autoPlay={true}
          />
        </Box>
        <Box>
          <Flex alignItems={"center"}>
            <Avatar
              size="lg"
              m="2"
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
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
        <Center>
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
            m="5"
          >
            Chat with{" "}
          </Button>
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
            m="5"
          >
            Meeting with{" "}
          </Button>
        </Center>
      </Box>
    </>
  );
};

export default Profile;
