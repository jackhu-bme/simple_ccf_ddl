// Conference configuration with icons and categories
const CONFERENCE_CONFIG = {
    'CVPR': { icon: 'icons/cvpr.png', category: 'cv', fullName: 'Computer Vision and Pattern Recognition' },
    'ICCV': { icon: 'icons/iccv.png', category: 'cv', fullName: 'International Conference on Computer Vision' },
    'ECCV': { icon: 'icons/eccv.png', category: 'cv', fullName: 'European Conference on Computer Vision' },
    'NeurIPS': { icon: 'icons/neurips.png', category: 'ml', fullName: 'Neural Information Processing Systems' },
    'ICML': { icon: 'icons/icml.png', category: 'ml', fullName: 'International Conference on Machine Learning' },
    'ICLR': { icon: 'icons/iclr.png', category: 'ml', fullName: 'International Conference on Learning Representations' },
    'AAAI': { icon: 'icons/aaai.png', category: 'ai', fullName: 'AAAI Conference on Artificial Intelligence' },
    'IJCAI': { icon: 'icons/ijcai.png', category: 'ai', fullName: 'International Joint Conference on AI' },
    'MICCAI': { icon: 'icons/miccai.png', category: 'medical', fullName: 'Medical Image Computing and Computer Assisted Intervention' }
};

const CONFERENCE_FILES = ['cvpr', 'iccv', 'eccv', 'nips', 'icml', 'iclr', 'aaai', 'ijcai', 'miccai'];

let allConferences = [];
let allDeadlines = [];

// Load all conference data
async function loadConferences() {
    try {
        const promises = CONFERENCE_FILES.map(file =>
            fetch(`conference/${file}.yml`)
                .then(res => res.text())
                .then(text => jsyaml.load(text))
        );

        const conferences = await Promise.all(promises);
        allConferences = conferences.map(conf => conf[0]); // YAML returns array

        processDeadlines();
        renderStats();
        renderTimeline();
        renderConferences();

        document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString();
    } catch (error) {
        console.error('Error loading conferences:', error);
        document.getElementById('conferenceList').innerHTML =
            '<div class="error">Failed to load conference data. Please try again later.</div>';
    }
}

