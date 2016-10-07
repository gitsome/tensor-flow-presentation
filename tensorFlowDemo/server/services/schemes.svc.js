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
                        name: 'A',
                        transforms: [
                            {
                                id: 1,
                                script: ['cursor.forEachVowel(function(c,i) {\n',
                                        '    if (i > 4) {\n',
                                        '        c.set(c.getRandomCon());\n',
                                        '    }\n',
                                        '});'
                                ].join('')
                            },
                            {
                                id: 2,
                                script: 'cursor.next().next().set(\'A\');'
                            }
                        ]
                    },
                    {
                        name: 'B',
                        transforms: [
                            {
                                id: 3,
                                script: 'cursor.last().set(cursor.getRandomCon());'
                            },
                            {
                                id: 4,
                                script: 'cursor.first().set(cursor.getRandomVowel());'
                            }
                        ]
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