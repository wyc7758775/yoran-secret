# 使用 Composition API 实战经验

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006140571-694fd4fa-87b2-45b6-90d8-7b70304141c8.png)

<font style="color:rgb(0, 0, 0);">Composition api 出来之后，我们除了要学习它的 API 之后，更加要学习他为什么要这样设计。</font>

## <font style="color:rgb(0, 0, 0);">一、为什么组件越开发越难维护</font>

<font style="color:rgb(0, 0, 0);">在讨论组件为什么越来越难以维护，本质是在讨论，</font><font style="color:rgb(0, 0, 0);">compostion-api</font><font style="color:rgb(0, 0, 0);">的抛出是为什么解决什么问题？我们学习一个框架，除了要学习它的 API 之外，更重要的是学习它的 API 为什么要这么设计。</font>

### <font style="color:rgb(0, 0, 0);">1.1 vue2 的项目现状</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006140467-87e7fea2-1339-40a2-ab38-8e5207134749.png)

<font style="color:rgb(0, 0, 0);">以该图为例, A B C 分别是父子孙组件.</font>

<font style="color:rgb(0, 0, 0);">当我们要控制其中一个组件的状态的是, 可以通过很多方式来进行控制. 这些方式的来源有可能是</font>**<font style="color:rgb(0, 0, 0);">全局变量</font>**<font style="color:rgb(0, 0, 0);">、</font>**<font style="color:rgb(0, 0, 0);">vuex</font>**<font style="color:rgb(0, 0, 0);">、事件</font>**<font style="color:rgb(0, 0, 0);">总线</font>**<font style="color:rgb(0, 0, 0);">、以及</font>**<font style="color:rgb(0, 0, 0);">自己父组件或子组件的改变</font>**<font style="color:rgb(0, 0, 0);">等等。</font>

<font style="color:rgb(0, 0, 0);">可以看出, 改变它组件内部状态的来源非常的多, 维护或者修改的时候,需要翻阅的文件目录和范围就很广。更不用说当你发现同样的逻辑在别的地方可以共用的时候，抽离的心智成本自然是很高的。 自然就很难维护。这就是典型的</font>**<font style="color:rgb(0, 0, 0);">意大利面现象</font>**<font style="color:rgb(0, 0, 0);">。</font>

<font style="color:rgb(0, 0, 0);">当你想要进行逻辑复用的话，不要就是 mixins，要不就是 HOC。下面举一个 mixins 的例子：</font>

```plain
export default {
  mixins: [ a, b, c, d, e, f, g],
  mounted() {
    console.log(this.whoAreYou)
  }
}
```

<font style="color:rgb(0, 0, 0);">这个</font><font style="color:rgb(0, 0, 0);">this.whoAreYou</font><font style="color:rgb(0, 0, 0);">你能够知道来源于哪一个么？如果这个组件还使用了 HOC 高阶组件的话，会更加的混乱的。</font>

### <font style="color:rgb(0, 0, 0);">1.2 composition api 带来什么改进呢？</font>

<font style="color:rgb(0, 0, 0);">下面是</font><font style="color:rgb(0, 0, 0);">script setup</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">官方给出它其中的两个优点：</font>

- <font style="color:rgb(0, 0, 0);">更好的逻辑服用</font>
- <font style="color:rgb(0, 0, 0);">更灵活的代码组织</font>![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006140527-5fa27bcf-548f-4bd9-a46e-d32992682b09.png)
- ~~<font style="color:rgb(0, 0, 0);">更好的 ts 支持</font>~~
- ~~<font style="color:rgb(0, 0, 0);">更小的打包体积</font>~~

<font style="color:rgb(0, 0, 0);">下面我来给大家看看实际项目中都是怎么体现出来的。</font>

#### **<font style="color:rgb(0, 0, 0);">更好的逻辑服用</font>**

<font style="color:rgb(0, 0, 0);">这个</font><font style="color:rgb(0, 0, 0);">this.whoAreYou</font><font style="color:rgb(0, 0, 0);">你能够知道来源于哪一个么？如果使用了</font><font style="color:rgb(0, 0, 0);">composition api</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">的话，是下面这样：</font>

```javascript
export default {
  mixins: [a, b, c, d, e, f, g],
  mounted() {
    console.log(this.whoAreYou);
  },
};
```

