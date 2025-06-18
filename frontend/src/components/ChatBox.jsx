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
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.sender === 'ai' ? 'assistant' : m.sender,
            content: m.text
          }))
        }),
      });
      const data = await response.json();
      if (data.response) {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'ai', text: data.response }
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'ai', text: data.error || 'Sorry, something went wrong.' }
        ]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: 'Error connecting to backend.' }
      ]);
    } finally {
      setLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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