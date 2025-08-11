// 静态导入所有gallery图片
// 这样Vite就能正确识别并打包这些图片

export const galleryImages = {
  // 使用Vite的glob功能导入所有图片
  ...import.meta.glob('/assets/gallery/*.(jpg|jpeg|png|gif|webp|bmp|svg)', { eager: true }),
};

/**
 * 获取图片的URL
 * @param filename 图片文件名
 * @returns 图片URL
 */
export function getImageUrl(filename: string): string {
  const image = galleryImages[`/assets/gallery/${filename.globEager}`];
  if (image) {
    return image.default;
  }
  console.warn(`图片${filename}不存在`);
  return '';
}