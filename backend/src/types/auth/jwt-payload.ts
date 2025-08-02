export type JwtPayload = {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    lastname: string;
    id: string;
    iat: number;
    iss: string;
    aud: string;
    exp: number;
    sub: string;
  }