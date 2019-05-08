module.exports = {


  friendlyName: 'Delete my account',


  description: 'Allow a user delete his account.',


  inputs: {

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The required parameter user id is not provided',
    },

    internalServerError: {
      statusCode: 500,
      description: 'An error occured on the server, we will respond soon'
    }

  },


  fn: async function (inputs, exits) {

    let userRecord = await User.destroy({ id: this.req.me.id })
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .fetch(); // fetch so user activity can be updated

    // user does not exist
    if (!userRecord || userRecord.length === 0) {
      return exits.userNotFound({ success: false, message: 'User does not exist' });
    }

    return exits.success( { success: true, message: 'Account deleted successfully' } );

  }


};
