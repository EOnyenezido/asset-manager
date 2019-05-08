/**
 * Module dependencies
 */

// ...


/**
 * images/get-user-avatar.js
 *
 * Get user avatar.
 */
module.exports = async function getUserAvatar(req, res) {

  User.findOne(req.param('userId')).exec((err, user) => {
    if (err) {return res.serverError(err);}
    if (!user) {return res.notFound();}

    // User has no avatar image uploaded.
    // (should have never have hit this endpoint and used the default image)
    if (!user.avatarFd) { // send the default image
      user.avatarFd = require('path').resolve(sails.config.appPath, `base-assets/images/profile-pictures/avatar.png`);
    }

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);

    // set the filename to the same file as the user uploaded
    res.set('Content-disposition', 'attachment; filename=');

    // Stream the file down
    fileAdapter.read(user.avatarFd)
    .on('error', (err) => {
      return res.serverError(err);
    })
    .pipe(res);
  });

};
