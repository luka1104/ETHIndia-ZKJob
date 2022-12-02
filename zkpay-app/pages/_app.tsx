import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { getDefaultProvider } from 'ethers';
import { createClient, WagmiConfig } from 'wagmi';
import Header from 'components/Header';
import { AccountProvider } from 'contexts/accountContext';

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <AccountProvider>
          <Header />
          <Component {...pageProps} />
        </AccountProvider>
      </ChakraProvider>
    </WagmiConfig>
  )
}
