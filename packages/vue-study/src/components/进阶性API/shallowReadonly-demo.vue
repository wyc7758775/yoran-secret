<template>
  <h2>3.2 基本使用</h2>
  <div>
    <h3>3.2.6 与 readonly 对比</h3>
    <p>
      readonly() 方法可以创建一个只读的对象，对象的属性不能被修改。
      增不行，删不行，改可以。而且是深度哦，多少层级都不可以。而
      shallowReadonly() 方法只能浅度的只读，只能只读一层。
    </p>
  </div>
  <div>
    <h3>3.2.8 与 Object.seal 对比</h3>
    <p>
      seal()
      方法可以防止新属性的添加和已有属性的删除，但是可以修改已有属性的值。
      增不行，删不行，改可以。
    </p>
  </div>
  <div>
    <h3>3.2.7 与 Object.freeze 对比</h3>
    <p>
      freeze()
      方法可以防止新属性的添加和已有属性的删除，也可以防止已有属性的值的修改增删改都不行
    </p>
  </div>
  <div>
    <h3>3.2.9 与 Object.preventExtensions 对比</h3>
    <p>
      preventExtensions() 方法可以防止新属性的添加，但是可以修改已有属性的值,
      也可以删除。增不行，改可以，删可以。
    </p>
  </div>
  <div>
    <h3>3.2.10 与 Object.isFrozen 对比</h3>
    <p>isFrozen() 方法可以判断一个对象是否被冻结。</p>
  </div>
  <div>
    <h3>3.2.11 与 Object.isSealed 对比</h3>
    <p>isSealed() 方法可以判断一个对象是否被密封。</p>
  </div>
</template>
<script setup>
import { readonly, shallowReadonly } from "vue";

/**
 * readonly() 方法可以创建一个只读的对象，对象的属性不能被修改。
 */
const readonlyObject = readonly({
  foo: 42,
  obj: {
    too: 11,
  },
});
readonlyObject.foo = 33; // ❌ 改
readonlyObject.bar = 11; // ❌ 增
delete readonlyObject.foo; // ❌ 删
readonlyObject.obj.too = 22; // ❌ 改
readonlyObject.obj.bar = 11; // ❌ 增
console.log("readonlyObject.foo:", readonlyObject); // Expected output: 42

/**
 * shallowReadonly() 方法可以创建一个只读的对象，对象的属性不能被修改。
 */
console.log("------------shallowReadonly() 方法分割线--------------");
const shallowReactiveObject = shallowReadonly({
  foo: 42,
  obj: {
    too: 11,
  },
});
shallowReactiveObject.foo = 33; // ❌ 改
shallowReactiveObject.bar = 11; // ❌ 增
delete shallowReactiveObject.foo; // ❌ 删
shallowReactiveObject.obj.too = 22; // ✅ 改
shallowReactiveObject.obj.bar = 11; // ✅ 增
delete shallowReactiveObject.obj.too; // ✅ 删
console.log("shallowReactiveObject.foo:", shallowReactiveObject); // Expected output: 42

/**
 * 1. Object.seal() 方法
 *  seal() 方法可以防止新属性的添加和已有属性的删除，但是可以修改已有属性的值。
 */
console.log("------------Object.seal() 方法分割线--------------");
const object = {
  foo: 42,
};

Object.seal(object);
object.foo = 33;
console.log(object.foo);
// Expected output: 33

// delete object.foo; // Cannot delete when sealed
console.log("seal() delete object.foo:", object.foo); // Expected output: 33
object.foo = 11; // ✅
// object.bar = 11; // ✅
console.log("seal() object.foo:", object.foo); // Expected output: 33

/**
 * 2. Object.freeze() 方法
 * freeze() 方法可以防止新属性的添加和已有属性的删除，也可以防止已有属性的值的修改。
 */
const object2 = {
  foo: 42,
};

Object.freeze(object2);
// object2.foo = 33; // ❌
// object2.bar = 11; // ❌
// delete object2.foo; // ❌
console.log("freeze() object2.foo:", object2.foo); // Expected output: 42

/**
 * 3. Object.preventExtensions() 方法
 * preventExtensions() 方法可以防止新属性的添加，但是可以修改已有属性的值。
 */
const object3 = {
  foo: 42,
};

Object.preventExtensions(object3);
// object3.foo = 33; // ✅
// object3.bar = 11; // ❌
// delete object3.foo; // ✅
// object3.foo = 11; // ❌
console.log("preventExtensions() object3.foo:", object3.foo); // Expected output: 42

/**
 * 4. Object.isFrozen() 方法
 * isFrozen() 方法可以判断一个对象是否被冻结。
 */
console.log("------------Object.isFrozen() 方法分割线--------------");
console.log("Object.preventExtensions()", Object.isFrozen(object3)); // 空对象了，才是true
console.log("Object.freeze()", Object.isFrozen(object2)); // true
console.log("Object.seal()", Object.isFrozen(object)); // false

/**
 * 5. Object.isSealed() 方法
 * isSealed() 方法可以判断一个对象是否被密封。
 */
console.log("------------Object.isSealed() 方法分割线--------------");
console.log("Object.seal()", Object.isSealed(object)); // true
console.log("Object.freeze()", Object.isSealed(object2)); // true
console.log("Object.preventExtensions()", Object.isSealed(object3)); // false

/**
 * 6. Object.isExtensible() 方法
 * isExtensible() 方法可以判断一个对象是否是可扩展的。
 */
console.log("------------Object.isExtensible() 方法分割线--------------");
console.log("Object.preventExtensions()", Object.isExtensible(object3)); // false
console.log("Object.freeze()", Object.isExtensible(object2)); // false
console.log("Object.seal()", Object.isExtensible(object)); // false
</script>
