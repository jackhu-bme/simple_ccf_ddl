# 🎓 AI Conference Deadlines Tracker

A simplified, beautiful, and automatically-updated website tracking submission deadlines for top AI/CV/ML conferences.

## 🌟 Features

- **📅 Interactive Timeline**: Visual timeline showing all deadlines in the next 12 months
- **🤖 Smart Estimation**: Shows estimated deadlines (based on historical averages) for conferences without announced dates
- **⏱️ Live Countdown**: Real-time countdown to each deadline
- **🎨 Beautiful UI**: Modern, responsive design with conference icons
- **🔄 Auto-Updates**: Automatically syncs with [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) weekly via GitHub Actions
- **📱 Mobile-Friendly**: Fully responsive design

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
1. Fetch latest deadline data from the [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) repository every Sunday
2. Update conference YAML files
3. Redeploy the website to GitHub Pages

**No server required!** Everything runs on GitHub's infrastructure for free.

### Timeline Features
- **Exact Deadlines** (🟢): Shows confirmed submission deadlines for announced conferences
- **Estimated Deadlines** (🟡): Calculates average deadline based on historical data when current year deadline is not yet announced

The estimated deadline calculation:
- Excludes the current/future year
- Averages the month and day from 2+ past conferences
- Projects to the next logical year

## 🛠️ Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks needed!)
- **Data Format**: YAML
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Data Source**: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines)

## 📦 Repository Structure

```
simple-ccf-ddl/
├── index.html              # Main webpage
├── src/
│   ├── styles.css         # Styling
│   └── script.js          # JavaScript logic
├── conference/            # Conference YAML data files
│   ├── cvpr.yml
│   ├── iccv.yml
│   ├── eccv.yml
│   ├── nips.yml
│   ├── icml.yml
│   ├── iclr.yml
│   ├── aaai.yml
│   ├── ijcai.yml
│   └── miccai.yml
├── .github/
│   └── workflows/
│       └── update-deadlines.yml  # Auto-update workflow
└── README.md
```

## 🚀 Setup Your Own Instance

1. **Fork this repository**

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from `gh-pages` branch
   - Save

3. **Enable GitHub Actions**:
   - Go to Actions tab
   - Enable workflows

4. **Wait for first deployment** or manually trigger the workflow:
   - Go to Actions → "Update Conference Deadlines"
   - Click "Run workflow"

5. **Access your site**:
   - Your site will be available at: `https://yourusername.github.io/simple-ccf-ddl/`

## ⚙️ Configuration

### Update Frequency
Edit `.github/workflows/update-deadlines.yml` to change update frequency:
```yaml
schedule:
  - cron: '0 0 * * 0'  # Sunday at 00:00 UTC
```

### Add/Remove Conferences
1. Edit the conference list in `.github/workflows/update-deadlines.yml`
2. Update `CONFERENCE_FILES` array in `src/script.js`
3. Add conference configuration in `CONFERENCE_CONFIG` object

## 📝 Data Source

All deadline data comes from the community-maintained [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines) repository. Huge thanks to all contributors!

## 🤝 Contributing

Issues and pull requests are welcome! This project is designed to be simple and maintainable.

## 📄 License

MIT License - Feel free to use this for your own conference tracking needs!

## 🙏 Acknowledgments

- Data source: [ccfddl/ccf-deadlines](https://github.com/ccfddl/ccf-deadlines)
- Inspired by the need for a cleaner, focused conference deadline tracker
- Built for researchers who need to track specific AI/CV/ML conferences

---

**Made with ❤️ for the AI research community**
