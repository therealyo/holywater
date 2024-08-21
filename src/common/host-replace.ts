import { isDev } from 'src/config/environment';

export const replaceDevHost = (url: string) =>
  isDev() ? url.replace('host.docker.internal', 'localhost') : url;
