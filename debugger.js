const debug = {}
debug['log'] = require('debug')('hermescraft-admin:log')
debug['success'] = require('debug')('hermescraft-admin:success')
debug['error'] = require('debug')('hermescraft-admin:error')

module.exports = debug
