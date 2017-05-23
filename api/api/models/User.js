"use strict";

/**
 * User
 * @description :: Model for storing User records
 */

module.exports = {
  schema: true,

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
    },

    password: {
      type: 'text',
      required: true,
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    toJSON() {
      let obj = this.toObject()

      delete obj.password

      return obj
    }
  },

  afterCreate: (values, next) => {
    delete values.password;
    sails.sockets.broadcast('user', 'post', values);
    next();
  },

  afterUpdate: (values, next) => {
    delete values.password;
    sails.sockets.broadcast('user', 'put', values);
    next();
  },

  afterDestroy: (values, next) => {
    values = values.map(item => {
      delete item.password;
      return item;
    });
    sails.sockets.broadcast('user', 'delete', values);
    next();
  },

  beforeUpdate: (values, next) => {
    if (false === values.hasOwnProperty('password')) return next()
    if (/^\$2[aby]\$[0-9]{2}\$.{53}$/.test(values.password)) return next()

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash
        next()
      })
      .catch(next)
  },

  beforeCreate: (values, next) => {
    if (false === values.hasOwnProperty('password')) return next()

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash
        next()
      })
      .catch(next)
  }
}
