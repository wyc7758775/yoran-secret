const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const observerRouterFile = path.resolve(__dirname, '../router/observer.js')

function readObserverRouterData() {
  const fileContent = fs.readFileSync(observerRouterFile, 'utf-8')
  const jsonText = fileContent.replace(/^export default\s*/, '')
  return JSON.parse(jsonText)
}

test('observer router data exposes short slugs for sharing', () => {
  const articles = readObserverRouterData()
  const targetArticle = articles.find(article =>
    article.src === '/observer/现在是菜鸟程序员弯道超车的计划吗？.md',
  )

  assert.ok(targetArticle)
  assert.equal(targetArticle.slug, 'all-in-ai-first-month')
  assert.equal(
    articles.every(article => typeof article.slug === 'string' && article.slug.length > 0),
    true,
  )
})
