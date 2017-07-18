module.exports = {
  userId    : process.env.USER_ID    || 'YOUR_USER_ID', // <-- note, this is not the same as the username you used to login to the portal
  apiToken  : process.env.API_TOKEN  || 'YOUR_API_TOKEN',
  apiSecret : process.env.API_SECRET || 'YOUR_API_SECRET'
}
