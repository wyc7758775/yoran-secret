# Vapor

## 性能提升测试

|                  | 首屏加载速度       | 更新耗时 | 更新内存使用 |
| ---------------- | ------------------ | -------- | ------------ |
| traditional Mode | **1.82s 到 2.28s** | 143ms    | 180 mb       |
| Vapor Mode       | **1.72s 到 2s**    | 25ms     | 144 mb       |

### 测试方法

浏览器：Chorme 版本 135 隐私模式

创建项目，把 `vite-plugin-vue-devtools`插件删除。删除默认的.vue 文件，删除样式文件。

template 核心代码如下：

```vue
<div class="flat-form">
  <div v-for="item in formData" :key="item.id" class="flat-form-item">
    <input type="text" v-model="item.name" placeholder="Name" />
    <input type="email" v-model="item.email" placeholder="Email" />
    <input
      type="number"
      v-model="item.age"
      min="18"
      max="120"
      placeholder="Age"
    />
    <label class="active-label">
      <input type="checkbox" v-model="item.active" /> Active
    </label>
  </div>
</div>
```

数据生成逻辑如下：

```typescript
const generateTestData = () => {
  formData.value = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 18,
    active: i % 2 === 0, // 确保正好一半数据的active为true
  }));
  isLoading.value = false;
};
```

active 确保正好一半数据的 active 为 true，是为了测试数据更新的时候数据变量的量样本一致。

更新数据的关键代码如下：

```typescript
const fixedUpdateCount = 20000;
formData.value.forEach((item, index) => {
  if (index < fixedUpdateCount) {
    item.active = !item.active;
  }
});
```

性能监听关键代码如下：

```typescript
// 等待DOM更新完成
await nextTick();

// 记录结束时间并计算差值
const endTime = performance.now();
updateTime.value = Math.round(endTime - startTime);

if (performance.memory) {
  const memoryUsageBytes = performance.memory.usedJSHeapSize;
  const memoryUsageMB = (memoryUsageBytes / (1024 * 1024)).toFixed(2);
  memoryUsage.value = parseFloat(memoryUsageMB);
  console.log(`Memory usage after update: ${memoryUsageMB} MB`);
}

console.log(`DOM update completed in ${updateTime.value}ms`);
```

> 之所以不完全使用控制台中的 Performance 来记录，是因为电脑比较卡，打开控制台本身就消耗了电脑不少性能。而且我们不需要多么精准的数据，需要的是对比。有了对比数据即可。

### 数据来源

**Vapor Mode:**

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753260936414-c4c79d5c-54cd-4126-bc1e-5ad60bf9d66c.png)

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753264996004-4812f646-3f94-4358-9e53-7a0755a86244.png)

**传统模式：**

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753260964666-3d085815-2c0c-4c45-9f3c-a889e19ba06f.png)

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753264977057-87195717-c3a6-473a-84ff-494fafc93f8e.png)

## Vapor 工作原理

### 配置流程

基于 vue3@3.6.0-alpha.2 版本

#### 渐进式使用方式(混合渲染模式)

1. 从 vue 中导出 vaporInteropPlugin 并 use

```vue
import { createApp, vaporInteropPlugin } from 'vue' import App from './App.vue'
import router from './router' const app = createApp(App)
app.use(vaporInteropPlugin) app.use(router) app.mount('#app')
```

2. 在需要使用的 SFC 文件的 setup 中配置上 `vapor` 即可。

#### 全量使用

修改 main.ts 中的引入组件

```typescript
import { createVaporApp } from "vue";
import App from "./App.vue";
createVaporApp(App).mount("#app");
```

> vue 的包体积从 50K 减少到 6k

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753265976128-e7d94807-36af-4fba-87ea-9ec2ae23dbd3.png)

### vapor 执行过程

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753271068555-e6b29728-1703-45ac-876c-1b33060fdb70.png)

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753266797992-fb35a48c-fb11-4887-a00e-0d4bf3288dec.png)

> 编译后的文件一般在 source 对应文件的下面，它的作用就是识别.vue 文件，然后把.vue 文件编译为 js 代码

简化代码如下

```javascript
const t0 = _template("<button>add count</button>");
const t1 = _template("<div> </div>");
const t2 = _template("<button>update class</button>");
const t3 = _template("<div>我是什么颜色</div>");
function _sfc_render(_ctx, $props, $emit, $attrs, $slots) {
  const n1 = t0();
  const n2 = t1();
  const n3 = t2();
  const n4 = t3();
  n1.$evtclick = _ctx.addCount;
  const x2 = _child(n2);
  n3.$evtclick = _ctx.updateClass;
  _renderEffect(() => {
    _setText(x2, _toDisplayString(_ctx.count));
    _setClass(n4, _ctx.color);
  });
  return [n1, n2, n3, n4];
}
```

上面是编译后的结果。

