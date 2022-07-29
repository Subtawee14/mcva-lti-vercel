const express = require('express');
const cookieParser = require('cookie-parser');
const { sign } = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Connected');
});

app.post('/api/connect', (req, res) => {
  const { tokenData } = login(req.body);

  res.cookie('Authorization', tokenData.token, {
    expires: new Date(Date.now() + 3600000),
    sameSite: 'none',
    secure: true,
  });

  //   res.redirect(302, 'http://localhost:3400/');
  res.redirect(302, 'https://mcva-lti-web-demo.vercel.app');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const login = (data) => {
  const tokenData = createToken(data);
  const cookie = createCookie(tokenData);

  return { cookie, data, tokenData };
};

const createToken = (data) => {
  const dataStoredInToken = { ...data };
  const secretKey = 'secret';
  const expiresIn = 60 * 60;

  return {
    expiresIn,
    token: sign(dataStoredInToken, secretKey, { expiresIn }),
  };
};

const createCookie = (tokenData) => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};
