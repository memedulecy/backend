export const Env = {
    PORT: 'PORT',
} as const;

export type EnvKey = keyof typeof Env;
