import { createLocalJWKSet } from "jose";

const storedJWKS = JSON.parse(process.env.JWKS || "{}");

export const JWKS = createLocalJWKSet(storedJWKS);