// Parse timezone offset
function parseTimezone(tz) {
    if (tz === 'AoE') return -12;
    const match = tz.match(/UTC([+-]\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// Convert deadline to Date object
function parseDeadline(deadlineStr, timezone) {
    const offset = parseTimezone(timezone);
    const date = new Date(deadlineStr);
    // Adjust for timezone
    date.setHours(date.getHours() - offset);
    return date;
}

// Calculate average deadline from historical data
function calculateAverageDeadline(confs, excludeLatestYear = true) {
    const now = new Date();
    const currentYear = now.getFullYear();

    const validConfs = confs.filter(conf => {
        if (excludeLatestYear && conf.year >= currentYear) return false;
        return conf.timeline && conf.timeline.length > 0;
    });

    if (validConfs.length === 0) return null;

    // Calculate average month and day
    const dates = validConfs.map(conf => {
        const deadline = conf.timeline[0].deadline;
        return new Date(deadline);
    });

    const avgMonth = Math.round(dates.reduce((sum, d) => sum + d.getMonth(), 0) / dates.length);
    const avgDay = Math.round(dates.reduce((sum, d) => sum + d.getDate(), 0) / dates.length);

    // Create estimated date for next year
    let estimatedDate = new Date(currentYear, avgMonth, avgDay);

    // If the estimated date is in the past, use next year
    if (estimatedDate < now) {
        estimatedDate = new Date(currentYear + 1, avgMonth, avgDay);
    }

    return estimatedDate;
}

// Process all deadlines for timeline
function processDeadlines() {
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    allDeadlines = [];

    allConferences.forEach(conf => {
        const confName = conf.title;

        // Find exact upcoming deadlines
        let hasUpcomingDeadline = false;

        if (conf.confs && conf.confs.length > 0) {
            conf.confs.forEach(yearConf => {
                if (!yearConf.timeline || yearConf.timeline.length === 0) return;

                const deadline = yearConf.timeline[0].deadline;
                const deadlineDate = parseDeadline(deadline, yearConf.timezone);

                // Only include deadlines within the next year
                if (deadlineDate >= now && deadlineDate <= oneYearLater) {
                    hasUpcomingDeadline = true;
                    allDeadlines.push({
                        conference: confName,
                        date: deadlineDate,
                        year: yearConf.year,
                        type: 'exact',
                        hasAbstract: !!yearConf.timeline[0].abstract_deadline,
                        abstractDate: yearConf.timeline[0].abstract_deadline ?
                            parseDeadline(yearConf.timeline[0].abstract_deadline, yearConf.timezone) : null
                    });
                }
            });
        }

        // If no upcoming deadline, calculate average
        if (!hasUpcomingDeadline && conf.confs && conf.confs.length > 2) {
            const avgDate = calculateAverageDeadline(conf.confs, true);
            if (avgDate && avgDate >= now && avgDate <= oneYearLater) {
                allDeadlines.push({
                    conference: confName,
                    date: avgDate,
                    year: avgDate.getFullYear(),
                    type: 'estimated',
                    hasAbstract: false
                });
            }
        }
    });

    // Sort by date
    allDeadlines.sort((a, b) => a.date - b.date);
}

// Render statistics
function renderStats() {
    const now = new Date();
    const upcoming = allDeadlines.filter(d => d.date >= now);

    document.getElementById('upcomingCount').textContent = upcoming.length;

    if (upcoming.length > 0) {
        const nextDeadline = upcoming[0];
        const daysUntil = Math.ceil((nextDeadline.date - now) / (1000 * 60 * 60 * 24));
        document.getElementById('nextDeadline').textContent =
            `${daysUntil} days`;
    }
}

// Render timeline using vis-timeline library
function renderTimeline() {
    const timelineEl = document.getElementById('timeline');
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const upcomingDeadlines = allDeadlines.filter(d => d.date >= now);

    if (upcomingDeadlines.length === 0) {
        timelineEl.innerHTML = '<div class="no-deadline">No upcoming deadlines in the next 12 months</div>';
        return;
    }

    // Clear previous timeline
    timelineEl.innerHTML = '';

    // Prepare items for vis-timeline
    const items = upcomingDeadlines.map((deadline, index) => {
        const config = CONFERENCE_CONFIG[deadline.conference];
        const daysUntil = Math.ceil((deadline.date - now) / (1000 * 60 * 60 * 24));
        const typeLabel = deadline.type === 'estimated' ? ' (est.)' : '';
        const typeClass = deadline.type === 'estimated' ? 'estimated-item' : 'exact-item';

        return {
            id: index,
            content: deadline.conference, // Placeholder, will be replaced by template
            start: deadline.date,
            className: typeClass,
            type: 'point',
            // Store data for template function
            conferenceData: {
                name: deadline.conference,
                icon: config?.icon,
                date: deadline.date,
                typeLabel: typeLabel,
                daysUntil: daysUntil
            }
        };
    });

    // Configure timeline options with custom template
    const options = {
        width: '100%',
        height: '400px',
        margin: {
            item: 20,
            axis: 40
        },
        orientation: {
            axis: 'both',
            item: 'top'
        },
        stack: true,
        stackSubgroups: true,
        verticalScroll: false,
        zoomable: true,
        zoomMin: 1000 * 60 * 60 * 24 * 7, // Min zoom: 1 week
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 2, // Max zoom: 2 years
        min: now,
        max: oneYearLater,
        start: now,
        end: oneYearLater,
        format: {
            minorLabels: {
                month: 'MMM',
                week: 'w'
            },
            majorLabels: {
                month: 'MMMM YYYY',
                year: 'YYYY'
            }
        },
        tooltip: {
            followMouse: true,
            overflowMethod: 'cap'
        },
        // Custom template function to create DOM elements
        template: function (item, element, data) {
            if (!item.conferenceData) return item.content;

            const container = document.createElement('div');
            container.className = 'vis-item-content';

            // Add icon if available
            if (item.conferenceData.icon) {
                const icon = document.createElement('img');
                icon.src = item.conferenceData.icon;
                icon.alt = item.conferenceData.name;
                icon.className = 'timeline-icon-vis';
                container.appendChild(icon);
            }

            // Conference name
            const name = document.createElement('div');
            name.className = 'vis-conf-name';
            name.textContent = item.conferenceData.name;
            container.appendChild(name);

            // Date
            const date = document.createElement('div');
            date.className = 'vis-date';
            date.textContent = item.conferenceData.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + item.conferenceData.typeLabel;
            container.appendChild(date);

            // Days until
            const days = document.createElement('div');
            days.className = 'vis-days';
            days.textContent = item.conferenceData.daysUntil + ' days';
            container.appendChild(days);

            return container;
        }
    };

    // Create timeline
    const timeline = new vis.Timeline(timelineEl, items, options);

    // Add click event for items
    timeline.on('select', function (properties) {
        if (properties.items.length > 0) {
            const itemId = properties.items[0];
            const deadline = upcomingDeadlines[itemId];
            console.log('Selected deadline:', deadline);
        }
    });
}

// Get countdown text with styling class
function getCountdown(date) {
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let className = 'normal';
    let text = '';

    if (days < 0) {
        className = 'past';
        text = 'Deadline passed';
    } else if (days === 0) {
        className = 'urgent';
        text = 'Due today!';
    } else if (days === 1) {
        className = 'urgent';
        text = 'Due tomorrow!';
    } else if (days <= 7) {
        className = 'urgent';
        text = `${days} days left`;
    } else if (days <= 30) {
        className = 'soon';
        text = `${days} days left`;
    } else {
        className = 'normal';
        text = `${days} days left`;
    }

    return { className, text };
}

// Render conference cards
function renderConferences() {
    const listEl = document.getElementById('conferenceList');
    listEl.innerHTML = '';

    allConferences.forEach(conf => {
        const confName = conf.title;
        const config = CONFERENCE_CONFIG[confName];
        if (!config) return;

        const card = document.createElement('div');
        card.className = `conference-card ${config.category}`;
        card.dataset.category = config.category;

        // Header with icon
        const header = document.createElement('div');
        header.className = 'conference-header';

        const iconContainer = document.createElement('div');
        iconContainer.className = 'conference-icon';
        const icon = document.createElement('img');
        icon.src = config.icon;
        icon.alt = confName;
        iconContainer.appendChild(icon);
        header.appendChild(iconContainer);

        const titleGroup = document.createElement('div');
        titleGroup.className = 'conference-title-group';

        const name = document.createElement('div');
        name.className = 'conference-name';
        name.textContent = confName;
        titleGroup.appendChild(name);

        const fullName = document.createElement('div');
        fullName.className = 'conference-full-name';
        fullName.textContent = config.fullName;
        titleGroup.appendChild(fullName);

        header.appendChild(titleGroup);
        card.appendChild(header);

        // Badges
        const badges = document.createElement('div');
        badges.className = 'conference-badges';

        const rankBadge = document.createElement('span');
        rankBadge.className = 'badge rank-a';
        rankBadge.textContent = `CCF ${conf.rank?.ccf || 'N/A'}`;
        badges.appendChild(rankBadge);

        const catBadge = document.createElement('span');
        catBadge.className = 'badge category';
        catBadge.textContent = config.category.toUpperCase();
        badges.appendChild(catBadge);

        card.appendChild(badges);

        // Find next deadline
        const now = new Date();
        let nextDeadline = null;
        let isEstimated = false;

        if (conf.confs && conf.confs.length > 0) {
            for (const yearConf of conf.confs) {
                if (yearConf.timeline && yearConf.timeline.length > 0) {
                    const deadline = parseDeadline(yearConf.timeline[0].deadline, yearConf.timezone);
                    if (deadline >= now) {
                        nextDeadline = {
                            date: deadline,
                            year: yearConf.year,
                            confDate: yearConf.date,
                            place: yearConf.place,
                            link: yearConf.link,
                            hasAbstract: !!yearConf.timeline[0].abstract_deadline,
                            abstractDeadline: yearConf.timeline[0].abstract_deadline ?
                                parseDeadline(yearConf.timeline[0].abstract_deadline, yearConf.timezone) : null
                        };
                        break;
                    }
                }
            }
        }

        // If no exact deadline, use estimated
        if (!nextDeadline && conf.confs && conf.confs.length > 2) {
            const avgDate = calculateAverageDeadline(conf.confs, true);
            if (avgDate) {
                nextDeadline = {
                    date: avgDate,
                    year: avgDate.getFullYear(),
                    confDate: 'TBA',
                    place: 'TBA',
                    link: null
                };
                isEstimated = true;
            }
        }

        // Deadline info
        if (nextDeadline) {
            const deadlineInfo = document.createElement('div');
            deadlineInfo.className = 'deadline-info';

            const label = document.createElement('div');
            label.className = 'deadline-label';
            label.textContent = isEstimated ? '📅 Estimated Deadline' : '🎯 Next Deadline';
            deadlineInfo.appendChild(label);

            const dateEl = document.createElement('div');
            dateEl.className = `deadline-date ${isEstimated ? 'estimated' : ''}`;
            dateEl.textContent = nextDeadline.date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            deadlineInfo.appendChild(dateEl);

            const countdown = getCountdown(nextDeadline.date);
            const countdownEl = document.createElement('div');
            countdownEl.className = `deadline-countdown ${countdown.className}`;
            countdownEl.textContent = countdown.text;
            deadlineInfo.appendChild(countdownEl);

            card.appendChild(deadlineInfo);

            // Conference details
            const details = document.createElement('div');
            details.className = 'conference-details';
            details.innerHTML = `
                <div><strong>Conference:</strong> ${nextDeadline.confDate}</div>
                <div><strong>Location:</strong> ${nextDeadline.place}</div>
                ${nextDeadline.hasAbstract ?
                    `<div><strong>Abstract:</strong> ${nextDeadline.abstractDeadline.toLocaleDateString()}</div>` : ''}
            `;
            card.appendChild(details);

            // Link
            if (nextDeadline.link) {
                const link = document.createElement('a');
                link.className = 'conference-link';
                link.href = nextDeadline.link;
                link.target = '_blank';
                link.textContent = '🔗 Visit Website';
                card.appendChild(link);
            }
        } else {
            const noDeadline = document.createElement('div');
            noDeadline.className = 'no-deadline';
            noDeadline.textContent = 'No upcoming deadline information';
            card.appendChild(noDeadline);
        }

        listEl.appendChild(card);
    });

    setupFilters();
}

// Setup filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.conference-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadConferences);
