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
                                script: [
                                    "cursor.forEach('P', function (c, i) {",
                                    "    c.next().set('S');",
                                    "});",
                                    "cursor.forEach('F', function (c, i) {",
                                    "    c.next().set('S');",
                                    "});",
                                    "cursor.forEach('V', function (c, i) {",
                                    "    c.next().set('S');",
                                    "});",
                                ].join('\n')
                            },
                            {
                                id: 2,
                                script: [
                                    "cursor.forEach('J', function (c, i) {",
                                    "    c.set(c.getRandomVowel());",
                                    "});",
                                    "cursor.forEach('H', function (c, i) {",
                                    "    c.set(c.getRandomVowel());",
                                    "});",
                                    "cursor.forEach('N', function (c, i) {",
                                    "    c.set(c.getRandomVowel());",
                                    "});",
                                    "cursor.forEach('O', function (c, i) {",
                                    "    c.set('W');",
                                    "});",
                                ].join('\n')
                            }
                        ]
                    },
                    {
                        name: 'B',
                        transforms: [
                            {
                                id: 3,
                                script: [
                                    "cursor.forEach('O', function (c, i) {",
                                    "    c.set(c.getRandomCon());",
                                    "});",
                                    "cursor.forEach('I', function (c, i) {",
                                    "    c.set(c.getRandomCon());",
                                    "});",
                                ].join('\n')
                            },
                            {
                                id: 4,
                                script: [
                                    "cursor.first().set(cursor.getRandomCon());",
                                    "cursor.last().set(cursor.getRandomCon());"
                                ].join('\n')
                            },
                            {
                                id: 5,
                                script: [
                                    "cursor.forEach('Z', function (c, i) {",
                                    "    c.next().set('J');",
                                    "});",
                                    "cursor.forEach('X', function (c, i) {",
                                    "    c.next().set('H');",
                                    "});",
                                    "cursor.forEach('Y', function (c, i) {",
                                    "    c.next().set('N');",
                                    "});",
                                    "cursor.forEach('Q', function (c, i) {",
                                    "    c.next().set('D');",
                                    "});",
                                    "cursor.forEach('W', function (c, i) {",
                                    "    c.next().set('P');",
                                    "});"
                                ].join('\n')
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