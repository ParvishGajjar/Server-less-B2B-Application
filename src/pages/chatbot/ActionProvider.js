import { retrieveNextMessage } from "./BotAPICall";

// ActionProvider starter code
class ActionProvider {
    constructor(
        createChatBotMessage,
        setStateFunc,
        createClientMessage,
        stateRef,
        createCustomMessage,
        ...rest
    ) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
        this.stateRef = stateRef;
        this.createCustomMessage = createCustomMessage;
    }

    pushResponse(message) {
        console.log('Message', message)
        retrieveNextMessage(message).then((response) => {
            console.log('Output message', response.outputMessage)
            var messageByLines = response.outputMessage.split('\n')
            for(var i=0;i<messageByLines.length;i++)
                    this.updateState(this.createChatBotMessage(messageByLines[i]))   
        });
        
    }

    updateState(message) {
        this.setState(prevState => ({
            ...prevState, messages: [...prevState.messages, message]
        }))
    }
}

export default ActionProvider;