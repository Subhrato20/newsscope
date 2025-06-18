import { useState, useRef } from 'react';
import { Box, Input, Button, VStack, HStack, Text, Spinner } from '@chakra-ui/react';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: 'This is a placeholder response from the AI.' }
      ]);
      setLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column" justifyContent="flex-end" p={4}>
      <VStack align="stretch" spacing={2} flex={1} overflowY="auto" mb={2}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'user' ? '#3182ce' : '#2d3748'}
            color="#fff"
            px={4}
            py={2}
            borderRadius={msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0'}
            maxWidth="70%"
            fontSize="md"
            boxShadow="sm"
          >
            {msg.text}
          </Box>
        ))}
        {loading && (
          <Box alignSelf="flex-start" bg="#2d3748" color="#fff" px={4} py={2} borderRadius="16px 16px 16px 0" maxWidth="70%" fontSize="md" boxShadow="sm">
            <Spinner size="sm" mr={2} /> AI is typing...
          </Box>
        )}
        <div ref={messagesEndRef} />
      </VStack>
      <HStack mt={2}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          bg="#181a1b"
          color="#fff"
        />
        <Button onClick={sendMessage} colorScheme="blue" isLoading={loading} disabled={!input.trim()}>Send</Button>
      </HStack>
    </Box>
  );
} 