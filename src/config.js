
const hostname = window.location.hostname;

export const API_URL =
  hostname === 'localhost'
    ? 'http://localhost:8181'
    : `https://${hostname.replace('-4173.', '-8181.')}`;

console.log('API_URL:', API_URL);
