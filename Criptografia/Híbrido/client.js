// Cliente Node.js - Criptografia Híbrida (AES + RSA)
const axios = require('axios');
const crypto = require('crypto');

const SERVER_URL = 'http://localhost:3001';

async function main() {
  // 1. Obtém a chave pública do servidor
  const { data: publicKeyPem } = await axios.get(`${SERVER_URL}/public-key`);
  const publicKey = crypto.createPublicKey(publicKeyPem);

  // 2. Gera chave AES e IV aleatórios
  const aesKey = crypto.randomBytes(32); // 256 bits
  const iv = crypto.randomBytes(16); // 128 bits

  // 3. Criptografa o payload com AES
  const payload = { message: 'Olá, criptografia híbrida!' };
  const payloadString = JSON.stringify(payload);
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedPayload = cipher.update(payloadString, 'utf8', 'base64');
  encryptedPayload += cipher.final('base64');

  // 4. Criptografa a chave AES com a chave pública RSA
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    aesKey
  ).toString('base64');

  // 5. Envia para o servidor
  const response = await axios.post(`${SERVER_URL}/data`, {
    encryptedKey,
    encryptedPayload,
    iv: iv.toString('hex'),
  });

  console.log('Resposta do servidor:', response.data);
}

main().catch(err => {
  console.error('Erro no cliente:', err.message);
});
