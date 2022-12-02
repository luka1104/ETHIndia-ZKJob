import { ReactElement, useContext } from 'react'
import { Box } from '@chakra-ui/react'
import Header from 'components/Header'
import Loading from 'components/Loading'
import { AccountContext } from 'contexts/accountContext'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const Layout = ({ children }: LayoutProps) => {
  const { loading } = useContext(AccountContext)
  return (
    <>
      <Box>
        <Header />
        {loading && (
          <Loading />
        )}
        {children}
      </Box>
    </>
  )
}
