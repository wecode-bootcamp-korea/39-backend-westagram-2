const jwt = require('jsonwebtoken');

const payLoad = {foo : 'bar'};
const secretKey = 'mySecretKey';
const jwtToken = jwt.sign(payLoad, secretKey);

console.log(jwtToken)

const decoded = jwt.verify(jwtToken, secretKey)

console.log(decoded)