export const getEnv = (key: string): string => {
  return typeof process !== 'undefined' && process.env?.[key]
    ? String(process.env[key])
    : '';
};
