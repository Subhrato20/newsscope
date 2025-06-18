import { useState } from 'react';
import { Box, VStack, Input, Button, Text, HStack, Flex, List, ListItem, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';

const FINNHUB_API_KEY = 'd19a5c9r01qkcat71150d19a5c9r01qkcat7115g';

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

export default function Sidebar({ onSelectStock }) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  // Search stocks using Finnhub API
  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(search)}&token=${FINNHUB_API_KEY}`);
      const data = await res.json();
      const commonStock = data.result?.find((item) => item.type === 'Common Stock');
      if (commonStock && !cards.find((c) => c.symbol === commonStock.symbol)) {
        const newCard = { symbol: commonStock.symbol, name: commonStock.description || commonStock.symbol };
        setCards([...cards, newCard]);
        // Automatically select the newly added stock
        handleStockSelect(newCard);
      }
      setSearch('');
    } catch (e) {
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    onSelectStock?.(stock);
  };

  return (
    <Box w="320px" bg="#222426" p={6} minH="100vh">
      <HStack mb={4} align="center">
        <Text fontSize="3xl" fontWeight="bold" color="#e0e0e0">
          NewsScope
        </Text>
        <LiveClock />
      </HStack>
      <HStack mb={6}>
        <Input
          placeholder="search stocks"
          bg="#333"
          color="#e0e0e0"
          fontWeight="bold"
          _placeholder={{ color: '#aaa' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
        />
        <Button bg="#444" color="#e0e0e0" fontWeight="bold" onClick={handleSearch} isLoading={loading}>Search</Button>
      </HStack>
      {/* Search Results */}
      {loading && <Spinner color="#e0e0e0" mb={2} />}
      {searchResults.length > 0 && (
        <List spacing={1} mb={4} bg="#23272a" borderRadius="md" p={2} maxH="180px" overflowY="auto">
          <ListItem
            _hover={{ bg: '#333', cursor: 'pointer' }}
            p={2}
            borderRadius="md"
            onClick={handleSearch}
          >
            <Text color="#e0e0e0" fontWeight="bold">
              {searchResults[0]?.symbol || 'No Common Stock found'}
            </Text>
            <Text color="#aaa" fontSize="sm">
              {searchResults[0]?.description || ''}
            </Text>
            <Text color="#888" fontSize="xs">
              Click to add Common Stock
            </Text>
          </ListItem>
        </List>
      )}
      <VStack spacing={4} align="stretch">
        {cards.map((card) => (
          <Flex
            key={card.symbol}
            bg={selectedStock?.symbol === card.symbol ? "#2c3136" : "#23272a"}
            borderRadius="md"
            p={6}
            align="center"
            justify="flex-start"
            cursor="pointer"
            onClick={() => handleStockSelect(card)}
            _hover={{ bg: "#2c3136" }}
            transition="background-color 0.2s"
          >
            <Box w="32px" h="32px" bg="#444" borderRadius="full" mr={4} />
            <Box>
              <Text fontWeight="bold" fontSize="2xl" color="#e0e0e0">
                {card.symbol}
              </Text>
              <Text color="#aaa" fontSize="lg">
                {card.name}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
} 