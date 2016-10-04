(function () {

    angular.module('MachineLearning').service('StringTransformService', [

        'CursorClass',
        'SeededRandom',

        function (CursorClass, SeededRandom) {

            /*============ SERVICE DECLARATION ============*/

            var StringTransformService = {};


            /*============ PRIVATE METHODS AND VARIABLES ============*/

            var STRING_LENGTH = 10;

            var getRandomString = function (stringLength) {

                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

                for( var i=0; i < stringLength; i++) {
                    text += possible.charAt(Math.floor(SeededRandom.random() * possible.length));
                }

                return text;
            };

            var transformString = function (stringValue, transforms) {

                var cursor = new CursorClass(stringValue);

                var foundError = false;

                _.each(transforms, function (transform) {
                    cursor.first();

                    transform.error = false;

                    try {
                        eval(transform.script);
                    } catch (e) {
                        transform.error = e.toString();
                        foundError = true;
                    }
                });

                if (!foundError) {
                    return cursor.getText();
                } else {
                    return 'ERROR';
                }
            };


            /*============ SERVICE DEFINITION ============*/

            StringTransformService.generateStringTransformPairsData = function (transforms, count) {

                SeededRandom.reset();

                var transformPairs = [];

                var totalChanged = 0;

                for (var i=0; i < count; i++) {

                    var beforeString = getRandomString(STRING_LENGTH);
                    var afterString = transformString(beforeString, transforms);
                    var hasChanged = beforeString !== afterString && afterString !== 'ERROR';

                    if (hasChanged) {
                        totalChanged++;
                    }

                    transformPairs.push({
                        before: beforeString,
                        after: afterString,
                        hasChange: hasChanged
                    });
                }

                return {
                    transformPairs: transformPairs,
                    percentChanged: totalChanged ? Math.round((totalChanged / transformPairs.length) * 100) : 0
                };
            };

            /*============ LISTENERS ============*/

            /*============ SERVICE PASSBACK ============*/

            return StringTransformService;
        }
    ]);

})();

