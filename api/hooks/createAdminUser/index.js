/**
 * createAdminUser hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCreateAdminUserHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`createAdminUser`)');

      sails.after('ready', async () => {
        // create admin user
        const adminUser = {
          emailAddress: sails.config.custom.admin.email,
          password: await sails.helpers.passwords.hashPassword(sails.config.custom.admin.password),
          firstName: sails.config.custom.admin.firstName,
          lastName: sails.config.custom.admin.lastName,
          phoneNumber: sails.config.custom.admin.phoneNumber,
          tosAcceptedByIp: '',
          profileImage: require('util').format('%s/user/avatar/%s', sails.config.custom.baseUrl, 1),
          isSuperAdmin: true,
        };
        // only create i fthe admin user does not exist
        await User.findOrCreate({emailAddress: sails.config.custom.admin.email}, adminUser)
        .intercept({name: 'UsageError'}, (err) => { sails.log( 'ErrorCreatingAdminUser: ', err); return done(err);});
      });

      // Be sure and call `done()` when finished!
      // (Pass in Error as the first argument if something goes wrong to cause Sails
      //  to stop loading other hooks and give up.)
      return done();

    }

  };

};
