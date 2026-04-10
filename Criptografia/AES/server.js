// Servidor Node.js com AES
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const SECRET_KEY = Buffer.from('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff', 'hex'); // 32 bytes
const IV = Buffer.from('0102030405060708090a0b0c0d0e0f10', 'hex'); // 16 bytes

app.use(bodyParser.json());

function encrypt(text) {
  const iv = crypto.randomBytes(16); // IV aleatório
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

// Endpoint que retorna payload criptografado
app.post('/data', (req, res) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload);
  const { encrypted, iv } = encrypt(payloadString);
  res.json({ encrypted, iv }); // IV agora é dinâmico
});

app.listen(PORT, () => {
  console.log(`Servidor AES rodando em http://localhost:${PORT}`);
});
