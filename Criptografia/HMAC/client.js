// Cliente Node.js para consumir API HMAC
const axios = require('axios');
const crypto = require('crypto');

const SECRET_KEY = 'supersegredo1235'; // Mesma chave do servidor
const URL = 'http://localhost:3000/data';

async function main() {
  const payload = { message: 'Olá, HMAC!' };
  try {
    const response = await axios.post(URL, payload);
    const { payload: serverPayload, hmac: serverHmac } = response.data;
    const payloadString = JSON.stringify(serverPayload);
    const localHmac = crypto.createHmac('sha256', SECRET_KEY).update(payloadString).digest('hex');
    if (localHmac === serverHmac) {
      console.log('HMAC válido! Resposta autêntica.');
    } else {
      console.log('HMAC inválido! Resposta pode ter sido alterada.');
    }
    console.log('Payload recebido:', serverPayload);
    console.log('HMAC recebido:', serverHmac);
  } catch (err) {
    console.error('Erro ao consumir API:', err.message);
  }
}

main();
