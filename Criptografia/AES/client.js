// Cliente Node.js para consumir API AES
const axios = require('axios');
const crypto = require('crypto');

const SECRET_KEY = Buffer.from('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff', 'hex'); // 32 bytes
const URL = 'http://localhost:3001/data';

function decrypt(encrypted, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function main() {
  const payload = { message: 'Olá, AES!' };
  try {
    // Envia o payload para o servidor, recebe criptografado
    const response = await axios.post(URL, payload);
    const { encrypted, iv } = response.data;
    const decrypted = decrypt(encrypted, Buffer.from(iv, 'hex'));
    console.log('Payload descriptografado:', JSON.parse(decrypted));
    console.log('Criptografado:', encrypted);
  } catch (err) {
    console.error('Erro ao consumir API:', err.message);
  }
}

main();
