import { Request, Response, NextFunction } from "express";
import { decode, JwtPayload, verify } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";

async function authEnsure(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const client = new JwksClient({
    jwksUri: process.env.SUPABASE_JWKS_URI,
    timeout: 3000,
  });

  const tokenDecoded = decode(token, { complete: true });

  const kid = tokenDecoded?.header.kid;

  const key = await client.getSigningKey(kid);

  const signingKey = key.getPublicKey();

  const verifiedToken = verify(token, signingKey) as JwtPayload;

  req.userId = verifiedToken.sub;

  next();
}

export { authEnsure };
