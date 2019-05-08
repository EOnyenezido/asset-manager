/**
 * SignupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    firstName:  {
      required: true,
      type: 'string',
      example: 'Frida',
      description: 'The user\'s first name.',
    },

    lastName:  {
      required: true,
      type: 'string',
      example: 'Kahlo de Rivera',
      description: 'The user\'s last name.',
    },

    phoneNumber: {
      type: 'number',
      required: true,
      description: 'Phone number',
    },

  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs, exits) {

    var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create({
      emailAddress: newEmailAddress,
      password: await sails.helpers.passwords.hashPassword(inputs.password),
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      phoneNumber: inputs.phoneNumber,
      birthDate: inputs.birthDate,
      gender: inputs.gender,
      tosAcceptedByIp: this.req.ip
    })
    .intercept('E_UNIQUE', 'emailAlreadyInUse')
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();

    // set a default profile picture
    newUserRecord = await User.update({id: newUserRecord.id }).set({profileImage: require('util').format('%s/user/avatar/%s', sails.config.custom.baseUrl, newUserRecord.id)})
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .fetch();

    // fetch above returns an array, so reassign newUserRecord to newUserRecord[0]
    newUserRecord = newUserRecord[0];

    const tokenContent = Object.assign({}, newUserRecord);

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(tokenContent, sails.config.session.secret, { expiresIn: sails.config.custom.tokenExpirationTime });

    // Since everything went ok, send our 200 response.
    return exits.success({
      success: true,
      message: 'User Registered Successfully',
      newUserRecord,
      token
    });

  }

};


