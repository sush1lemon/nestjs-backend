export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  jwt: {
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'notsosecret',
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'notsosecret',
  },
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.replace(/\s/g, '').split(',')
      : [],
    credentials: process.env.CORS_CREDENTIALS
      ? process.env.CORS_CREDENTIALS == 'true'
      : false,
  },
});
