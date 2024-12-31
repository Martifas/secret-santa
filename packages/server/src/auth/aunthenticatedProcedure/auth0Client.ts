import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const config = {
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
} as const;

const jwksClient = jwksRsa({
  jwksUri: `${config.issuerBaseURL}/.well-known/jwks.json`,
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
    audience: config.audience,
    issuer: config.issuerBaseURL,
  });
}

export const auth0Middleware = auth(config);