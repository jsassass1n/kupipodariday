import { Request as ExpressRequest } from 'express';

interface RequestUser {
  id: number;
  username: string;
}

declare module 'express' {
  interface Request extends ExpressRequest {
    user?: RequestUser;
  }
}
