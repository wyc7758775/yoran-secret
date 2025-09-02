# pinia

## Part 1: Pinia 快速入门教程

### 1. 安装与设置

```bash
npm install pinia
# 或
yarn add pinia
```

在您的 Vue 应用中设置 Pinia：

```javascript
import { createPinia } from 'pinia'
// main.js 或 main.ts
import { createApp } from 'vue'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

### 2. 定义一个 Store (Options API 风格)

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态（数据）
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),

  // 计算属性（派生状态）
  getters: {
    doubleCount: state => state.count * 2,
    doubleCountPlusOne() {
      return this.doubleCount + 1 // 可以访问其他 getters
    }
  },

  // 方法（修改状态）
  actions: {
    increment() {
      this.count++ // 直接通过 this 访问 state
    },
    async incrementAsync() {
      // 异步操作
      const response = await fetch('/api/increment')
      const amount = await response.json()
      this.count += amount
    }
  }
})
```

### 3. 在组件中使用 Store

```js
<template>
  <div>
    <h1>{{ counterStore.count }}</h1>
    <h2>{{ counterStore.doubleCount }}</h2>
    <button @click="counterStore.increment()">Increment</button>
    <button @click="counterStore.incrementAsync()">Increment Async</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()

// 如果需要解构并保持响应性
import { storeToRefs } from 'pinia'
const { count, name, doubleCount } = storeToRefs(counterStore)
</script>
```

### 4. Setup API 风格 (推荐)

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const name = ref('Eduardo')

  // getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const doubleCountPlusOne = computed(() => doubleCount.value + 1)

  // actions
  function increment() {
    count.value++
  }

  async function incrementAsync() {
    const response = await fetch('/api/increment')
    const amount = await response.json()
    count.value += amount
  }

  return {
    count,
    name,
    doubleCount,
    doubleCountPlusOne,
    increment,
    incrementAsync
  }
})
```

---

## Part 2: Pinia 项目实践

下面是一个符合企业级应用标准的 Pinia 架构示例：

### 项目结构

```
src/
├── stores/
│   ├── index.ts          # 主入口文件
│   ├── modules/          # 业务模块 stores
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   ├── products.store.ts
│   │   └── cart.store.ts
│   ├── types/            # TypeScript 类型定义
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   └── plugins/          # Pinia 插件
│       └── persistence.plugin.ts
└── api/
    └── modules/          # API 层，与 stores 分离
        ├── auth.api.ts
        ├── user.api.ts
        └── products.api.ts
```

### 1. 类型定义 (TypeScript)

```typescript
// stores/types/auth.types.ts
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  roles: string[]
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  error: string | null
}
```

### 2. API 层 (与 Store 分离)

```typescript
// api/modules/auth.api.ts
import type { AuthUser, LoginCredentials } from '@/stores/types/auth.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser, token: string }> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    return response.json()
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' })
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await fetch(`${BASE_URL}/auth/me`)

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }
}
```

### 3. Auth Store 实现 (Setup API 风格)

```typescript
import type { AuthState, LoginCredentials } from '../types/auth.types'
// stores/modules/auth.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/modules/auth.api'
import router from '@/router'
import { useUserStore } from './user.store'

export const useAuthStore = defineStore('auth', () => {
  // State
  const state = ref<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isLoading: false,
    error: null
  })

  // Getters
  const isAuthenticated = () => !!state.value.token
  const hasRole = (role: string) => state.value.user?.roles.includes(role) || false

  // Actions
  const login = async (credentials: LoginCredentials) => {
    state.value.isLoading = true
    state.value.error = null

    try {
      const response = await authApi.login(credentials)

      state.value.user = response.user
      state.value.token = response.token

      // 存储 token
      localStorage.setItem('auth_token', response.token)

      // 初始化用户相关数据
      const userStore = useUserStore()
      await userStore.initializeUserData()

      // 导航到首页
      router.push('/dashboard')
    }
    catch (error: any) {
      state.value.error = error.message || 'Login failed'
      throw error
    }
    finally {
      state.value.isLoading = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    }
    catch (error) {
      console.error('Logout error:', error)
    }
    finally {
      // 无论如何都清除本地状态
      state.value.user = null
      state.value.token = null
      localStorage.removeItem('auth_token')

      // 清除其他 stores 的数据
      const userStore = useUserStore()
      userStore.clearUserData()

      router.push('/login')
    }
  }

  const initializeAuth = async () => {
    if (state.value.token && !state.value.user) {
      try {
        state.value.isLoading = true
        state.value.user = await authApi.getCurrentUser()

        const userStore = useUserStore()
        await userStore.initializeUserData()
      }
      catch (error) {
        console.error('Auth initialization failed:', error)
        await logout()
      }
      finally {
        state.value.isLoading = false
      }
    }
  }

  return {
    // State
    state: state.value,

    // Getters
    isAuthenticated,
    hasRole,

    // Actions
    login,
    logout,
    initializeAuth
  }
})
```

### 4. 用户 Store (展示 Store 间通信)

```typescript
// stores/modules/user.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api/modules/user.api'

