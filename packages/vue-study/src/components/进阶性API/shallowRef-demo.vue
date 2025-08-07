<template>
  <h2>1.1 基本使用</h2>
  <h3>1.1.1 shallowRef</h3>
  <ul>
    <li>shallow翻译为浅的，读音：ˈʃæləʊ/，这里的 shallowRef 是浅的引用。</li>
  </ul>
  <p>多层级 shallowRef: {{ objShallow.count }}</p>
  <p>shallowRef: {{ count }}</p>

  <button @click="addShallowRefCount">改变 shallowRef 的子级的属性</button>
  <button @click="addShallowRefCount2">方法里面放入一个 ref 的变量</button>
  <button @click="addShallowRefCount3">立刻执行渲染</button>
  <button @click="addShallowRefCount4">改变 shallowRef 的根级的属性</button>
  <p>
    上面的例子只能看到 shallowRef
    只能监听对象的属性变化，不能监听对象的属性值变化。也就是说只能监听 root。
    但是这样说并不准确，下面的例子可以证明。点击第一个按钮多吃之后，值其实是一个改变的，只是界面没有实时的渲染，所以只能说
    shallowRef 是惰性的更新数据
  </p>

  <button @click="pushShallowRef">push shallowRef</button>
  <p>shallowRef: {{ refShallow }}</p>

  <h3>1.1.2 ref</h3>
  <button @click="addRefCount">change ref</button>
  <button @click="changeRefArray">改变数组的属性</button>
  <p>ref: {{ objRef.count }}</p>
  <p>多层级 Ref: {{ objRef.obj.count }}</p>
  <p>ref: {{ refCount }}</p>

  <h2>1.2 shallowRef 基础使用场景</h2>
  <p>
    上面的例子只能看到 shallowRef
    只能监听对象的属性变化，不能监听对象的属性值变化。也就是说只能监听 root。
    节点的变化。而 ref 可以监听对象的属性值变化，多个层级都可以监听到。
  </p>
  <p><button @click="clearRef">置空</button></p>
  <button @click="addArrayRef">Ref添加数组的元素</button>
  <button @click="changeArrayRef">改变数组的属性</button>
  <button @click="changeArrayRefOptimized">ref优化修改数组元素</button>
  <button @click="changeArrayRefOptimized2">ref优化修改数组元素2</button>
  <p>Ref: {{ arrayRef }}</p>
  <button @click="addArrayShallow">ShallowRef添加数组的元素</button>
  <button @click="changeArrayShallow">修改数组元素</button>
  <p>shallowRef: {{ arrayShallow }}</p>
  <p></p>

  <h2>1.3 shallowRef + Ref 性能优化使用场景</h2>
  <table>
    <tr v-for="row in bigData.rows" :key="row.id">
      <td>
        <!-- 绑定到 currentEditRow，确保输入时实时反馈 -->
        <input
          v-model="currentEditRow[row.id].value"
          @focus="startEdit(row)"
          @blur="saveEdit(row)"
        />
      </td>
    </tr>
  </table>
</template>
<script setup lang="tsx">
import { shallowRef, ref, triggerRef, toRaw, nextTick } from "vue";

/**
 *  使用场景 1：shallowRef
 */
const objShallow = shallowRef({
  count: 0,
});
const count = shallowRef(0);
const refShallow = shallowRef([1, 2, 3]);
const addShallowRefCount = () => {
  objShallow.value.count++;
};
const addShallowRefCount2 = () => {
  objShallow.value.count++;
  count.value++; // 添加这个之后，上面的就生效了
};
const addShallowRefCount4 = () => {
  objShallow.value = {
    count: ++objShallow.value.count,
  };
};
const addShallowRefCount3 = () => {
  objShallow.value.count++;
  triggerRef(objShallow);
};
const pushShallowRef = () => {
  refShallow.value[1] = 4444; // ❌
  refShallow.value.push(4); // ❌
};

