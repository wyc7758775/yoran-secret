/**
 * 处理图片路径，确保正确加载和打包
 * @param src 图片相对路径
 * @returns 处理后的图片路径
 */
export function resolveImageUrl(src: string): string {
  // 确保路径以/assets开头
  const normalizedSrc = src.startsWith("/") ? src : `/assets/gallery/${src}`;
  // 使用import.meta.env.BASE_URL确保包含base路径
  return `${import.meta.env.BASE_URL}${
    normalizedSrc.startsWith("/") ? normalizedSrc.slice(1) : normalizedSrc
  }`;
}
