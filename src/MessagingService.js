const axios = require('axios');
require('dotenv').config();

module.exports.SendMessageToRoblox = async function sendMessage(message, topic) {
     const response = await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${process.env.UNIVERSE_ID}/topics/${topic}`,
        {
            'message': message
        },
        {
            headers: {
                'x-api-key': process.env.OPENCLOUD_KEY,
                'Content-Type': 'application/json'
            }
        }
    ).catch(err =>{
        console.log(err.response.status)
        if (err.response.status == 401) return `**Error:** API key not valid for operation, user does not have authorization`;
        if (err.response.status == 403) return `**Error:** Publish is not allowed on universe.`;
        if (err.response.status == 500) return `**Error:** Server internal error / Unknown error.`;
        if (err.response.status == 400){
            if (err.response.data == "requestMessage cannot be longer than 1024 characters. (Parameter 'requestMessage')") `**Error:** The request message cannot be longer then 1024 characters long.`;
            console.log(err.response.data)
        }
  })
    if (response){
        if (response.status == 200) return true;
        if (response.status != 200) return `**Error:** An unknown issue has occurred.`
    }
}