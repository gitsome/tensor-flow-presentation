module.exports = function (appAPI) {

    /*============ DEPENDENCIES ============*/


    /*============ PRIVATE VARIABLES/METHODS ============*/

    var currentMode = 'view'; // other option 'edit'


    /*============ SERVICE ============*/

    var ModeService = {};


    /*==================================== PRIVATE METHODS ====================================*/


    /*==================================== PUBLIC METHODS ====================================*/

    ModeService.get = function () {
        return currentMode;
    };

    ModeService.set = function (mode) {
        return currentMode = mode;
    };


    /*============ RETURN THE SERVICE ============*/

    return ModeService;

};