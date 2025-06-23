import { useState, useEffect, useCallback } from 'react';

export const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Check if Speech Recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSupported(true);
            
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognitionInstance.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                setTranscript(speechResult);
            };

            recognitionInstance.onerror = (event) => {
                setError(`Speech recognition error: ${event.error}`);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setIsSupported(false);
            setError('Speech recognition not supported in this browser');
        }

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            setTranscript('');
            setError(null);
            recognition.start();
        }
    }, [recognition, isListening]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
        }
    }, [recognition, isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    // Parse problem from speech transcript
    const parseProblemFromSpeech = useCallback((speechText) => {
        const text = speechText.toLowerCase().trim();
        
        // Simple parsing logic - can be enhanced
        const patterns = {
            // Match patterns like "add problem two sum easy"
            basic: /(?:add\s+problem\s+)?(.+?)(?:\s+(easy|medium|hard))?$/i,
            // Match patterns like "create problem binary search medium"
            create: /(?:create\s+problem\s+)?(.+?)(?:\s+(easy|medium|hard))?$/i,
            // Match patterns like "new problem valid parentheses easy"
            new: /(?:new\s+problem\s+)?(.+?)(?:\s+(easy|medium|hard))?$/i
        };

        for (const [patternName, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                const title = match[1]
                    .replace(/\s+/g, ' ')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                const difficulty = match[2] 
                    ? match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
                    : 'Medium';

                return {
                    title,
                    difficulty: ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium',
                    confidence: patternName === 'basic' ? 0.9 : 0.7
                };
            }
        }

        // Fallback: treat entire text as title with default medium difficulty
        return {
            title: text.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            difficulty: 'Medium',
            confidence: 0.5
        };
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
        parseProblemFromSpeech
    };
};