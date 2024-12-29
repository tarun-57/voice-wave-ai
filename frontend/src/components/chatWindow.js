import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  // const startListening = () => SpeechRecognition.startListening({ continuous: true });
  // // const {
  // //   transcript,
  // //   listening,
  // //   resetTranscript,
  // //   browserSupportsSpeechRecognition
  // // } = useSpeechRecognition();

  useEffect(() => {
    console.log("in useeff")
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Speech recognition is not supported in your browser. Please try a different browser like Chrome.');
    }
  }, []);

  // Handle speech input
  const handleSpeech = () => {
    console.log("isListening", isListening); // Debugging log

    if (isListening) {
      console.log("stopped listening");
      SpeechRecognition.stopListening();
      setIsListening(false);
      console.log("Transcript captured:", transcript); // Debugging log
      setInput(transcript); // Update the input field with the spoken text
    } else {
      resetTranscript();
      console.log("listening...");
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  // Handle manual text input changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Send message to ChatGPT
  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    console.log("Input to send:", input); // Debugging log
    const userMessage = { role: 'user', content: input };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [...messages, userMessage],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Replace YOUR_API_KEY with your actual API key
          }
        }
      );

      console.log("AI response:", response.data); // Debugging log
      const aiMessage = { role: 'assistant', content: response.data.choices[0].message.content };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with ChatGPT API:', error); // Debugging log
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, there was an error. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Assistant</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleSpeech} style={{ marginRight: '10px' }}>
          {isListening ? 'Stop Listening' : 'Speak'}
        </button>
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {/* <div>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button
          onTouchStart={startListening}
          onMouseDown={startListening}
          onTouchEnd={SpeechRecognition.stopListening}
          onMouseUp={SpeechRecognition.stopListening}
        >Hold to talk</button>
        <p>ok {transcript}</p>
      </div> */}

      {/* Real-time transcript display */}
      <p style={{ fontStyle: 'italic', color: listening ? 'green' : 'red' }}>
        {listening ? `Listening: ${transcript}` : 'Click Speak to start'}
      </p>

      {/* Message input field */}
      <textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message or click Speak to use voice input"
        rows={3}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      {/* Chat messages */}
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              marginBottom: '10px',
              color: msg.role === 'user' ? 'blue' : 'black',
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatApp;
