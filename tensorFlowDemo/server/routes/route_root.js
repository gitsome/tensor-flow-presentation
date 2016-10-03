module.exports = function(app, routeAPI){

    /*============ DEPENDENCIES ============*/

    /*============ PRIVATE VARIABLES/METHODS ============*/

    var services = routeAPI.services;
    var server = routeAPI.server;

    /*==================================== INDEX PAGE ====================================*/

    //send everything else
    app.use(function(req, res) {
        //generate html that contains the initializations scripts
        //populated with enough environment info as needed for resource loading and web sockets
        console.log("schemes:", services.schemes.get());

        res.render('index', {
            title: 'Machine Learning',
            session: {
                schemes : JSON.stringify(services.schemes.get())
            }
        });
    });

};