```tsx
import { myHome } from '@/homwHook'
import { useWho } from '@/whoHook'
const { Iam1 } = useHome()

const { Iam2 as me } = useWho()
```

- <font style="color:rgb(0, 0, 0);">一切都变得很明朗，我可以非常清楚的知道这个方法的来源。维护和可读性都极大的提高了</font>
- <font style="color:rgb(0, 0, 0);">还可以取别名</font>
- <font style="color:rgb(0, 0, 0);">没有创建仅用于逻辑重用的不必要的组件实例。</font>

<font style="color:rgb(0, 0, 0);">composition-api 的书写流程大概就是把可以复用的状态和行为抽成函数，然后在 set up 标签里面引入并执行。如果我们把每个组件也看做一个函数的话，大概就是下面这个意思：</font>

```javascript
import useSth from './Sth'
function Component() {
  useSth()
    ....
}
```

<font style="color:rgb(0, 0, 0);">因为我们的业务中，对每个组件都要进行一些通用的操作，比如打印日志，设置 document.title，配置权限等等，在 composition-api 的背景下，差不多应该这么做：</font>

```javascript
function Component() {
  _logger()
  _setTitle()
  useSth()
    ....
}
```

<font style="color:rgb(0, 0, 0);">如果这些是每一个组件的通用组件，我们又可以怎么使用呢？在 option api 的时代，我使用</font><font style="color:rgb(0, 0, 0);">extend</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">来实现：</font>

```javascript
class BaseComponent extends Vue {
  created() {
    _logger();
    _setTitle();
  }
}
```

<font style="color:rgb(0, 0, 0);">那么每次我只需要 extends 这个 BaseComponent 即可，并不要每次都写执行它们的流程。</font>

<font style="color:rgb(0, 0, 0);">而 hook 的写法更加直接。</font>

```javascript
function abstract(Componet) {
  _logger();
  _setTitle();
  return Component();
}
```

```javascript
<script setup>
  import {abstract} from './abstract' import useSth from './Sth' abstract(() =>
  useSth()) ...
</script>
```

<font style="color:rgb(0, 0, 0);">写法就是将函数作为函数的参数，毕竟在 JS 中函数是一等公民，这是 JS 能够实现函数式范式的基础。展开代码如下：</font>

```javascript
function WithAttr(WrapperComponent) {
  return defineComponent({
    setup() {
      const number = ref(666);
      onMounted(() => {
        console.log("with attr mounted");
      });
      const attr: AttrType = useAttrs(); // 替代v-bind="$attrs"
      // import { h } from 'vue', 可以使用unplugin-auto-import插件省略掉
      return () =>
        h(WrapperComponent, {
          ...attr,
          a: number.value,
        });
    },
  });
}
```

#### **<font style="color:rgb(0, 0, 0);">更灵活的代码组织</font>**

```vue
<template>
  <div v-if="error">failed to load</div>
  <div v-else-if="loading">loading...</div>
  <div v-else>hello {{ fullName }}!</div>
</template>

<script>
import { createComponent, computed } from 'vue'

export default {
  data() {
    // 集中式的data定义 如果有其他逻辑相关的数据就很容易混乱
    return {
      data: {
        firstName: '',
        lastName: ''
      },
      loading: false,
      error: false,
    },
      },
  async created() {
    try {
      // 管理loading
      this.loading = true
      // 取数据
      const data = await this.$axios('/api/user')
      this.data = data
    } catch (e) {
      // 管理error
      this.error = true
    } finally {
      // 管理loading
      this.loading = false
    }
  },
  computed() {
    // 没人知道这个fullName和哪一部分的异步请求有关 和哪一部分的data有关 除非仔细阅读
    // 在组件大了以后更是如此
    fullName() {
      return this.data.firstName + this.data.lastName
    }
  }
}
</script>
```

```vue
<template>
  <div v-if="error">failed to load</div>
  <div v-else-if="loading">loading...</div>
  <div v-else>hello {{ fullName }}!</div>
</template>

<script>
import { createComponent, computed } from "vue";
import useSWR from "vue-swr";

export default createComponent({
  setup() {
    // useSWR帮你管理好了取数、缓存、甚至标签页聚焦重新请求、甚至Suspense...
    const { data, loading, error } = useSWR("/api/user", fetcher);
    // 轻松的定义计算属性
    const fullName = computed(() => data.firstName + data.lastName);
    return { data, fullName, loading, error };
  },
});
</script>
```

