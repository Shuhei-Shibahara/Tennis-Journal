interface DBConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
}

interface JWTConfig {
  secret: string | undefined;
  expiresIn: string | undefined;
}

interface Config {
  environment: string;
  port: number | string;
  db: DBConfig;
  jwtConfig: JWTConfig;
}

const config: Config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
  },
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
};

export default config;