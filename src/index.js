const express = require('express');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const data = JSON.parse(fs.readFileSync('src/talker.json', 'utf-8'));
  res.status(200).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const data = JSON.parse(fs.readFileSync('src/talker.json', 'utf-8'));
  const talkerObj = data.find((e) => e.id === Number(req.params.id));

  if (talkerObj) {
    return res.status(200).json(talkerObj);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

const newToken = () => crypto.randomBytes(8).toString('hex');

app.post('/login', (_req, res) => {
  res.status(200).json({ token: newToken() });
});

app.listen(PORT, () => {
  console.log('Online');
});
