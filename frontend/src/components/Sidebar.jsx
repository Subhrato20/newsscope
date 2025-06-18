import { useState, useEffect } from 'react';
import { Box, VStack, Text, HStack, Flex, Image, Spinner } from '@chakra-ui/react';

const FINNHUB_API_KEY = 'd19a5c9r01qkcat71150d19a5c9r01qkcat7115g';

// Company names mapping
const COMPANY_NAMES = {
  'AAPL': 'Apple Inc.',
  'GOOGL': 'Alphabet Inc.',
  'TSLA': 'Tesla Inc.',
  'NVDA': 'NVIDIA Corporation',
  'AMZN': 'Amazon.com Inc.',
  'MSFT': 'Microsoft Corporation',
  'META': 'Meta Platforms Inc.',
  'NFLX': 'Netflix Inc.',
  'CRM': 'Salesforce Inc.',
  'ADBE': 'Adobe Inc.',
  'DIS': 'The Walt Disney Company',
  'INTC': 'Intel Corporation',
  'CSCO': 'Cisco Systems Inc.'
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Text fontSize="lg" color="#aaa" ml={2} fontFamily="monospace">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </Text>
  );
}

function StockLogo({ symbol }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        
        if (data.logo) {
          setLogoUrl(data.logo);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [symbol]);

  if (loading) {
    return (
      <Box w="32px" h="32px" bg="#444" borderRadius="full" mr={4} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="sm" color="blue.400" />
      </Box>
    );
  }

  if (error || !logoUrl) {
    return (
      <Box w="32px" h="32px" bg="#444" borderRadius="full" mr={4} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="xs" color="#aaa" fontWeight="bold">{symbol.charAt(0)}</Text>
      </Box>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={`${symbol} logo`}
      w="32px"
      h="32px"
      borderRadius="full"
      mr={4}
      objectFit="cover"
      fallback={
        <Box w="32px" h="32px" bg="#444" borderRadius="full" mr={4} display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="xs" color="#aaa" fontWeight="bold">{symbol.charAt(0)}</Text>
        </Box>
      }
    />
  );
}

export default function Sidebar({ onSelectStock }) {
  const [portfolio, setPortfolio] = useState({});
  const [userName, setUserName] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  // Load user portfolio data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/data/user_data.json');
        const userData = await response.json();
        if (userData.length > 0) {
          const user = userData[0]; // Get the first user
          setUserName(user.user_name);
          setPortfolio(user.portfolio);
          
          // Auto-select the first stock in the portfolio
          const firstStock = Object.keys(user.portfolio)[0];
          if (firstStock) {
            const stockData = { 
              symbol: firstStock, 
              name: COMPANY_NAMES[firstStock] || firstStock 
            };
            setSelectedStock(stockData);
            onSelectStock?.(stockData);
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    
    loadUserData();
  }, [onSelectStock]);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    onSelectStock?.(stock);
  };

  return (
    <Box w="320px" bg="#222426" p={6} minH="100vh" display="flex" flexDirection="column">
      <HStack mb={4} align="center">
        <Text fontSize="3xl" fontWeight="bold" color="#e0e0e0">
          NewsScope
        </Text>
        <LiveClock />
      </HStack>
      
      <Box mb={6}>
        <Text fontSize="lg" color="#e0e0e0" fontWeight="bold" mb={2}>
          Welcome, {userName}
        </Text>
        <Text fontSize="md" color="#aaa" mb={4}>
          Your Portfolio
        </Text>
      </Box>

      <VStack 
        spacing={4} 
        align="stretch" 
        flex={1}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1d1e',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#444',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
        pr={2}
      >
        {Object.entries(portfolio).map(([symbol, shares]) => (
          <Flex
            key={symbol}
            bg={selectedStock?.symbol === symbol ? "#2c3136" : "#23272a"}
            borderRadius="md"
            p={4}
            align="center"
            minH="80px"
            cursor="pointer"
            onClick={() => handleStockSelect({ 
              symbol, 
              name: COMPANY_NAMES[symbol] || symbol 
            })}
            _hover={{ bg: "#2c3136" }}
            transition="background-color 0.2s"
            mb={1}
          >
            <StockLogo symbol={symbol} />
            <Box ml={2} flex="1 1 0" minW={0} display="flex" flexDirection="column" justifyContent="center">
              <Text fontWeight="bold" fontSize="xl" color="#e0e0e0" lineHeight={1}>
                {symbol}
              </Text>
              <Text color="#aaa" fontSize="sm" mb={0.5} isTruncated maxW="170px">
                {COMPANY_NAMES[symbol] || symbol}
              </Text>
              <Text color="#888" fontSize="sm" fontWeight="medium" mt={1} noOfLines={1}>
                {shares} shares
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
} 