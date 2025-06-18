import React, { useState } from 'react';
import { Box, Input, Button, VStack, Text, Spinner, Flex } from '@chakra-ui/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column" p={4}>
      <VStack 
        flex={1} 
        spacing={4} 
        overflowY="auto" 
        mb={4}
        align="stretch"
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
            bg={message.role === 'user' ? 'blue.500' : 'gray.700'}
            color="white"
            px={4}
            py={2}
            borderRadius="lg"
            maxW="70%"
          >
            <Text>{message.content}</Text>
          </Box>
        ))}
        {loading && (
          <Box alignSelf="flex-start" bg="gray.700" color="white" px={4} py={2} borderRadius="lg">
            <Spinner size="sm" mr={2} /> AI is thinking...
          </Box>
        )}
      </VStack>
      <Flex gap={2}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          bg="gray.700"
          color="white"
          _placeholder={{ color: 'gray.400' }}
        />
        <Button
          colorScheme="blue"
          onClick={handleSend}
          isLoading={loading}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default ChatBot; 