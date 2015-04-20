/* @name ajaxWrapper 
  * @description Wrapper for ajax calls for 
        fetching/insertin/deleting  and updating
        the data in the sql database
  * @returns ajaxWrapper 
  */
var ajaxWrapper = (function () {
    function ajaxWrapper() { };

    ajaxWrapper.prototype.send = function (url, data, method, callback) {
        var x = new XMLHttpRequest();

        if (url !== undefined) {
            var seperator = url.indexOf('?') > 0 ? "&":"?";
            url += seperator + "random=" + new Date().getTime();
        }

        x.open(method, url, true);
        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == 200) {
                callback(x.responseText)
            }
        };

        if (method == 'POST' || method == 'PUT' || method == 'DELETE') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };
    return ajaxWrapper;
})();