编译时: 识别了我绑定的在 DOM 上面可以进行的动态变改的是什么类型的节点。这次我想要改变的是 div 标签中的文本和 div 中字体的颜色。所以在生成的代码中就提前导入了 `setText` 以及 `setClass` 两个方法。

以 `setClass`为例，参数有两个：`_template("<div>我是什么颜色</div>")`和 `ctx.color`。

我们最后来看看`_renderEffect`函数，看名字你可能已经猜出来了。这个函数和`vue3`中的`watchEffect`比较相似，会立即运行一个函数。并且追踪函数中用的的依赖，这里的依赖是`msg`变量。当依赖的值变化时会再次执行这个函数。

这里的`_setText(n1, _ctx.msg)`，实际就是执行了`n1.textContent = _ctx.msg`。`textContent` 属性表示一个节点及其后代的文本内容，也可能通过给它赋值的方式删除它的所有子节点，并替换为一个具有给定值的文本节点，和`innerText`功能比较相似。

#### \_template 源码

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753277987653-172779a2-e138-484d-87d6-e2d0d2ad2cb0.png)

1. isHydrating 为服务端渲染，服务 SSR，跳过
2. `html[0] !== '<'`为 true 说明是纯文本内容，直接创建文本节点，跳过模板解析流程。
3. t 使用单例模式，不多于创建 `template`。
4. `if(!node)`缓存首次解析的 DOM 节点，避免重复解析 HTML 字符串, 如果已经存在了，通过 `cloneNode` 复用已经创建，减少 DOM 操作成本。

#### \_setText 源码

#### ![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753279257903-7fbace23-1e13-4758-99c2-b1f72c7e9137.png)

> `nodeValue`：直接修改 DOM 文本节点的内容（`textContent` 的底层实现）。

这里做了一个优化，如果值没有变化，就不重新个 `el.nodeValue`赋值。

上面代码转化为下面代码片段，直接改变的是文本本身，因为传进来的 childNodes 只有文本。

```javascript
const el = document.getElementById("test").childNodes[0];
el.nodeValue = el.$txt = value;
```

#### \_renderEffect 源码

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753280633388-6d30f4dc-c8d1-4ece-8585-27b0a96be070.png)

renderEffect 继承于 `ReactiveEffect`类，也就是说，我们传进去的函数作为一整个副作用在运行。

> `watchEffect` 本质上是通过封装 `ReactiveEffect` 类实现的高级用户 API。

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753281228512-0d4e769d-4c18-49d6-8885-b282d829cbf1.png)

`this.render()`就是执行我们传进行的下面的代码。

```javascript
() => {
  _setText(x2, _toDisplayString(_ctx.count));
  _setClass(n4, _ctx.color);
})
```

`_renderEffect(() => { ... })` 会自动追踪其回调函数内访问的所有响应式变量（如 `_ctx.count` 和 `_ctx.color`）。无论这些变量是否在本次更新中真正变化，只要它们被访问，就会被记录为依赖。

然后只有其中一个变量改变了，就会执行一次上面的 `fn()`函数，`_setText`和 `_setClass`都会被执行。

> 这个应该是需要它们后期优化的，我明明只是修改其中一个变量，为什么另外一个不相关的 \_setClass 也执行了呢？但是执行函数里面有了一定的优化，看\_setText 源码部分。

上面的代码简而言之，就是 直接调用 DOM API 对变量进行精细化渲染。

:::info
<u><font style="color:#DF2A3F;">也就是说？Vapor 在编译时就确定了 t1 这个 DOM 节点需要更新 count 数据,不需要再 diff 一遍！</font></u>

:::

#### compiler-vapor 源码

IR 是重点.....

看不懂，编译时，在解析文本，确定哪个 Dom 是需要精准更新的。

#### apiCreateFor

diff 不完全从运行时中删除了。比如在 v-for 中。源码位置如下：

`packages/runtime-vapor/src/apiCreateFor.ts`

源码如下：

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753696188297-a7d841ab-2126-4a96-abd5-43798be69458.png)

在运行时 中，v-for 循环依旧使用了 diff 算法。

#### 总结一下它执行的过程：

- 编译时：通过 AST 分析标记动态绑定与响应式依赖，生成精准的 DOM 操作指令；
- 运行时：通过 `_renderEffect` 实现细粒度更新，完全跳过虚拟 DOM；

所以等同于把 “diff 算法” 或者“虚拟 DOM”这些的操作提前在 vue 的 Compiler 中进行了处理。运行时只需要操作 DOM API 精准渲染，不存在寻找这次改变的是哪一个位置的逻辑了，运行时简化了计算节点的逻辑。

> _**这就是本地初始化的时候，首屏加载的速度没有明显的提升，那是因为 Compiler 增加了对于动态绑定标记与响应式依赖分析逻辑，会在本地开发或首次构建时带来额外开销。**_

## 传统 node 执行过程

具体代码如下：

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753271321802-b29229a5-eeb4-4ac6-a160-1f21063bc301.png)

