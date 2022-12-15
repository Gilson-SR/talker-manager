const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const { validateLogin } = require('./middlewares/validateLogin');
const { validateAge } = require('./middlewares/validateAge');
const { validateAuthentication } = require('./middlewares/validateAuthentication');
const { validateName } = require('./middlewares/validateName');
const { validateTalk } = require('./middlewares/validateTalk');

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

app.post('/login', validateLogin, (_req, res) => {
  res.status(200).json({ token: newToken() });
});

app.post('/talker',
validateAuthentication, validateName, validateAge, validateTalk,
  (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = JSON.parse(fs.readFileSync('src/talker.json'));
    const addTalk = { id: talkers.length + 1, name, age, talk };
    talkers.push(addTalk);
    fs.writeFileSync('src/talker.json', JSON.stringify(talkers));
    res.status(201).json(addTalk);
  });

app.listen(PORT, () => {
  console.log('Online');
});
