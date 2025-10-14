# 🎓 AI Conference Deadlines Tracker

A simplified, beautiful, and automatically-updated website tracking submission deadlines for top AI/CV/ML conferences.

**🌐 Live Site**: [https://jackhu-bme.github.io/simple_ccf_ddl/](https://jackhu-bme.github.io/simple_ccf_ddl/)

**📖 中文文档**: [README_CN.md](README_CN.md)

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
1. Fetch latest deadline data from the [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) repository daily at 00:00 UTC
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

### 1. Conference List Maintenance

#### Adding a New Conference

**Step 1: Update GitHub Actions workflow**

Edit `.github/workflows/update-deadlines.yml`:
```yaml
- name: Update conference files
  run: |
    cp temp_source/conference/AI/cvpr.yml conference/
    # ... existing conferences ...
    cp temp_source/conference/AI/new-conference.yml conference/  # Add this line
```

**Step 2: Update frontend configuration**

Edit `src/script.js`:
```javascript
// 1. Add to CONFERENCE_CONFIG
const CONFERENCE_CONFIG = {
    // ... existing configs ...
    'NEW-CONF': {
        icon: 'icons/new-conf.png',
        category: 'ml',  // Options: cv, ml, ai, medical
        fullName: 'New Conference Full Name'
    }
};

// 2. Add to CONFERENCE_FILES
const CONFERENCE_FILES = [
    'cvpr', 'iccv', 'eccv', 'nips', 'icml', 'iclr',
    'aaai', 'ijcai', 'miccai',
    'new-conference'  // Add this line (YAML filename without .yml)
];
```

**Step 3: Add conference icon**
- Place a 120x120 PNG icon in the `icons/` directory
- Name it `new-conf.png` (matching the icon path in CONFERENCE_CONFIG)
- Transparent background recommended

**Step 4: Update homepage filters (Optional)**

If you need a new category, edit `index.html`:
```html
<div class="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="cv">Computer Vision</button>
    <button class="filter-btn" data-filter="ml">Machine Learning</button>
    <button class="filter-btn" data-filter="ai">AI General</button>
    <button class="filter-btn" data-filter="medical">Medical</button>
    <button class="filter-btn" data-filter="new-category">New Category</button>  <!-- Add new category -->
</div>
```

#### Removing a Conference

1. Remove the corresponding `cp` command from `.github/workflows/update-deadlines.yml`
2. Remove entries from `CONFERENCE_CONFIG` and `CONFERENCE_FILES` in `src/script.js`
3. Delete the corresponding YAML file from the `conference/` directory
4. Delete the corresponding icon file from the `icons/` directory

---

### 2. GitHub Actions Workflow Maintenance

#### Auto-Update Frequency

**Location:** `.github/workflows/update-deadlines.yml`

**Current Configuration:** Runs daily at 00:00 UTC
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at 00:00 UTC
  workflow_dispatch:      # Also supports manual trigger
```

**Frequency Modification Examples:**
```yaml
# Run daily
- cron: '0 0 * * *'

# Run every Monday and Friday
- cron: '0 0 * * 1,5'

# Run on the 1st and 15th of each month
- cron: '0 0 1,15 * *'

# Run every 3 days
- cron: '0 0 */3 * *'
```

**Cron Syntax:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

#### Manual Trigger Update

1. Go to your GitHub repository page
2. Click the **Actions** tab
3. Select **"Update Conference Deadlines"** workflow
4. Click **"Run workflow"** button
5. Select branch (usually main)
6. Click the green **"Run workflow"** button

#### View Update Logs

1. Actions → Click on the most recent workflow run
2. View "Update conference files" step
3. Check if any files were updated
4. Check "Check for changes" step to confirm if there's a new commit

#### Workflow Troubleshooting

**Issue 1: Workflow not running automatically**
- Check: Are Actions enabled? (Settings → Actions → General)
- Check: Is the repository active? (GitHub pauses scheduled workflows for inactive repositories)
- Solution: Manually trigger the workflow once to reactivate

**Issue 2: Workflow run fails**
- View error logs (Actions → failed run → red step)
- Common causes:
  - Source repository (ccfddl/ccf-deadlines) structure changed
  - Network issues causing git clone failure
  - Permission issues (check GITHUB_TOKEN)

**Issue 3: Data updated but website unchanged**
- GitHub Pages has about 10 minutes of cache delay
- Force refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check if workflow actually generated a new commit

---

### 3. Timeline Display Maintenance

#### Adjust Timeline Height and Spacing

**Location:** `src/script.js` → `renderTimeline()` function

**Current Configuration:**
```javascript
const options = {
    width: '100%',
    height: '600px',        // Overall timeline height
    margin: {
        item: 30,            // Vertical spacing between stacked items
        axis: 50             // Axis margin
    },
    // ...
};
```

**Adjustment Recommendations:**
- **Many conferences (>15)**: Increase `height` to `'700px'` or `'800px'`
- **Few conferences (<5)**: Reduce `height` to `'400px'`
- **Items overlapping**: Increase `margin.item` to `40` or `50`

#### Modify Timeline Display Range

**Current:** Display next 12 months, extended by 2 months on each side

**Location:** `src/script.js` → `renderTimeline()` function
```javascript
const now = new Date();
const oneYearLater = new Date(now);
oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);  // Modify here to change display range

