ts 可以解决[Top 10 JavaScript errors from 1000+ projects (and how to avoid them)](https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/) 这样的问题。再加上对象提示🔔

## 一、 TS 基础
```typescript
// 1.对象和函数 interface
interface IPerson {
  readonly name: string;
  age: number;
  callback: { (name: string): string };
}

const obj: IPerson = {
  name: "yoran",
  age: 2,
  callback: function (name: string): string {
    return name;
  },
};
// obj.name = "ma";

// 2.枚举
enum Transpiler {
  Babel = "Babel",
  Postcss = "Postcss",
  Terser = "Terser",
  Prettier = "Prettier",
}

const curVersion = "Babel";
console.log(curVersion === Transpiler.Babel);
const transpiler1: Transpiler = Transpiler.Babel;

// 3.extends
type isTow<T> = T extends 2 ? string : number;

type TString = isTow<2>;
type TNumber = isTow<1>;

// const a: TString = 22;

// 4.数组类型
const array: unknown[] = [1, ""];
console.log(array);

// 5.联合类型
// 下面的 | 变更为 & 之后，错误提示就是不可达.
// 因为这个不可能，没有什么变量能够既是字符串还是数字的
const array1: (string | number)[] = [1, 2, ""];

// 6.映射类型，这个是我一直搞不明白的东西
type student = {
  name: "yoran";
  age: 29;
  sex: "boy";
};

type ReadonlyTest<T> = {
  readonly [Key in keyof T]: T[Key];
};

type TStudent = ReadonlyTest<student>;

// 限制传进来的变量是这个几个对象
// 这个的用法困住了我好久好久，我就是一个傻逼
const stateType = {
  start: "开始",
  continue: "继续",
  stop: "停止",
};

enum EStateType {
  start = "开始",
  continue = "继续",
  stop = "停止",
}

function getStateType(type: EStateType): EStateType {
  return type;
}

console.log(getStateType(EStateType.start));

// 7.函数 , return显示undefined的话，使用undefined,否则是void
type TFnPerson = (name: string) => void;

const getPerson: TFnPerson = (name) => {
  console.error(name);
};

const getPersonUndefined = (name: string): undefined => {
  return;
};

// 8. any和unknown的关系
// any 和 unknown都是万能类型，但是前者放弃了类型检查
function fnAny(params: any) {
  console.log(params.name);
}
function fnUnknown(params: unknown) {
  console.log((params as { name: string }).name);
}
// 这个才是unknown的正确用法，绝大多数可以使用unknown来代替any
function fnUnknownArray(params: unknown) {
  (params as unknown[]).forEach((element) => {
    element = (element as number) + 1;
  });
}
// 反直觉现象
interface IUser {
  name1: string;
  job?: IJob;
}
interface IJob {
  title: string;
}
const user: IUser = {
  name1: "foo",
  job: {
    title: "bar",
  },
};
const { name1, job = {} as IJob } = user;
console.log(job.title);

/**
 * 9. 联合类型
 */
interface IPerson1 {
  name: string | number;
}
type IPerson2 = {
  name: string | number;
};

type IPerson3 = string | number;
let person3: IPerson3 = 2;
person3 = "3";
console.log(person3);

enum status_map {
  success = "success",
  failure = "failure ",
}
enum skill_map {
  computed = "computed",
  sport = "sport",
}
// type Status = 'success' | "failure";
// 如果都是一个map的话，这样子没有必要，如果是联合其他类型的话，还是有点作用的
type Status = status_map.success | "failure" | skill_map;
const status1: Status = status_map.success;
console.log(status1);
const status2: status_map = status_map.failure;
const status3: Status = skill_map.sport;
console.log(status3);

/**
 * 10. 字面量类型
 */
interface ILiteral {
  name: "yoran";
}
const literalObject: { name: "yoran" } = { name: "yoran" };
const literal1: ILiteral = { name: "yoran" };
// 上面这两种类型没有区别

type aa = {
  name: "sdf";
};
type bb = {
  age: number;
};

type aabb = aa | bb;

const aabb1: aabb = {
  name: "sdf",
};

/**
 * 11. 范型
 */
type TStatus<T, D> = "success" | "failure" | "pending" | T | D;

// 等价于 type TStatus = "success" | "failure" | "pending" | "start" | "end"
const status4: TStatus<"start", "end"> = "pending";

interface IStatus<T> {
  data: T;
  code: 200;
}
const status5: IStatus<number> = {
  data: 222,
  code: 200,
};

/**
 * 12. 工具类
 */
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;

const user1: PartialUser = {
  name: "John Doe",
  age: 30,
  // email: "john.doe@example.com",
};

type TUser = {
  name: string;
  age: number;
  email: string;
  phone: string;
};

// 只提取其中的 name 与 age 信息
type UserBasicInfo = Pick<User, "name" | "age">;

const user2: UserBasicInfo = {
  name: "yoran",
  age: 18,
};

/**
 * 13. 模版字符串类型
 */
type Version = `${number}.${number}.${number}`;
const v1: Version = "1.2.0";

type SayHello<T extends string | number> = `Hello ${T}`;

type Greet1 = SayHello<"linbudu">; // "Hello linbudu"
type Greet2 = SayHello<599>; // "Hello 599"

const meName = "yoran";
type TMeName = typeof meName;
const meName1: TMeName = "yoran";

```

