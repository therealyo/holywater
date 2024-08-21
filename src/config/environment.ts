export enum Environment {
  TEST = 'test',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const isDev = (): boolean =>
  process.env.NODE_ENV !== Environment.PRODUCTION;