简化如下

```typescript
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock(
      _Fragment,
      null,
      [
        _createElementVNode(
          "button",
          { onClick: $setup.addCount },
          "add count"
        ),
        _createElementVNode(
          "div",
          null,
          _toDisplayString($setup.count),
          1
          /* TEXT */
        ),
        _createElementVNode(
          "button",
          { onClick: $setup.updateClass },
          "update class"
        ),
        _createElementVNode(
          "div",
          {
            class: _normalizeClass($setup.color),
          },
          "我是什么颜色",
          2
          /* CLASS */
        ),
      ],
      64
      /* STABLE_FRAGMENT */
    )
  );
}
```

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753270858551-4b0d5e8d-6c4b-46de-b3ec-7d25fb791b98.png)

相比传统的执行过程，vapor 模式执行如下：

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1753270866798-fa49bc7a-9263-456b-a005-074a468a4fde.png)

总结：

1. diff 算法的删除减少了 patch 的执行时间。
2. 虚拟 DOM 删除，减少了大量变量的存在，直接减少了内存的占用。

### 执行过程

#### 1. 初始化阶段

模板编译：Vue 的编译器会将你的 template 编译为渲染函数（render function），生成的虚拟 DOM 结构大致如下：

```tsx
function render() {
  return h("div", [
    h("h1", "HelloWorld"),
    h("button", { onClick: () => count.value++ }, `count is ${count.value}`),
  ]);
}
```

响应式数据绑定：count 被 ref(0) 包裹后，Vue 会将其转换为响应式对象，并建立依赖追踪。

#### 2. 首次渲染

生成虚拟 DOM 树，执行渲染函数，生成初始虚拟 DOM（VNode）。

```tsx
{
  type: 'div',
    children: [
    { type: 'h1', children: 'HelloWorld' },
    { type: 'button', props: { onClick: handler }, children: 'count is 0' }
  ]
}
```

挂载真实 DOM：Vue 将虚拟 DOM 转换为真实 DOM 并插入页面。

```tsx
<div>
  <h1>HelloWorld</h1>
  <button>count is 0</button>
</div>
```

#### 3. 更新阶段

- 触发响应式更新：点击按钮 → count.value++ → 触发 count 的 setter 通知依赖（副作用）。
- 重新生成虚拟 DOM：重新执行渲染函数，生成新的虚拟 DOM。

```tsx
{
  button: { ..., children: 'count is 1' } // 只有 count 文本变化
}
```

- Diff 算法对比差异：Vue 对比新旧虚拟 DOM，发现只有 button 的文本子节点变化（0 → 1）。
- 精准更新真实 DOM：直接修改按钮的 textContent，无需重新创建整个 DOM 树。

button.textContent = 'count is 1';

以上便是对 Vue 虚拟 DOM 工作流程的简化描述，Vue 的虚拟 DOM 工作流程在实际执行中还有一些优化细节和边界情况，这个大家有兴趣可以去看一下 Vue 的源码，这里不做过多的阐述，只是让大家有个印象。

#### 感想

痛苦不会消失，只是会转移，Vapor 将耗时的逻辑从运行时转移到了编译时。但是优化编译时的逻辑，所以实现了总体性能的极大提升的同时，总的痛苦也减少了很多。

# 当前版本注意事项

## 官方的话:

- 适用场景：

  - ✅ 新项目初始化（createVaporApp）
  - ✅ 性能敏感页面（如首屏、数据看板）的局部启用（`<script setup vapor />`）

- 规避风险：
  - ❌ 避免老项目全量迁移
  - ❌ 暂勿依赖高级功能（如 SSR 激活、异步组件）
  - ❌ 大量依赖第三方 VDOM 组件库（兼容性存在边界问题）；
  - ❌ 暂勿依赖高级功能（如 SSR 激活、异步组件）
  - ❌ 大量依赖第三方 VDOM 组件库（兼容性存在边界问题）；

## 不使用的具体 API

defineAsyncComponent、`<KeepAlive>`、`<Teleport>`、`<Suspense>`都没有支持，计划中。

:::info
列表渲染 v-for 中依旧存在 diff 算法，而且是完整的 diff 算法。
:::

**Vapor 并不是简单粗暴地抛弃了所有 diff 算法，而是做了精细化的场景区分。**

- 在 90%的常规场景下，通过编译时优化实现了"无 diff"更新
- 在复杂的列表场景下，保留了成熟稳定的 diff 算法

**理出一个简单的表格总结：**

| 场景                | Vapor 的策略      | 原因                     |
| ------------------- | ----------------- | ------------------------ |
| 简单绑定 {{ name }} | 直接更新，无 dif  | 编译时就能确定更新目标   |
| 条件渲染 v-if       | 简单替换，无 diff | 只需要显示/隐藏，不复杂  |
| 列表渲染 v-for      | 保留 diff 算法    | 需要处理复杂的增删改移动 |
