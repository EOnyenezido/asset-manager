module.exports = {


  friendlyName: 'Delete software',


  description: 'A user can delete software asset records',


  inputs: {

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    softwareNotFound: {
      statusCode: 404,
      description: 'Software asset does not exist'
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

    if (!this.req.me.id) {
      return exits.userNotFound({ success: false, message: 'The provided token does not match a user' });
    }

    await Software.destroy({id: this.req.param('softwareId')}) // eslint-disable-line no-undef
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .fetch(); // fetch so user activity can be updated;

    return exits.success( { success: true, message: 'Software asset deleted successfully' } );

  }


};
