import jwt from 'jsonwebtoken';

const secret = 'secretKey';

export function authenticate(req:any, res:any, next:any) {
  const token = req.headers['auth'];
  if (!token) {
    res.status(401).send({ error: 'No token provided' });
  } else {
    jwt.verify(token, secret, (error:any, decoded:any) => {
      if (error) {
        res.status(401).send({ error: 'Token is not valid' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
}