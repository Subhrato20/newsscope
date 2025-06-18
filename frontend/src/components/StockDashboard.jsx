import { Box, Grid, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import ChatBox from './ChatBox';

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
        <Box bg="#181a1b" borderRadius="md" h="180px" display="flex" alignItems="center" justifyContent="center">
          <Text color="#888">[Chart Placeholder]</Text>
        </Box>
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