import './App.css'
import { Flex } from '@chakra-ui/react'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import StockDashboard from './components/StockDashboard'

function App() {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <Flex h="100vh" w="100vw" bg="#181a1b" position="fixed" top={0} left={0}>
      <Sidebar onSelectStock={setSelectedStock} />
      <StockDashboard selectedStock={selectedStock} />
    </Flex>
  )
}

export default App
