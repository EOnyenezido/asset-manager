module.exports = {


  friendlyName: 'Logout',


  description: 'Log out of this app.',


  extendedDescription:
`This action simply logs an activity that the user has logged out for analytic purposes`,


  exits: {

    success: {
      description: 'The requesting user has been successfully logged out.'
    },

  },


  fn: async function (inputs, exits) {

    let user = this.req.me;

    await sails.helpers.addActivity.with({
      owner: user.id,
      type: 'user',
      action: 'logout',
      user: user.id,
      affectedType: 'user',
    })
    .intercept({name: 'UsageError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', user, err);})
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('ErrorCreatingActivity: ', user, err);})
    .intercept({name: 'Error'}, (err) => { sails.log.error('ErrorCreatingActivity: ', user, err);});

    return exits.success({ success: true, message: 'The requesting user has been successfully logged out.' });

  }


};
