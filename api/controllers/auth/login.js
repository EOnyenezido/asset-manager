/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  friendlyName: 'Login',


  description: 'Log in using the provided email and password combination.',


  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true
    },

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true
    },

    rememberMe: {
      description: 'Whether to extend the lifetime of the user\'s session.',
      extendedDescription:
`Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
requests over WebSockets instead of HTTP).`,
      type: 'boolean'
    }

  },


  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged in.'
    },

    badCombo: {
      description: `Incorrect username or password. Please try again.`,
      responseType: 'unauthorized'
      // ^This uses the custom `unauthorized` response located in `api/responses/unauthorized.js`.
      // To customize the generic "unauthorized" response across this entire app, change that file
      // (see http://sailsjs.com/anatomy/api/responses/unauthorized-js).
      //
      // To customize the response for _only this_ action, replace `responseType` with
      // something else.  For example, you might set `statusCode: 498` and change the
      // implementation below accordingly (see http://sailsjs.com/docs/concepts/controllers).
    }

  },


  fn: async function (inputs, exits) {

    // Look up by the email address.
    // (note that we lowercase it to ensure the lookup is always case-insensitive,
    // regardless of which database we're using)
    var userRecord = await User.findOne({
      emailAddress: inputs.emailAddress.toLowerCase(),
    });

    // If there was no matching user, respond thru the "badCombo" exit.
    if(!userRecord) {
      throw 'badCombo';
    }

    // If the password doesn't match, then also exit thru "badCombo".
    await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
    .intercept('incorrect', 'badCombo');

    await sails.helpers.addActivity.with({
      owner: userRecord.id,
      type: 'user',
      action: 'login',
      user: userRecord.id,
      affectedType: 'user',
    })
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', userRecord, err);})
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', userRecord, err);})
    .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', userRecord, err);});

    const tokenContent = Object.assign({}, userRecord);

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(tokenContent, sails.config.custom.secret, { expiresIn: sails.config.custom.tokenExpirationTime }); // expires in 24 hours
    
    // Send success response
    return exits.success({
      success: true,
      message: 'User Authenticated Successfully',
      userRecord,
      token
    });

  }

};


