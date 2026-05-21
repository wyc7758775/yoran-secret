const n=`<!-- date: 2026-05-21T12:00:00 -->
<link rel="stylesheet" href="/obsidian-sync/业务型产品工程师升级路线/roadmap.css" />

<article class="career-map">
  <section class="cm-hero">
    <p class="cm-kicker">从前端工程师升级到业务型产品工程师</p>
    <h1 class="cm-title">不走 Agent 底层，走业务结果这条路</h1>
    <p class="cm-lead">
      你的主线不是继续横向卷前端框架，也不是硬转模型研究。更合适的路线是：用前端作为入口，补研发流程、架构、业务建模、数据判断和 AI 应用能力，逐渐变成能负责一块业务结果的人。
    </p>

    <div class="cm-hero-grid">
      <div class="cm-hero-card">
        <strong>最终定位</strong>
        <p>业务型产品工程师。懂产品判断，能写系统，能和人沟通，也能把 AI 放进真实业务流程里提效。</p>
      </div>
      <figure class="cm-hero-gif">
        <img src="/obsidian-sync/业务型产品工程师升级路线/study-pulse.gif" alt="业务型产品工程师升级路线动图" />
      </figure>
    </div>
  </section>

  <section class="cm-section">
    <div class="cm-section-head">
      <h2>五条能力树</h2>
      <p class="cm-section-note">学习顺序不是平均用力。先补研发和架构，再补业务和数据，最后把 AI 当成业务工具，而不是职业主线本身。</p>
    </div>
    <div class="cm-stack">
      <div class="cm-skill">
        <b>1</b>
        <h3>研发流程与架构</h3>
        <p>需求拆解、技术方案、模块边界、API、数据模型、权限、日志、部署。</p>
      </div>
      <div class="cm-skill">
        <b>2</b>
        <h3>业务建模</h3>
        <p>用户是谁、流程是什么、钱在哪里、成本在哪里、指标怎么定义。</p>
      </div>
      <div class="cm-skill">
        <b>3</b>
        <h3>数据判断</h3>
        <p>SQL、漏斗、留存、转化、Dashboard、埋点和问题定位。</p>
      </div>
      <div class="cm-skill">
        <b>4</b>
        <h3>LLM 与 Agent 机制</h3>
        <p>理解 token、RAG、Tool Calling、Agent Loop、Memory、Eval，不卷底层。</p>
      </div>
      <div class="cm-skill">
        <b>5</b>
        <h3>英文阅读</h3>
        <p>读官方文档、英文技术博客、优秀 README，用英文写 issue 和技术总结。</p>
      </div>
    </div>
  </section>

  <section class="cm-section">
    <div class="cm-section-head">
      <h2>12 周升级路线</h2>
      <p class="cm-section-note">每周只抓一个主任务。每天只穿插一个小动作，压力控制在可长期坚持的强度。</p>
    </div>
    <div class="cm-road">
      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>1-2</strong></div>
        <div>
          <h3>新手村：研发流程和技术方案</h3>
          <p>选一个真实业务需求，练习从需求到方案：背景、目标、非目标、模块拆分、接口、状态、异常、验收标准。</p>
          <div class="cm-tags">
            <span>技术方案</span><span>模块边界</span><span>Code Review</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>1 份技术方案模板</li>
            <li>1 张业务流程图</li>
            <li>1 次复盘：哪些地方想浅了</li>
          </ul>
        </div>
      </section>

      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>3-4</strong></div>
        <div>
          <h3>第一关：全栈业务骨架</h3>
          <p>做一个小型 B2B SaaS 骨架：登录、角色、列表、详情、创建编辑、操作日志。不要追求炫，先把业务闭环跑通。</p>
          <div class="cm-tags">
            <span>API</span><span>数据库</span><span>权限</span><span>日志</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>一个可登录的系统</li>
            <li>一套数据模型</li>
            <li>一条完整业务流程</li>
          </ul>
        </div>
      </section>

      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>5-6</strong></div>
        <div>
          <h3>第二关：数据和业务判断</h3>
          <p>给前面的系统加 Dashboard。不要只画图，要能回答：业务哪里好，哪里坏，下一步该做什么。</p>
          <div class="cm-tags">
            <span>SQL</span><span>漏斗</span><span>留存</span><span>转化</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>用户增长面板</li>
            <li>转化漏斗</li>
            <li>一页数据分析结论</li>
          </ul>
        </div>
      </section>

      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>7-8</strong></div>
        <div>
          <h3>第三关：产品和业务建模</h3>
          <p>选择一个垂直方向，拆 5 个竞品，访谈 3 个真实用户，写一版 PRD。训练自己判断什么值得做。</p>
          <div class="cm-tags">
            <span>用户访谈</span><span>竞品拆解</span><span>PRD</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>5 份竞品卡片</li>
            <li>3 条用户访谈记录</li>
            <li>一版 MVP PRD</li>
          </ul>
        </div>
      </section>

      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>9-10</strong></div>
        <div>
          <h3>第四关：AI 业务应用</h3>
          <p>不要做通用 Agent。给业务系统加一个具体 AI 功能，例如反馈归类、工单摘要、报表解读、客户风险提示。</p>
          <div class="cm-tags">
            <span>RAG</span><span>Tool Calling</span><span>Eval</span><span>人工审核</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>1 个 AI 业务功能</li>
            <li>100 条测试样本</li>
            <li>准确率和失败归因</li>
          </ul>
        </div>
      </section>

      <section class="cm-level">
        <div class="cm-badge"><span>Week</span><strong>11-12</strong></div>
        <div>
          <h3>Boss 关：作品集和英文输入</h3>
          <p>把整个项目包装成案例：发现问题、设计方案、实现系统、用数据验证、用 AI 提效。英文阅读开始固定化。</p>
          <div class="cm-tags">
            <span>案例集</span><span>英文文档</span><span>复盘</span>
          </div>
        </div>
        <div class="cm-output">
          <strong>本关产物</strong>
          <ul>
            <li>1 篇完整项目案例</li>
            <li>1 份英文技术总结</li>
            <li>下一轮学习计划</li>
          </ul>
        </div>
      </section>
    </div>
  </section>

  <section class="cm-section">
    <div class="cm-section-head">
      <h2>每周节奏</h2>
      <p class="cm-section-note">不需要每天都高强度。建议每周 4 次，每次 45 到 90 分钟。关键是产出，而不是焦虑式学习。</p>
    </div>
    <div class="cm-week">
      <div class="cm-day">
        <h3>一次阅读</h3>
        <p>读书或官方文档 30 到 45 分钟，只记 3 条有用观点。</p>
      </div>
      <div class="cm-day">
        <h3>一次编码</h3>
        <p>围绕本周主线写代码，不开新坑，只推进一个小闭环。</p>
      </div>
      <div class="cm-day">
        <h3>一次表达</h3>
        <p>写 300 字中文复盘，练习把问题、选择和取舍讲清楚。</p>
      </div>
      <div class="cm-day">
        <h3>一次英文</h3>
        <p>读一篇英文文档或博客，摘 5 个关键词和 1 段英文总结。</p>
      </div>
    </div>
  </section>

  <section class="cm-section">
    <div class="cm-section-head">
      <h2>推荐书单</h2>
      <p class="cm-section-note">先读能直接改变做事方式的书。每本不用全啃，带着当前项目的问题读。</p>
    </div>
    <div class="cm-books">
      <article class="cm-book">
        <div class="cm-book-cover">SD</div>
        <div>
          <h3>A Philosophy of Software Design</h3>
          <p>补软件设计品味。重点看复杂度、模块边界、深模块。</p>
        </div>
      </article>
      <article class="cm-book">
        <div class="cm-book-cover">DD</div>
        <div>
          <h3>Designing Data-Intensive Applications</h3>
          <p>不用一次读完。先读数据模型、存储、可靠性相关章节。</p>
        </div>
      </article>
      <article class="cm-book">
        <div class="cm-book-cover">LA</div>
        <div>
          <h3>Lean Analytics</h3>
          <p>学会用指标看业务，而不是用感觉讨论产品。</p>
        </div>
      </article>
      <article class="cm-book">
        <div class="cm-book-cover">MT</div>
        <div>
          <h3>The Mom Test</h3>
          <p>练用户访谈，避免问出只会让自己开心的答案。</p>
        </div>
      </article>
      <article class="cm-book">
        <div class="cm-book-cover">AI</div>
        <div>
          <h3>AI Engineering</h3>
          <p>理解 LLM 应用怎么从 demo 走向生产，包括评估、成本和质量。</p>
        </div>
      </article>
      <article class="cm-book">
        <div class="cm-book-cover">ST</div>
        <div>
          <h3>The Staff Engineer's Path</h3>
          <p>不是为了头衔，而是学习如何扩大技术影响力和协作半径。</p>
        </div>
      </article>
    </div>
  </section>

  <section class="cm-section">
    <div class="cm-section-head">
      <h2>推荐项目</h2>
      <p class="cm-section-note">项目不要贪多。做一个能持续迭代的业务系统，比做十个 demo 更有价值。</p>
    </div>
    <div class="cm-project">
      <article class="cm-project-card">
        <h3>主线项目：客户反馈管理系统</h3>
        <ol>
          <li>用户提交反馈，系统自动分类和分派。</li>
          <li>产品和研发看 Dashboard，决定优先级。</li>
          <li>AI 做摘要、聚类、风险提示和周报。</li>
          <li>最后形成一篇完整作品集案例。</li>
        </ol>
      </article>
      <article class="cm-project-card">
        <h3>备选项目：设备运维管理后台</h3>
        <ol>
          <li>设备列表、详情、在线状态、告警和操作日志。</li>
          <li>角色权限、通知、异常追踪和数据面板。</li>
          <li>AI 辅助解释告警、生成排障建议。</li>
          <li>适合你当前对设备和产品业务的积累。</li>
        </ol>
      </article>
    </div>
  </section>

  <section class="cm-footer">
    <h2>一句话结论</h2>
    <p>
      你下一阶段的主线是：先用研发流程和架构能力站稳，再用业务建模和数据判断往前走，最后用 AI 应用能力放大结果。英文阅读是长期基础设施，每周小剂量坚持即可。
    </p>
  </section>
</article>
`;export{n as default};
