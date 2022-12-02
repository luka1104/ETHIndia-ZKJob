import type { AppProps } from 'next/app'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { getDefaultProvider } from 'ethers';
import { createClient, WagmiConfig } from 'wagmi';
import { AccountProvider } from 'contexts/accountContext';
import { Layout } from 'layout';

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <AccountProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AccountProvider>
      </ChakraProvider>
    </WagmiConfig>
  )
}
