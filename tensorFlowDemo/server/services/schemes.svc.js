module.exports = function (appAPI) {

    /*============ DEPENDENCIES ============*/

    var Promise = require("bluebird");


    /*============ PRIVATE VARIABLES/METHODS ============*/

    var schemes = [];


    /*============ SERVICE ============*/

    var SchemesService = {};


    /*==================================== PRIVATE METHODS ====================================*/


    /*==================================== PUBLIC METHODS ====================================*/

    SchemesService.hydrate = function () {
        return new Promise(function(resolve, reject) {

            setTimeout(function () {

                SchemesService.set([
                    {
                        name: 'Johns',
                        transforms: []
                    },
                    {
                        name: 'Kevins',
                        transforms: []
                    }
                ]);

                resolve(true);

            }, 500);
        });
    };

    SchemesService.get = function () {
        return schemes;
    };

    SchemesService.set = function (schemes_in) {
        return schemes = schemes_in;
    };


    /*============ RETURN THE SERVICES ============*/

    return SchemesService;

};