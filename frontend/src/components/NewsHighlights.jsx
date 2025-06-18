import { Box, Text, HStack, VStack, Badge, Spinner, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function NewsHighlights({ selectedStock }) {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock?.symbol) return;
    
    setLoading(true);
    setError(null);
    setCurrentArticleIndex(0);
    
    fetch('http://localhost:8080/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_name: selectedStock.symbol
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('News API Response:', data);
      if (data.error) {
        setError(data.error);
      } else {
        setNewsData(data);
      }
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch news data');
      setLoading(false);
    });
  }, [selectedStock?.symbol]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!newsData?.articles || newsData.articles.length === 0) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousArticle();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextArticle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newsData, currentArticleIndex]);

  const handlePreviousArticle = () => {
    if (newsData?.articles && currentArticleIndex > 0) {
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const handleNextArticle = () => {
    if (newsData?.articles && currentArticleIndex < newsData.articles.length - 1) {
      setCurrentArticleIndex(currentArticleIndex + 1);
    }
  };

  const getSentimentColor = (score) => {
    if (score > 0.3) return 'green';
    if (score < -0.3) return 'red';
    return 'yellow.600';
  };

  const getSentimentText = (score) => {
    if (score > 0.3) return 'Positive';
    if (score > 0.1) return 'Slightly Positive';
    if (score < -0.3) return 'Negative';
    if (score < -0.1) return 'Slightly Negative';
    return 'Neutral';
  };

  const currentArticle = newsData?.articles?.[currentArticleIndex];
  const currentSummary = newsData?.summarized_articles?.[currentArticleIndex];
  const totalArticles = newsData?.articles?.length || 0;

  return (
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
      <HStack justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold" fontSize="2xl" color="#e0e0e0">
          NEWS/HIGHLIGHTS
        </Text>
        {newsData?.average_sentiment !== undefined && (
          <Badge
            bg={getSentimentColor(newsData.average_sentiment)}
            color="white"
            fontWeight="bold"
            fontSize="lg"
            borderRadius="md"
            px={4}
            py={1}
          >
            {getSentimentText(newsData.average_sentiment)} ({newsData.average_sentiment.toFixed(2)})
          </Badge>
        )}
      </HStack>

      {loading && (
        <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
          <Spinner color="blue.400" size="lg" />
        </Box>
      )}

      {error && (
        <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
          <Text color="red.300" textAlign="center">{error}</Text>
        </Box>
      )}

      {!loading && !error && newsData && totalArticles > 0 && (
        <Box flex={1} position="relative">
          {/* Navigation arrows */}
          <IconButton
            onClick={handlePreviousArticle}
            isDisabled={currentArticleIndex === 0}
            position="absolute"
            left={2}
            top="50%"
            transform="translateY(-50%)"
            bg="rgba(0,0,0,0.5)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.7)" }}
            zIndex={2}
            size="sm"
            aria-label="Previous article"
          >
            ←
          </IconButton>
          
          <IconButton
            onClick={handleNextArticle}
            isDisabled={currentArticleIndex === totalArticles - 1}
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            bg="rgba(0,0,0,0.5)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.7)" }}
            zIndex={2}
            size="sm"
            aria-label="Next article"
          >
            →
          </IconButton>

          {/* Article content */}
          <VStack align="flex-start" spacing={3} p={4} h="100%" position="relative">
            <Text color="#888" fontSize="sm">
              Article {currentArticleIndex + 1} of {totalArticles}
            </Text>
            
            <Text 
              fontWeight="bold" 
              fontSize="lg" 
              color="#e0e0e0"
              lineHeight="1.4"
              noOfLines={2}
            >
              {currentArticle?.title || 'No title available'}
            </Text>
            
            <Text 
              color="#aaa" 
              fontSize="md"
              lineHeight="1.5"
              noOfLines={4}
            >
              {currentSummary || currentArticle?.description || 'No summary available'}
            </Text>

            {currentArticle?.url && (
              <Text 
                color="blue.400" 
                fontSize="sm" 
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => window.open(currentArticle.url, '_blank')}
              >
                Read full article →
              </Text>
            )}

            {/* Individual article sentiment score */}
            {newsData?.sentiment_scores?.[currentArticleIndex] !== undefined && (
              <Badge
                bg={getSentimentColor(newsData.sentiment_scores[currentArticleIndex])}
                color="white"
                fontWeight="bold"
                fontSize="sm"
                borderRadius="md"
                px={3}
                py={1}
                position="absolute"
                bottom={4}
                right={4}
              >
                {getSentimentText(newsData.sentiment_scores[currentArticleIndex])} ({newsData.sentiment_scores[currentArticleIndex].toFixed(2)})
              </Badge>
            )}

            {/* Keyboard navigation hint */}
            {totalArticles > 1 && (
              <Text color="#666" fontSize="xs" mt="auto" pt={2}>
                Use ← → arrow keys or click arrows to navigate
              </Text>
            )}
          </VStack>
        </Box>
      )}

      {!loading && !error && (!newsData || totalArticles === 0) && (
        <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
          <Text color="#888">No news articles found</Text>
        </Box>
      )}
    </Box>
  );
} 