const twoMonths = 1000 * 60 * 60 * 24 * 60;  // Modify here to change extension range
const extendedStart = new Date(now.getTime() - twoMonths);
const extendedEnd = new Date(oneYearLater.getTime() + twoMonths);
```

**Example: Display next 6 months**
```javascript
const sixMonthsLater = new Date(now);
sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

const oneMonth = 1000 * 60 * 60 * 24 * 30;
const extendedStart = new Date(now.getTime() - oneMonth);
const extendedEnd = new Date(sixMonthsLater.getTime() + oneMonth);
```

#### Modify Timeline Colors

**Location:** `src/styles.css`

**Confirmed Deadlines (Green):**
```css
.vis-item.exact-item .vis-item-dot {
    background-color: var(--success) !important;  /* Modify --success variable */
    border-color: var(--success) !important;
}

.vis-item.exact-item .vis-item-content {
    border: 2px solid var(--success);
}
```

**Estimated Deadlines (Orange):**
```css
.vis-item.estimated-item .vis-item-dot {
    background-color: var(--warning) !important;  /* Modify --warning variable */
    border-color: var(--warning) !important;
}

.vis-item.estimated-item .vis-item-content {
    border: 2px dashed var(--warning);
}
```

**Modify Global Color Variables:**
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #10b981;    /* Green - confirmed deadlines */
    --warning: #f59e0b;    /* Orange - estimated deadlines */
    --danger: #ef4444;     /* Red - urgent/current timeline */
    /* ... */
}
```

#### Enable/Disable Timeline Interactive Features

**Location:** `src/script.js` → `renderTimeline()` function
```javascript
const options = {
    // ...
    zoomable: true,        // Set to false to disable zoom
    moveable: true,        // Set to false to disable drag
    selectable: true,      // Set to false to disable selection
    // ...
};
```

---

### 4. Deadline Calculation Logic Maintenance

#### Modify Estimation Algorithm

**Location:** `src/script.js` → `calculateAverageDeadline()` function

**Current Logic:**
1. Exclude current year and future years
2. Calculate average month and date from historical data
3. Project to next year

**Modification Example - Use only last 3 years:**
```javascript
function calculateAverageDeadline(confs, excludeLatestYear = true) {
    const now = new Date();
    const currentYear = now.getFullYear();

    const validConfs = confs.filter(conf => {
        if (excludeLatestYear && conf.year >= currentYear) return false;
        if (conf.year < currentYear - 3) return false;  // Only use last 3 years
        return conf.timeline && conf.timeline.length > 0;
    });

    // ... rest of the logic
}
```

#### Modify Deadline Color Warning Levels

