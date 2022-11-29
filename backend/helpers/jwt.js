const jwt = require('jsonwebtoken');

const generateJWT = (uid) => new Promise((resolve, reject) => {
  const payload = {
    uid,
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '6h' },
    (err, token) => {
      if (err) {
        console.log(err);
        reject(new Error('Could not generate JWT'));
      } else {
        resolve(token);
      }
    },
  );
});
module.exports = {
  generateJWT,
};
