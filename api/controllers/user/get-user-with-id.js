module.exports = {


  friendlyName: 'Get user with id',


  description: 'Get basic details of a user',


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

    let userRecord = await User.findOne({ select: ['id', 'firstName', 'lastName', 'profileImage', 'avatarFd', 'isCandidate'], where: { id: this.req.param('userId') } }).populate('friends')
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('UsageError: ', err); return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });

    // user does not exist
    if (!userRecord) {
      return exits.userNotFound({ success: false, message: 'User does not exist' });
    }

    return exits.success( { success: true, message: 'User details obtained successfully', user: userRecord } );

  }


};
