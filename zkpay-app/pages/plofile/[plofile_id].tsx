import { NextPage } from "next";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
  ThemeConfig,
} from "@livepeer/react";
import { LivepeerPlayer } from "components/LivepeerPlayer";
import { Box } from "@chakra-ui/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  }),
});

const livepeerTheme: ThemeConfig = {
  colors: {
    accent: "rgb(0, 145, 255)",
    containerBorderColor: "rgba(0, 145, 255, 0.9)",
  },
  fonts: {
    display: "Inter",
  },
};

const Plofile: NextPage = () => {
  return (
    <Box maxW="700px" mx="auto" my="20">
      <LivepeerConfig client={livepeerClient} theme={livepeerTheme}>
        <LivepeerPlayer
          url={
            "https://ipfs.io/ipfs/QmWY8DSGsqsiJYs3dab5mYFwTcp2YiUMecYn1h8iVqHwjB"
          }
        />
      </LivepeerConfig>
    </Box>
  );
};

export default Plofile;
