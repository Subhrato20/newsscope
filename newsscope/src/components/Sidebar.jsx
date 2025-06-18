import { useState } from 'react';
import { Box, VStack, Input, Button, Text, HStack, Flex, List, ListItem, Spinner } from '@chakra-ui/react';

const FINNHUB_API_KEY = 'd19a5c9r01qkcat71150d19a5c9r01qkcat7115g';

export default function Sidebar() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

  // Search stocks using Finnhub API
  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(search)}&token=${FINNHUB_API_KEY}`);
      const data = await res.json();
      setSearchResults(data.result || []);
    } catch (e) {
      setSearchResults([]);
    }
    setLoading(false);
  };

  // Add first 'Common Stock' card from search results
  const addCommonStockCard = () => {
    const common = searchResults.find((item) => item.type === 'Common Stock');
    if (common && !cards.find((c) => c.symbol === common.symbol)) {
      setCards([...cards, { symbol: common.symbol, name: common.description || common.symbol }]);
    }
    setSearch('');
    setSearchResults([]);
  };

  return (
    <Box w="320px" bg="#222426" p={6} minH="100vh">
      <Text fontSize="3xl" fontWeight="bold" color="#e0e0e0" mb={4}>
        NewsScope
      </Text>
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
            onClick={addCommonStockCard}
          >
            <Text color="#e0e0e0" fontWeight="bold">
              {searchResults.find((item) => item.type === 'Common Stock')?.symbol || 'No Common Stock found'}
            </Text>
            <Text color="#aaa" fontSize="sm">
              {searchResults.find((item) => item.type === 'Common Stock')?.description || ''}
            </Text>
            <Text color="#888" fontSize="xs">
              Click to add Common Stock
            </Text>
          </ListItem>
        </List>
      )}
      <VStack spacing={4} align="stretch">
        {cards.map((card, idx) => (
          <Flex key={card.symbol} bg="#23272a" borderRadius="md" p={6} align="center" justify="flex-start">
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