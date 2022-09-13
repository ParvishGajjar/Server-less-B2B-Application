const BotGatewayURI = 'https://ots7p7rnhq7cvg2qsu43symnzi0kzkrs.lambda-url.us-east-1.on.aws/'

export const retrieveNextMessage = async (object) => {
    const localStorageUserId = localStorage.getItem('userId')
    const localStorageEmail = localStorage.getItem('email')

    console.log('Local Storage User Id', localStorageUserId)
    console.log('Local Storage Email', localStorageEmail)
    const requestBody = {
        'userId': null == localStorageUserId ? "guestuser" : localStorageUserId,
        'userName':'botuser',
        'inputMessage': object
    }
    console.log('Request body' + JSON.stringify(requestBody))
    const response = await fetch(`${BotGatewayURI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    const data = await response.json()
    console.log('JSON data', data)
    return data
  };