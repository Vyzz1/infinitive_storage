import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string | number;
      username: string;
      [key: string]: any;
    };
  }
}
