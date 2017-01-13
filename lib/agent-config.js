'use strict';
const edgeConfig = require('microgateway-config');
const agent = require('./server')();
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const cluster = require('cluster');

/**
 * starts an configures agent
 * @param env {source,target,keys{key,secret}}
 * @param cb
 */
module.exports = function configureAndStart(options, cb) {
  assert(options.target, 'must have target');
  getConfigStart(options, cb);
};

const getConfigStart = function getConfigStart(options, cb) {
  fs.exists(options.target, (exists) => {
    if (exists) {
      const config = edgeConfig.load({ source: options.target });
      const keys = {key: config.analytics.key, secret: config.analytics.secret};
      startServer(keys, options.pluginDir,config, cb);
    } else {
      return cb(options.target+" must exist")
    }
  });
  assert(options.target, 'must have target')
  startWithConfig(options, cb);
};

const startWithConfig = function getConfigStart(options, cb) {
  startServer(options.keys, options.pluginDir, JSON.parse(process.env.CONFIG), cb);
};

const startServer = function startServer(keys, pluginDir,config, cb) {
  agent.start(keys, pluginDir, config, function (err) {
    cb(err, agent, config);
  });
}
