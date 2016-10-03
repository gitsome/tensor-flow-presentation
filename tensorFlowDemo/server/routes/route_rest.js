module.exports = function(app, routeAPI){

    /*============ DEPENDENCIES ============*/

    var RequestHandler = require('../classes/RequestHandler.cls.js')();


    /*============ PRIVATE VARIABLES/METHODS ============*/

    var services = routeAPI.services;


    /*==================================== GET ====================================*/

    app.post("/service/update", RequestHandler(function (req, res) {

        var that = this;

        /*============ GATHER PARAMS ============*/

        var query = req.query;
        var params = req.params;
        var body = req.body;

        var data = {
            text: body.text
        };


        /*============ RESPONSE LOGIC ============*/

        that.success({});

    }));

};