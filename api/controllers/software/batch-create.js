module.exports = {


  friendlyName: 'Batch Upload',


  description: 'Batch upload of new records',


  inputs: {

    excelFile: {
      type: 'ref',
      description: 'The excel file containing all the records',
      extendedDescription: 'Must be a valid excel file.',
    },

  },


  exits: {

    userNotFound: {
      statusCode: 404,
      description: 'User does not exist'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The required parameter excelFile is not provided',
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

    let createdBy = this.req.me.id; // set createdBy from token

    this.req.file('excelFile').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000,
      // save on file system for now, will switch to cloud storage
      dirname: require('path').resolve(sails.config.appPath, 'assets/files/excel')
    }, (err, uploadedFiles) => {
      if (err) {
        sails.log.error(err);
        return exits.internalServerError({success: false, message: `An error occured on the server, we will respond soon` });
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0){
        return exits.invalid({success: false, message: `The required parameter excelFile is not provided. No file was uploaded` });
      }
      
      var XLSX = require('xlsx');
      var workbook = XLSX.readFile(uploadedFiles[0].fd);
      var result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (Object.keys(result[0]).length < 20) { // check to make sure the correct template was used
        return exits.invalid({success: false, message: `The file does not contain the required fields. Are you sure you are using the template?` });
      }
      
      result.forEach(async element => {
        var newRecord = {
          name: element["APPLICATION NAME"],
          itemDescription: element["ITEM DESCRIPTION"],
          applicationOwner: element["APPLICATION OWNER"],
          oem: element["OEM/RESELLER"],
          supplier: element["SUPPLIER"],
          licenseCategory: element["CATEGORY"],
          currentLicenseVersion: element["Current License Version"],
          unit: element["Unit"],
          ownership: element["Ownership"],
          status: element["STATUS"],
          eol: element["EOL(S)"],
          emtsOwned: element["EMTS OWNED"],
          huaweiOwned: element["HUAWEI OWNED"],
          qbSCD: element["Quantity as at SCD in 2014"],
          qaSCD: element["Quantity after SCD in 2014"],
          q2015: element["Quantity as at 2015"],
          q2016: element["Quantity as at  2016"],
          q2017: element["Quantity as at 2017"],
          q2018: element["Quantity as at 2018"],
          q2019: element["Quantity as at 2019"],
        };

        await Software.create(Object.assign({ createdBy: createdBy }, newRecord)) // eslint-disable-line no-undef
        .intercept({name: 'UsageError'}, () => { return exits.invalid({ success: false, message: `The provided criteria is invalid` }); })
        .intercept({name: 'AdapterError'}, (err) => { sails.log.error('AdapterError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); })
        .intercept({name: 'Error'}, (err) => { sails.log.error('UnexpectedApplicationError: ', err); return exits.internalServerError({ success: false, message: `An error occured on the server, we will respond soon` }); });
        
      });

      return exits.success({ success: true, message: 'Batch records created successfully' });
    });

  }


};
