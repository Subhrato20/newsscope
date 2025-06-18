import './App.css'
import { Flex } from '@chakra-ui/react'
import Sidebar from './components/Sidebar'
import StockDashboard from './components/StockDashboard'

function App() {
  return (
    <Flex h="100vh" w="100vw" bg="#181a1b" position="fixed" top={0} left={0}>
      <Sidebar />
      <StockDashboard />
    </Flex>
  )
}

export default App
