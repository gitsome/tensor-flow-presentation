module.exports = function(app, routeAPI){

    /*============ DEPENDENCIES ============*/

    var RequestHandler = require('../classes/RequestHandler.cls.js')();


    /*============ PRIVATE VARIABLES/METHODS ============*/

    var services = routeAPI.services;


    /*==================================== SET DEFAULT SCHEMES ====================================*/

    app.get("/services/setdefaultschemes", RequestHandler(function (req, res) {

        var that = this;

        /*============ RESPONSE LOGIC ============*/

        services.schemes.setDefaultSchemes();

        that.success({status: 'success'});
    }));


    /*==================================== GET SCHEMES ====================================*/

    app.get("/services/schemes", RequestHandler(function (req, res) {

        var that = this;

        /*============ RESPONSE LOGIC ============*/

        that.success(services.schemes.get());
    }));


    /*==================================== CREATE or UPDATE SCHEME ====================================*/

    app.post("/services/schemes", RequestHandler(function (req, res) {

        var that = this;

        /*============ GATHER PARAMS ============*/

        var query = req.query;
        var params = req.params;
        var body = req.body;

        var schemeName = body.schemeName;
        var schemeTransforms = body.schemeTransforms;

        services.schemes.updateOrCreateScheme(schemeName, schemeTransforms);


        /*============ RESPONSE LOGIC ============*/

        that.success({status: 'success'});
    }));


    /*==================================== DELETE SCHEME ====================================*/

    app.delete("/services/schemes", RequestHandler(function (req, res) {

        var that = this;

        /*============ GATHER PARAMS ============*/

        var query = req.query;

        var schemeName = query.schemeName;

        services.schemes.deleteScheme(schemeName);


        /*============ RESPONSE LOGIC ============*/

        that.success({status: 'success'});
    }));


    /*==================================== SAVE ML DATA ====================================*/

    app.post("/services/savedata", RequestHandler(function (req, res) {

        var that = this;

        /*============ GATHER PARAMS ============*/

        var query = req.query;
        var params = req.params;
        var mlData = req.body;

        services.mlData.save(mlData);


        /*============ RESPONSE LOGIC ============*/

        that.success({status: 'success'});
    }));

};