<font style="color:rgb(0, 0, 0);">代码更加的干净。而这个干净的感觉就是体现在将三个变量的定义都给藏进了</font><font style="color:rgb(0, 0, 0);">useSWR</font><font style="color:rgb(0, 0, 0);">之中。</font>

<font style="color:rgb(0, 0, 0);">那这个和抽离出去一个函数有什么不同呢？</font>

<font style="color:rgb(0, 0, 0);">这就是它一个关键的地方。</font>

**<font style="color:rgb(0, 0, 0);">composition-api 本质上它带来的组件逻辑的抽离和复用。根本上来说，就是我们可以让响应式变量单独抽离出去了，</font>\*\***<font style="color:rgb(0, 0, 0);">ref</font>\***\*<font style="color:rgb(0, 0, 0);">和</font>\*\***<font style="color:rgb(0, 0, 0);">reactive</font>\***\*<font style="color:rgb(0, 0, 0);">。</font>**

<font style="color:rgb(0, 0, 0);">data、fullName, loading</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">是可以直接作用于视图的。</font>

<font style="color:rgb(0, 0, 0);">在</font><font style="color:rgb(0, 0, 0);">composition-api</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">之前，只能通过</font><font style="color:rgb(0, 0, 0);">mixins</font><font style="color:rgb(0, 0, 0);">和</font><font style="color:rgb(0, 0, 0);">vuex</font><font style="color:rgb(0, 0, 0);">来实现。</font>

<font style="color:rgb(0, 0, 0);">文档中提出了一个尖锐的灵魂之问，你作为一个新接手的开发人员，能够在茫茫的</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">method</font><font style="color:rgb(0, 0, 0);">、</font><font style="color:rgb(0, 0, 0);">data</font><font style="color:rgb(0, 0, 0);">、</font><font style="color:rgb(0, 0, 0);">computed</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">等选项中一目了然的发现这个变量是属于哪个功能吗？比如「创建新文件夹」功能使用了两个数据属性，一个计算属性和一个方法，其中该方法在距数据属性「一百行以上」的位置定义。</font>

<font style="color:rgb(0, 0, 0);">当一个组价中，维护同一个逻辑需要跨越上百行的「空间距离」的时候，即使是让我去维护 Vue 官方团队的代码，我也会暗搓搓的吐槽一句，「这写的什么玩意，这变量干嘛用的！」</font>

<font style="color:rgb(0, 0, 0);">vue 是一个只负责视图的库。MVVC，我们负责 M 和写好 V，至于为什么我们改变了 M，V 就会有相应的变化，那就是 VC 干的事情了，即 Vue 库的工作了。</font>

<font style="color:rgb(0, 0, 0);">基于「逻辑功能」去组织代码，而不是</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">state</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">放在一块，</font><font style="color:rgb(0, 0, 0);">method</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">放在一块，这样和用 Vue2 没什么本质上的区别。</font>

```vue
setup() { // state const a = ref(1) const b = ref('') const c = ref(null) const
d = ref('') // method function handleA() {} function handleB() {} }
```

```vue
setup() { // handle a const a = ref(1) function getA() {} // handle b const b =
ref('') function handleB() {} const c = ref(null) const d = ref('') }
```

#### <font style="color:rgb(0, 0, 0);">额外的作用</font>

<font style="color:rgb(0, 0, 0);">代码行数减少。</font>

<font style="color:rgb(0, 0, 0);">这些就是 composition-api 带来的变化。除此之外呢？让我组件变成混乱的还有一点：</font>

- <font style="color:rgb(0, 0, 0);">业务变量和 UI 变量的混用</font>

### <font style="color:rgb(0, 0, 0);">1.3 业务变量和 UI 变量的混用</font>

<font style="color:rgb(0, 0, 0);">举一个例子, 在上面的目录中</font><font style="color:rgb(0, 0, 0);">dialog 组件</font><font style="color:rgb(0, 0, 0);">的显示或隐藏,是通过</font><font style="color:rgb(0, 0, 0);">model-value / v-model</font><font style="color:rgb(0, 0, 0);">来进行控制的,</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">true</font><font style="color:rgb(0, 0, 0);">就显示,</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">false</font><font style="color:rgb(0, 0, 0);">就隐藏起来. 下面是我们实际项目中的代码，这样的写法很多，很多。</font>

