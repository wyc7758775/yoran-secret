import { effectScope, type EffectScope } from 'vue'

// 创建全局状态的工厂函数
export const createGlobalState = <T>(stateFactory: () => T) => {
  // 用于存储全局作用域
  let global: T
  // 用于存储effect作用域
  let scope: EffectScope
  
  // 返回一个函数，该函数用于获取或创建全局状态
  return () => {
    // 如果全局状态已存在，直接返回
    if (global) return global
    
    // 如果全局状态不存在，创建一个新的effect作用域
    scope = effectScope(true)
    
    // 在作用域内运行状态工厂函数，创建全局状态
    global = scope.run(() => stateFactory())!
    
    return global
  }
}
