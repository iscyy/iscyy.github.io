# 浏览器事件循环


## JavaScript单线程
JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。那么，为什么JavaScript 不能有多个线程呢 ？这样能提高效率啊。

就拿一个例子来说吧：如果两个js同时去对DOM元素进行操作，那么浏览器该以哪个为准呢？最终DOM的结果是什么呢？所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

单线程就意味着任务得一个一个的执行，得排队执行。不能打断一个正在执行的任务。

## 事件队列
  为了实现这个目标，浏览器使用了**事件队列**。所有已经生成的事件(无论是用户生成的，例如鼠标移动，点击；还是服务器生成的，例如ajax请求)都会放在同一事件队列当中，以他们被浏览器检测到的顺序排列。如下图所示，事件处理的过程可以描述成一个简单的流程图:

* 浏览器检查事件队列头
* 如果浏览器没有检测到，那么就继续检测。
* 如果检测到了事件，则取出该事件并执行相对应的事件处理器,在这个过程中，余下的事件会在队列中耐心等待，直到轮到自己为止。
![image](https://user-images.githubusercontent.com/24501320/111966616-14e35300-8b32-11eb-8836-3a7b303050bc.png)

## JS宏任务,微任务分类
**浏览器**
### 1.宏任务
setTimeout  
setInterval  
requestAnimationFrame

### 2.微任务
MutationObserver  
Promise.then catch finally  

# 深入事件循环

## 微任务产生原因
  宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求就不太符合了，比如后面要介绍的监听 DOM 变化的需求。

  不过要搞清楚微任务系统是怎么运转起来的，就得站在 V8 引擎的层面来分析下。我们知道当 JavaScript 执行一段脚本的时候，V8 会为其创建一个**全局执行上下文**，
在创建全局执行上下文的同时，V8 引擎也会在内部创建一个**微任务队列**。顾名思义，这个微任务队列就是用来存放微任务的，因为在当前宏任务执行的过程中，有时候会产生多个微任务，
这时候就需要使用这个微任务队列来保存这些微任务了。不过这个微任务队列是给 V8 引擎内部使用的，所以你是无法通过 JavaScript 直接访问的。

  现在微任务队列中有了微任务了，那接下来就要看看微任务队列是何时被执行的。通常情况下，在当前宏任务中的 JavaScript 快执行完成时，
也就在 JavaScript 引擎准备退出全局执行上下文并清空调用栈的时候，JavaScript 引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。
WHATWG 把执行微任务的时间点称为检查点。当然除了在退出全局执行上下文式这个检查点之外，还有其他的检查点，不过不是太重要，这里就不做介绍了。
如果在执行微任务的过程中，产生了新的微任务，同样会将该微任务添加到微任务队列中，V8 引擎一直循环执行微任务队列中的任务，直到队列为空才算执行结束。
也就是说在执行微任务过程中产生的新的微任务并不会推迟到下个宏任务中执行，而是在当前的宏任务中继续执行。

**任务队列**分为macrotask（宏任务）与microtask（微任务）
开始解释**事件循环**的流程，在第一次执行事件循环的时候，通常都会这样说
事件循环从宏任务队列开始，这个时候，宏任务队列中，只有一个script(整体代码)任务。

```
(function test() {
    setTimeout(function() {console.log(4)}, 0);
    new Promise(function executor(resolve) {
        console.log(1);
        for( var i=0 ; i<10000 ; i++ ) {
            i == 9999 && resolve();
        }
        console.log(2);
    }).then(function() {
        console.log(5);
    });
    console.log(3);
})()
```

直接说说macrotasks和microtasks的执行顺序吧：

主js作为macro先入队列，编号ma1
执行到setTimeout...，回调作为macro入队列，编号ma2
执行到new Promise...，then作为micro入队列，编号mi1
ma1执行完之前，调用mi1，mi1执行完以后，ma1也就正式的结束了
ma2开始执行
可以认为macro是主人，micro是奴隶，哪个macro创建了micro，micro就管它叫主人。

总的来说就是，**macro作为主导，它有支配micro的能力**，在一个macro任务消灭之前，它会让它创建的micro任务都执行完，然后才进入下一个macro任务。

![image](https://user-images.githubusercontent.com/24501320/111966482-eebdb300-8b31-11eb-9939-4e39c0bf2697.png)


## 一、浏览器事件循环

浏览器中的 js 执行是单线程，但是比如我们发送的一个 ajax 请求为什么可以异步执行？因为浏览器中的事件循环机制，可以一边执行同步任务，一边处理异步任务。

同步任务进入主线程，异步的进入 Event Table 并注册回调函数，异步逻辑执行完将回调函数移入 Event Queue 队列。

主线程内的任务执行完毕为空（会持续不断的检查主线程执行栈是否为空）就会去 Event Queue 读取对应的函数，放进主线程执行。

这个不断重复的过程就被称为 Event Loop (事件循环)。
![image](https://user-images.githubusercontent.com/24501320/111964523-a8ffeb00-8b2f-11eb-9537-3169a2ca514f.png)

大致的了解什么是事件循环，并且知道异步会被进入一个异步事件注册回调，但是 js 中还有微任务的概念。

**macro-task（宏任务）**：setTimeout、setInterval、setImmediate、全部代码、 I/O 操作、UI 渲染等

**micro-task（微任务）**:  process.nextTick、Promise、MutationObserver(html5 新特性) 等

那么这个过程中微任务和宏任务的运行和事件循环有什么关系呢
![image](https://user-images.githubusercontent.com/24501320/111964560-b4531680-8b2f-11eb-8cf8-b155653b770c.png)

```
let timer1 = setTimeout(()=>{
    console.log('1')
    Promise.resolve().then(()=>{
        console.log('1-1')
        Promise.resolve().then(()=>{
            console.log('1-1-1')
        })
    })
    Promise.resolve().then(()=>{
	console.log('1-2')
	let timer3 = setTimeout(()=>{
            console.log('1-2-1')
             Promise.resolve().then(()=>{
                console.log('1-2-2')
            })
        }, 0)
    })
}, 0)

let timer2 = setTimeout(()=>{
    console.log('2')
    Promise.resolve().then(()=>{
        console.log('2-1')
    })
}, 0)

Promise.resolve().then(()=>{
    console.log('3')
    Promise.resolve().then(()=>{
        console.log('3-1')
    })
})

//结果 3、3-1、1、1-1、 1-2、1-1-1、2、2-1、1-2-1、1-2-2
```
# 总结：
在第一个定时器中将所有的微任务执行完才会进行第二个 timer2 的执行，同时 timer1 中又注册了一个 timer3 宏任务，最后再会被执行。所以我们可以得出一个结论：
**宏任务队列可以有多个，微任务队列只有一个**。所以上图中标注的是有可执行的微任务并且执行所有。

补充：js 或者 node 中的定时器并不是严格的到点就执行，只是到点会把任务放进 Event Queue，具体执不执行这个回调要看主线程有没有空闲（没有正在处理的任务了），
比如通过耗时的 while 循环等操作，会影响定时器回调的延迟执行，所以不要相信定时器。
# 举例

```
//请写出输出内容
async function async1() {
	console.log("async1 start");
	await async2();
	console.log("async1 end");
}
async function async2() {
	console.log("async2");
}

----------------转换代码同以上async
function async1() {
	console.log("async1 start");
	new Promise((resolve) => {
		console.log("async2");
		resolve()
	}).then(_ => {
		console.log("async1 end");
	})
}
-----------------

console.log("script start");

setTimeout(function() {
	console.log("setTimeout");
}, 0)

async1();

new Promise(function(resolve) {
	console.log("promise1");
	resolve();
}).then(function() {
	console.log("promise2");
});
console.log("script end");
```

首先呢。宏任务队列里有一个任务:**js主线程执行**。async1这时候还没有调用，所以执行到console.log(“script start”)的时候打印。

然后执行到setTimeOut，我们知道**定时器事件是宏任务，所以加入到宏任务队列**，这是宏任务队列有两个任务：js执行主线程，定时器事件。

接下来执行async1，先打印"async1 start",然后执行new Promise打印"async2"并立即兑现promise，将promise0回调加入微任务。这时候宏任务队列:js主线程，定时器事件。微任务队列：promise0(执行就打印async1 end)回调。

执行到async1下面的new Promsie，打印"promise1"。又立即兑现promise，将promise1(执行就打印promise2)加入微任务队列。这时候宏任务队列:js主线程(正在执行)，定时器事件。微任务队列：promise0回调，promise1回调。

接着打印"script end"。js主线程代码这个宏任务完成了，我们知道宏任务执行完毕，会去检查微任务队列，如果存在微任务，那么便全部执行。此时我们的微任务队列还有2个微任务promise0,promise1。所以我们执行promise0 打印"async1 end"，执行 promise1 打印promise2。至此，一次循环完毕。

接下来又检查宏任务队列，发现还有一个setTimeOut，则执行，打印"setTimeOut"

所以最终的结果顺序为 :
```
//script start 
//async1 start
//async2
//promise1
//script end
//async1 end 
//promise2
//setTimeOut
```

