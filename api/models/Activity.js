/**
 * Activity.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    // Add a reference to User
    owner: {
      model: 'user',
    },

    // Add a type for analytics
    type: {
      type: 'string',
      required: true,
      description: 'Type of user activity',
      example: 'asset, share, device, etc.',
      maxLength: 30,
    },

    // Add the action for analytics
    action: {
      type: 'string',
      required: true,
      description: 'The action performed by the user',
      example: 'create, update, delete',
      maxLength: 30,
    },

    // Any user, asset, device who was affected by the activity, also add as affectedType
    user: {
      model: 'user',
    },

    // Add a model which was affected to enable populate to work, must be a linked relationship above
    affectedType: {
      type: 'string',
      required: true,
      description: 'Model which was affected',
      example: 'asset, user, device, etc.',
      maxLength: 30,
    },

    // Should this activity be displayed or for analytics only
    analytics: {
      type: 'boolean',
      description: 'True - this activity is for analytics only',
      defaultsTo: true,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

