module.exports = function (appAPI) {

    /*============ DEPENDENCIES ============*/

    var Promise = require("bluebird");
    var jsonfile = require('jsonfile');
    var _ = require('underscore');

    /*============ PRIVATE VARIABLES/METHODS ============*/

    var schemes = [];


    /*============ SERVICE ============*/

    var SchemesService = {};


    /*==================================== PRIVATE METHODS ====================================*/

    var persistSchemes = function () {
        var file = global.appRoot + '/exports/schemes.json';
        jsonfile.writeFileSync(file, JSON.stringify(schemes));
    };


    /*==================================== PUBLIC METHODS ====================================*/

    SchemesService.hydrate = function () {

        return new Promise(function (resolve, reject) {

            var file = global.appRoot + '/exports/schemes.json';

            try {
                schemes = JSON.parse(jsonfile.readFileSync(file));
            } catch (e) {
                console.log("error loading saved schemes so loading defaults:");
                SchemesService.setDefaultSchemes();
            }

            resolve(true);
        });
    };

    SchemesService.get = function () {
        return schemes;
    };

    SchemesService.updateOrCreateScheme = function (schemeName, schemeTransforms) {

        var foundIndex = -1;

        _.each(schemes, function (scheme, i) {
            if (scheme.name === schemeName) {
                foundIndex = i;
            }
        });

        if (foundIndex !== -1) {

            schemes[foundIndex] = {
                name: schemeName,
                transforms: schemeTransforms
            };

        } else {

            schemes.push({
                name: schemeName,
                transforms: schemeTransforms
            });
        }

        persistSchemes();
    };

    SchemesService.deleteScheme = function (schemeName) {

        var foundIndex = -1;

        _.each(schemes, function (scheme, i) {
            if (scheme.name === schemeName) {
                foundIndex = i;
            }
        });

        if (foundIndex !== -1) {
            schemes.splice(foundIndex, 1);
        }

        persistSchemes();
    };

    SchemesService.setDefaultSchemes = function () {

        schemes = [
            {
                name: 'A',
                transforms: [
                    {
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
                    },
                    {
                        script: "cursor.moveTo(4).set(cursor.getRandomVowel());"
                    }
                ]
            },
            {
                name: 'B',
                transforms: [
                    {
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
                        script: [
                            "cursor.first().set(cursor.getRandomCon());",
                            "cursor.last().set(cursor.getRandomCon());"
                        ].join('\n')
                    },
                    {
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
                    },
                    {
                        id: 7,
                        script: "cursor.moveTo(4).set(cursor.getRandomCon());"
                    }
                ]
            }
        ];

        persistSchemes();

        return schemes;
    };


    /*============ RETURN THE SERVICES ============*/

    return SchemesService;

};