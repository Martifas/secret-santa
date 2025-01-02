import config from '@server/config';
import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';


const jwksClient = jwksRsa({
  jwksUri: `${config.auth0.issuerBaseURL}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

export async function verifyAuth0Token(token: string) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header.kid) {
    throw new Error('Invalid token');
  }
  const key = await jwksClient.getSigningKey(decoded.header.kid);
  const signingKey = key.getPublicKey();
  return jwt.verify(token, signingKey, {
    algorithms: ['RS256'],
    audience: config.auth0.audience,
    issuer: config.auth0.issuerBaseURL,
  });
}

export const auth0Middleware = auth({
  issuerBaseURL: config.auth0.issuerBaseURL,
  audience: config.auth0.audience,
  jwksUri: `${config.auth0.issuerBaseURL}/.well-known/jwks.json`
});