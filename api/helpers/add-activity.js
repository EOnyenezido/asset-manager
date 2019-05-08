module.exports = {


  friendlyName: 'Add activity',


  description: 'Track every activity performed by a user, for security and audit purposes',


  inputs: {
    // User performing the activity
    owner: {
      type: 'number',
      required: true,
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
      type: 'number',
      allowNull: true,
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
      description: 'True - this activity is for analytics only (defaults to true)',
    },
  },


  exits: {
    userNotFound: {
      description: 'User does not exist'
    },

    invalid: {
      description: 'The required parameter user id is not provided',
    },

    internalServerError: {
      description: 'An error occured on the server, we will respond soon'
    }
  },


  fn: async function (inputs, exits) {

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    await Activity.create(inputs) // eslint-disable-line no-undef
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });

    // All done.
    return exits.success();

  }


};

