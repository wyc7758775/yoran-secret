<script setup lang="ts">
import { ref } from "vue";
import { ElTree } from "element-plus";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const generateMockData = (
  depth: number = 4,
  branches: number = 5
): TreeNode[] => {
  let counter = 0;

  const createNode = (currentDepth: number): TreeNode => {
    return {
      id: `node-${counter++}`,
      label: `节点 ${counter}`,
      children:
        currentDepth > 0
          ? Array.from({ length: branches }, () => createNode(currentDepth - 1))
          : undefined,
    };
  };

  return Array.from({ length: 1000 }, (_, i) => ({
    id: `root-${i}`,
    label: `根节点 ${i + 1}`,
    children: Array.from({ length: branches }, () => createNode(depth - 1)),
  }));
};

const props = defineProps<{
  initialData?: TreeNode[];
  selectedKey: string;
  autoGenerate: {
    type: Boolean;
    default: true;
  };
}>();

const localData = ref<TreeNode[]>([]);
// const localData = ref<TreeNode[]>(props.autoGenerate
//   ? generateMockData()
//   : props.initialData || [])

const emit = defineEmits<{
  (e: "update:selectedKey", value: string): void;
}>();

const defaultProps = {
  children: "children",
  label: "label",
};

const handleNodeClick = (data: TreeNode) => {
  emit("update:selectedKey", data.id);
};

const refreshData = (depth: number, branches: number) => {
  localData.value = generateMockData(depth, branches);
};

const worker = new Worker(
  new URL("../../hooks/tree-data-handler.ts", import.meta.url)
);
// const worker = new Worker(`${location.href}/src/hooks/tree-data-handler.ts`) // ❌不行，垃圾
worker.postMessage([1, 2]);
worker.onmessage = (e) => {
  localData.value = props.autoGenerate
    ? e.data.generateMockData
    : props.initialData || [];
};

defineExpose({
  refreshData,
});
</script>

<template>
  <el-tree
    :data="localData"
    :props="defaultProps"
    :highlight-current="true"
    node-key="id"
    height="600"
    style="width: 100%"
    @node-click="handleNodeClick"
  />
</template>

<style scoped>
.el-tree {
  width: 100%;
  height: 600px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: auto;
}
</style>
