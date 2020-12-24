import baseConfig from './base';
import { DOMAIN } from 'custom/config.json';

const config = {
  appEnv: 'dev',
  JANUS_DOMAIN: DOMAIN,
  STREAM_HOST:`${location.protocol}//${location.hostname}:9000/live`,
  SERVICE_HOST: `${location.protocol}//${location.host}/api`,
  SOCKET_ADDRESS: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api`,
  ADMIN_URL: `${location.protocol}//${location.host}/admin/`,
  ACTOR_URL: `${location.protocol}//${location.host}/actor/`,
  ATTENDEE_URL: `${location.protocol}//${location.host}/attendee/`,
  GUIDE_URL: `${location.protocol}//${location.host}/guide/`,
};

export default Object.freeze(Object.assign({}, baseConfig, config));
