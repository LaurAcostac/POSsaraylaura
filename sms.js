const accountSid = "ACf0071bc457678cd3833aa6075caf606b";
const authToken = "62d753f4d004b7ba242305da008946c2";
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Mensaje enviado desde twiliooo',
     from: '+13613493213',
     to: '+573052792464'
   })
  .then(message => console.log(message.sid));