const originArray = () => {
  return { items: [{ count: 0 }] };
};
// shallow大数据添加和更新的测试
const arrayShallow = shallowRef(originArray());
const addArrayShallow = () => {
  const start = performance.now();
  // 插入 1000 个元素到 arrayShallow
  for (let i = 0; i < 1000; i++) {
    arrayShallow.value.items.push({ count: i });
  }
  triggerRef(arrayShallow);
  const end = performance.now();
  console.log("addArrayShallow 运行时间: ", end - start);
};

/**
 * 使用场景 1： ref 的数据新增和添加
 */
const arrayRef = ref(originArray());
const addArrayRef = () => {
  const start = performance.now();
  let template = { items: [{ count: 0 }] };
  for (let i = 0; i < 1000; i++) {
    template.items.push({ count: i });
  }
  arrayRef.value = template;
  const end = performance.now();
  console.log("addArrayRef 运行时间: ", end - start);
};
const changeArrayRef = () => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    arrayRef.value.items[i].count = arrayRef.value.items[i].count + 1000; // 无响应式开销
  }
  const end = performance.now();
  console.log("changeArrayRef 运行时间: ", end - start);
};
const changeArrayShallow = () => {
  const start = performance.now();
  // 高频修改内部属性
  for (let i = 0; i < 1000; i++) {
    arrayShallow.value.items[i].count =
      arrayShallow.value.items[i].count + 1000; // 无响应式开销
  }
  triggerRef(arrayShallow); // 仅一次更新
  const end = performance.now();
  console.log("changeArrayShallow 运行时间: ", end - start);
};
const changeRefArray = () => {
  refCount.value[1] = 4444; // ✅
};

const changeArrayRefOptimized = () => {
  const start = performance.now();

  // 获取原始数据
  const rawItems = arrayRef.value.items;

  // 创建新数据并修改
  const newItems = [...rawItems].map((item) => ({
    ...item,
    count: item.count + 1000,
  }));

  // 一次性替换整个数组
  arrayRef.value = { ...arrayRef.value, items: newItems };

  const end = performance.now();
  console.log("changeArrayRefOptimized 运行时间: ", end - start);
};

const changeArrayRefOptimized2 = () => {
  const start = performance.now();

  // 获取原始对象
  const rawData = toRaw(arrayRef.value);

  // 直接修改原始对象（无响应式开销）
  for (let i = 0; i < 1000; i++) {
    rawData.items[i].count += 1000;
  }

  // 手动触发更新
  arrayRef.value = { ...rawData };

  const end = performance.now();
  console.log("changeArrayRefOptimized 运行时间: ", end - start);
};

const clearRef = () => {
  arrayRef.value = originArray();
  arrayShallow.value = originArray();
};

/**
 * ref
 */
const objRef = ref({
  count: 0,
  obj: {
    count: 0,
  },
});
const refCount = ref([1, 2, 3]);
const addRefCount = () => {
  objRef.value.count++;
  objRef.value.obj.count++;
  refCount.value.push(4);
};

/**
 * shallowRef + ref 性能优化
 */
const bigOriginData = () => {
  // 模拟大数据
  const rows = [];
  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      value: `第${i}行`,
    });
  }
  return { rows };
};
const bigData = shallowRef(bigOriginData());

// 当前正在编辑的行用 ref（保证实时反馈）
const currentEditRow = ref(bigOriginData().rows);

// 开始编辑时：将行数据复制到 currentEditRow
const startEdit = (row) => {
  currentEditRow.value[row.id] = { ...row };
};

// 失去焦点时：同步修改到大数据，并触发更新
// 每一次都是改变一次引用
const saveEdit = (row) => {
  // 将修改同步到大数据
  const target = bigData.value.rows.find((r) => r.id === row.id);
  Object.assign(target, currentEditRow.value[row.id]);

  // 手动触发大数据更新（界面刷新）
  bigData.value = { ...bigData.value };
};
</script>