```vue
<span
  class="edit-icon cursor-pointer"
  v-show="
    isMobile &&
    item.editable &&
    group.key === 'user' &&
    visibleIconItemId === item.key
  "
>
  <i class="el-icon-edit" @click.stop="handleEdit(item)"></i>
</span>
```

<font style="color:rgb(0, 0, 0);">通过通过接口拿到的,或者自己组件的数据传进来之后,再进行对 v-model 的控制. data.id 这样的变量就是业务变量, 通过业务变量来直接控制 UI 的组件的显示和隐藏,就是业务变量和 UI 变量的混用. 或者说</font>_**<font style="color:rgb(0, 0, 0);">业务逻辑和交互逻辑的混用</font>**_**<font style="color:rgb(0, 0, 0);">。</font>**

<font style="color:rgb(0, 0, 0);">混用之后的后果,就是我们进行维护的时候, 需要查看的变量或者说字段就成倍的增加, 交互变量和业务变量交织在一起. 这部分的代码</font>**<font style="color:rgb(0, 0, 0);">同时承载了</font>**_**<font style="color:rgb(0, 0, 0);">业务逻辑和交互逻辑</font>**_<font style="color:rgb(0, 0, 0);"> 意大利面。</font>

<font style="color:rgb(0, 0, 0);">所以我们就需要将业务逻辑和交互逻辑给拆开. 如下:</font>

```vue
export default function Dialog() { props = { isShow: { type : Boolean, desc:
'是否显示弹窗' }, type: { type: String, desc: '弹窗的类型' } } render() { return
(
<el-dialog v-model="{ isShow }">
          <template slot="header">
            {{ dialogTitle }}
          </template>
          <template slot="content">
            // type === 创建表单
            // type === 移动文件夹目录
          </template>
        </el-dialog>
) } }
```

<font style="color:rgb(0, 0, 0);">其中 ishow 和 type 就可以视为 UI 变量, 它们不关心外界是通过了什么样的逻辑，什么样的判断, 只关系传进来的是 true 还是 false。这就是很简单的将业务逻辑和交互逻辑拆开。</font>

### <font style="color:rgb(0, 0, 0);">1.4 对于单个业务组件我们的理想模型</font>

<font style="color:rgb(0, 0, 0);">我们根据“角色”或“用途”分为通用型组件和业务型组件，通用型组件对于我们项目而言就是 element ui。所以我们主要面对的是业务型组件。</font>

<font style="color:rgb(0, 0, 0);">由此我们可以得到基于 composition api 可以得出业务型组件理想的模型如下：</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006140505-9ec2d28e-7a8a-4218-8a55-71bb1d52656f.png)

<font style="color:rgb(0, 0, 0);">依旧是 A B C 三个组件.但是 A B C 三个组件外边飘的那些箭头不存在了. 所有能够控制它们的内部状态的方式都集中 在了</font><font style="color:rgb(0, 0, 0);">hooks</font><font style="color:rgb(0, 0, 0);">上面.</font>

<font style="color:rgb(0, 0, 0);">其中</font><font style="color:rgb(0, 0, 0);">hooks</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">部分的组织形式和 vue 的</font><font style="color:rgb(0, 0, 0);">composition api</font><font style="color:rgb(0, 0, 0);">宣传图表现一致，每一个颜色对应一个 Hook，就是图上面的 void。</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006140528-f6b8b4c2-1e0c-4dc5-b6fb-57e38071898b.png)

<font style="color:rgb(0, 0, 0);">也就是说,控制 C 组件内部状态的是通过引入到 A 组件中的</font><font style="color:rgb(0, 0, 0);">controller</font><font style="color:rgb(0, 0, 0);">来进行通过,中间的 B 组件不做任何的处理,仅仅作为一个中转站。</font>

<font style="color:rgb(0, 0, 0);">但是在维护起来的时候还是挺灾难的，比如淡蓝色的那个色块代表的功能。我想要完整的理清楚它的逻辑，需要「上下反复横跳」，类似的事情我已经经历过好多次了。</font>

<font style="color:rgb(0, 0, 0);">组件化好似“搭积木”；“分而治之”思想实际运用，所谓“大事化小，小事化了”或称为“抽象隔离”。就是，各个组件之间有自己需要解决的问题，有各自解决的方式方法，但互相 不需要知道，它们沟通只看“结果”即 props，events/emit。</font>

