/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'pages/homepage'
  // },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  // Registration
  'POST  /api/v1/registration/signup':                       { action: 'registration/signup' },

  // Login and Logout
  'POST  /api/v1/auth/login':                       { action: 'auth/login' },
  'POST  /api/v1/auth/logout':                       { action: 'auth/logout' },

  // User
  'GET /api/v1/user/get-user':                      { action: 'user/get-user' },
  'GET /api/v1/user/get-user/:userId':              { action: 'user/get-user-with-id' },
  'DELETE /api/v1/user/delete-my-account':              { action: 'user/delete-my-account' },
  'POST /api/v1/user/change-password':              { action: 'user/change-password' },

  // Images
  'POST  /api/v1/images/set-user-avatar':                       { action: 'images/set-user-avatar' },
  'GET  /user/avatar/:userId':                       { action: 'images/get-user-avatar' },

  // Software assets
  'POST  /api/v1/software/create':                       { action: 'software/create-software' },
  'POST  /api/v1/software/batch-create':                       { action: 'software/batch-create' },
  'PUT /api/v1/software/edit/:softwareId':              { action: 'software/edit-software' },
  'DELETE /api/v1/software/delete/:softwareId':              { action: 'software/delete-software' },
  'GET /api/v1/software/get/:softwareId':              { action: 'software/get-software' },
  'GET /api/v1/softwares/get/:postId':              { action: 'software/get-softwares' },


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
