import React, { useContext } from 'react'
import { Modal, Spinner, Center, useDisclosure, ModalOverlay, ModalContent } from '@chakra-ui/react'

const Loading: React.FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent top='30%' w='20%' h='25%'>
          <Center h='100%'>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Center>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Loading