<font style="color:rgb(0, 0, 0);">下面我通过一个实际的业务场景来描述。</font>

## <font style="color:rgb(0, 0, 0);">二、实际的例子</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006144434-75ce3f68-9c73-4263-af64-dc98671d048f.png)

### <font style="color:rgb(0, 0, 0);">2.1 数据流向</font>

![](https://cdn.nlark.com/yuque/0/2023/png/654315/1704006306543-1518f8a4-b8c6-4cdc-bb27-79acfb902f85.png)

<font style="color:rgb(0, 0, 0);">它由两部分构成:</font>

- <font style="color:rgb(0, 0, 0);">组件的模块</font>
- <font style="color:rgb(0, 0, 0);">组件之间的控制关系</font>

### <font style="color:rgb(0, 0, 0);">2.2 目录结构</font>

```plain
.
├── aside
├── constants
├── content
├── index.tsx
├── hooks
├── modal
└── search
```

#### <font style="color:rgb(0, 0, 0);">index.tsx</font>

```tsx
import { usexxxx, usexxx } from '@/hooks'
import { useModalAdd } from '@/useModalAdd'
import { useModalEdit } from '@/useModalEdit'

const { networkState } = useNetworkState()

// 更新目录树
const { updateTree } = useTree()

// 初始化右边的文档
const { updateContent, addContent } = useRenderContent(networkState)

// 收藏
const { folders, currentFolderData } = useFavorite(networkState)

// 目录树托拽移动
const folderNavigation = useTreeDrop({ networkState, currentFolderData })

  / **
  * 弹窗操作
  * /
  const { ModalAdd, handleAdd } = useModalAdd({
    callbackAdd: updateTree
  })
const { ModalEdit, handleEdit } = useModalAdd()

// Utils
const { slicePath } = usePathUtils()
export default {
  setup () {
    return () => (
      <search />
      <aside />
      <content />
      <ModalAdd />
      <ModalEdit />
    )
  }
}
```

<font style="color:rgb(0, 0, 0);">很清晰的代码结构和逻辑。一个变量都没有，但是通过函数就可以把这一块业务有的功能都给描述清楚了。</font>

### <font style="color:rgb(0, 0, 0);">2.3 ModalEdit</font>

```tsx
import { defineComponent } from "vue";

const useElDialog = () => {};
export const DOC_NAME = "doc_name";
export const DOC_TIME = "doc_time";
export type xxx = typeof DOC_NAME | typeof DOC_TIME;

export function useModalEadit(type) {
  const { Dialog, show, hide } = useElDialog({
    appendToBody: true,
    width: "200px",
  });

  const addModal = () => {};

  const ModalEdit = defineComponent({
    setup() {
      return () => <Dialog>{/* {xxxxx} */}</Dialog>;
    },
  });
  return { ModalEdit, addModal };
}
```

### <font style="color:rgb(0, 0, 0);">2.4 权限控制例子</font>

<font style="color:rgb(0, 0, 0);">颗粒度最小的一个例子：</font>

<font style="color:rgb(0, 0, 0);">此处放流程图：</font>

![]()

<font style="color:rgb(0, 0, 0);">其中最重要的就是拆分好受控组件和非受控组件。</font>

```vue
<tempalte>
  <el-button v-if="$auto('modile_app.version_plan.test_plan.create')" />
  </template>
```

<font style="color:rgb(0, 0, 0);">以 UI 变量来拆分组件。</font><font style="color:rgb(0, 0, 0);">ButtonAuth</font><font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">vue 还是 tsx 无所谓。</font>

```vue
import { defineComponent } from "vue" export function defineComponent({ props: {
type: { type: string, required: true, validator: val => { return
Object.value(AUTH_TYPE).include(val) }, desc: '当前按钮的类型' }, },
setup(props) { const { isShow } = useButtonAuth(props.type) return () => (
<el-button v-if="isShow">
    {/* {xxxxx} */}
    </el-button>
) } })
```

<font style="color:rgb(0, 0, 0);">用一个 useButtonAuth 来统一控制</font>

```tsx
import AUTH_TYPE from 'constant.ts'
export function useButtonAuth(type) {
  const _authList = {
    [AUTH_TYPE.edit]: root.$mobileAppAuthFunction('modile_app.version_plan.test_plan.create''),
    // ....
  }
  const isShow = ref(_authList[type])
  return { isShow }
}
```

<font style="color:rgb(0, 0, 0);">此外还需要一个常量文件</font><font style="color:rgb(0, 0, 0);">constant.ts</font>

```tsx
export AUTH_TYPE = {
  edit: 'edit'，
preview: 'preview',
  // ...
  }
```

<font style="color:rgb(0, 0, 0);">为什么不 vuex 直接控制到组件这里呢？就是为了让我的思维产生定式。后期需要维护的时候，我们第一时间联想到的就是找对应的 hooks，而不是翻阅好几个文件。这就是规范。规范有什么用，就是降低我维护代码的心智负担。</font>

<font style="color:rgb(0, 0, 0);">可能我说得还不够清晰，这个是我们的项目地址。技术栈是 vue3 + hook + ts + jsx</font>

## <font style="color:rgb(0, 0, 0);">三、持续的优化</font>

### <font style="color:rgb(0, 0, 0);">3.1 有了 setup 就足够了么？</font>

<font style="color:rgb(0, 0, 0);">代码终究是要人来写的，起码现在还是。而且一个项目，像我们这样的长期项目，经历过了多批开发人员的项目，不过你前期写得再怎么好，它随着时间的积累，还是会乱的。我们前期的架子只能延缓这个过程。</font>

<font style="color:rgb(0, 0, 0);">在我们实际开发中，某一个功能（业务）逻辑真的很复杂时，聚合度很高，可能一个 API 中有许多的状态，许多的 computed，用到了多个的生命周期钩子函数。如果真的因为某些无法明确的原因将其拆分，或许你真的该考虑下在代码中自行添加一些 Options API 式的注释，它们用于标出用途还是很立竿见影的（返祖 ）。</font>

<font style="color:rgb(0, 0, 0);">这一块是用于 created 的，这一块是用于 methods 的。</font>

<font style="color:rgb(0, 0, 0);">所以说，在我看来，composition api 的带来并没有真正的解决任何问题。代码的质量真正还是取决于使用它的这个人，这个人对于软件工程的理解深度。</font>

### <font style="color:rgb(0, 0, 0);">3.2 持续的优化和阶段性的重构才是根本</font>

<font style="color:rgb(0, 0, 0);">持续的优化和阶段性的重构才是保证代码质量的有力工具。</font>

- <font style="color:rgb(0, 0, 0);">当碰到这里用的代码别的地方也用到的时候</font>
- <font style="color:rgb(0, 0, 0);">这个变量出现在好几个地方,被好几个地方都 set 的时候, 而自己搞不懂它们 set 的顺序的时候</font>
- <font style="color:rgb(0, 0, 0);">函数复杂到自己看了半天都看不明白的时候</font>

<font style="color:rgb(0, 0, 0);">重构不等于重写，它依然有风险，有关于重构的使用策略是另外的一个话题，我们暂且略过。但是对于我们开发者而言，最重要的是知道什么样的代码需要重构。</font>

- <font style="color:rgb(0, 0, 0);">技术债是不可避免的。业务飞速发展时，遗留适当技术债可以帮忙业务强占市场。我们的产品一定是各方妥协的产物。客户端操作体验比 WEB 强了这么多，为什么还不将诺亚做成客户端。</font>
- <font style="color:rgb(0, 0, 0);">技术债的大小和影响，是个很难量化和说清楚的事情。不论哪种测量方式，都不能只看指标；需要不停地在技术和业务之间做出权衡。正如标题所说，如同“带着镣铐在冰山上跳舞”。</font>
- <font style="color:rgb(0, 0, 0);">最重要的一点。除了 TL 之外，团队需要培养“还债”的意识，不止开发团队，需要所有利益相关团队对技术债有正确的认识，并形成“还债”的一个氛围和文化。</font>

<font style="color:rgb(0, 0, 0);">技术债又是另外一个话题。</font>

<font style="color:rgb(0, 0, 0);">最重要的是在保障业务按时完成的情况下，就应该</font>_**<font style="color:rgb(0, 0, 0);">多尝试,多实践</font>**_<font style="color:rgb(0, 0, 0);">。</font>

<font style="color:rgb(0, 0, 0);">最后和大家分享一句话：</font>**<font style="color:rgb(0, 0, 0);">前端是一门手艺活，唯手熟尔。</font>**

<font style="color:rgb(0, 0, 0);">与君共勉。</font>

<font style="color:rgb(0, 0, 0);">谢谢大家。</font>
