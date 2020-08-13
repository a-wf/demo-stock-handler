declare module 'config' {
  export interface CommonConfig {
    nodeEnv: string;
  }

  export interface DBConfigByEnv {
    client: string;
    connection: {
      host: string;
      user: string;
      password: string;
      database: string;
    };
    pool: {
      min: number;
      max: number;
    };
    migrations: { directory: string };
    seeds: { directory: string };
  }

  export interface DatabaseConfig {
    [env: string]: DBConfigByEnv;
  }

  export interface LoggerConfig {
    level: string;
    file: {
      name: string;
      path: string;
      maxSize: number;
      maxFiles: number;
    };
  }

  export interface MonitorConfig {
    enable: boolean;
    port: number;
  }

  export interface RateLimiterConfig {
    points: number;
    duration: number;
  }

  export interface ServerConfig {
    apiType: string;
    protocol: string;
    port: number;
    adminLogin: string;
    adminPassword: string;
    token_secret: string;
    apikey: string;
    ssl: {
      key: string;
      cert: string;
    };
  }
}
