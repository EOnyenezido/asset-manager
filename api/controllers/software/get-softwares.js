module.exports = {


  friendlyName: 'Get softwares',


  description: 'Get softwares assets to display on a table',


  inputs: {

  },


  exits: {

    softwareNotFound: {
      statusCode: 404,
      description: 'No softwares to share'
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


  fn: async function (inputs, exits) { // using -0 to convert to number
    let lastId = this.req.param('softwareId')-0;
    let greaterOrLess = { '<': lastId };
    greaterOrLess = lastId === 0 ? { '>': lastId } : greaterOrLess;

    let records = await Software.find({ where: { id: greaterOrLess }, sort: 'id DESC' }).limit(sails.config.custom.paginationLimit) // eslint-disable-line no-undef
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });

    // no softwares yet
    if (!records) {
      return exits.softwareNotFound({ success: false, message: 'No softwares assets records yet' });
    }

    return exits.success( { success: true, message: 'Software records obtained successfully', softwares: records } );

  }


};
