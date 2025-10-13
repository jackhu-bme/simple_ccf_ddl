# 🎓 AI Conference Deadlines Tracker

A simplified, beautiful, and automatically-updated website tracking submission deadlines for top AI/CV/ML conferences.

**🌐 Live Site**: [https://jackhu-bme.github.io/simple_ccf_ddl/](https://jackhu-bme.github.io/simple_ccf_ddl/)

## 🌟 Features

- **📅 Interactive Timeline**: Visual timeline powered by [vis-timeline](https://visjs.github.io/vis-timeline/) showing all deadlines in the next 12 months
- **🤖 Smart Estimation**: Shows estimated deadlines (based on historical averages) for conferences without announced dates
- **⏱️ Live Countdown**: Real-time countdown to each deadline
- **🎨 Beautiful UI**: Modern, responsive design with conference icons
- **🔄 Auto-Updates**: Automatically syncs with [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) weekly via GitHub Actions
- **📱 Mobile-Friendly**: Fully responsive design
- **🎯 Smart Collision Detection**: Automatic layout optimization prevents overlapping items

## 📊 Tracked Conferences

### Computer Vision (3)
- **CVPR** 🎥 - IEEE/CVF Conference on Computer Vision and Pattern Recognition (CCF-A)
- **ICCV** 👁️ - International Conference on Computer Vision (CCF-A)
- **ECCV** 🖼️ - European Conference on Computer Vision (CCF-A)

### Machine Learning (3)
- **NeurIPS** 🧠 - Neural Information Processing Systems (CCF-A)
- **ICML** 🤖 - International Conference on Machine Learning (CCF-A)
- **ICLR** 📊 - International Conference on Learning Representations (CCF-A)

### Artificial Intelligence (2)
- **AAAI** 🎯 - AAAI Conference on Artificial Intelligence (CCF-A)
- **IJCAI** 🌐 - International Joint Conference on AI (CCF-A)

### Medical Imaging (1)
- **MICCAI** ⚕️ - Medical Image Computing and Computer Assisted Intervention (CCF-B)

## 🚀 How It Works

### Automatic Updates
This website uses **GitHub Actions** to automatically:
1. Fetch latest deadline data from the [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) repository every Sunday at 00:00 UTC
2. Update conference YAML files in `conference/` directory
3. Commit changes if any deadlines were updated
4. Automatically redeploy to GitHub Pages (via gh-pages branch)

**No server required!** Everything runs on GitHub's infrastructure for free.

### Timeline Visualization
We use the professional **vis-timeline** library for timeline rendering:
- **Automatic collision detection**: No manual positioning needed
- **Smart stacking**: Overlapping deadlines are automatically arranged vertically
- **Interactive**: Zoom and pan to explore different time periods
- **Responsive**: Adapts to all screen sizes

#### Timeline Features
- **Exact Deadlines** (🟢 green solid border): Shows confirmed submission deadlines for announced conferences
- **Estimated Deadlines** (🟡 orange dashed border): Calculates average deadline based on historical data when current year deadline is not yet announced

The estimated deadline calculation:
- Excludes the current/future year
- Averages the month and day from 2+ past conferences
- Projects to the next logical year

## 🛠️ Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks needed!)
- **Timeline Library**: [vis-timeline](https://visjs.github.io/vis-timeline/) (via CDN)
- **YAML Parser**: [js-yaml](https://github.com/nodeca/js-yaml) (via CDN)
- **Data Format**: YAML
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Data Source**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines)

## 📦 Repository Structure

```
simple-ccf-ddl/
├── index.html              # Main webpage
├── src/
│   ├── styles.css         # Styling with custom vis-timeline themes
│   └── script.js          # JavaScript logic (timeline rendering, deadline calculation)
├── conference/            # Conference YAML data files (auto-updated)
│   ├── cvpr.yml
│   ├── iccv.yml
│   ├── eccv.yml
│   ├── nips.yml
│   ├── icml.yml
│   ├── iclr.yml
│   ├── aaai.yml
│   ├── ijcai.yml
│   └── miccai.yml
├── icons/                 # Conference icons (120x120 PNG)
│   ├── cvpr.png
│   ├── iccv.png
│   └── ...
├── analysis_docs/         # Technical documentation and decision records
│   ├── 2025-10-13_17-39_vis_timeline_integration.md
│   ├── 2025-10-13_18-12_timeline_spacing_increase.md
│   └── ...
├── .github/
│   └── workflows/
│       └── update-deadlines.yml  # Auto-update workflow
└── README.md
```

## 🔧 Maintenance Guide

### 1. 维护会议列表 (Conference List Maintenance)

#### 添加新会议 (Add a New Conference)

**步骤 Step 1: 更新 GitHub Actions workflow**
编辑 `.github/workflows/update-deadlines.yml`:
```yaml
- name: Update conference files
  run: |
    cp temp_source/conference/AI/cvpr.yml conference/
    # ... existing conferences ...
    cp temp_source/conference/AI/new-conference.yml conference/  # 添加这一行
```

**步骤 Step 2: 更新前端配置**
编辑 `src/script.js`:
```javascript
// 1. 添加到 CONFERENCE_CONFIG
const CONFERENCE_CONFIG = {
    // ... existing configs ...
    'NEW-CONF': {
        icon: 'icons/new-conf.png',
        category: 'ml',  // 选择: cv, ml, ai, medical
        fullName: 'New Conference Full Name'
    }
};

// 2. 添加到 CONFERENCE_FILES
const CONFERENCE_FILES = [
    'cvpr', 'iccv', 'eccv', 'nips', 'icml', 'iclr',
    'aaai', 'ijcai', 'miccai',
    'new-conference'  // 添加这一行（使用 YAML 文件名，不含 .yml）
];
```

**步骤 Step 3: 添加会议图标**
- 将 120x120 PNG 图标放入 `icons/` 目录
- 命名为 `new-conf.png` (与 CONFERENCE_CONFIG 中的 icon 路径匹配)
- 建议使用透明背景

**步骤 Step 4: 更新首页筛选器（可选）**
如果需要新的分类，编辑 `index.html`:
```html
<div class="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="cv">Computer Vision</button>
    <button class="filter-btn" data-filter="ml">Machine Learning</button>
    <button class="filter-btn" data-filter="ai">AI General</button>
    <button class="filter-btn" data-filter="medical">Medical</button>
    <button class="filter-btn" data-filter="new-category">New Category</button>  <!-- 添加新分类 -->
</div>
```

#### 删除会议 (Remove a Conference)

1. 从 `.github/workflows/update-deadlines.yml` 中删除对应的 `cp` 命令行
2. 从 `src/script.js` 的 `CONFERENCE_CONFIG` 和 `CONFERENCE_FILES` 中删除条目
3. 删除 `conference/` 目录下的对应 YAML 文件
4. 删除 `icons/` 目录下的对应图标文件

---

### 2. 维护 GitHub Actions Workflow

#### 自动更新频率

**位置:** `.github/workflows/update-deadlines.yml`

**当前配置:** 每周日 00:00 UTC 自动运行
```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Sunday at 00:00 UTC
  workflow_dispatch:      # 也支持手动触发
```

**修改频率示例:**
```yaml
# 每天运行
- cron: '0 0 * * *'

# 每周一和周五运行
- cron: '0 0 * * 1,5'

# 每月1号和15号运行
- cron: '0 0 1,15 * *'

# 每3天运行一次
- cron: '0 0 */3 * *'
```

**Cron 语法说明:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

#### 手动触发更新

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **"Update Conference Deadlines"** workflow
4. 点击 **"Run workflow"** 按钮
5. 选择 branch (通常是 main)
6. 点击绿色的 **"Run workflow"** 按钮

#### 查看更新日志

1. Actions → 点击最近的 workflow run
2. 查看 "Update conference files" 步骤
3. 检查是否有文件被更新
4. 查看 "Check for changes" 步骤确认是否有新的 commit

#### Workflow 故障排查

**问题 1: Workflow 没有自动运行**
- 检查: Actions 是否被启用 (Settings → Actions → General)
- 检查: 仓库是否有活跃提交 (GitHub 会暂停长期不活跃仓库的定时任务)
- 解决: 手动触发一次 workflow 重新激活

**问题 2: Workflow 运行失败**
- 查看错误日志 (Actions → 失败的 run → 红色的步骤)
- 常见原因:
  - 源仓库 (ccfddl/ccf-deadlines) 结构变化
  - 网络问题导致 git clone 失败
  - 权限问题 (检查 GITHUB_TOKEN)

**问题 3: 数据更新了但网站没变化**
- GitHub Pages 有 10 分钟左右的缓存延迟
- 强制刷新: Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)
- 检查 workflow 是否真的生成了新的 commit

---

### 3. 维护时间线显示

#### 调整时间线高度和间距

**位置:** `src/script.js` → `renderTimeline()` 函数

**当前配置:**
```javascript
const options = {
    width: '100%',
    height: '600px',        // 时间线整体高度
    margin: {
        item: 30,            // 堆叠项目间的垂直间距
        axis: 50             // 轴线边距
    },
    // ...
};
```

**调整建议:**
- **会议很多 (>15个)**: 增加 `height` 到 `'700px'` 或 `'800px'`
- **会议很少 (<5个)**: 减少 `height` 到 `'400px'`
- **项目重叠**: 增加 `margin.item` 到 `40` 或 `50`

#### 修改时间线显示范围

**当前:** 显示未来 12 个月，前后各扩展 2 个月

**位置:** `src/script.js` → `renderTimeline()` 函数
```javascript
const now = new Date();
const oneYearLater = new Date(now);
oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);  // 修改这里改变显示范围

const twoMonths = 1000 * 60 * 60 * 24 * 60;  // 修改这里改变扩展范围
const extendedStart = new Date(now.getTime() - twoMonths);
const extendedEnd = new Date(oneYearLater.getTime() + twoMonths);
```

**示例: 显示未来 6 个月**
```javascript
const sixMonthsLater = new Date(now);
sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

const oneMonth = 1000 * 60 * 60 * 24 * 30;
const extendedStart = new Date(now.getTime() - oneMonth);
const extendedEnd = new Date(sixMonthsLater.getTime() + oneMonth);
```

#### 修改时间线配色

**位置:** `src/styles.css`

**确定的截止日期 (绿色):**
```css
.vis-item.exact-item .vis-item-dot {
    background-color: var(--success) !important;  /* 修改 --success 变量 */
    border-color: var(--success) !important;
}

.vis-item.exact-item .vis-item-content {
    border: 2px solid var(--success);
}
```

**估算的截止日期 (橙色):**
```css
.vis-item.estimated-item .vis-item-dot {
    background-color: var(--warning) !important;  /* 修改 --warning 变量 */
    border-color: var(--warning) !important;
}

.vis-item.estimated-item .vis-item-content {
    border: 2px dashed var(--warning);
}
```

**修改全局颜色变量:**
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #10b981;    /* 绿色 - 确定的截止日期 */
    --warning: #f59e0b;    /* 橙色 - 估算的截止日期 */
    --danger: #ef4444;     /* 红色 - 紧急/当前时间线 */
    /* ... */
}
```

#### 禁用/启用时间线交互功能

**位置:** `src/script.js` → `renderTimeline()` 函数
```javascript
const options = {
    // ...
    zoomable: true,        // 设为 false 禁用缩放
    moveable: true,        // 设为 false 禁用拖动
    selectable: true,      // 设为 false 禁用选择
    // ...
};
```

---

### 4. 维护截止日期计算逻辑

#### 修改估算算法

**位置:** `src/script.js` → `calculateAverageDeadline()` 函数

**当前逻辑:**
1. 排除当前年及未来年份的数据
2. 从历史数据中计算平均月份和日期
3. 投射到下一年

**修改示例 - 只使用最近 3 年的数据:**
```javascript
function calculateAverageDeadline(confs, excludeLatestYear = true) {
    const now = new Date();
    const currentYear = now.getFullYear();

    const validConfs = confs.filter(conf => {
        if (excludeLatestYear && conf.year >= currentYear) return false;
        if (conf.year < currentYear - 3) return false;  // 只使用最近3年
        return conf.timeline && conf.timeline.length > 0;
    });

    // ... rest of the logic
}
```

#### 修改截止日期颜色警告级别

**位置:** `src/script.js` → `getCountdown()` 函数

**当前阈值:**
```javascript
if (days <= 7) {
    className = 'urgent';  // 红色 - 7天内
} else if (days <= 30) {
    className = 'soon';    // 橙色 - 30天内
} else {
    className = 'normal';  // 绿色 - 30天以上
}
```

**修改示例:**
```javascript
if (days <= 3) {
    className = 'urgent';  // 3天内
} else if (days <= 14) {
    className = 'soon';    // 14天内
} else {
    className = 'normal';  // 14天以上
}
```

---

### 5. 维护样式和布局

#### 修改配色方案

**位置:** `src/styles.css` → `:root` CSS 变量

```css
:root {
    --primary: #667eea;     /* 主色调 - 按钮、链接 */
    --secondary: #764ba2;   /* 次色调 - 渐变背景 */
    --success: #10b981;     /* 成功/确定 */
    --warning: #f59e0b;     /* 警告/估算 */
    --danger: #ef4444;      /* 危险/紧急 */
    --dark: #1f2937;        /* 文字颜色 */
    --light: #f9fafb;       /* 浅背景 */

    /* 会议分类颜色 */
    --cv-color: #3b82f6;    /* 计算机视觉 - 蓝色 */
    --ml-color: #8b5cf6;    /* 机器学习 - 紫色 */
    --ai-color: #ec4899;    /* 人工智能 - 粉色 */
    --medical-color: #10b981; /* 医学 - 绿色 */
}
```

#### 修改响应式断点

**位置:** `src/styles.css` → 底部的 `@media` 查询

```css
@media (max-width: 768px) {
    /* 平板和手机样式 */
    header h1 {
        font-size: 2rem;
    }

    .conference-grid {
        grid-template-columns: 1fr;
    }
}

/* 添加更多断点 */
@media (max-width: 480px) {
    /* 小手机样式 */
}

@media (min-width: 1600px) {
    /* 大屏幕样式 */
}
```

---

### 6. 数据源维护

#### 检查源仓库格式

如果自动更新突然失败，可能是源仓库 ([ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines)) 的数据格式发生了变化。

**检查步骤:**
1. 访问 https://github.com/ccfddl/ccf-deadlines/tree/main/conference
2. 检查你关注的会议文件格式是否改变
3. 查看 `analysis_docs/` 中的文档了解预期格式

**YAML 文件预期格式:**
```yaml
- title: CVPR
  description: IEEE/CVF Conference on Computer Vision and Pattern Recognition
  year: 2025
  link: https://cvpr2025.thecvf.com/
  deadline: "2024-11-14 23:59:59"
  timezone: America/Los_Angeles
  date: June 10-17, 2025
  place: Nashville, Tennessee, USA
  sub: CV
  rank:
    ccf: A
    core: A*
  confs:
    - year: 2025
      id: cvpr25
      link: https://cvpr2025.thecvf.com/
      timeline:
        - deadline: "2024-11-14 23:59:59"
          comment: 'Submission deadline'
      timezone: America/Los_Angeles
      date: June 10-17, 2025
      place: Nashville, Tennessee, USA
```

#### 切换数据源

如果需要使用其他数据源，修改 `.github/workflows/update-deadlines.yml`:

```yaml
- name: Clone source repository
  run: |
    git clone https://github.com/your-fork/ccf-deadlines.git temp_source
    # 或使用其他数据源
```

---

### 7. 常见问题 (FAQ)

#### Q1: 为什么有些会议显示"估算"日期？
**A:** 当会议的最新年份截止日期尚未公布时，系统会根据历史数据（过去多年的平均值）计算一个估算日期，以橙色虚线边框标识。

#### Q2: 如何强制更新数据？
**A:**
1. 访问 GitHub Actions 页面
2. 手动触发 "Update Conference Deadlines" workflow
3. 等待 workflow 完成（约 1-2 分钟）
4. 刷新网站（Ctrl+F5 清除缓存）

#### Q3: 时间线上的项目为什么会重叠？
**A:** 不应该重叠。vis-timeline 库会自动检测碰撞并垂直堆叠。如果出现重叠：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 尝试增加 `margin.item` 值
3. 检查 vis-timeline CDN 是否加载成功

#### Q4: 如何修改时区？
**A:** 时区信息来自源 YAML 文件的 `timezone` 字段。我们的 `parseTimezone()` 函数支持：
- `AoE` (Anywhere on Earth = UTC-12)
- `UTC±N` 格式 (如 `UTC-8`, `UTC+0`)

如需支持其他格式，修改 `src/script.js` 中的 `parseTimezone()` 函数。

#### Q5: 网站部署后显示 404
**A:**
1. 检查 GitHub Pages 是否启用 (Settings → Pages)
2. 确认部署分支是 `gh-pages`
3. 检查 Actions 是否成功运行
4. 等待 5-10 分钟（GitHub Pages 有缓存延迟）

#### Q6: 如何备份数据？
**A:** 所有数据都在 Git 仓库中：
1. Fork 仓库到自己账号
2. 或定期运行 `git pull` 到本地备份
3. `conference/` 目录包含所有会议数据
4. `analysis_docs/` 目录包含技术文档

---

## 🎓 技术文档

详细的技术决策和实现细节记录在 `analysis_docs/` 目录：

- **vis-timeline 集成**: `2025-10-13_17-39_vis_timeline_integration.md`
  - 为什么放弃自定义碰撞检测
  - vis-timeline 的优势和配置
  - 代码迁移过程

- **时间线间距优化**: `2025-10-13_18-12_timeline_spacing_increase.md`
  - 垂直空间调优过程
  - 参数调整说明
  - 视觉效果对比

- **布局改进历史**: `2025-10-13_17-32_timeline_v2_fixes.md`
  - 早期碰撞检测尝试
  - 布局算法演进

---

## 🚀 快速部署指南

### 1. Fork this repository
点击右上角的 **Fork** 按钮

### 2. Enable GitHub Pages
1. 进入你 fork 的仓库
2. Settings → Pages
3. Source: 选择 **Deploy from a branch**
4. Branch: 选择 **gh-pages** / **(root)**
5. Save

### 3. Enable GitHub Actions
1. Actions 标签
2. 点击 **"I understand my workflows, go ahead and enable them"**

### 4. 首次部署
1. Actions → "Update Conference Deadlines"
2. 点击 **"Run workflow"**
3. 等待完成（约 1-2 分钟）

### 5. 访问网站
`https://your-username.github.io/simple-ccf-ddl/`

---

## 🎯 项目设计理念

### 为什么创建这个项目？

1. **简化复杂性**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) 包含 100+ 会议，对于专注特定领域的研究者来说信息过载
2. **无服务器**: 完全静态网站 + GitHub Actions，零维护成本
3. **自动化**: 无需手动更新，数据来源于社区维护的仓库
4. **视觉优先**: 使用专业时间线库，直观展示截止日期分布
5. **开源透明**: 所有代码和数据公开，易于定制和维护

