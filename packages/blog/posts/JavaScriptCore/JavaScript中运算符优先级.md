- Metadata
  - Author:
  - Link:
  - Publisher
  - Date: [[2022-01-06]]
  - Status: #waiting
  - Tag:
- content

  - JavaScript 中运算符优先级的问题？
  - 优先级 是 结合的优先级，不是说谁的优先级高就先给谁求值。

  - 结合是什么意思呢？可以理解成是加一个括号

    <img src="https://pica.zhimg.com/50/v2-b2c09744a0088336494e8d9400d42065_720w.jpg?source=1940ef5c" data-rawwidth="294" data-rawheight="60" class="content_image" width="294"/>

    上面的这条表达式，在执行的时候，可以看做是下面这样的，加个括号就很容易理解了吧

    <img src="https://pic2.zhimg.com/50/v2-4ec5ec1989d20449e25b0850be0ea68e_720w.jpg?source=1940ef5c" data-rawwidth="313" data-rawheight="57" class="content_image" width="313"/>

  - 可是你不能说加了括号就要先给你求值啊，还是要按照基本法！！！从左往右

  - 这里还有个短路计算的概念， || 操作符左边的是 true 的话，这个表达式的结果就是 true，不管右边的值是 false 还是 true，所以它就不会去求右边的值；&& 正好反过来，详细看文档：

  [ 逻辑运算符 - JavaScript](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_Operators)

  - 如果 fn01() 算出的结果是 true，那整个

    [表达式](https://www.zhihu.com/search?q=%E8%A1%A8%E8%BE%BE%E5%BC%8F&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A129171248%7D)的结果就是 false，根本不会去求其他的值。

    `false || false && true || true === false || (false && true) || true`

  - 优先级是结合的优先级，不是说谁的优先级高就先给谁求值！！！

  - 再通俗一点，看到谁的优先级高就给它加一个括号，就像这样：
  - `1 + 2 * 3 === 1 + (2 * 3)`

- Metadata
  - Author: RednaxelaFX
  - Link:[(2 条消息) JavaScript 中运算符优先级的问题？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/52116922)
  - Publisher: [[知乎]]
  - Date: [[2022-01-06]]
  - Status: #waiting
  - Tag:
- content

  - 前面的回答都说得挺好了。那我还是来放传送门：
  - [虚拟机随谈（一）：解释器，树遍历解释器，基于栈与基于寄存器，大杂烩](https://link.zhihu.com/?target=http%3A//rednaxelafx.iteye.com/blog/492667)
  - 题主要注意区分优先级、结合性、
  - [求值顺序](https://www.zhihu.com/search?q=%E6%B1%82%E5%80%BC%E9%A1%BA%E5%BA%8F&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A129426603%7D)三者的区别。
  - 这三个是不同的概念，却经常被混淆。通过 AST 来看就很容易理解：（假设源码是从左到右输入的）
  - 所谓优先级，就是不同操作相邻出现时，
  - [AST 节点](https://www.zhihu.com/search?q=AST%E8%8A%82%E7%82%B9&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A129426603%7D)与根的距离的关系。优先级高的操作会更远离根，优先级低的操作会更接近根。为什么？因为整棵 AST 是以后序遍历求值的，显然节点离根越远就越早被求值。
  - 所谓结合性，就是当同类操作相邻出现时，操作的先后顺序同 AST 节点与根的距离的关系。如果是左结合，则先出现的操作对应的 AST 节点比后出现的操作的节点离根更远；换句话说，先出现的节点会是后出现节点的子节点。
  - 所谓求值顺序，就是在遍历子节点时的顺序。对二元运算对应的节点来说，先遍历
  - [左子节点](https://www.zhihu.com/search?q=%E5%B7%A6%E5%AD%90%E8%8A%82%E7%82%B9&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A129426603%7D)再遍历右子节点就是从左到右的求值顺序，反之则是从右到左的求值顺序。
  - 这三个概念与运算的联系都很紧密，但实际描述的是不同的关系。前两者是
  - [解析器](https://www.zhihu.com/search?q=%E8%A7%A3%E6%9E%90%E5%99%A8&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A129426603%7D)根据语法生成 AST 时就已经决定好的，后者则是解释执行或者生成代码而去遍历 AST 时决定的。
  - 在没有副作用的环境中，给定优先级与结合性，则无论求值顺序是怎样的都能得到同样的结果；而在有副作用的环境中，求值顺序会影响结果。
  - 题主可以看看您的代码对应的 AST 长啥样：
  - [Esprima: Parser](https://link.zhihu.com/?target=http%3A//esprima.org/demo/parse.html)
  - ，对照上面传送门所说的看看。
  - 或者这个：
  - [AST Visualization on browser](https://link.zhihu.com/?target=http%3A//nhiro.org/learn_language/AST-Visualization-on-browser.html)
  - 对应 console.log(fn01() || fn02() && fn03())，AST 是：
  - 具体到题主有疑问的那个地方，AST 是这样的：` || / \ fn01() && / \ fn02() fn03()`
  - 表达式层面上，代码的执行就是后序遍历这棵 AST 而已。
  - 优先级：在相邻的两个运算符 || 与 && 中，&& 比 || 离 AST 的根更远所以优先级更高
  - 结合性：这里没有相邻的同优先级运算符所以展现不出 || 与 && 的结合性，虽然它们都是左结合的
  - 求值顺序：JavaScript 的求值顺序就是从左向右的。对这棵 AST 来说就是在后序遍历时，每个节点的求值过程是先遍历左子树，再遍历右子树，然后对自己求值。
  - 外加 || 与 && 的短路求值语义，如果左操作数已经足以求出结果则不会对右操作数求值