export const useUserStore = defineStore('user', () => {
  const preferences = ref({})
  const notifications = ref([])
  const recentActivity = ref([])

  const initializeUserData = async () => {
    try {
      // 可以并行获取多个数据
      const [prefs, notifs, activity] = await Promise.all([
        userApi.getPreferences(),
        userApi.getNotifications(),
        userApi.getRecentActivity()
      ])

      preferences.value = prefs
      notifications.value = notifs
      recentActivity.value = activity
    }
    catch (error) {
      console.error('Failed to initialize user data:', error)
    }
  }

  const clearUserData = () => {
    preferences.value = {}
    notifications.value = []
    recentActivity.value = []
  }

  return {
    preferences,
    notifications,
    recentActivity,
    initializeUserData,
    clearUserData
  }
})
```

### 5. 持久化插件

```typescript
// stores/plugins/persistence.plugin.ts
import { PiniaPluginContext } from 'pinia'

interface PersistOptions {
  key?: string
  paths?: string[]
}

export function persistencePlugin({ options, store }: PiniaPluginContext) {
  const persistOptions = (options.persist as PersistOptions) || {}
  const key = persistOptions.key || `pinia_${store.$id}`

  // 从 localStorage 恢复状态
  const persistedState = localStorage.getItem(key)
  if (persistedState) {
    const parsedState = JSON.parse(persistedState)

    if (persistOptions.paths) {
      // 只恢复指定的路径
      persistOptions.paths.forEach((path) => {
        const pathParts = path.split('.')
        let target = store.$state
        let source = parsedState

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          target = target[part]
          source = source[part]
        }

        const lastPart = pathParts[pathParts.length - 1]
        target[lastPart] = source[lastPart]
      })
    }
    else {
      // 恢复整个状态
      store.$patch(parsedState)
    }
  }

  // 监听状态变化并保存
  store.$subscribe((mutation, state) => {
    let stateToPersist = state

    if (persistOptions.paths) {
      // 只保存指定的路径
      stateToPersist = {}
      persistOptions.paths.forEach((path) => {
        const pathParts = path.split('.')
        let source = state
        let target = stateToPersist

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          if (!target[part])
            target[part] = {}
          target = target[part]
          source = source[part]
        }

        const lastPart = pathParts[pathParts.length - 1]
        target[lastPart] = source[lastPart]
      })
    }

    localStorage.setItem(key, JSON.stringify(stateToPersist))
  })
}
```

### 6. Stores 主入口文件

```typescript
// stores/index.ts
import { createPinia } from 'pinia'
import { persistencePlugin } from './plugins/persistence.plugin'

const pinia = createPinia()

// 注册插件
pinia.use(persistencePlugin)

export default pinia

// 类型导出
export * from './types'
```

### 7. 在应用初始化时使用

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { useAuthStore } from './stores/modules/auth.store'

const app = createApp(App)

app.use(pinia)
app.use(router)

// 初始化认证状态
const authStore = useAuthStore()
authStore.initializeAuth().then(() => {
  app.mount('#app')
})
```

### 8. 在组件中的使用示例

```vue
<template>
  <div>
    <div v-if="auth.state.isLoading">Loading...</div>
    <div v-else-if="auth.state.user">
      Welcome, {{ auth.state.user.firstName }}!
      <button @click="auth.logout()">Logout</button>
    </div>
    <div v-else>
      <login-form @submit="handleLogin" />
    </div>
  </div>
</template>

<script setup lang="ts">****
import { useAuthStore } from '@/stores/modules/auth.store'
import { storeToRefs } from 'pinia'
import type { LoginCredentials } from '@/stores/types'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)

const handleLogin = async (credentials: LoginCredentials) => {
  try {
    await auth.login(credentials)
  } catch (error) {
    // 处理错误
  }
}
</script>
```
