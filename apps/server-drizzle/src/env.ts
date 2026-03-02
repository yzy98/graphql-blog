import "dotenv/config";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
};

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
};
