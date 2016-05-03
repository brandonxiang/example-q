var Q = require('q');

function async(arg) {
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve('result ' + arg);
    }, 1000);
    return deferred.promise;
}

function parallel() {
    //并行处理
    var promises = [];
    promises.push(async('a'));
    promises.push(async('b'));
    promises.push(async('c'));
    return Q.all(promises);
}

function validate() {
    //串行
    async('first').then(function (resp) {
        console.log(resp);
        return async('second');
    }).then(function (resp) {
        console.log(resp);
        return async('third')
    }).then(function (resp) {
        console.log(resp);
        return async('fourth');
    }).then(function (resp) {
        console.log(resp);
    }).then(function () {
        //并行
        parallel().then(function (resp) {
            resp.forEach(function (item) {
                console.log(item);
            })
        });
    });
}

validate();