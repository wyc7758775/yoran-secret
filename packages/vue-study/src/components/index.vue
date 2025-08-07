<script setup lang="ts">
import { ElCollapse, ElCollapseItem, ElTabs, ElTabPane } from "element-plus";
import { ref } from "vue";
import "element-plus/dist/index.css";

import ShallowRefDemo from "./进阶性API/shallowRef-demo.vue";
import CustomRefDemo from "./进阶性API/customRef-demo.vue";
import ShallowReactiveDemo from "./进阶性API/shallowReactive-demo.vue";
import ShallowReadonlyDemo from "./进阶性API/shallowReadonly-demo.vue";
import ToRawDemo from "./进阶性API/toRaw-demo.vue";
import MarkRawDemo from "./进阶性API/markRaw-demo.vue";
import EffectScopeDemo from "./进阶性API/effectScope-demo.vue";
// 响应式API
import RefDemo from "./响应式API/ref-demo.vue";
import ComputedDemo from "./响应式API/computed-demo.vue";
import ReadonlyDemo from "./响应式API/readonly-demo.vue";
import WatchEffectDemo from "./响应式API/watchEffect-demo.vue";
import IsRefUnRefToRef from "./响应式API 工具/isRef-unRef-toRef.vue";
import IsValueToRefs from "./响应式API 工具/isValue-toRefs.vue";
// 生命周期
import LifecycleDemo from "./生命周期钩子 API.vue";
// 依赖注入
import provide from "./依赖注入/provide.vue";
import injectChild from "./依赖注入/injectChild.vue";
import VModalDemo from "./内置指令/VModal-demo.vue";

const activeName = ref("first");
</script>
<template>
  <h1>Vue3 API 学习示例</h1>
  <el-tabs v-model="activeName">
    <el-tab-pane label="进阶性API" name="first">
      <el-collapse>
        <el-collapse-item name="1">
          <template #title>
            <h1>1. shallowRef</h1>
          </template>
          <ShallowRefDemo />
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <h1>2. customRef</h1>
          </template>
          <CustomRefDemo />
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <h1>3. shallowReactive</h1>
          </template>
          <ShallowReactiveDemo />
        </el-collapse-item>
        <el-collapse-item name="4">
          <template #title>
            <h1>4. shallowReadonly</h1>
          </template>
          <ShallowReadonlyDemo />
        </el-collapse-item>
        <el-collapse-item name="5">
          <template #title>
            <h1>5. toRaw</h1>
          </template>
          <ToRawDemo />
        </el-collapse-item>
        <el-collapse-item name="6">
          <template #title>
            <h1>6. markRaw</h1>
          </template>
          <MarkRawDemo />
        </el-collapse-item>
        <el-collapse-item name="7">
          <template #title>
            <h1>7. effectScope</h1>
          </template>
          <EffectScopeDemo />
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="响应式API" name="second">
      <el-collapse>
        <el-collapse-item name="8">
          <template #title>
            <h1>8. ref</h1>
          </template>
          <RefDemo />
        </el-collapse-item>
        <el-collapse-item name="9">
          <template #title>
            <h1>9. computed</h1>
          </template>
          <ComputedDemo />
        </el-collapse-item>
        <el-collapse-item name="10">
          <template #title>
            <h1>10. readonly</h1>
          </template>
          <ReadonlyDemo />
        </el-collapse-item>
        <el-collapse-item name="11">
          <template #title>
            <h1>11. watchEffect</h1>
          </template>
          <WatchEffectDemo />
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="响应式API：工具" name="third">
      <el-collapse>
        <el-collapse-item name="12">
          <template #title>
            <h1>12. isRef()、unref()、toRef()</h1>
          </template>
          <IsRefUnRefToRef />
        </el-collapse-item>
        <el-collapse-item name="13">
          <template #title>
            <h1>13. isValue()、toRefs()</h1>
          </template>
          <IsValueToRefs />
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="生命周期" name="fourth">
      <el-collapse>
        <el-collapse-item name="14">
          <template #title>
            <h1>14. 生成式API</h1>
          </template>
          <LifecycleDemo />
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label="依赖注入" name="fifth">
      <el-collapse>
        <el-collapse-item name="15">
          <template #title>
            <h1>15. 依赖注入</h1>
          </template>
          <provide>
            <template #test>
              <injectChild />
            </template>
          </provide>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
    <el-tab-pane label=" 内置指令" name="sixth">
      <el-collapse>
        <el-collapse-item name="16">
          <template #title>
            <h1>16. 自定义组件</h1>
          </template>
          <VModalDemo />
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>
  </el-tabs>
</template>
