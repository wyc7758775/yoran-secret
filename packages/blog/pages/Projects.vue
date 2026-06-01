<script setup lang="ts">
import { withBase } from 'vitepress'

const projects = [
  {
    name: 'linux-learning-platform',
    label: 'Linux 命令行学习平台',
    summary: '把 Linux 命令学习做成关卡式训练：左侧是章节、知识点和进度，右侧是真实终端练习环境。',
    image: '/projects/linux-learning-platform.png',
    imageAlt: 'Linux 命令行学习平台界面截图',
    sourceUrl: 'https://github.com/wyc7758775/linux-learning-platform',
    stage: 'Interactive Lab',
    stack: ['React', 'TypeScript', 'Vite', 'xterm.js', 'Express', 'Socket.IO', 'Docker'],
    highlights: [
      '为每个关卡准备隔离 Linux 环境',
      '通过 WebSocket 连接浏览器终端和后端验证逻辑',
      '按章节组织命令知识点、练习目标和学习进度',
    ],
  },
  {
    name: 'agile-person-manage',
    label: '个人敏捷项目管理系统',
    summary: '把个人事务产品化管理，用项目、任务、需求、缺陷和激励体系组织长期行动。',
    image: '/projects/agile-person-manage.png',
    imageAlt: 'Agile Person Manage 界面截图',
    sourceUrl: 'https://github.com/wyc7758775/aglie-person-manage',
    stage: 'Product System',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'NextAuth', 'Vitest', 'Playwright'],
    highlights: [
      '输入契约来自产品设计文档和 OpenSpec',
      '输出契约由六维 E2E 测试体系验证',
      '实现层保持可替换，适合 AI 生成代码后持续验收',
    ],
  },
]
</script>

<template>
  <main class="projects-page">
    <header class="projects-header">
      <p class="projects-kicker">
        Vibe Coding
      </p>
      <h1>项目展示</h1>
      <p class="projects-intro">
        收纳我用 AI 协作推进的产品实验：先把想法做成可运行系统，再用真实界面和工程约束反复校准。
      </p>
    </header>

    <section class="project-list" aria-label="Vibe coding projects">
      <article
        v-for="project in projects"
        :key="project.name"
        class="project-card"
      >
        <a
          class="project-preview"
          :href="project.sourceUrl"
          target="_blank"
          rel="noreferrer"
          :aria-label="`打开 ${project.label} 的代码仓库`"
        >
          <img
            :src="withBase(project.image)"
            :alt="project.imageAlt"
          >
        </a>

        <div class="project-content">
          <div class="project-title-row">
            <div>
              <p class="project-stage">
                {{ project.stage }}
              </p>
              <h2>{{ project.label }}</h2>
              <p class="project-name">
                {{ project.name }}
              </p>
            </div>
            <a
              class="project-source"
              :href="project.sourceUrl"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>

          <p class="project-summary">
            {{ project.summary }}
          </p>

          <ul class="project-highlights">
            <li
              v-for="highlight in project.highlights"
              :key="highlight"
            >
              {{ highlight }}
            </li>
          </ul>

          <div class="project-stack" aria-label="技术栈">
            <span
              v-for="item in project.stack"
              :key="item"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.projects-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  color: var(--vp-c-text-1);
}

.projects-header {
  max-width: 720px;
  margin-bottom: 36px;
}

.projects-kicker {
  margin: 0 0 8px;
  color: #d65f42;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
  text-transform: uppercase;
}

.projects-header h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.projects-intro {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.project-list {
  display: grid;
  gap: 24px;
}

.project-card {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.project-preview {
  display: block;
  min-height: 360px;
  overflow: hidden;
  background: #101827;
}

.project-preview img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.3s ease;
}

.project-card:hover .project-preview img {
  transform: scale(1.02);
}

.project-content {
  display: flex;
  flex-direction: column;
  padding: 26px;
}

.project-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.project-stage,
.project-name {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.project-stage {
  color: #d65f42;
  text-transform: uppercase;
}

.project-title-row h2 {
  margin: 8px 0 6px;
  font-size: 24px;
  line-height: 1.3;
}

.project-name {
  color: var(--vp-c-text-3);
}

.project-source {
  flex: 0 0 auto;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.project-source:hover {
  border-color: #d65f42;
  color: #d65f42;
}

.project-summary {
  margin: 22px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.project-highlights {
  display: grid;
  gap: 10px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.project-highlights li {
  position: relative;
  padding-left: 18px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.project-highlights li::before {
  position: absolute;
  top: 0.72em;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #4b9f73;
  content: "";
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 28px;
}

.project-stack span {
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  line-height: 1.4;
}

.dark .projects-kicker,
.dark .project-stage {
  color: #f29b77;
}

.dark .project-source:hover {
  border-color: #f29b77;
  color: #f29b77;
}

@media (max-width: 900px) {
  .project-card {
    grid-template-columns: 1fr;
  }

  .project-preview,
  .project-preview img {
    min-height: 280px;
  }
}

@media (max-width: 640px) {
  .projects-page {
    padding: 24px 16px 72px;
  }

  .projects-header h1 {
    font-size: 30px;
  }

  .project-preview,
  .project-preview img {
    min-height: 220px;
  }

  .project-content {
    padding: 20px;
  }

  .project-title-row {
    flex-direction: column;
  }
}
</style>
