const path = require('path');
const fs = require('fs').promises;
const NodeMediaServer = require('node-media-server');

const { SHOW_DOMAIN_NAME } = require('../secrets/promenade-config.json');

module.exports = app => {
  const config = {
    logType: 3,
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: app.locals.ENV_DEVELOPMENT ? 9000 : 9001,
      allow_origin: '*',
      mediaroot: path.resolve(__dirname, '../media')
    },
    trans: {
      ffmpeg: '/usr/bin/ffmpeg',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments:hls_segment_type=fmp4]',
          dash: true,
          dashFlags: '[f=dash:seg_duration=2:window_size=3:extra_window_size=5]'
        }
      ]
    }
  };

  if(!app.locals.ENV_DEVELOPMENT){
    config.https = {
      port: 9000,
      key: `/etc/letsencrypt/live/services.${SHOW_DOMAIN_NAME}/privkey.pem`,
      cert: `/etc/letsencrypt/live/services.${SHOW_DOMAIN_NAME}/cert.pem`
    };
  }
   
  return new NodeMediaServer(config);
};