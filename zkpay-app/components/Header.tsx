import React, { useContext } from 'react'
import { Box, Center, Button, Icon, Text, Link, useColorMode } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { FiSun, FiMoon } from 'react-icons/fi';
import { BiWallet } from 'react-icons/bi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { shortenEOAName } from 'utils/shortenEOA';
import { AccountContext } from 'contexts/accountContext';

const Header: React.FC = () => {
  const { setLoading } = useContext(AccountContext)
  const { address, isConnected } = useAccount();
  const { colorMode, toggleColorMode } = useColorMode()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const shortAddress = shortenEOAName(address);
  return (
    <>
      <Head>
        <title>ZKJob | Job matching platform</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box w="100%" h="60px" p="0 30px 0 0" borderBottom='1px solid' borderColor={colorMode === 'light' ? '#F5F5F5' : '#1A202C'}>
        <Center h="100%" justifyContent="space-between">
          <Link fontWeight='bold' fontSize='30px' pl='20px' href='/' _hover={{textDecoration: 'none'}}>
            ZKJob
          </Link>
          <Box>
            {/* <NextLink href="/upload" passHref>
              <Button mr="20px" colorScheme="orange">
                <Icon as={AiOutlinePlus} />
              </Button>
            </NextLink> */}
            <Button mr="20px" colorScheme="orange" onClick={toggleColorMode}>
              {colorMode === 'light' ? (<Icon as={FiMoon} />) : (<Icon as={FiSun} />) }
            </Button>
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
                onClick={() => {connect(), setLoading(true)}}
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
