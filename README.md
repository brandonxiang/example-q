#q 笔记一：异步编程入门

> 源码github地址在此，记得点星：
https://github.com/brandonxiang/example-q

##前言

大家都知道javascript的优点在于异步非阻塞。[Javascript异步编程的4种方法](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)指出javascript的单线程的特性和同步（Synchronous）异步（Asynchronous）的执行模式，并且说明了四种异步的方法，如今最重要的当然是**Promises对象**。

> Promises对象是CommonJS工作组提出的一种规范，目的是为异步编程提供[统一接口](http://wiki.commonjs.org/wiki/Promises/A)。

异步编程有着一个很大的效率优势，但是异步多了就成为**金字塔型**的代码结构非常不好阅读，而且异步和同步的控制变得非常非常困难。

```
$.getJSON('./api', function(data){
    console.log(data);
    $.getJSON('./api', function(data){
        console.log(data);
    }
})
```

这时候，我们需要Promise模式。这种模式其实在ES6已经得到官配，参考[Javascript 中的神器——Promise](http://www.jianshu.com/p/063f7e490e9a)。但是有些人还停留在ES5的开发，没接触node.js这时候，我们需要运用一些第三方库来控制异步的流程。

## Promise在ES5实现

- [q](https://github.com/kriskowal/q)
- [bluebird](https://github.com/petkaantonov/bluebird)
- [co](https://github.com/tj/co)
- [when](https://github.com/cujojs/when)

##q的详细说明

其他几个资源库都应该大同小异，留给你们私下研究。

###串行

`then`作为一个关键字，将函数`async('first')`和`async('second')`和`async('third')`和`async('fourth')`的顺序分开，整体呈现完成第一个函数再完成第二个函数的序列操作。

```
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
});
```

###并行

并行要把对应的函数（`async('a')`和`async('b')`和`async('c')`）事先装备在数组当中。用`Q.all()`对它们进行并行处理，也就是说这几个函数将同时处理。

```
var promises = [];
promises.push(async('a'));
promises.push(async('b'));
promises.push(async('c'));
Q.all(promises);
```

###串并行混连

无论是先串后并，还是先并后串都可以。在并行程序`Q.all(promises)`后，加入`then`关键字，实现串并行混连，非常适合在拉取数据后对所有数据进行操作。

```
Q.all(promises).then(function(){
   console.log('hello world');
})
```

##总结

引用[q官方文档](https://github.com/kriskowal/q)的一段代码。

以前异步编程的代码是这样的。
```
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

现在异步编程的代码是这样的。
```
Q.fcall(promisedStep1)
.then(promisedStep2)
.then(promisedStep3)
.then(promisedStep4)
.then(function (value4) {
    // Do something with value4
})
.catch(function (error) {
    // Handle any error from all above steps
})
.done();
```

转载，请表明出处。[总目录前端经验收集器](http://www.jianshu.com/p/c1e3b96c1293)