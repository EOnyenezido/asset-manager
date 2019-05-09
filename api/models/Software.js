/**
 * Software.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // Add a reference to User who created the asset
    createdBy: {
      model: 'user'
    },
    
    name: {
      type: 'string',
      required: true,
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


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

