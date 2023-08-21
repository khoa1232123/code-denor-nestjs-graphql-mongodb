import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

export type ContextType = {
  req: Request & {
    session: { userId?: string; token?: string } & Session &
      Partial<SessionData>;
  };
  res: Response;
};