**Location:** `src/script.js` → `getCountdown()` function

**Current Thresholds:**
```javascript
if (days <= 7) {
    className = 'urgent';  // Red - within 7 days
} else if (days <= 30) {
    className = 'soon';    // Orange - within 30 days
} else {
    className = 'normal';  // Green - more than 30 days
}
```

**Modification Example:**
```javascript
if (days <= 3) {
    className = 'urgent';  // Within 3 days
} else if (days <= 14) {
    className = 'soon';    // Within 14 days
} else {
    className = 'normal';  // More than 14 days
}
```

---

### 5. Style and Layout Maintenance

#### Modify Color Scheme

**Location:** `src/styles.css` → `:root` CSS variables

```css
:root {
    --primary: #667eea;     /* Primary - buttons, links */
    --secondary: #764ba2;   /* Secondary - gradient background */
    --success: #10b981;     /* Success/confirmed */
    --warning: #f59e0b;     /* Warning/estimated */
    --danger: #ef4444;      /* Danger/urgent */
    --dark: #1f2937;        /* Text color */
    --light: #f9fafb;       /* Light background */

    /* Conference category colors */
    --cv-color: #3b82f6;    /* Computer Vision - blue */
    --ml-color: #8b5cf6;    /* Machine Learning - purple */
    --ai-color: #ec4899;    /* AI - pink */
    --medical-color: #10b981; /* Medical - green */
}
```

#### Modify Responsive Breakpoints

**Location:** `src/styles.css` → bottom `@media` queries

```css
@media (max-width: 768px) {
    /* Tablet and mobile styles */
    header h1 {
        font-size: 2rem;
    }

    .conference-grid {
        grid-template-columns: 1fr;
    }
}

/* Add more breakpoints */
@media (max-width: 480px) {
    /* Small mobile styles */
}

@media (min-width: 1600px) {
    /* Large screen styles */
}
```

---

### 6. Data Source Maintenance

#### Check Source Repository Format

If auto-updates suddenly fail, the source repository ([ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines)) data format may have changed.

**Check Steps:**
1. Visit https://github.com/ccfddl/ccf-deadlines/tree/main/conference
2. Check if the conference file format you're tracking has changed
3. Refer to documentation in `analysis_docs/` for expected format

**Expected YAML File Format:**
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

#### Switch Data Source

If you need to use a different data source, modify `.github/workflows/update-deadlines.yml`:

```yaml
- name: Clone source repository
  run: |
    git clone https://github.com/your-fork/ccf-deadlines.git temp_source
    # Or use another data source
```

---

### 7. Frequently Asked Questions (FAQ)

#### Q1: Why do some conferences show "estimated" dates?
**A:** When a conference's latest year deadline hasn't been announced yet, the system calculates an estimated date based on historical data (average from past years), marked with an orange dashed border.

#### Q2: How to force update data?
**A:**
1. Visit GitHub Actions page
2. Manually trigger "Update Conference Deadlines" workflow
3. Wait for workflow to complete (about 1-2 minutes)
4. Refresh website (Ctrl+F5 to clear cache)

#### Q3: Why do timeline items overlap?
**A:** They shouldn't overlap. The vis-timeline library automatically detects collisions and stacks vertically. If overlapping occurs:
1. Check browser console for JavaScript errors
2. Try increasing `margin.item` value
3. Check if vis-timeline CDN loaded successfully

#### Q4: How to modify timezone?
**A:** Timezone information comes from the source YAML file's `timezone` field. Our `parseTimezone()` function supports:
- `AoE` (Anywhere on Earth = UTC-12)
- `UTC±N` format (e.g., `UTC-8`, `UTC+0`)

To support other formats, modify the `parseTimezone()` function in `src/script.js`.

#### Q5: Website shows 404 after deployment
**A:**
1. Check if GitHub Pages is enabled (Settings → Pages)
2. Confirm deployment branch is `gh-pages`
3. Check if Actions ran successfully
4. Wait 5-10 minutes (GitHub Pages has cache delay)

