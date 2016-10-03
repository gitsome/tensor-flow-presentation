(function () {

    angular.module('MachineLearning').factory('CursorClass', [

        '$rootScope',

        function ($rootScope) {

            /*============ PRIVATE STATIC VARIABLES AND METHODS ============*/

            /*============ CLASS DECLARATION ============*/

            var CursorClass = function (text) {

                var that = this;


                /*============== PRIVATE VARIABLES =============*/

                var cursor = 0;


                /*============== PRIVATE METHODS =============*/

                var clampCursor = function () {
                    cursor = Math.max(0, Math.min(text.length - 1, cursor));
                };


                /*=============== PUBLIC PROPERTIES =============*/

                that.first = function () {
                    cursor = 0;
                    return that;
                };

                that.moveTo = function (index) {
                    cursor = index;
                    clampCursor();
                    return that;
                };

                that.next = function () {
                    cusor = cursor + 1;
                    clampCursor();
                    return that;
                };

                that.back = function () {
                    cusor = cursor - 1;
                    clampCursor();
                    return that;
                };

                that.last = function () {
                    cusor = text.length - 1;
                    return that;
                };


                that.find = function (find, callBack) {

                    return that;
                };

                that.vowels = function (callBack) {

                };

                that.cons = function (callBack) {

                };

                that.setValue = function () {

                };

                that.getValue = function () {

                };

                that.getRandomCons = function () {

                };

                that.getRandomVowel = function () {

                };



                /*=============== PUBLIC METHODS =============*/




                /*=============== MORE PUBLIC PROPERTIES =============*/

                /*=============== INITIALIZTION =============*/

            };


            /*============ PUBLIC STATIC METHODS ============*/

            /*============ LISTENERS ============*/


            /*============ FACTORY INSTANCE PASSBACK ============*/

            return CursorClass;
        }
    ]);

})();


