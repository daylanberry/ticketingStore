import axios from 'axios';

export default ({ req }) => {
  if (typeof Window === 'undefined') {
    // we're on the server
    return axios.create({
      baseURL: 'http://www.ticketing-prod1234.xyz',
      headers: req.headers
    });

  } else {
    // we're on the browser
    return axios.create({
      baseURL: '/'
    })

  }
}