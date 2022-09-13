import { Button } from "react-bootstrap";
import Chatbot from 'react-chatbot-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import 'react-chatbot-kit/build/main.css';
import { useState } from 'react';

const ChatBotEmbedder = () => {
    const[botDispay, setBotDisplay] = useState(false)

    return(
        <div style={{
            position: 'fixed',
            right: '0',
            bottom: '0',
            
          }}>
            <Button variant="info" size="lg" style = {{width: '275px'}} onClick={e => setBotDisplay( botDispay => !botDispay)}>Bot</Button>
            {botDispay && <Chatbot config={config} actionProvider = {ActionProvider} messageParser = {MessageParser} />}
          </div>
    )
}

export default ChatBotEmbedder