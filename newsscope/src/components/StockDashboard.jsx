import { Box, Grid, Text, VStack, HStack, Badge } from '@chakra-ui/react';

export default function StockDashboard() {
  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
      templateRows={{ base: 'repeat(4, 1fr)', md: '1fr 1fr' }}
      gap={6}
      p={12}
      flex={1}
      minH="100vh"
      bg="#181a1b"
    >
      {/* Chart */}
      <Box bg="#23272a" borderRadius="md" p={6} minH="300px">
        <Text fontWeight="bold" fontSize="lg" mb={2} color="#e0e0e0">Amazon</Text>
        <Box bg="#181a1b" borderRadius="md" h="220px" display="flex" alignItems="center" justifyContent="center">
          <Text color="#888">[Chart Placeholder]</Text>
        </Box>
      </Box>
      {/* Highlights */}
      <Box bg="#23272a" borderRadius="md" p={6} color="#e0e0e0" position="relative" minH="300px">
        <HStack justify="space-between" align="flex-start">
          <Text fontWeight="bold" fontSize="2xl">HIGHLIGHTS</Text>
          <Badge bg="#444" color="#e0e0e0" fontWeight="bold" fontSize="lg" borderRadius="md" px={4} py={1}>+30</Badge>
        </HStack>
        <VStack align="flex-start" mt={4} spacing={1} fontSize="lg">
          <Text>good time to buy!</Text>
          <Text>blah blah</Text>
          <Text>blah blah</Text>
          <Text>blah</Text>
          <Text>blah</Text>
          <Text>big moment!</Text>
          <Text>all chatgpt summarized</Text>
        </VStack>
      </Box>
      {/* News */}
      <Box bg="#23272a" borderRadius="md" p={6} color="#e0e0e0" minH="220px">
        <Text fontWeight="bold" fontSize="3xl" mb={4} textAlign="center">NEWS</Text>
        <VStack align="flex-start" spacing={2} fontSize="xl">
          <Text>9:00am blah blah +30</Text>
          <Text>9:20am blah blah -300</Text>
          <Text>9:30am blah blah +30</Text>
          <Text>10:00am blah blah +50</Text>
          <Text>11:00am blah blah -30</Text>
        </VStack>
      </Box>
      {/* ChatGPT */}
      <Box bg="#23272a" borderRadius="md" p={6} minH="220px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Text fontWeight="bold" fontSize="xl" mb={2} color="#e0e0e0">ChatGPT</Text>
        <Box bg="#181a1b" borderRadius="md" w="100%" h="120px" display="flex" alignItems="center" justifyContent="center">
          <Text color="#e0e0e0">[AI Agent Placeholder]</Text>
        </Box>
      </Box>
    </Grid>
  );
} 