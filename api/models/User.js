/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad',
      custom: function(value) {
        // • be a string
        // • be at least 8 characters long
        // • contain at least one number
        // • contain at least one letter
        return _.isString(value) && value.length >= 8 && value.match(/[a-z]/i) && value.match(/[0-9]/);
      }
    },

    firstName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s first name',
      maxLength: 50,
      example: 'Emeka'
    },

    lastName: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s last name',
      maxLength: 50,
      example: 'Onyenezido'
    },

    phoneNumber: {
      type: 'number',
      required: true,
      unique: true,
      description: 'Phone number',
      example: '07035382411',
      custom: function(value) {
        // • be a number
        // • be equal to 10 digits with leading zero removed
        return _.isNumber(value) && value.toString().length === 10;
      }
    },

    profileImage: {
      type: 'string',
      description: 'Link to the user\'s profile picture',
      maxLength: 1000,
    },

    avatarFd: {
      type: 'string',
      description: 'Link to the user\'s profile picture',
      maxLength: 1000,
    },

    // Add a one to many reference to user's Activity
    activity: {
      collection: 'activity',
      via: 'owner'
    },

    isSuperAdmin: {
      type: 'boolean',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },

    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a

  },
  customToJSON: function() {
    // Return a shallow copy of this record with the password and isSuperAdmin removed.
    return _.omit(this, ['password', 'isSuperAdmin']);
  },

  afterCreate: async (newlyCreatedRecord, proceed) => {
    // Add activity for analytics
    await sails.helpers.addActivity.with({
      owner: newlyCreatedRecord.id,
      type: 'user',
      action: 'create',
      user: newlyCreatedRecord.id,
      affectedType: 'user',
    })
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', newlyCreatedRecord, err); return proceed(); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', newlyCreatedRecord, err); return proceed(); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', newlyCreatedRecord, err); return proceed(); });

    return proceed();
  },

  afterUpdate: async (updatedRecord, proceed) => {
    // Add activity for analytics
    await sails.helpers.addActivity.with({
      owner: updatedRecord.id,
      type: 'user',
      action: 'update',
      user: updatedRecord.id,
      affectedType: 'user',
    })
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', updatedRecord, err); return proceed(); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', updatedRecord, err); return proceed(); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', updatedRecord, err); return proceed(); });

    return proceed();
  },

  afterDestroy: async (destroyedRecord, proceed) => {
    // Add activity for analytics
    await sails.helpers.addActivity.with({
      owner: destroyedRecord.id,
      type: 'user',
      action: 'delete',
      user: destroyedRecord.id,
      affectedType: 'user',
    })
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', destroyedRecord, err); return proceed(); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', destroyedRecord, err); return proceed(); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', destroyedRecord, err); return proceed(); });

    return proceed();
  }


};

