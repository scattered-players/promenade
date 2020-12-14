import baseConfig from './base';
import { DOMAIN } from 'custom/config.json';

const config = {
  appEnv: 'dist',
  JANUS_DOMAIN: DOMAIN,
  STREAM_HOST:  `https://services.${DOMAIN}:9000`,
  SERVICE_HOST: `https://services.${DOMAIN}`,
  SOCKET_ADDRESS: `wss://services.${DOMAIN}`,
  ADMIN_URL: `https://${DOMAIN}/admin/`,
  ACTOR_URL: `https://${DOMAIN}/actor/`,
  ATTENDEE_URL: `https://${DOMAIN}/attendee/`,
  GUIDE_URL: `https://${DOMAIN}/guide/`,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
