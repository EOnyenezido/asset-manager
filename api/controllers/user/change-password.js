module.exports = {


  friendlyName: 'Change password',


  description: 'User can change their password',


  inputs: {

    currentPassword:  {
      type: 'string',
      required: true,
      example: 'password123',
      description: 'The user\'s current password.',
    },

    newPassword:  {
      type: 'string',
      required: true,
      example: 'password1234',
      description: 'The user\'s new password.',
    }

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'Username and password combination does not exist',
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

    const owner = this.req.me.id;

    const userRecord = await User.findOne({id: owner})
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });

    if(!userRecord) {
      return exits.userNotFound({ success: false, message: 'The provided token does not match a user' });
    }

    sails.helpers.passwords.checkPassword(inputs.currentPassword, userRecord.password)
    .then(async () => {
      // Current password matches user password. Set new password
      await User.update({id: owner }).set({password: await sails.helpers.passwords.hashPassword(inputs.newPassword)})
      .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
      .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
      .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });
      
      // Log password change activity
      const activity = {
        owner: owner,
        type: 'user',
        action: 'change-password',
        user: owner,
        affectedType: 'user',
      };
      
      await sails.helpers.addActivity.with(activity)
      .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', activity, err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` });})
      .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', activity, err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` });})
      .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', activity, err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` });});
  
      return exits.success({ success: true, message: 'Password changed successfully. Please login with new password.' });
    })
    .catch(async (err) => {
      sails.log.error('IncorrectPasswordChangeAttempt: ', err);
      // record a serious issue
      const issueRecord = {
        affectedModelId: owner,
        type: 'IncorrectPasswordChangeAttempt',
        causedByUserId: owner,
        affectedModel: 'user',
        otherInformation: inputs.currentPassword + '###' + inputs.newPassword,
      };
    });

  }


};
