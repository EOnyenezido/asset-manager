module.exports = {


  friendlyName: 'Set user avatar',


  description: 'Set a profile picture for a user',


  inputs: {

    avatar: {
      type: 'ref',
      description: 'The new profile picture of the user',
      extendedDescription: 'Must be a valid image file less than 10MB.',
    },

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The required parameter avatar is not provided',
    },

    internalServerError: {
      statusCode: 500,
      description: 'An error occured on the server, we will respond soon'
    }

  },


  fn: async function (inputs, exits) {

    this.req.file('avatar').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000,
      // save on file system for now, will switch to cloud storage
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/profile-pictures')
    }, (err, uploadedFiles) => {
      if (err) {
        sails.log.error(err);
        return exits.internalServerError({success: false, message: `An error occured on the server, we will respond soon` });
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return exits.invalid({success: false, message: `The required parameter avatar is not provided. No file was uploaded` });
      }

      // Get the base URL for our deployed application from our custom config
      // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
      let baseUrl = sails.config.custom.baseUrl;

      // Save the "fd" and the url where the avatar for a user can be accessed
      User.update(this.req.me.id, {

        // Generate a unique URL where the avatar can be downloaded.
        profileImage: require('util').format('%s/user/avatar/%s', baseUrl, this.req.me.id),

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      })
      .exec((err) => {
        if (err) {
          sails.log.error(err);
          return exits.internalServerError({success: false, message: `An error occured on the server, we will respond soon` });
        }
        return exits.success({ success: true, message: 'Profile picture updated successfully' });
      });
    });

  }


};
