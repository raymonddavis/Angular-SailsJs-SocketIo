"use strict";

/**
 * UserController
 * @description :: Server-side logic for ...
 */

module.exports = {
  subscribe: function(req, res) {
    if(!req.isSocket) {
      return res.badRequest();
    }
    
    sails.sockets.join(req.socket, 'user');

    return res.ok();
  }
};
