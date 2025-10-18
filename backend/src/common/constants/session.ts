export const sessionConstants = {
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: 'none' as 'none' | 'lax' | 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
};
