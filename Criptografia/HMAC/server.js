// Servidor Node.js com HMAC
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersegredo123'; // Chave secreta compartilhada

app.use(bodyParser.json());

// Endpoint protegido por HMAC
app.post('/data', (req, res) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(payloadString).digest('hex');
  res.json({ payload, hmac });
});

app.listen(PORT, () => {
  console.log(`Servidor HMAC rodando em http://localhost:${PORT}`);
});
