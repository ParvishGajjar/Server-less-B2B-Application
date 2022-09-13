class MessageParser {
    constructor(actionProvider, state) {
        this.actionProvider = actionProvider;
        this.state = state;
    }

    parse(message) {
        console.log('Message is', message)
        this.actionProvider.pushResponse(message)
    }
}

export default MessageParser;