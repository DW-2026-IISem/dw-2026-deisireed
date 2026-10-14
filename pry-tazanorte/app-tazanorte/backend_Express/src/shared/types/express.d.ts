declare global {
  namespace Express {
    interface UserPayload {
      sub: string;
      id?: string;
      email: string;
      roles: string[];
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
