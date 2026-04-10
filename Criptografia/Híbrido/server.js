// Servidor Node.js - Criptografia Híbrida (AES + RSA)
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Gera par de chaves RSA (apenas para exemplo; em produção, salve as chaves)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

app.use(bodyParser.json());

// Endpoint para obter a chave pública
app.get('/public-key', (req, res) => {
  res.send(publicKey.export({ type: 'pkcs1', format: 'pem' }));
});

// Endpoint para receber dados criptografados
app.post('/data', (req, res) => {
  const { encryptedKey, encryptedPayload, iv } = req.body;
  try {
    // Descriptografa a chave AES com a chave privada RSA
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedKey, 'base64')
    );
    // Descriptografa o payload com a chave AES
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedPayload, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    res.json({ decrypted: JSON.parse(decrypted) });
  } catch (err) {
    res.status(400).json({ error: 'Falha na descriptografia', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor híbrido rodando em http://localhost:${PORT}`);
  console.log('Chave pública disponível em /public-key');
});