TS 解决的问题:[https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/](https://rollbar.com/blog/top-10-javascript-errors-from-1000-projects-and-how-to-avoid-them/)

## 二、 TS 相关疑问
+ type和interface的区别？

:::tips
1. type 可以指定基础类型，并且给基础类型编程，比如type TPerson = string | number | boolean。
2. 在定义对象类型时，两者并没有什么不同。type 可以用来定义所有类型，interface 只能用来定义对象类型,type 和interface在使用场景上二者应该是包含与被包含的关系。

:::

+ 字面量类型

:::tips
1. 更加细致的限制开发输入的类型

:::

+ 范型是什么

:::tips
1. 类型编程中的参数。`type TPerson<T, D> = T | D | 'yoran' | '柳生'`

:::

+ 范型的难点？
    - 主动赋值
    - 自动推导



+ <font style="color:rgb(37, 41, 51);">类型声明的概念</font>

:::tips
1. 专门指 `xxxx.d.ts`这样的文件

:::

### 团队使用 TS 是否会增加人力成本？


## 三、 JS 迁移 TS
+ 不要对逻辑进行重构，最多写一个 TODO。即便你看这一部分再不顺眼也是这样。
+ <font style="color:rgb(37, 41, 51);">更加不要发生技术栈的替换，只做类型包的补充。</font>

> <font style="color:rgb(37, 41, 51);">在迁移过程中的一个大忌就是，你明明只应该补充下类型，却觉得原来的逻辑不顺眼直接顺手改掉了，或者感觉使用的 npm 包太老，顺手替换了个更潮流的包。千万不要这么做！否则如果迁移过程中哪里出现了问题，为了定位问题根源，大概率你又要将它们回退回去，甚至包括一些无辜的类型代码...，简直就是在给你自己增加工作量了。</font>
>

## 四、 TypeScript 是如何运作的？
为什么说 TS 是一个单独的语言？又为什么说 TS 可以最大限度的兼容 JS？

在深入学习之前，我有一个认知，TS 只是 JS 的一个辅助工具一样的东西，它依托于 webpack 之类的构建工具工作。这样的认知是错误的。TS就是一个单独的语言，但是它为了能够最大限度地降低用户的使用门槛，在 JS 语言规范的基础上，扩展出了类型检查。这也是说 TS 是 JS 超集的由来。

![](https://cdn.nlark.com/yuque/0/2024/png/654315/1707976483587-c71a7066-83ef-4199-9fe1-c7708a74403a.png)

所以说，这就给了，那些不想要改老的项目也可以使用类型检查的条件，毕竟即便改成使用 TS 来写 JS，它也是回转化成 JS 和.d.ts 的文件。比如下面的 lodash 的依赖包。

![](https://cdn.nlark.com/yuque/0/2024/png/654315/1707976789675-abe84f57-2425-4147-8f46-8718338934b4.png)

但是在安装了，`@type/loadsh`之后，就不会报错了。

```bash
npm i @types/lodash
```

我可以去看一下 `node_module`中的 `@type`文件夹如下所示：

![](https://cdn.nlark.com/yuque/0/2024/png/654315/1707976915158-e5aebc7a-438c-41fc-87b1-6a72477e440e.png)

全部都是使用 `xxx.d.ts`的组成。有了这些文件，我们就可以消除 <font style="background-color:#FBDE28;">无法找到模块的相关报错。</font>

如果一开始就是使用 TS 写的项目，也只不过是把 `xx.d.ts`放到了依赖包之中。

## 五、类型断言如何正确的使用
###  5.1 为将来补全类型做好准备
unknown 和类型断言结合使用

```typescript
function myFunc(param: unknown) {
  (param as number[]).forEach((element) => {
    element = element + 1;
  });
}

function myFunc(param: unknown) {
  (param as unknown[]).forEach((element) => {
    element = (element as number) + 1;
  });
}

```

这样做的目的是什么呢？提醒开发，你使用的这个变量还是不知道的类型，要小心为好哦。

+ 类型断言的意义存在
+ unkown 结合类型断言可以强制开发明确它的类型，一步步的完善它最终的类型



而 any 结合类型断言也是可以到达同样的目的。但是他们还是有一个很大的差别的，如下

```typescript
let a: any = {}
console.log(a.b.foo()) // 不会报错

let b: unknow = {}
console.log(b.a.foo()) //  会找错，提示a为unknow
```

**any 在使用的时候不会报错，容易被忽略**

### 5.2 弥补TS的错误
```typescript
interface IName {
  boo: string
}
interface IHuman {
  base: IName
  height: number
}

const yoran: IHuman = {
  height: 12,
  base: {
    boo: '吃饭咩'
  }
}
const { height, base = {} } = yoran
console.log(height)
console.log(base.boo) // 类型"{}"上面不存在属性"boo"

```

类型明明都已经给了，但是在使用的时候，给他弄一个默认值，它的类型就改变了，读取不到 boo 这个属性了。

这个时候我们就需要使用到类型断言去解决这个问题。如下：

```typescript
const { height, base = {} as IHuman } = yoran
console.log(base.boo) // 不报错。完美哦
```

