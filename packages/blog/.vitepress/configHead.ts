export default [
  // 使用动态路径
  [
    "link",
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/yoran-secret/pikachu.svg",
    },
  ],
  [
    "link",
    {
      rel: "dns-prefetch",
      href: "//cdn.jsdelivr.net",
    },
  ],
  [
    "link",
    {
      rel: "stylesheet",
      href: "//cdn.jsdelivr.net/npm/element-plus/dist/index.css",
    },
  ],
  [
    "link",
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
    },
  ],
  // 添加referrer meta标签以解决图片403问题
  [
    "meta",
    {
      name: "referrer",
      content: "no-referrer",
    },
  ],
];
