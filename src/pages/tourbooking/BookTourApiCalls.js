const PublishMessageURI = 'https://us-central1-assignment2-352803.cloudfunctions.net/tourBookings'
const toursURI = 'https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/getTours'
const recommendToursURI = 'https://us-central1-csci5410-assignment4-fenil.cloudfunctions.net/getRecommendation'


export const publishTourBookingMessage = async (object) => {
  const response = await fetch(`${PublishMessageURI}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(object)
  })
  const data = await response.json()
  return data
};

export const viewAvailableTours = async (object) => {
  const response = await fetch(`${toursURI}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  const data = await response.json()
  return data
};


export const recommendGenricTours = async () => {
  const response = await fetch(`${recommendToursURI}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  const data = await response.json()
  return data
};

export const recommendToursWithDays = async (tourDays) => {
  const response = await fetch(`${recommendToursURI}?tourDays=${tourDays}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  const data = await response.json()
  return data
};
