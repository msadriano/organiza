import { Request, Response, NextFunction } from "express";
import { decode, JwtPayload, verify } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { AppError } from "../utils/app.error";

const client = new JwksClient({
  jwksUri: process.env.SUPABASE_JWKS_URI,
  timeout: 3000,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000,
});

async function authEnsure(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token ausente" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  const tokenDecoded = decode(token, { complete: true });

  const kid = tokenDecoded?.header.kid;

  try {
    const key = await client.getSigningKey(kid);

    const signingKey = key.getPublicKey();

    const verifiedToken = verify(token, signingKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    req.userId = verifiedToken.sub;
  } catch (error) {
    throw new AppError("Token inválido", 401);
  }

  next();
}

export { authEnsure };
