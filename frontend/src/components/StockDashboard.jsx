import { Box, Grid, Text, VStack, HStack, Badge, Spinner, Button, ButtonGroup } from '@chakra-ui/react';
import ChatBox from './ChatBox';
import { useEffect, useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TWELVE_DATA_API_KEY = 'f465a20d33f748d6817d9b899d47edc1';

const RANGE_OPTIONS = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'MAX', days: null },
];

function StockChart({ symbol }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState(RANGE_OPTIONS[0]); // Default to 1W
  const cacheRef = useRef({});

  // Choose interval based on range
  const interval = useMemo(() => {
    if (range.label === '1W' || range.label === '1M') return '1h';
    return '1day';
  }, [range]);

  useEffect(() => {
    if (!symbol) return;
    setError(null);
    setData(null);
    const cacheKey = symbol + '-' + interval;
    // Check cache first
    if (cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=500&apikey=${TWELVE_DATA_API_KEY}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'error' || !json.values) {
          setError(json.message || 'No data');
          setData(null);
        } else {
          // Reverse to chronological order
          const stockData = json.values.reverse().map(d => ({
            date: d.datetime,
            close: parseFloat(d.close)
          }));
          cacheRef.current[cacheKey] = stockData;
          setData(stockData);
        }
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [symbol, interval]);

  // Filter data for selected range
  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!range.days) return data; // MAX
    return data.slice(-range.days * (interval === '1h' ? 7 : 1)); // 7 hours per day for 1h interval (market hours)
  }, [data, range, interval]);

  return (
    <Box>
      <ButtonGroup size="sm" mb={2}>
        {RANGE_OPTIONS.map(opt => (
          <Button
            key={opt.label}
            onClick={() => setRange(opt)}
            colorScheme={range.label === opt.label ? 'teal' : 'gray'}
            variant={range.label === opt.label ? 'solid' : 'ghost'}
          >
            {opt.label}
          </Button>
        ))}
      </ButtonGroup>
      {loading && <Box h="180px" display="flex" alignItems="center" justifyContent="center"><Spinner color="blue.400" /></Box>}
      {error && <Box h="180px" display="flex" alignItems="center" justifyContent="center"><Text color="red.300">{error}</Text></Box>}
      {!loading && !error && filteredData && (
        <Box w="100%">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={filteredData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 12 }} hide={filteredData.length > 20} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#aaa', fontSize: 12 }} width={60} 
                label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#aaa', fontSize: 14 }}
              />
              <Tooltip contentStyle={{ background: '#23272a', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="close" stroke="#4fd1c5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
      {!loading && !error && !filteredData && <Box h="180px" display="flex" alignItems="center" justifyContent="center"><Text color="#888">No data</Text></Box>}
    </Box>
  );
}

export default function StockDashboard({ selectedStock }) {
  if (!selectedStock) {
    return (
      <Box 
        flex={1} 
        minH="100vh" 
        bg="#181a1b" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Text color="#888" fontSize="xl">Select a stock to view its dashboard</Text>
      </Box>
    );
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
      templateRows={{ base: '1fr 1fr' }}
      gap={6}
      p={12}
      flex={1}
      minH="100vh"
      bg="#181a1b"
    >
      {/* Chart (top left) */}
      <Box
        gridColumn="1"
        gridRow="1"
        bg="#23272a"
        borderRadius="md"
        p={6}
        minH="220px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Text fontWeight="bold" fontSize="lg" mb={2} color="#e0e0e0">{selectedStock.name}</Text>
        <StockChart symbol={selectedStock.symbol} />
      </Box>

      {/* News/Highlights (bottom left) */}
      <Box
        gridColumn="1"
        gridRow="2"
        bg="#23272a"
        borderRadius="md"
        p={6}
        minH="220px"
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <HStack justify="flex-start" align="center" mb={4}>
          <Text fontWeight="bold" fontSize="2xl" color="#e0e0e0">NEWS/HIGHLIGHTS</Text>
          <Badge
            bg="#888"
            color="#e0e0e0"
            fontWeight="bold"
            fontSize="lg"
            borderRadius="md"
            px={4}
            py={1}
            ml={2}
            position="absolute"
            top={6}
            right={6}
          >
            +30
          </Badge>
        </HStack>
        <VStack align="flex-start" spacing={2} fontSize="xl">
          <Text>9:00am blah blah +30</Text>
          <Text>9:20am blah blah -300</Text>
          <Text>9:30am blah blah +30</Text>
          <Text>10:00am blah blah +50</Text>
          <Text>11:00am blah blah -30</Text>
        </VStack>
      </Box>

      {/* Chatbox (right column, spans both rows) */}
      <Box
        gridColumn="2"
        gridRow="1 / span 2"
        bg="#23272a"
        borderRadius="md"
        p={0}
        minH="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-end"
      >
        <ChatBox />
      </Box>
    </Grid>
  );
} 