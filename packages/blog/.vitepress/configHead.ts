export default [
  // 使用动态路径
  [
    "link",
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/yoran-secret/profile.svg",
    },
  ],
  [
    "link",
    {
      rel: "dns-prefetch preload",
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
    "script",
    {
      src: "//cdn.jsdelivr.net/npm/element-plus",
    },
  ],
  [
    "script",
    {
      src: "//unpkg.com/@element-plus/icons-vue",
    },
  ],
  [
    "link",
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap",
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
