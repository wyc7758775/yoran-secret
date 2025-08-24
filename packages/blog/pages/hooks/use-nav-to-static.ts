import { onMounted, onUnmounted } from "vue";

export const useNavToStatic = () => {
  onMounted(() => {
    // 确保在客户端环境执行
    if (typeof window !== "undefined") {
      // 查找导航栏元素 - 根据VitePress的默认结构
      const navElement = document.querySelector(".VPNav");
      const docElement = document.querySelector(".VPDoc");
      const sidebarElement = document.querySelector(".VPSidebar");
      const contentElement = document.querySelector(".VPContent");

      if (contentElement) {
        contentElement.style.paddingTop = "0";
      }

      if (navElement) {
        // 使导航栏不固定
        navElement.style.position = "static";
        navElement.style.zIndex = "1";
      }

      if (docElement) {
        // 调整内容区域的上边距
        docElement.style.paddingTop = "0";
      }

      if (sidebarElement) {
        // 调整侧边栏位置（如果存在）
        sidebarElement.style.top = "0";
      }
    }
  });

  onUnmounted(() => {
    // 组件卸载时，恢复原始样式
    if (typeof window !== "undefined") {
      const navElement = document.querySelector(".VPNav");
      const docElement = document.querySelector(".VPDoc");
      const sidebarElement = document.querySelector(".VPSidebar");
      const contentElement = document.querySelector(".VPContent");

      if (contentElement) {
        contentElement.style.paddingTop = "64px";
      }

      if (navElement) {
        navElement.style.position = "fixed";
        navElement.style.zIndex = "1000";
      }

      if (docElement) {
        docElement.style.paddingTop = "64px";
      }

      if (sidebarElement) {
        sidebarElement.style.top = "64px";
      }
    }
  });
};
