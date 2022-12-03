import type { AppProps } from 'next/app'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { getDefaultProvider } from 'ethers';
import { createClient, WagmiConfig } from 'wagmi';
import { AccountProvider } from 'contexts/accountContext';
import { Layout } from 'layout';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
  ThemeConfig,
} from "@livepeer/react";

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <LivepeerConfig client={livepeerClient} theme={livepeerTheme}>
        <ChakraProvider>
          <AccountProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AccountProvider>
        </ChakraProvider>
      </LivepeerConfig>
    </WagmiConfig>
  )
}
