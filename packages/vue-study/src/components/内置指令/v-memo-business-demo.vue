<template>
  <div class="product-list">
    <h2>实时价格商品列表</h2>
    <p>共 {{ products.length }} 件商品 · 每秒随机更新部分商品价格</p>
    <div class="filter-controls">
      <button @click="toggleHighlights">
        {{ highlightChanges ? "关闭" : "开启" }}价格变动高亮
      </button>
    </div>
    <ul>
      <li
        v-for="(product, index) in products"
        :key="product.id"
        :class="{ 'price-changed': product.priceChanged && highlightChanges }"
        v-memo="[product.id, product.price, product.stockStatus === 'inStock']"
      >
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price.toFixed(2) }}</p>
          <p
            class="stock"
            :class="
              product.stockStatus === 'inStock' ? 'in-stock' : 'out-of-stock'
            "
          >
            {{ product.stockStatus === "inStock" ? "有货" : "缺货" }}
          </p>
        </div>
        <div
          v-if="product.priceChanged && highlightChanges"
          class="price-change-indicator"
        >
          {{ product.priceChangeDirection === "up" ? "↑" : "↓" }}
          {{ Math.abs(product.priceChangePercent).toFixed(1) }}%
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 生成模拟商品数据
const generateProducts = (count) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const basePrice = 50 + Math.random() * 950; // 50-1000元
    products.push({
      id: i + 1,
      name: `商品 ${i + 1}`,
      price: basePrice,
      originalPrice: basePrice,
      stockStatus: Math.random() > 0.2 ? "inStock" : "outOfStock", // 80%有货
      priceChanged: false,
      priceChangeDirection: "up",
      priceChangePercent: 0,
    });
  }
  return products;
};

const products = ref(generateProducts(1000)); // 1000个商品
const highlightChanges = ref(true);
let updateInterval = null;

// 随机更新部分商品价格
const updateRandomPrices = () => {
  // 每次更新5%的商品
  const updateCount = Math.floor(products.value.length * 0.05);
  const updatedIndexes = new Set();

  while (updatedIndexes.size < updateCount) {
    const index = Math.floor(Math.random() * products.value.length);
    if (updatedIndexes.has(index)) continue;
    updatedIndexes.add(index);

    const product = products.value[index];
    const oldPrice = product.price;
    const priceChange = (Math.random() - 0.5) * 0.1; // -5% 到 +5%
    const newPrice = Math.max(1, oldPrice * (1 + priceChange));
    const priceChangePercent = ((newPrice - oldPrice) / oldPrice) * 100;

    // 只有价格变化超过1%才更新，避免微小波动导致的渲染
    if (Math.abs(priceChangePercent) > 1) {
      product.price = newPrice;
      product.priceChanged = true;
      product.priceChangeDirection = priceChangePercent > 0 ? "up" : "down";
      product.priceChangePercent = priceChangePercent;

      // 3秒后清除变动标记
      setTimeout(() => {
        product.priceChanged = false;
      }, 3000);
    }
  }
};

// 切换价格变动高亮
const toggleHighlights = () => {
  highlightChanges.value = !highlightChanges.value;
};

// 组件挂载时开始定时更新价格
onMounted(() => {
  updateInterval = setInterval(updateRandomPrices, 1000); // 每秒更新一次
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval);
});
</script>

<style scoped>
.product-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-controls {
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

li {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
}

.price-changed {
  border-color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.05);
}

.product-info {
  margin-bottom: 10px;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
}

.stock {
  font-size: 0.9rem;
}

.in-stock {
  color: #27ae60;
}

.out-of-stock {
  color: #7f8c8d;
}

.price-change-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: bold;
}
</style>
