// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';

const config = {
  initialMessages: [createChatBotMessage(`Hello, how may I help you?`)],
  botName: 'Bed&Breakfast Assistant',
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  }
}

export default config