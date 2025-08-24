import{_ as a,c as n,o as p,ah as e}from"./chunks/framework.z4R-vjjm.js";const u=JSON.parse('{"title":"响应式 API：进阶","description":"","frontmatter":{},"headers":[],"relativePath":"posts/Vue/响应式API：进阶.md","filePath":"posts/Vue/响应式API：进阶.md"}'),l={name:"posts/Vue/响应式API：进阶.md"};function t(i,s,c,o,r,h){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="响应式-api-进阶" tabindex="-1">响应式 API：进阶 <a class="header-anchor" href="#响应式-api-进阶" aria-label="Permalink to “响应式 API：进阶”">​</a></h1><h2 id="参考资料-vue3-官网" tabindex="-1">参考资料(vue3 官网) <a class="header-anchor" href="#参考资料-vue3-官网" aria-label="Permalink to “参考资料(vue3 官网)”">​</a></h2><ul><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#shallowref" target="_blank" rel="noreferrer">shallowRef()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#triggerref" target="_blank" rel="noreferrer">triggerRef()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#customref" target="_blank" rel="noreferrer">customRef()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive" target="_blank" rel="noreferrer">shallowReactive()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#shallowreadonly" target="_blank" rel="noreferrer">shallowReadonly()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#toraw" target="_blank" rel="noreferrer">toRaw()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#markraw" target="_blank" rel="noreferrer">markRaw()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#effectscope" target="_blank" rel="noreferrer">effectScope()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#getcurrentscope" target="_blank" rel="noreferrer">getCurrentScope()</a></li><li><a href="https://cn.vuejs.org/api/reactivity-advanced.html#onscopedispose" target="_blank" rel="noreferrer">onScopeDispose()</a></li></ul><h2 id="前言" tabindex="-1">前言 <a class="header-anchor" href="#前言" aria-label="Permalink to “前言”">​</a></h2><p>官方已经很好的写出了这些 API 是如何使用的，但是没有结合实践的业务场景来说明运用的场景，这个对于我们实际的开发非常的重要，而且在现在离不开大模型的情况下，对于我这种业务开发员来说，广度可能比深度更加的重要。</p><h2 id="_1-shallowref" tabindex="-1">1. ShallowRef <a class="header-anchor" href="#_1-shallowref" aria-label="Permalink to “1. ShallowRef”">​</a></h2><p>shallow 翻译为浅的，读音：ˈʃæləʊ/，这里的 shallowRef 是浅的引用。</p><h3 id="_1-1-基础使用" tabindex="-1">1.1 基础使用 <a class="header-anchor" href="#_1-1-基础使用" aria-label="Permalink to “1.1 基础使用”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;p&gt;多层级 shallowRef: {{ objShallow.count }}&lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;shallowRef: {{ count }}&lt;/p&gt;</span></span>
<span class="line"><span>  &lt;button @click=&#39;addShallowRefCount1&#39;&gt;&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;button @click=&#39;addShallowRefCount2&#39;&gt;&lt;/button&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>  const objShallow = shallowRef({</span></span>
<span class="line"><span>    count: 0,</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  const count = shallowRef(0)</span></span>
<span class="line"><span>  const addShallowRefCount1 = () =&gt; {</span></span>
<span class="line"><span>    objShallow.value.count++ // 界面没有变化</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  const addShallowRefCount2 = () =&gt; {</span></span>
<span class="line"><span>    count.value++ // 界面实时改变</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>也就是说 <code>shallowRef</code>它只收集 root 层级的数据变化，所以 <code>objShallow.value.count++</code>在界面没有响应。<strong>换一句话说，就是只监听.value 这个层级的变化</strong>。只是进行依赖收集，而不会监听.value 之后的层级的属性的变化。可以通过如下的方法让它可以在界面渲染：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const addShallowRefCount1 = () =&gt; {</span></span>
<span class="line"><span>  objShallow.value.count++ // 和下面的 count.value 在一起就界面就会改变了</span></span>
<span class="line"><span>  count.value++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const addShallowRefCount3 = () =&gt; {</span></span>
<span class="line"><span>  objShallow.value = {</span></span>
<span class="line"><span>    count: ++objeShallow.value.count</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>Diff 算法用于比较新旧虚拟 DOM 树的差异,发现有变化了就重新更新整个组件</p><p>上面的两种方式本质都是触发了组件的重新渲染。<code>addShallowRefCount3</code>不用多说，第一个方法是更加的让人错愕。当触发 count.value++的时候会执行 diff 算法，然后 diff 算法发现了差异之后，会重新更新<strong>整个组件。</strong>这个时候 <code>objShallow.value.count</code>会渲染最新的值。</p><p>对象如此，数组也一样：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;pushShallowRef&quot;&gt;push shallowRef&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;shallowRef: {{ refShallow }}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const refShallow = shallowRef([1, 2, 3]);</span></span>
<span class="line"><span>const pushShallowRef = () =&gt; {</span></span>
<span class="line"><span>  refShallow.value[1] = 4444; // ❌</span></span>
<span class="line"><span>  refShallow.value.push(4); // ❌</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h3 id="_1-2-业务使用场景" tabindex="-1">1.2 业务使用场景 <a class="header-anchor" href="#_1-2-业务使用场景" aria-label="Permalink to “1.2 业务使用场景”">​</a></h3><h4 id="_1-21-一次性处理大批量的数据" tabindex="-1">1.21 一次性处理大批量的数据 <a class="header-anchor" href="#_1-21-一次性处理大批量的数据" aria-label="Permalink to “1.21 一次性处理大批量的数据”">​</a></h4><p>添加下数据</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const originArray = () =&gt; {</span></span>
<span class="line"><span>  return { items: [{ count: 0 }] }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const arrayShallow = shallowRef(originArray())</span></span>
<span class="line"><span>const addArrayShallow = () =&gt; {</span></span>
<span class="line"><span>  // 插入 1000 个元素到 arrayShallow</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>    arrayShallow.value.items.push({ count: i })</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  triggerRef(arrayShallow) // 仅一次更新</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const arrayRef = ref(originArray());</span></span>
<span class="line"><span>const addArrayRef = () =&gt; {</span></span>
<span class="line"><span>  let template = { items: [{ count: 0 }] }</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>    template.items.push({ count: i })</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  arrayRef.value = template</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>使用 <code>originArray</code>函数封装原始数据，是为了之后可能存在初始化的可能性。s</p><p><img src="https://cdn.nlark.com/yuque/0/2025/png/654315/1754306966587-4647f582-3d60-49ad-9737-60543246b9a7.png" alt=""></p><p>这个是两个函数的运行时间，并没太大的差别，虽然理论上说 ref 会个嵌套每一个属性添加响应式代理，这样无疑会导致运行时间增加，但是实际的测试等于没有差别，即便数据量添加到 1 万。shallowRef 的优势在于 uptate 的时候，如下代码片段。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script&gt;</span></span>
<span class="line"><span>const changeArrayShallow = () =&gt; {</span></span>
<span class="line"><span>  const start = performance.now();</span></span>
<span class="line"><span>  // 高频修改内部属性</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>    arrayShallow.value.items[i].count =</span></span>
<span class="line"><span>      arrayShallow.value.items[i].count + 1000; // 无响应式开销</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  triggerRef(arrayShallow); // 仅一次更新</span></span>
<span class="line"><span>  const end = performance.now();</span></span>
<span class="line"><span>  console.log(&quot;changeArrayShallow 运行时间: &quot;, end - start);</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const changeArrayRef = () =&gt; {</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 10000; i++) {</span></span>
<span class="line"><span>    arrayRef.value.items[i].count = arrayRef.value.items[i].count + 1000; // 无响应式开销</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>运行的结果如下：</p><p><img src="https://cdn.nlark.com/yuque/0/2025/png/654315/1754313858262-123f7b4b-e552-4267-93f5-7e2f54de49ba.png" alt=""></p><p>使用 Ref 的 更改数据的用时是 25ms，而使用 ShallowRef 的是 0.7。应该它只更新一次数据，而 Ref 触发了 10000 次的。<strong>本质创建 10000 个响应式代理与创建 1 个响应式代理的性能差异巨大。</strong></p><p>但是 只使用 ref 不可以实现 shallowRef 一样的性能效果吗？它性能提升的主要是 shallowRef 在数据改变之后，再进行一次的响应式触发，所以我们只需要讲 ref 也改为响应式触发就可以了。</p><p>具体如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script&gt;</span></span>
<span class="line"><span>  const changeArrayRefOptimized2 = () =&gt; {</span></span>
<span class="line"><span>  const start = performance.now();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 获取原始对象</span></span>
<span class="line"><span>  const rawData = toRaw(arrayRef.value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 直接修改原始对象（无响应式开销）</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>    rawData.items[i].count += 1000;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 手动触发更新</span></span>
<span class="line"><span>  arrayRef.value = { ...rawData };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const end = performance.now();</span></span>
<span class="line"><span>  console.log(&quot;changeArrayRefOptimized 运行时间: &quot;, end - start);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>运行的耗时如下：</p><p><img src="https://cdn.nlark.com/yuque/0/2025/png/654315/1754319412934-a1cb9376-14a7-4127-9e4c-69b404e7fa20.png" alt=""></p><p>只是 ref 一样可以到底性能优化的目的。只是 shallowRef 会更加的方便，不需要通过 <code>toRaw</code>将响应式数据转化为原始对象，非响应式的。如果数据量多了，多创建一个大数据依旧会增加内存的占用的。</p><p>ref 加 toRaw 是 &quot;绕过响应式&quot; 的临时解决方案，而 shallowRef 是 Vue 为 &quot;浅层响应式需求&quot; 设计的原生 API，在初始化性能、内存占用、引用追踪的简洁性和第三方库集成方面，具有 ref 无法替代的优势。</p><h4 id="_1-22-大表单有优化-ref-和-shallowref-极致的性能优化" tabindex="-1">1.22 大表单有优化： ref 和 shallowRef 极致的性能优化 <a class="header-anchor" href="#_1-22-大表单有优化-ref-和-shallowref-极致的性能优化" aria-label="Permalink to “1.22 大表单有优化： ref 和 shallowRef 极致的性能优化”">​</a></h4><p>总体思路是 shallowRef 负责大数据的渲染，ref 负责单个表单元素的实时渲染。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;table&gt;</span></span>
<span class="line"><span>  &lt;tr v-for=&quot;row in bigData.rows&quot; :key=&quot;row.id&quot;&gt;</span></span>
<span class="line"><span>    &lt;td&gt;</span></span>
<span class="line"><span>      &lt;!-- 绑定到 currentEditRow，确保输入时实时反馈 --&gt;</span></span>
<span class="line"><span>      &lt;input</span></span>
<span class="line"><span>        v-model=&quot;currentEditRow[row.id].value&quot;</span></span>
<span class="line"><span>        @focus=&quot;startEdit(row)&quot;</span></span>
<span class="line"><span>        @blur=&quot;saveEdit(row)&quot;</span></span>
<span class="line"><span>      /&gt;</span></span>
<span class="line"><span>    &lt;/td&gt;</span></span>
<span class="line"><span>  &lt;/tr&gt;</span></span>
<span class="line"><span>&lt;/table&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>  const bigOriginData = () =&gt; {</span></span>
<span class="line"><span>  // 模拟大数据</span></span>
<span class="line"><span>  const rows = [];</span></span>
<span class="line"><span>  for (let i = 0; i &lt; 1000; i++) {</span></span>
<span class="line"><span>    rows.push({</span></span>
<span class="line"><span>      id: i,</span></span>
<span class="line"><span>      value: \`第\${i}行\`,</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return { rows }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const bigData = shallowRef(bigOriginData())</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 当前正在编辑的行用 ref（保证实时反馈）</span></span>
<span class="line"><span>const currentEditRow = ref(bigOriginData().rows)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 开始编辑时：将行数据复制到 currentEditRow</span></span>
<span class="line"><span>const startEdit = (row) =&gt; {</span></span>
<span class="line"><span>  currentEditRow.value[row.id] = { ...row }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 失去焦点时：同步修改到大数据，并触发更新</span></span>
<span class="line"><span>// 每一次都是改变一次引用</span></span>
<span class="line"><span>const saveEdit = (row) =&gt; {</span></span>
<span class="line"><span>  // 将修改同步到大数据</span></span>
<span class="line"><span>  const target = bigData.value.rows.find((r) =&gt; r.id === row.id)</span></span>
<span class="line"><span>  Object.assign(target, currentEditRow.value[row.id])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 手动触发大数据更新（界面刷新）</span></span>
<span class="line"><span>  bigData.value = { ...bigData.value }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>本质还是为了降低响应式处理的耗时，正如上面代码片段描述的一样，每一次更多只是改变一次响应式的变化，而且还能够帮助界面的实时改变。</p><h2 id="_2-customref" tabindex="-1">2. CustomRef <a class="header-anchor" href="#_2-customref" aria-label="Permalink to “2. CustomRef”">​</a></h2><p>这是一个非常典型符合元编程范式的 API，和 <code>Proxy</code>api 一样。不仅仅局限于业务的逻辑，可以从修改程序本身。</p><p>元编程的最大特点就是操作程序自身</p><p><code>customRef</code>相比 <code>ref</code>而言，白盒子和黑盒子的对比，它提供了 ref 内部的 track 和 trigger 方法，可以直接操作 <code>ref</code>内部不暴露的依赖收集和响应式的方法。而这两个方法就等于程序自身，而 <code>customRef</code>可以操作这个程序，也就论证了可以操作程序自身，所以 <code>customRef</code>符合元编程范式。</p><h3 id="_2-1-基础使用" tabindex="-1">2.1. 基础使用 <a class="header-anchor" href="#_2-1-基础使用" aria-label="Permalink to “2.1. 基础使用”">​</a></h3><p>customRef 将依赖收集和响应式变化的调用时机完全交给开发者。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>import { customRef, ref } from &quot;vue&quot;</span></span>
<span class="line"><span>const testCount = customRef((track, trigger) =&gt; {</span></span>
<span class="line"><span>  let value = 0 // 值的初始化</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    get() {</span></span>
<span class="line"><span>      track()</span></span>
<span class="line"><span>      return value</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    set(newValue) {</span></span>
<span class="line"><span>      value = newValue;</span></span>
<span class="line"><span>      trigger()</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>const addTestCount = () =&gt; {</span></span>
<span class="line"><span>  testCount.value++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h3 id="_2-2-业务使用场景" tabindex="-1">2.2. 业务使用场景 <a class="header-anchor" href="#_2-2-业务使用场景" aria-label="Permalink to “2.2. 业务使用场景”">​</a></h3><h4 id="_2-2-1-防抖" tabindex="-1">2.2.1. 防抖 <a class="header-anchor" href="#_2-2-1-防抖" aria-label="Permalink to “2.2.1. 防抖”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;addCount&quot;&gt;count++&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;count: {{ count }}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const useDebouncedRef = (value, delay = 200) =&gt; {</span></span>
<span class="line"><span>  let timeout</span></span>
<span class="line"><span>  return customRef((track, trigger) =&gt; {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      get() {</span></span>
<span class="line"><span>        track();</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      set(newValue) {</span></span>
<span class="line"><span>        clearTimeout(timeout);</span></span>
<span class="line"><span>        timeout = setTimeout(() =&gt; {</span></span>
<span class="line"><span>          value = newValue;</span></span>
<span class="line"><span>          trigger();</span></span>
<span class="line"><span>        }, delay);</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const count = useDebouncedRef(0);</span></span>
<span class="line"><span>const addCount = () =&gt; {</span></span>
<span class="line"><span>  count.value++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h4 id="_2-2-2-验证" tabindex="-1">2.2.2. 验证 <a class="header-anchor" href="#_2-2-2-验证" aria-label="Permalink to “2.2.2. 验证”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;input v-model=&quot;emailValue&quot; /&gt;</span></span>
<span class="line"><span>  &lt;p style=&quot;color: red&quot;&gt;{{ errorText }}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const errorText = ref(&quot;&quot;)</span></span>
<span class="line"><span>const emailValue = customRef((track, trigger) =&gt; {</span></span>
<span class="line"><span>  let value = &quot;&quot;</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    get() {</span></span>
<span class="line"><span>      track()</span></span>
<span class="line"><span>      return value</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    set(newValue, oldValue) {</span></span>
<span class="line"><span>      value = newValue;</span></span>
<span class="line"><span>      if (newValue.trim() === &quot;&quot;) {</span></span>
<span class="line"><span>        errorText.value = &quot;请输入邮箱&quot;</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      if (newValue.includes(&quot;66&quot;)) {</span></span>
<span class="line"><span>        errorText.value = &quot;你够 6&quot;</span></span>
<span class="line"><span>        trigger()</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      errorText.value = &quot;&quot;</span></span>
<span class="line"><span>      trigger()</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h4 id="_2-2-3-数据持久化" tabindex="-1">2.2.3. 数据持久化 <a class="header-anchor" href="#_2-2-3-数据持久化" aria-label="Permalink to “2.2.3. 数据持久化”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const valueLocal = customRef((track, grigger) =&gt; {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    get() {</span></span>
<span class="line"><span>      track();</span></span>
<span class="line"><span>      return localStorage.getItem(&quot;valueLocal&quot;) || &quot;light&quot;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    set(newValue) {</span></span>
<span class="line"><span>      localStorage.setItem(&quot;valueLocal&quot;, newValue)</span></span>
<span class="line"><span>      grigger();</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>const changeTheme = () =&gt; {</span></span>
<span class="line"><span>  valueLocal.value = valueLocal.value === &quot;dark&quot; ? &quot;light&quot; : &quot;dark&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h2 id="_3-shallowreactive" tabindex="-1">3. ShallowReactive <a class="header-anchor" href="#_3-shallowreactive" aria-label="Permalink to “3. ShallowReactive”">​</a></h2><h3 id="_3-1-基本使用" tabindex="-1">3.1. 基本使用 <a class="header-anchor" href="#_3-1-基本使用" aria-label="Permalink to “3.1. 基本使用”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;addShallowReactiveCount&quot;&gt;addShallowReactiveCount&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;addShallowReactiveCount2&quot;&gt;addShallowReactiveCount2&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;</span></span>
<span class="line"><span>    shallowReactive: {{ objShallow.count }}; 多层级 shallowReactive:</span></span>
<span class="line"><span>    {{ objShallow.obj.count }}</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const objShallow = shallowReactive({</span></span>
<span class="line"><span>  count: 0,</span></span>
<span class="line"><span>  obj: {</span></span>
<span class="line"><span>    count: 0,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>const addShallowReactiveCount = () =&gt; {</span></span>
<span class="line"><span>  objShallow.count++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const addShallowReactiveCount2 = () =&gt; {</span></span>
<span class="line"><span>  objShallow.obj.count++</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>和 <code>shallowRef</code>基本是一致的，只是面试操作的类型不一样。和 ref 之于 reactive 的一样。</p><h3 id="_3-2-业务使用场景" tabindex="-1">3.2. 业务使用场景 <a class="header-anchor" href="#_3-2-业务使用场景" aria-label="Permalink to “3.2. 业务使用场景”">​</a></h3><p>同 <code>shallowRef</code>。</p><h2 id="_4-shallowreadonly" tabindex="-1">4. ShallowReadonly <a class="header-anchor" href="#_4-shallowreadonly" aria-label="Permalink to “4. ShallowReadonly”">​</a></h2><p>主要是和一些 API 进行比较，本身的使用还是很简单的。</p><h3 id="_4-1-基本使用" tabindex="-1">4.1. 基本使用 <a class="header-anchor" href="#_4-1-基本使用" aria-label="Permalink to “4.1. 基本使用”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>const shallowReactiveObject = shallowReadonly({</span></span>
<span class="line"><span>  foo: 42,</span></span>
<span class="line"><span>  obj: {</span></span>
<span class="line"><span>    too: 11,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>shallowReactiveObject.foo = 33; // ❌ 改</span></span>
<span class="line"><span>shallowReactiveObject.bar = 11; // ❌ 增</span></span>
<span class="line"><span>delete shallowReactiveObject.foo; // ❌ 删</span></span>
<span class="line"><span>shallowReactiveObject.obj.too = 22; // ✅ 改</span></span>
<span class="line"><span>shallowReactiveObject.obj.bar = 11; // ✅ 增</span></span>
<span class="line"><span>delete shallowReactiveObject.obj.too; // ✅ 删</span></span>
<span class="line"><span>console.log(&quot;shallowReactiveObject.foo:&quot;, shallowReactiveObject); // Expected output: 42</span></span></code></pre></div><p>第一层数据和 <code>readonly</code>的一致，第二层就和操作普通的对象一样的，增删改查的都可以了。</p><h4 id="_4-1-1-readonly" tabindex="-1">4.1.1. readonly <a class="header-anchor" href="#_4-1-1-readonly" aria-label="Permalink to “4.1.1. readonly”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * readonly() 方法可以创建一个只读的对象，对象的属性不能被修改。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>const readonlyObject = readonly({</span></span>
<span class="line"><span>  foo: 42,</span></span>
<span class="line"><span>  obj: {</span></span>
<span class="line"><span>    too: 11,</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>readonlyObject.foo = 33; // ❌ 改</span></span>
<span class="line"><span>readonlyObject.bar = 11; // ❌ 增</span></span>
<span class="line"><span>delete readonlyObject.foo; // ❌ 删</span></span>
<span class="line"><span>readonlyObject.obj.too = 22; // ❌ 改</span></span>
<span class="line"><span>readonlyObject.obj.bar = 11; // ❌ 增</span></span>
<span class="line"><span>console.log(&quot;readonlyObject.foo:&quot;, readonlyObject); // Expected output: 42</span></span></code></pre></div><h4 id="_4-1-2-object-seal" tabindex="-1">4.1.2. Object.seal <a class="header-anchor" href="#_4-1-2-object-seal" aria-label="Permalink to “4.1.2. Object.seal”">​</a></h4><p>从此开始下面都是原生底层的 API，不是上面的 vue3 框架提供的 API。这些方法直接修改对象的 内部属性描述符 （如 [[Extensible]] 、 [[Writable]] 、 [[Configurable]]）。</p><p>seal() 方法可以防止新属性的添加和已有属性的删除，但是可以修改已有属性的值。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>const object = {</span></span>
<span class="line"><span>  foo: 42,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object.seal(object);</span></span>
<span class="line"><span>object.foo = 33;</span></span>
<span class="line"><span>console.log(object.foo); // Expected output: 33</span></span>
<span class="line"><span></span></span>
<span class="line"><span>delete object.foo; // Cannot delete when sealed</span></span>
<span class="line"><span>console.log(&quot;seal() delete object.foo:&quot;, object.foo); // Expected output: 33</span></span>
<span class="line"><span>object.foo = 11; // ✅</span></span>
<span class="line"><span>object.bar = 11; // ✅</span></span>
<span class="line"><span>console.log(&quot;seal() object.foo:&quot;, object.foo); // Expected output: 33</span></span></code></pre></div><h4 id="_4-1-3-object-freeze" tabindex="-1">4.1.3. Object.freeze <a class="header-anchor" href="#_4-1-3-object-freeze" aria-label="Permalink to “4.1.3. Object.freeze”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>const object2 = {</span></span>
<span class="line"><span>  foo: 42,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object.freeze(object2);</span></span>
<span class="line"><span>object2.foo = 33; // ❌</span></span>
<span class="line"><span>object2.bar = 11; // ❌</span></span>
<span class="line"><span>delete object2.foo; // ❌</span></span>
<span class="line"><span>console.log(&quot;freeze() object2.foo:&quot;, object2.foo); // Expected output: 42</span></span></code></pre></div><p>只可以读取，其他任何的操作都会直接报错，阻塞 JS 主线程的运行。</p><p><img src="https://cdn.nlark.com/yuque/0/2025/png/654315/1754328281285-67f3d43d-0d56-4706-ac5c-ddb3c4011355.png" alt=""></p><h4 id="_4-1-4-object-preventextensions" tabindex="-1">4.1.4. Object.preventExtensions <a class="header-anchor" href="#_4-1-4-object-preventextensions" aria-label="Permalink to “4.1.4. Object.preventExtensions”">​</a></h4><p>preventExtensions() 方法可以防止新属性的添加，但是可以修改已有属性的值。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>const object3 = {</span></span>
<span class="line"><span>  foo: 42,</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Object.preventExtensions(object3);</span></span>
<span class="line"><span>object3.foo = 33; // ✅</span></span>
<span class="line"><span>object3.bar = 11; // ❌</span></span>
<span class="line"><span>delete object3.foo; // ✅</span></span>
<span class="line"><span>object3.foo = 11; // ❌</span></span>
<span class="line"><span>console.log(&quot;preventExtensions() object3.foo:&quot;, object3.foo); // Expected output: 42</span></span></code></pre></div><h4 id="_4-1-5-校验是否被以上-api-修改对象的数据属性的方式" tabindex="-1">4.1.5. 校验是否被以上 API 修改对象的数据属性的方式 <a class="header-anchor" href="#_4-1-5-校验是否被以上-api-修改对象的数据属性的方式" aria-label="Permalink to “4.1.5. 校验是否被以上 API 修改对象的数据属性的方式”">​</a></h4><p><code>Object.isFrozen</code>、<code>Object.isSealed</code>、<code>Object.isExtensible</code>。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 4. Object.isFrozen() 方法</span></span>
<span class="line"><span> * isFrozen() 方法可以判断一个对象是否被冻结。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>console.log(&quot;------------Object.isFrozen() 方法分割线--------------&quot;);</span></span>
<span class="line"><span>console.log(&quot;Object.preventExtensions()&quot;, Object.isFrozen(object3)); // 空对象了，才是true</span></span>
<span class="line"><span>console.log(&quot;Object.freeze()&quot;, Object.isFrozen(object2)); // true</span></span>
<span class="line"><span>console.log(&quot;Object.seal()&quot;, Object.isFrozen(object)); // false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 5. Object.isSealed() 方法</span></span>
<span class="line"><span> * isSealed() 方法可以判断一个对象是否被密封。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>console.log(&quot;------------Object.isSealed() 方法分割线--------------&quot;);</span></span>
<span class="line"><span>console.log(&quot;Object.seal()&quot;, Object.isSealed(object)); // true</span></span>
<span class="line"><span>console.log(&quot;Object.freeze()&quot;, Object.isSealed(object2)); // true</span></span>
<span class="line"><span>console.log(&quot;Object.preventExtensions()&quot;, Object.isSealed(object3)); // false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 6. Object.isExtensible() 方法</span></span>
<span class="line"><span> * isExtensible() 方法可以判断一个对象是否是可扩展的。</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>console.log(&quot;------------Object.isExtensible() 方法分割线--------------&quot;);</span></span>
<span class="line"><span>console.log(&quot;Object.preventExtensions()&quot;, Object.isExtensible(object3)); // false</span></span>
<span class="line"><span>console.log(&quot;Object.freeze()&quot;, Object.isExtensible(object2)); // false</span></span>
<span class="line"><span>console.log(&quot;Object.seal()&quot;, Object.isExtensible(object)); // false</span></span></code></pre></div><p>-Object.isExtensible() 对应的判断对象的数据属性中的 [[Extensible]] 为 false。</p><p>所以想要通过判断对象被那个方法处理了，需要用这三个结合判断。如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>// 假设 object3 已被某种方法处理</span></span>
<span class="line"><span>const isPrevented = !Object.isExtensible(object3) &amp;&amp; !Object.isSealed(object3) &amp;&amp; !Object.isFrozen(object3);</span></span>
<span class="line"><span>const isSealed = !Object.isExtensible(object3) &amp;&amp; Object.isSealed(object3) &amp;&amp; !Object.isFrozen(object3);</span></span>
<span class="line"><span>const isFrozen = !Object.isExtensible(object3) &amp;&amp; Object.isSealed(object3) &amp;&amp; Object.isFrozen(object3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>console.log(&#39;被 preventExtensions 处理:&#39;, isPrevented);</span></span>
<span class="line"><span>console.log(&#39;被 seal 处理:&#39;, isSealed);</span></span>
<span class="line"><span>console.log(&#39;被 freeze 处理:&#39;, isFrozen);</span></span></code></pre></div><h2 id="_5-toraw" tabindex="-1">5. toRaw <a class="header-anchor" href="#_5-toraw" aria-label="Permalink to “5. toRaw”">​</a></h2><p><img src="https://cdn.nlark.com/yuque/0/2025/png/654315/1754330006417-d6b88f62-d1cd-4b69-99fa-012038f8ebbf.png" alt=""></p><p>toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象。</p><p>在前面说到 shallowRef 部分已经提到了这个 API 的作用了，可以配合 ref 实现接近 shallowRef 的性能。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;changeName&quot;&gt;changeName&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;changeRaw&quot;&gt;changeRaw&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;{{ data.name }}&lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;{{ data.age }}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>  const data = reactive({</span></span>
<span class="line"><span>  name: &quot;张三&quot;,</span></span>
<span class="line"><span>  age: 18,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>const raw = toRaw(data);</span></span>
<span class="line"><span>const changeName = () =&gt; {</span></span>
<span class="line"><span>  data.name = data.name === &quot;李四&quot; ? &quot;张三&quot; : &quot;李四&quot;;</span></span>
<span class="line"><span>  data.age++;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>const changeRaw = () =&gt; {</span></span>
<span class="line"><span>  raw.name = raw.name === &quot;李四&quot; ? &quot;张三&quot; : &quot;李四&quot;;</span></span>
<span class="line"><span>  raw.age++;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p><code>changeRaw</code>方法没有反应，视图不会更新，说明 raw 已经是原对象了，非响应式了。但是修改 raw 依旧会影响到 <code>data</code>这个响应式对象。</p><p>修改 toRaw()返回的对象，删除以及修改都会影响到原始的响应式对象。它们两个都是引向同一个内存地址，只是一个用 Proxy 进行了再加个，另外一个没有。</p><h2 id="_6-markraw" tabindex="-1">6. markRaw <a class="header-anchor" href="#_6-markraw" aria-label="Permalink to “6. markRaw”">​</a></h2><p>它的效果和 <code>toRaw</code>有一定相似的。都是让某一个对象更改为非响应式的。但是 markRaw 可以直接用在依旧被定义过的响应式对象中，如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;p&gt;</span></span>
<span class="line"><span>    标记为非响应式的对象，不会触发视图更新,但是初始化的时候依旧会改变，点击</span></span>
<span class="line"><span>    changeMarked 按钮，就不会改变视图</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>  &lt;button @click=&quot;changeMarked&quot;&gt;changeMarked&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;{{ state.config.name }}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const rawObject = { name: &quot;静态数据&quot; };</span></span>
<span class="line"><span>const markedObject = markRaw(rawObject); // 标记为非响应式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 即使放入响应式对象中，markedObject 仍保持原始状态</span></span>
<span class="line"><span>const state = reactive({</span></span>
<span class="line"><span>  config: markedObject, // 不会被代理</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state.config.name = &quot;修改&quot;; // ❌ 无效（非响应式，视图不更新）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const changeMarked = () =&gt; {</span></span>
<span class="line"><span>  state.config.name = state.config.name === &quot;静态数据&quot; ? &quot;修改&quot; : &quot;静态数据&quot;;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p>我们初始化的时候依旧是“修改”，那是因为 vue3 收集依赖是在 <code>onMounted</code>生命周期之前。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>setup() → 初始化响应式数据</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>onBeforeMount() → 渲染前准备</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>渲染 DOM → 访问响应式数据，触发依赖收集</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>onMounted() → 组件挂载完成</span></span></code></pre></div><ul><li>依赖收集发生在 渲染 DOM 的过程中 ，介于 onBeforeMount 和 onMounted 之间</li><li>这就是为什么界面显示的是「修改」而非「静态数据」的关键</li></ul><p>而当我使用 <code>setTimout</code>来包裹住 <code>state.config.name</code>的时候，初始化的指就是&#39;静态数据&#39;了。</p><h2 id="_7-effectscope" tabindex="-1">7. effectScope <a class="header-anchor" href="#_7-effectscope" aria-label="Permalink to “7. effectScope”">​</a></h2><h3 id="_7-1-基本使用" tabindex="-1">7.1. 基本使用 <a class="header-anchor" href="#_7-1-基本使用" aria-label="Permalink to “7.1. 基本使用”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>   &lt;el-button @click=&quot;counter++&quot;&gt;增加&lt;/el-button&gt;</span></span>
<span class="line"><span>  &lt;el-button @click=&quot;startEffects&quot;&gt;启动&lt;/el-button&gt;</span></span>
<span class="line"><span>  &lt;el-button @click=&quot;stopEffect&quot;&gt;停止&lt;/el-button&gt;</span></span>
<span class="line"><span>  &lt;el-button @click=&quot;runEffect&quot;&gt;重新运行&lt;/el-button&gt;</span></span>
<span class="line"><span>  &lt;p&gt;计算结果：{{ counter }} 计算结果：{{ doubled }}&lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;条件性启用和禁用作用域&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>const counter = ref(0)</span></span>
<span class="line"><span>const doubled = computed(() =&gt; counter.value * 2)</span></span>
<span class="line"><span>const scope = effectScope()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const startEffects = () =&gt; {</span></span>
<span class="line"><span>  scope.run(() =&gt; {</span></span>
<span class="line"><span>    watch(doubled, () =&gt; console.log(doubled.value));</span></span>
<span class="line"><span>    watchEffect(() =&gt; console.log(&quot;Count: &quot;, doubled.value));</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const stopEffect = () =&gt; {</span></span>
<span class="line"><span>  scope.stop()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>const runEffect = () =&gt; {</span></span>
<span class="line"><span>  scope.run()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><h3 id="_7-2-业务使用场景-全局响应式变量" tabindex="-1">7.2. 业务使用场景：全局响应式变量 <a class="header-anchor" href="#_7-2-业务使用场景-全局响应式变量" aria-label="Permalink to “7.2. 业务使用场景：全局响应式变量”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>import { effectScope, type EffectScope } from &#39;vue&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 创建全局状态的工厂函数</span></span>
<span class="line"><span>export const createGlobalState = &lt;T&gt;(stateFactory: () =&gt; T) =&gt; {</span></span>
<span class="line"><span>  // 用于存储全局作用域</span></span>
<span class="line"><span>  let global: T</span></span>
<span class="line"><span>  // 用于存储effect作用域</span></span>
<span class="line"><span>  let scope: EffectScope</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 返回一个函数，该函数用于获取或创建全局状态</span></span>
<span class="line"><span>  return () =&gt; {</span></span>
<span class="line"><span>    // 如果全局状态已存在，直接返回</span></span>
<span class="line"><span>    if (global) return global</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 如果全局状态不存在，创建一个新的effect作用域</span></span>
<span class="line"><span>    scope = effectScope(true)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在作用域内运行状态工厂函数，创建全局状态</span></span>
<span class="line"><span>    global = scope.run(() =&gt; stateFactory())!</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return global</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用的时候</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>import { createGlobalState } from &#39;../../hooks/globalScope&#39;</span></span>
<span class="line"><span>import { ref } from &#39;vue&#39;</span></span>
<span class="line"><span>export const useGlobalCount = createGlobalState(() =&gt; {</span></span>
<span class="line"><span>  const count = ref&lt;number&gt;(222)</span></span>
<span class="line"><span>  const increment = () =&gt; count.value++</span></span>
<span class="line"><span>  return { count, increment }</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>在组件中使用，可以跨组件：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&lt;template&gt;</span></span>
<span class="line"><span>  &lt;div class=&quot;container&quot;&gt;</span></span>
<span class="line"><span>    &lt;!-- 页面内容区域 --&gt;</span></span>
<span class="line"><span>    &lt;h2&gt;{{ count }}&lt;/h2&gt;</span></span>
<span class="line"><span>  &lt;/div&gt;</span></span>
<span class="line"><span>&lt;/template&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;script setup&gt;</span></span>
<span class="line"><span>import { useGlobalCount } from &quot;./global-count&quot;;</span></span>
<span class="line"><span>const { count } = useGlobalCount();</span></span>
<span class="line"><span>&lt;/script&gt;</span></span></code></pre></div><p><code>count</code>可以在多个组件中同时使用。这个也是 vueuse 中 createGlobalState 的实现原理。利用的就是 effectScope 可以控制副作用的清除和重启的方法。</p>`,105)]))}const g=a(l,[["render",t]]);export{u as __pageData,g as default};
