import React, { useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceRecognition } from '../../Hooks/useVoiceRecognition';

const VoiceInput = ({ 
    onTranscript, 
    onParsedProblem, 
    className = "",
    disabled = false,
    placeholder = "Click to speak..."
}) => {
    const {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
        parseProblemFromSpeech
    } = useVoiceRecognition();

    useEffect(() => {
        if (transcript && onTranscript) {
            onTranscript(transcript);
        }
        
        if (transcript && onParsedProblem) {
            const parsed = parseProblemFromSpeech(transcript);
            onParsedProblem(parsed);
        }
    }, [transcript, onTranscript, onParsedProblem, parseProblemFromSpeech]);

    const handleVoiceToggle = () => {
        if (disabled) return;
        
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    if (!isSupported) {
        return (
            <div className={`flex items-center justify-center p-2 text-xs text-gray-500 bg-gray-100 rounded-lg ${className}`}>
                <MicOff className="h-4 w-4 mr-1" />
                Voice not supported
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <button
                type="button"
                onClick={handleVoiceToggle}
                disabled={disabled}
                className={`touch-target w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    isListening 
                        ? 'bg-red-50 border-red-300 text-red-700 animate-pulse' 
                        : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? (
                    <>
                        <Volume2 className="h-5 w-5" />
                        <span className="font-medium">Listening...</span>
                    </>
                ) : (
                    <>
                        <Mic className="h-5 w-5" />
                        <span className="font-medium">Voice Input</span>
                    </>
                )}
            </button>
            
            {/* Transcript Display */}
            {transcript && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                        <Volume2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-1">You said:</p>
                            <p className="text-sm text-gray-600 italic">"{transcript}"</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                        <MicOff className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-700 mb-1">Voice Error:</p>
                            <p className="text-xs text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Usage Hints */}
            {!transcript && !error && (
                <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>💡 Try saying:</p>
                    <p>"Add problem Two Sum Easy"</p>
                    <p>"Create Binary Search Medium"</p>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;