#### Q6: How to backup data?
**A:** All data is in the Git repository:
1. Fork the repository to your own account
2. Or periodically run `git pull` to backup locally
3. `conference/` directory contains all conference data
4. `analysis_docs/` directory contains technical documentation

---

## 🎓 Technical Documentation

Detailed technical decisions and implementation details are documented in the `analysis_docs/` directory:

- **vis-timeline Integration**: `2025-10-13_17-39_vis_timeline_integration.md`
  - Why we abandoned custom collision detection
  - vis-timeline advantages and configuration
  - Code migration process

- **Timeline Spacing Optimization**: `2025-10-13_18-12_timeline_spacing_increase.md`
  - Vertical space tuning process
  - Parameter adjustment instructions
  - Visual effect comparison

- **Layout Improvement History**: `2025-10-13_17-32_timeline_v2_fixes.md`
  - Early collision detection attempts
  - Layout algorithm evolution

---

## 🚀 Quick Deployment Guide

### 1. Fork this repository
Click the **Fork** button in the top right corner

### 2. Enable GitHub Pages
1. Go to your forked repository
2. Settings → Pages
3. Source: Select **Deploy from a branch**
4. Branch: Select **gh-pages** / **(root)**
5. Save

### 3. Enable GitHub Actions
1. Actions tab
2. Click **"I understand my workflows, go ahead and enable them"**

### 4. First Deployment
1. Actions → "Update Conference Deadlines"
2. Click **"Run workflow"**
3. Wait for completion (about 1-2 minutes)

### 5. Access Your Site
`https://your-username.github.io/simple-ccf-ddl/`

---

## 🎯 Project Design Philosophy

### Why Create This Project?

1. **Simplify Complexity**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) contains 100+ conferences, which is information overload for researchers focused on specific areas
2. **Serverless**: Fully static website + GitHub Actions, zero maintenance cost
3. **Automated**: No manual updates needed, data sourced from community-maintained repository
4. **Visual First**: Uses professional timeline library for intuitive deadline distribution display
5. **Open and Transparent**: All code and data public, easy to customize and maintain

### Technology Selection Principles

- **No build step**: No Node.js/Webpack/Vite, uses browser native features directly
- **CDN dependencies**: Uses unpkg.com to load external libraries, no npm needed
- **Progressive enhancement**: Basic features first, enhanced features added progressively
- **Mobile-first**: Responsive design, mobile experience prioritized
- **Community data**: Data from community, gives back to community

---

## 📝 Changelog

### v1.3.0 (2025-10-13)
- ✨ Increased timeline vertical spacing for better readability
- 📝 Enhanced maintenance documentation

### v1.2.0 (2025-10-13)
- ✨ Integrated vis-timeline professional timeline library
- 🐛 Fixed timeline boundary overflow issues
- 🎨 Improved visual distinction between confirmed/estimated deadlines

### v1.1.0 (2025-10-13)
- ✨ Implemented automatic collision detection and smart stacking
- 🎨 Optimized timeline layout

### v1.0.0 (2025-10-13)
- 🎉 Initial release
- ✨ Support for tracking 9 top conferences
- ✨ GitHub Actions auto-updates
- ✨ Responsive design

---

## 📄 License

MIT License - Feel free to use this for your own conference tracking needs!

---

## 🙏 Acknowledgments

- **Data Source**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) - Thanks to all contributors
- **Timeline Library**: [vis-timeline](https://visjs.github.io/vis-timeline/) - Professional timeline visualization library
- **YAML Parser**: [js-yaml](https://github.com/nodeca/js-yaml) - JavaScript YAML parser
- **Icons**: From official conference websites
- **Inspiration**: Built for researchers who need to track specific AI/CV/ML conferences

---

**Made with ❤️ for the AI research community**

**Maintainer**: [jackhu-bme](https://github.com/jackhu-bme)
**Issue Reports**: [GitHub Issues](https://github.com/jackhu-bme/simple_ccf_ddl/issues)