### 技术选型原则

- **No build step**: 不使用 Node.js/Webpack/Vite，直接用浏览器原生功能
- **CDN dependencies**: 使用 unpkg.com 加载外部库，无需 npm
- **Progressive enhancement**: 基础功能优先，增强功能渐进添加
- **Mobile-first**: 响应式设计，移动端体验优先
- **Community data**: 数据源于社区，回馈社区

---

## 📝 更新日志

### v1.3.0 (2025-10-13)
- ✨ 增加时间线垂直间距，提升可读性
- 📝 完善维护文档

### v1.2.0 (2025-10-13)
- ✨ 集成 vis-timeline 专业时间线库
- 🐛 修复时间线边界溢出问题
- 🎨 优化确定/估算截止日期的视觉区分

### v1.1.0 (2025-10-13)
- ✨ 实现自动碰撞检测和智能堆叠
- 🎨 优化时间线布局

### v1.0.0 (2025-10-13)
- 🎉 初始版本发布
- ✨ 支持 9 个顶会跟踪
- ✨ GitHub Actions 自动更新
- ✨ 响应式设计

---

## 📄 License

MIT License - Feel free to use this for your own conference tracking needs!

---

## 🙏 Acknowledgments

- **数据来源**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) - 感谢所有贡献者
- **时间线库**: [vis-timeline](https://visjs.github.io/vis-timeline/) - 专业的时间线可视化库
- **YAML 解析**: [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML 解析器
- **图标**: 各会议官方网站
- **灵感**: 为需要跟踪特定 AI/CV/ML 会议的研究者而生

---

**Made with ❤️ for the AI research community**

**维护者**: [jackhu-bme](https://github.com/jackhu-bme)
**问题反馈**: [GitHub Issues](https://github.com/jackhu-bme/simple_ccf_ddl/issues)
