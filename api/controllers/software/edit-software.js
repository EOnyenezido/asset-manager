module.exports = {


  friendlyName: 'Edit software asset',


  description: 'A user can edit software assets',


  inputs: {

    name: {
      type: 'string',
      description: 'Name of the software asset',
      example: 'Asset management software',
    },

    itemDescription: {
      type: 'string',
      description: 'Description of the software asset',
      example: 'Asset management software',
    },

    applicationOwner: {
      type: 'string',
      description: 'Operations asset managing the software',
      example: 'Ay Tod',
    },

    // Original Equipment Manufacturer
    oem: {
      type: 'string',
      description: 'Company that produces the software',
      example: 'huawei etc',
    },

    supplier: {
      type: 'string',
      description: 'Company that supplied the software',
      example: 'huawei etc',
    },

    licenseCategory: {
      type: 'string',
      description: 'Licensce Category',
      example: 'Annual, Perpetual etc',
    },

    currentLicenseVersion: {
      type: 'string',
      description: 'Licensce or Application version',
      example: '1.1.3',
    },

    unit: {
      type: 'string',
      description: 'What constitues a unit of the software',
      example: 'user, card',
    },

    ownership: {
      type: 'string',
      description: 'Who owns the license',
      example: 'CoyQ',
    },

    status: {
      type: 'string',
      description: 'Description of the current state',
      example: 'active, retired',
    },

    eol: {
      type: 'number',
      description: 'Number representing epoch date for End of Life',
      example: 1243943288,
    },

    emtsOwned: {
      type: 'number',
      description: 'Number representing units owned/purchased by EMTS',
      example: 1243943288,
    },

    huaweiOwned: {
      type: 'number',
      description: 'Number representing units owned/purchased by Huawei',
      example: 1243943288,
    },

    // Quantity before Service Commencement Date
    qbSCD: {
      type: 'number',
      description: 'Number representing units before service contract commencement',
      example: 1243943288,
    },

    // Quantity after Service Commencement Date
    qaSCD: {
      type: 'number',
      description: 'Number representing units at service contract commencement',
      example: 1243943288,
    },

    q2015: {
      type: 'number',
      description: 'Number representing units purchased during 2015',
      example: 1243943288,
    },

    q2016: {
      type: 'number',
      description: 'Number representing units purchased during 2016',
      example: 1243943288,
    },

    q2017: {
      type: 'number',
      description: 'Number representing units purchased during 2017',
      example: 1243943288,
    },

    q2018: {
      type: 'number',
      description: 'Number representing units purchased during 2018',
      example: 1243943288,
    },

    q2019: {
      type: 'number',
      description: 'Number representing units purchased during 2019',
      example: 1243943288,
    },

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The required parameters were not provided',
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

    let valuesToSet = Object.assign(inputs);

    // Save to the db
    const editedSoftware = await Software.update({id: this.req.param('softwareId')}).set(valuesToSet) // eslint-disable-line no-undef
    .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
    .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
    .fetch(); // fetch so user activity can be updated

    return exits.success({ success: true, message: 'Software updated successfully', software: editedSoftware });

  }


};
