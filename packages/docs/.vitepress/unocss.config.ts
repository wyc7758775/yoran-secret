import { defineConfig } from "unocss";
import { presetAttributify, presetUno } from "unocss";

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  shortcuts: {
    "highlight": "bg-[#d1e8f3ed] rounded-[0.225rem] px-[0.25rem]",
    "highlight:dark": "dark:bg-[#1e3a4d] dark:text-white",
    "tooltip-base":
      "absolute bottom-full left-1/2 -translate-x-1/2 bg-white p-2.5 rounded-lg shadow-md z-50 flex flex-col items-center mb-2 w-[220px]",
    // 封装悬浮框显示/隐藏相关样式
    "tooltip-visibility":
      "opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible",
    // 封装箭头样式
    "tooltip-arrow":
      "after:content-['*'] after:absolute after:top-full after:left-1/2 after:-ml-[5px] after:border-[5px] after:border-solid after:border-t-white after:border-r-transparent after:border-b-transparent after:border-l-transparent",
  },
});
