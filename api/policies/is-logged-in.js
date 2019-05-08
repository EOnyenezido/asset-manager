/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {

  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.

  const token = req.param('token') || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, sails.config.custom.secret, (err, decoded) => {
      // Wrong token
      if (err)	{
        return res.expired();
      }
      else	{
        // If everything is good pass on to other routes
        req.me = decoded;
        return proceed();
      }
    });
  } else  {
    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.unauthorized();
  }

};
