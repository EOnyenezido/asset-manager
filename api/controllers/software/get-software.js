module.exports = {


  friendlyName: 'Get software asset',


  description: 'Get a particular software asset record',


  inputs: {

  },


  exits: {

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

    let record = await Software.findOne({ id: this.req.param('softwareId') }) // eslint-disable-line no-undef
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });

    // record does not exist
    if (!record) {
      return exits.softwareNotFound({ success: false, message: 'Software does not exist' });
    }

    return exits.success( { success: true, message: 'Software record obtained successfully', software: record } );

  }


};
