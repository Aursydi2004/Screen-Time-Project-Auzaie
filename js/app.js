(function () {
    const storageKeys = {
        apps: 'screentimehub.apps',
        drafts: 'screentimehub.drafts',
        profile: 'screentimehub.profile',
        settings: 'screentimehub.settings',
        session: 'screentimehub.session'
    };

    const defaultApps = [
        { name: 'VS Code', category: 'Productivity & Coding', opens: 14, minutes: 105 },
        { name: 'WhatsApp', category: 'Communication', opens: 32, minutes: 55 },
        { name: 'Google Chrome', category: 'Web Browser', opens: 20, minutes: 50 },
        { name: 'Spotify', category: 'Entertainment', opens: 5, minutes: 35 },
        { name: 'Mobile Legends', category: 'Mobile Gaming', opens: 8, minutes: 80 },
        { name: 'Clash of Clans', category: 'Mobile Gaming', opens: 6, minutes: 40 },
        { name: 'Strava', category: 'Health & Fitness', opens: 3, minutes: 25 },
        { name: 'Gmail', category: 'Communication & Email', opens: 12, minutes: 30 },
        { name: 'Telegram', category: 'Communication', opens: 18, minutes: 45 },
        { name: 'Instagram', category: 'Social Media', opens: 25, minutes: 70 },
        { name: 'ChatGPT', category: 'Productivity & AI', opens: 10, minutes: 50 },
        { name: 'YouTube', category: 'Entertainment & Video', opens: 16, minutes: 90 },
        { name: 'TikTok', category: 'Social Media & Video', opens: 21, minutes: 65 },
        { name: 'Facebook', category: 'Social Media', opens: 9, minutes: 35 },
        { name: 'Netflix', category: 'Entertainment & Streaming', opens: 4, minutes: 75 },
        { name: 'Shopee', category: 'Shopping', opens: 7, minutes: 20 },
        { name: 'Google Maps', category: 'Navigation', opens: 5, minutes: 18 }
    ];

    const defaultDrafts = [
        { id: 'DRF-101', title: 'IMS566 Web Project Documentation', category: 'Academic', updated: '3 minutes ago', status: 'Active' },
        { id: 'DRF-102', title: 'PHP Schema & Relational Database Code', category: 'System Development', updated: '2 hours ago', status: 'Under Review' },
        { id: 'DRF-103', title: 'Weekly Exercise & Running Plan', category: 'Healthy Lifestyle', updated: 'Yesterday', status: 'Saved' },
        { id: 'DRF-104', title: 'Internship Group Discussion Notes', category: 'Career', updated: '3 days ago', status: 'Completed' },
        { id: 'DRF-105', title: 'Screen Time App Feature Ideas', category: 'Product Planning', updated: 'Today', status: 'Active' },
        { id: 'DRF-106', title: 'Weekly Class and Assignment Schedule', category: 'Academic', updated: 'Yesterday', status: 'Saved' },
        { id: 'DRF-107', title: 'Meeting Notes: Project Progress', category: 'Project Management', updated: '2 days ago', status: 'Under Review' },
        { id: 'DRF-108', title: 'Monthly Budget and Expense Tracker', category: 'Personal Finance', updated: '3 days ago', status: 'Saved' },
        { id: 'DRF-109', title: 'UI Color Palette and Layout Ideas', category: 'Design', updated: '4 days ago', status: 'Active' },
        { id: 'DRF-110', title: 'Database Testing Checklist', category: 'System Development', updated: '1 week ago', status: 'Completed' },
        { id: 'DRF-111', title: 'Reading List and Research Sources', category: 'Research', updated: '1 week ago', status: 'Saved' },
        { id: 'DRF-112', title: 'Personal Goals for the Month', category: 'Personal', updated: '2 weeks ago', status: 'Active' }
    ];

    function loadData(key, fallback) {
        const saved = localStorage.getItem(key);
        return saved === null ? fallback : JSON.parse(saved);
    }

    function saveData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getTrackedApps() {
        const savedApps = loadData(storageKeys.apps, []);
        return defaultApps.concat(savedApps);
    }

    function getAllDrafts() {
        const savedDrafts = loadData(storageKeys.drafts, []);
        return defaultDrafts.concat(savedDrafts);
    }

    if (document.body.classList.contains('app-page') && !localStorage.getItem(storageKeys.session)) {
        window.location.replace('index.html');
        return;
    }

    try {
        const savedSettings = loadData(storageKeys.settings, null);
        document.body.classList.toggle('app-dark-mode', Boolean(savedSettings && savedSettings.darkMode));
    } catch (error) {
        console.error('Could not apply saved display settings.', error);
    }

    function updateThemeControls(enabled) {
        document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
            toggle.setAttribute('aria-pressed', String(enabled));
            toggle.classList.toggle('is-active', enabled);
            const label = toggle.querySelector('.theme-toggle-label');
            if (label) label.textContent = enabled ? 'Light mode' : 'Dark mode';
        });
        const settingsSwitch = document.getElementById('darkModeSwitch');
        if (settingsSwitch) settingsSwitch.checked = enabled;
    }

    function setTheme(enabled, persist) {
        document.body.classList.toggle('app-dark-mode', enabled);
        updateThemeControls(enabled);
        if (!persist) return;

        try {
            const settings = loadData(storageKeys.settings, {});
            saveData(storageKeys.settings, {
                dailyLimit: Number(settings.dailyLimit) || 5,
                darkMode: enabled,
                alerts: settings.alerts !== false
            });
        } catch (error) {
            console.error('Could not save display settings.', error);
        }
    }

    updateThemeControls(document.body.classList.contains('app-dark-mode'));
    document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            setTheme(!document.body.classList.contains('app-dark-mode'), true);
        });
    });

    function updateSidebarControls(collapsed) {
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        document.querySelectorAll('[data-sidebar-toggle]').forEach(function (toggle) {
            toggle.setAttribute('aria-expanded', String(!collapsed));
            toggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
        });
    }

    let sidebarCollapsed = false;
    try {
        sidebarCollapsed = localStorage.getItem('screentimehub.sidebarCollapsed') === 'true';
    } catch (error) {
        console.error('Could not load navigation preference.', error);
    }
    updateSidebarControls(sidebarCollapsed);
    document.querySelectorAll('[data-sidebar-toggle]').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            sidebarCollapsed = !document.body.classList.contains('sidebar-collapsed');
            updateSidebarControls(sidebarCollapsed);
            try {
                localStorage.setItem('screentimehub.sidebarCollapsed', String(sidebarCollapsed));
            } catch (error) {
                console.error('Could not save navigation preference.', error);
            }
        });
    });

    document.querySelectorAll('a[href="index.html"]').forEach(function (link) {
        if (link.classList.contains('text-danger') || link.classList.contains('workspace-signout')) {
            link.addEventListener('click', function () {
                localStorage.removeItem(storageKeys.session);
            });
        }
    });

    function showFeedback(element, message, isError) {
        if (!element) return;
        element.textContent = message;
        element.className = `alert ${isError ? 'alert-danger' : 'alert-success'}`;
        element.setAttribute('role', 'status');
    }

    function getFrequency(opens) {
        if (opens >= 15) return { label: 'Very High', badge: 'bg-danger' };
        if (opens >= 7) return { label: 'High', badge: 'bg-warning text-dark' };
        return { label: 'Moderate', badge: 'bg-success' };
    }

    function formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0) return `${remainingMinutes} minutes`;
        if (remainingMinutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
    }

    function appendCell(row, value) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
        return cell;
    }

    function setupDeviceOverview() {
        const batteryPercent = document.getElementById('batteryPercent');
        const batteryStatus = document.getElementById('batteryStatus');
        const batteryMeter = document.querySelector('.battery-meter');
        const batteryMeterFill = document.getElementById('batteryMeterFill');
        const modelForm = document.getElementById('deviceModelForm');
        if (!batteryPercent || !batteryStatus || !batteryMeter || !batteryMeterFill || !modelForm) return;

        const modelInput = document.getElementById('deviceModelInput');
        const modelValue = document.getElementById('deviceModelValue');
        const modelFeedback = document.getElementById('deviceModelFeedback');
        const savedModelKey = 'screentimehub.deviceModel';

        try {
            const savedModel = localStorage.getItem(savedModelKey);
            if (savedModel) {
                modelValue.textContent = savedModel;
                modelInput.value = savedModel;
            }
        } catch (error) {
            modelFeedback.textContent = 'Could not load the saved phone model.';
            console.error('Could not load the saved phone model.', error);
        }

        modelForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const model = modelInput.value.trim();
            if (!model) {
                modelFeedback.textContent = 'Enter a phone model before saving.';
                modelInput.focus();
                return;
            }

            try {
                localStorage.setItem(savedModelKey, model);
                modelValue.textContent = model;
                modelFeedback.textContent = 'Phone model saved.';
            } catch (error) {
                modelFeedback.textContent = 'Could not save the phone model. Check browser storage settings.';
                console.error('Could not save the phone model.', error);
            }
        });

        function showBatteryUnavailable() {
            batteryPercent.textContent = 'N/A';
            batteryStatus.textContent = 'Battery status is unavailable in this browser.';
            batteryMeter.setAttribute('aria-valuenow', '0');
            batteryMeterFill.style.width = '0%';
        }

        function renderBattery(battery) {
            const percentage = Math.round(battery.level * 100);
            batteryPercent.textContent = `${percentage}%`;
            batteryStatus.textContent = battery.charging ? 'Charging' : 'On battery';
            batteryMeter.setAttribute('aria-valuenow', String(percentage));
            batteryMeterFill.style.width = `${percentage}%`;
        }

        if (typeof navigator.getBattery !== 'function') {
            showBatteryUnavailable();
            return;
        }

        navigator.getBattery()
            .then(function (battery) {
                renderBattery(battery);
                battery.addEventListener('levelchange', () => renderBattery(battery));
                battery.addEventListener('chargingchange', () => renderBattery(battery));
            })
            .catch(function (error) {
                showBatteryUnavailable();
                console.error('Could not read the device battery status.', error);
            });
    }

    function setupApps() {
        const form = document.getElementById('addAppForm');
        const tableBody = document.querySelector('#appsTable tbody');
        if (!tableBody) return;

        const feedback = document.getElementById('appsFeedback');
        const searchInput = document.getElementById('appsSearch');
        const categoryFilter = document.getElementById('appsCategoryFilter');
        const sortSelect = document.getElementById('appsSort');
        let allApps = [];

        function renderApps(apps) {
            tableBody.replaceChildren();
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const category = categoryFilter ? categoryFilter.value : '';
            const sort = sortSelect ? sortSelect.value : 'usage';
            const visibleApps = allApps.filter(function (app) {
                const matchesSearch = `${app.name} ${app.category}`.toLowerCase().includes(query);
                return matchesSearch && (!category || app.category === category);
            });

            visibleApps.sort(function (first, second) {
                if (sort === 'name') return first.name.localeCompare(second.name);
                if (sort === 'opens') return second.opens - first.opens;
                return second.minutes - first.minutes;
            });

            const count = document.getElementById('appsResultCount');
            if (count) count.textContent = `${visibleApps.length} ${visibleApps.length === 1 ? 'app' : 'apps'}`;

            if (visibleApps.length === 0) {
                const row = document.createElement('tr');
                const cell = appendCell(row, 'No apps match your search. Try another name or category.');
                cell.colSpan = 5;
                cell.className = 'explore-empty-state';
                tableBody.appendChild(row);
                return;
            }

            visibleApps.forEach(function (app) {
                const row = document.createElement('tr');
                row.classList.add('explore-data-row');
                const nameCell = document.createElement('td');
                const appIdentity = document.createElement('span');
                appIdentity.className = 'app-identity';
                const appIcon = document.createElement('span');
                appIcon.className = 'app-letter-icon';
                appIcon.textContent = app.name.slice(0, 1).toUpperCase();
                const appName = document.createElement('strong');
                appName.textContent = app.name;
                appIdentity.append(appIcon, appName);
                nameCell.appendChild(appIdentity);
                row.appendChild(nameCell);
                const categoryCell = appendCell(row, app.category);
                categoryCell.classList.add('explore-secondary-cell');
                const opensCell = appendCell(row, `${app.opens} ${app.opens === 1 ? 'time' : 'times'}`);
                opensCell.classList.add('explore-number-cell');
                const usageCell = appendCell(row, formatDuration(app.minutes));
                usageCell.classList.add('explore-number-cell', 'fw-semibold');
                const frequencyCell = document.createElement('td');
                const frequency = getFrequency(app.opens);
                const badge = document.createElement('span');
                badge.className = `badge activity-badge ${frequency.badge}`;
                badge.textContent = frequency.label;
                frequencyCell.appendChild(badge);
                row.appendChild(frequencyCell);
                tableBody.appendChild(row);
            });
        }

        try {
            allApps = getTrackedApps();
            const categoryOptions = Array.from(new Set(allApps.map(app => app.category))).sort();
            if (categoryFilter) {
                categoryOptions.forEach(function (category) {
                    categoryFilter.add(new Option(category, category));
                });
            }

            const totalCount = document.getElementById('appsTotalCount');
            const totalTime = document.getElementById('appsTotalTime');
            const highActivity = document.getElementById('appsHighActivity');
            if (totalCount) totalCount.textContent = allApps.length;
            if (totalTime) totalTime.textContent = formatDuration(allApps.reduce((total, app) => total + app.minutes, 0));
            if (highActivity) highActivity.textContent = allApps.filter(app => app.opens >= 7).length;
            renderApps(allApps);
        } catch (error) {
            showFeedback(feedback, `Could not load tracked apps: ${error.message}`, true);
        }

        [searchInput, categoryFilter, sortSelect].forEach(function (control) {
            if (control) control.addEventListener('input', () => renderApps(allApps));
            if (control && control.tagName === 'SELECT') control.addEventListener('change', () => renderApps(allApps));
        });

        if (!form) return;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.reportValidity()) return;

            const app = {
                name: document.getElementById('appName').value.trim(),
                category: document.getElementById('appCategory').value.trim(),
                opens: Number(document.getElementById('appOpens').value),
                minutes: Number(document.getElementById('appMinutes').value)
            };

            try {
                const apps = loadData(storageKeys.apps, []);
                apps.push(app);
                saveData(storageKeys.apps, apps);
                allApps = getTrackedApps();
                const totalCount = document.getElementById('appsTotalCount');
                const totalTime = document.getElementById('appsTotalTime');
                const highActivity = document.getElementById('appsHighActivity');
                if (totalCount) totalCount.textContent = allApps.length;
                if (totalTime) totalTime.textContent = formatDuration(allApps.reduce((total, item) => total + item.minutes, 0));
                if (highActivity) highActivity.textContent = allApps.filter(item => item.opens >= 7).length;
                if (categoryFilter && !Array.from(categoryFilter.options).some(option => option.value === app.category)) {
                    categoryFilter.add(new Option(app.category, app.category));
                }
                renderApps(allApps);
                form.reset();
                bootstrap.Modal.getOrCreateInstance(document.getElementById('addAppModal')).hide();
                showFeedback(feedback, `${app.name} was added to tracked apps.`, false);
            } catch (error) {
                showFeedback(feedback, `Could not save this app: ${error.message}`, true);
            }
        });
    }

    function setupDrafts() {
        const form = document.getElementById('createDraftForm');
        const tableBody = document.querySelector('#draftsTable tbody');
        if (!tableBody) return;

        const feedback = document.getElementById('draftsFeedback');
        const searchInput = document.getElementById('draftsSearch');
        const categoryFilter = document.getElementById('draftCategoryFilter');
        const resultCount = document.getElementById('draftsResultCount');
        let activeFilter = 'All';
        let allDrafts = [];
        const statusStyles = {
            Active: 'bg-primary',
            'Under Review': 'bg-warning text-dark',
            Saved: 'bg-secondary',
            Completed: 'bg-success'
        };

        function updateSummary(drafts) {
            const counts = { Active: 0, 'Under Review': 0, Saved: 0, Completed: 0 };
            drafts.forEach(function (draft) {
                const status = draft.status || 'Active';
                counts[status] = (counts[status] || 0) + 1;
            });

            const total = drafts.length;
            const totalCount = document.getElementById('draftsTotalCount');
            const totalSentenceCount = document.getElementById('draftsTotalSentenceCount');
            const activeCount = document.getElementById('draftsActiveCount');
            const reviewCount = document.getElementById('draftsReviewCount');
            const completedCount = document.getElementById('draftsCompletedCount');
            const chartTotal = document.getElementById('draftsChartTotal');
            if (totalCount) totalCount.textContent = total;
            if (totalSentenceCount) totalSentenceCount.textContent = total;
            if (activeCount) activeCount.textContent = counts.Active;
            if (reviewCount) reviewCount.textContent = counts['Under Review'];
            if (completedCount) completedCount.textContent = counts.Completed;
            if (chartTotal) chartTotal.textContent = total;
            document.getElementById('draftsChartActive').textContent = counts.Active;
            document.getElementById('draftsChartReview').textContent = counts['Under Review'];
            document.getElementById('draftsChartSaved').textContent = counts.Saved;
            document.getElementById('draftsChartCompleted').textContent = counts.Completed;

            const chart = document.querySelector('.workspace-status-chart');
            const denominator = total || 1;
            chart.style.setProperty('--status-active', `${counts.Active / denominator * 100}%`);
            chart.style.setProperty('--status-review', `${counts['Under Review'] / denominator * 100}%`);
            chart.style.setProperty('--status-saved', `${counts.Saved / denominator * 100}%`);
            chart.style.setProperty('--status-completed', `${counts.Completed / denominator * 100}%`);
        }

        function renderDrafts(drafts) {
            tableBody.replaceChildren();
            const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const category = categoryFilter ? categoryFilter.value : '';
            const visibleDrafts = drafts.filter(function (draft) {
                const status = draft.status || 'Active';
                const matchesFilter = activeFilter === 'All' || status === activeFilter;
                const matchesSearch = `${draft.title} ${draft.category} ${draft.notes || ''}`.toLowerCase().includes(query);
                return matchesFilter && matchesSearch && (!category || draft.category === category);
            });

            if (resultCount) resultCount.textContent = `${visibleDrafts.length} ${visibleDrafts.length === 1 ? 'draft' : 'drafts'}`;
            if (visibleDrafts.length === 0) {
                const row = document.createElement('tr');
                const cell = appendCell(row, 'No drafts found. Try another filter or search.');
                cell.colSpan = 5;
                cell.className = 'explore-empty-state';
                tableBody.appendChild(row);
                return;
            }

            visibleDrafts.forEach(function (draft) {
                const row = document.createElement('tr');
                row.classList.add('explore-data-row');
                const idCell = appendCell(row, `#${draft.id}`);
                idCell.classList.add('draft-id-cell');
                const titleCell = appendCell(row, draft.title);
                titleCell.classList.add('draft-title-cell');
                if (draft.notes) {
                    const note = document.createElement('small');
                    note.className = 'd-block text-muted mt-1';
                    note.textContent = draft.notes;
                    titleCell.appendChild(note);
                }
                const categoryCell = appendCell(row, draft.category);
                categoryCell.classList.add('explore-secondary-cell');
                appendCell(row, draft.updated).classList.add('explore-secondary-cell');
                const statusCell = document.createElement('td');
                const badge = document.createElement('span');
                badge.className = `badge ${statusStyles[draft.status] || statusStyles.Active}`;
                badge.textContent = draft.status || 'Active';
                statusCell.appendChild(badge);
                row.appendChild(statusCell);
                tableBody.appendChild(row);
            });
        }

        try {
            allDrafts = getAllDrafts();
            const categories = Array.from(new Set(allDrafts.map(draft => draft.category))).sort();
            categories.forEach(category => categoryFilter.add(new Option(category, category)));
            updateSummary(allDrafts);
            renderDrafts(allDrafts);
        } catch (error) {
            showFeedback(feedback, `Could not load saved drafts: ${error.message}`, true);
        }

        if (searchInput) searchInput.addEventListener('input', () => renderDrafts(allDrafts));
        if (categoryFilter) categoryFilter.addEventListener('change', () => renderDrafts(allDrafts));
        document.querySelectorAll('[data-draft-filter]').forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.dataset.draftFilter;
                document.querySelectorAll('[data-draft-filter]').forEach(function (filterButton) {
                    const selected = filterButton === button;
                    filterButton.classList.toggle('active', selected);
                    filterButton.setAttribute('aria-pressed', String(selected));
                });
                renderDrafts(allDrafts);
            });
        });

        if (!form) return;
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.reportValidity()) return;

            try {
                const drafts = loadData(storageKeys.drafts, []);
                const ids = defaultDrafts.concat(drafts)
                    .map(draft => Number(String(draft.id).replace(/\D/g, '')))
                    .filter(Number.isFinite);
                const draft = {
                    id: `DRF-${Math.max(100, ...ids) + 1}`,
                    title: document.getElementById('draftTitle').value.trim(),
                    category: document.getElementById('draftCategory').value.trim(),
                    notes: document.getElementById('draftNotes').value.trim(),
                    updated: 'Just now',
                    status: 'Active'
                };
                drafts.push(draft);
                saveData(storageKeys.drafts, drafts);
                allDrafts = getAllDrafts();
                if (categoryFilter && !Array.from(categoryFilter.options).some(option => option.value === draft.category)) {
                    categoryFilter.add(new Option(draft.category, draft.category));
                }
                updateSummary(allDrafts);
                renderDrafts(allDrafts);
                form.reset();
                bootstrap.Modal.getOrCreateInstance(document.getElementById('createDraftModal')).hide();
                showFeedback(feedback, `${draft.title} was added to drafts.`, false);
            } catch (error) {
                showFeedback(feedback, `Could not save this draft: ${error.message}`, true);
            }
        });
    }

    function setupProfile() {
        const form = document.getElementById('profileForm');
        if (!form) return;

        const feedback = document.getElementById('profileFeedback');
        const nameInput = document.getElementById('profileName');
        const emailInput = document.getElementById('profileEmail');
        const roleInput = document.getElementById('profileRole');
        const displayName = document.getElementById('profileDisplayName');
        const displayEmail = document.getElementById('profileDisplayEmail');
        const initials = document.getElementById('profileInitials');

        function updateProfile(profile) {
            nameInput.value = profile.name;
            emailInput.value = profile.email;
            roleInput.value = profile.role;
            displayName.textContent = profile.name;
            displayEmail.textContent = profile.email;
            initials.textContent = profile.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
        }

        try {
            const profile = loadData(storageKeys.profile, null);
            if (profile) updateProfile(profile);
        } catch (error) {
            showFeedback(feedback, `Could not load saved profile: ${error.message}`, true);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const profile = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                role: roleInput.value.trim()
            };

            try {
                saveData(storageKeys.profile, profile);
                updateProfile(profile);
                showFeedback(feedback, 'Profile changes saved.', false);
            } catch (error) {
                showFeedback(feedback, `Could not save profile: ${error.message}`, true);
            }
        });
    }

    function setupSettings() {
        const form = document.getElementById('settingsForm');
        if (!form) return;

        const feedback = document.getElementById('settingsFeedback');
        const limitInput = document.getElementById('dailyLimitRange');
        const limitValue = document.getElementById('dailyLimitValue');
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        const alertCheck = document.getElementById('alertCheck');

        function updateLimitLabel() {
            limitValue.textContent = `${limitInput.value} ${limitInput.value === '1' ? 'Hour' : 'Hours'} per day`;
        }

        function applyTheme(enabled) {
            setTheme(enabled, false);
        }

        limitInput.addEventListener('input', updateLimitLabel);
        darkModeSwitch.addEventListener('change', function () {
            applyTheme(darkModeSwitch.checked);
        });

        try {
            const settings = loadData(storageKeys.settings, null);
            if (settings) {
                limitInput.value = settings.dailyLimit;
                darkModeSwitch.checked = settings.darkMode;
                alertCheck.checked = settings.alerts;
                applyTheme(settings.darkMode);
            }
            updateLimitLabel();
        } catch (error) {
            showFeedback(feedback, `Could not load saved settings: ${error.message}`, true);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const settings = {
                dailyLimit: Number(limitInput.value),
                darkMode: darkModeSwitch.checked,
                alerts: alertCheck.checked
            };

            try {
                saveData(storageKeys.settings, settings);
                showFeedback(feedback, 'Preferences saved on this browser.', false);
            } catch (error) {
                showFeedback(feedback, `Could not save preferences: ${error.message}`, true);
            }
        });
    }

    function setupDashboard() {
        const totalElement = document.getElementById('dashboardTotalTime');
        if (!totalElement) return;

        try {
            const apps = getTrackedApps();
            const drafts = getAllDrafts();
            const totalMinutes = apps.reduce((total, app) => total + app.minutes, 0);
            const mostUsedApp = apps.reduce((mostUsed, app) => app.minutes > mostUsed.minutes ? app : mostUsed, apps[0]);
            const activeDrafts = drafts.filter(draft => draft.status === 'Active').length;
            const settings = loadData(storageKeys.settings, null);

            totalElement.textContent = formatDuration(totalMinutes);
            document.getElementById('dashboardMostUsedApp').textContent = mostUsedApp.name;
            document.getElementById('dashboardMostUsedTime').textContent = formatDuration(mostUsedApp.minutes);
            document.getElementById('dashboardDraftCount').textContent = `${activeDrafts} Drafts`;
            document.getElementById('dashboardDate').textContent = `Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;

            const alert = document.getElementById('dailyLimitAlert');
            if (settings && settings.alerts && totalMinutes >= settings.dailyLimit * 60 * 0.9) {
                alert.textContent = `Screen time is close to or above your ${settings.dailyLimit}-hour daily limit.`;
                alert.classList.remove('d-none');
            }

            const categoryTotals = {};
            apps.forEach(function (app) {
                categoryTotals[app.category] = (categoryTotals[app.category] || 0) + app.minutes;
            });
            const topApps = apps.slice().sort((first, second) => second.minutes - first.minutes).slice(0, 5);

            window.ScreenTimeHub = {
                categories: Object.entries(categoryTotals),
                topApps: topApps,
                totalMinutes: totalMinutes
            };
        } catch (error) {
            const alert = document.getElementById('dailyLimitAlert');
            alert.textContent = `Could not load dashboard data: ${error.message}`;
            alert.classList.remove('d-none');
            alert.classList.add('alert-danger');
        }
    }

    setupDeviceOverview();
    setupApps();
    setupDrafts();
    setupProfile();
    setupSettings();
    setupDashboard();
})();
