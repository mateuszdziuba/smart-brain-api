const jwt = require('jsonwebtoken');

const redisClient = require('./signin').redisClient;

const handleRegister = (req, res, db, bcrypt) => {
  const {
    email,
    name,
    password
  } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  return db.transaction(trx => {
      trx.insert({
          hash,
          email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => user[0])
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => Promise.reject('unable to register'))
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSessions = (user) => {
  const { id, email } = user;
  const token = signToken(email);
  return setToken(token, id)
  .then(() => {
    return { success: 'true', userId: id, token }
  })
  .catch(console.log)
}

const registerAuthentication = (req, res, db, bcrypt) => {
  return handleRegister(req, res, db, bcrypt)
    .then(data => {
      return data.id && data.email ? createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  registerAuthentication
};
