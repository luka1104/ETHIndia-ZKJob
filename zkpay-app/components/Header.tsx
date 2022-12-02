import React, { useEffect } from 'react'
import { Box, Center, Button, Icon, Text, Link } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiWallet } from 'react-icons/bi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { shortenEOAName } from 'utils/shortenEOA';

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const shortAddress = shortenEOAName(address);

  useEffect(() => {
    if(!address) return
    console.log(address);
  }, [address])
  return (
    <>
      <Head>
        <title>ZKJob | Job matching platform</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box w="100%" h="60px" p="0 30px 0 0" bg="#FFFDF6">
        <Center h="100%" justifyContent="space-between">
          <Link color='black' fontWeight='bold' fontSize='30px' pl='20px' href='/' _hover={{textDecoration: 'none'}}>
            ZKJob
          </Link>
          <Box>
            {/* <NextLink href="/upload" passHref>
              <Button mr="20px" colorScheme="orange">
                <Icon as={AiOutlinePlus} />
              </Button>
            </NextLink> */}
            {isConnected ? (
              <Button
                leftIcon={<BiWallet />}
                colorScheme="orange"
                onClick={() => disconnect()}
              >
                {shortAddress}
              </Button>
            ) : (
              <Button
                leftIcon={<BiWallet />}
                colorScheme="orange"
                onClick={() => connect()}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Center>
      </Box>
    </>
  )
}

export default Header
