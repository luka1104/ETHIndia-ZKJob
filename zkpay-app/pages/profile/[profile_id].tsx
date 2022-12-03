import { NextPage } from "next";
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { Box } from "@chakra-ui/react";

const Profile: NextPage = () => {
  return (
    <Box maxW="700px" mx="auto" my="20">
      <LivepeerPlayer
        url={
          "https://ipfs.io/ipfs/QmWY8DSGsqsiJYs3dab5mYFwTcp2YiUMecYn1h8iVqHwjB"
        }
      />
    </Box>
  );
};

export default Profile;
