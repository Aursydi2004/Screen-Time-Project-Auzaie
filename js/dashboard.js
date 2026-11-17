(function () {
    const chartContainers = document.querySelectorAll('.chart-container');
    if (!chartContainers.length) return;

    if (!window.ScreenTimeHub) {
        chartContainers.forEach((chart) => {
            chart.textContent = 'Sign in to load your screen-time activity.';
        });
        return;
    }

    const chartColors = ['#63a7ff', '#36c9a0', '#f4bd50', '#f17b79'];
    const chartText = '#d6e2ef';
    const chartGrid = 'rgba(214, 226, 239, 0.12)';
    const sharedChartOptions = {
        chart: {
            height: 300,
            background: 'transparent',
            foreColor: chartText,
            toolbar: { show: false },
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        dataLabels: { enabled: false },
        grid: { borderColor: chartGrid, strokeDashArray: 4 },
        legend: { labels: { colors: chartText } },
        tooltip: { theme: 'dark' },
        xaxis: { labels: { style: { colors: chartText } } },
        yaxis: { labels: { style: { colors: chartText } } }
    };

    const chartOptions = [
        {
            selector: '#screenTimeChart',
            options: {
                chart: { type: 'donut' },
                series: window.ScreenTimeHub.categories.map((category) => category[1]),
                labels: window.ScreenTimeHub.categories.map((category) => category[0]),
                colors: window.ScreenTimeHub.categories.map((category, index) => chartColors[index % chartColors.length]),
                stroke: { colors: ['#18324b'] },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '66%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Total minutes',
                                    color: chartText,
                                    formatter: (value) => Math.round(value.globals.seriesTotals.reduce((sum, total) => sum + total, 0))
                                }
                            }
                        }
                    }
                },
                legend: { position: 'bottom', labels: { colors: chartText } }
            }
        },
        {
            selector: '#dailyUsageChart',
            options: {
                chart: { type: 'area' },
                series: [{ name: 'Minutes', data: [8, 22, 15, 38, 27, 45, 31, 24] }],
                colors: [chartColors[0]],
                stroke: { curve: 'smooth', width: 3 },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.04 } },
                markers: { size: 4, colors: [chartColors[0]], strokeColors: '#18324b' },
                xaxis: { categories: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'] },
                yaxis: { title: { text: 'Minutes' }, min: 0 }
            }
        },
        {
            selector: '#appUsageChart',
            options: {
                chart: { type: 'bar' },
                series: [{ name: 'Minutes', data: window.ScreenTimeHub.topApps.map((app) => app.minutes) }],
                colors: [chartColors[1]],
                plotOptions: { bar: { borderRadius: 5, horizontal: true, barHeight: '55%' } },
                xaxis: {
                    categories: window.ScreenTimeHub.topApps.map((app) => app.name),
                    title: { text: 'Minutes' },
                    min: 0
                },
                yaxis: { labels: { style: { colors: chartText } } }
            }
        },
        {
            selector: '#weeklyUsageChart',
            options: {
                chart: { type: 'bar' },
                series: [{ name: 'Hours', data: [3.8, 4.2, 3.5, 5.1, 4.6, 5.4, 4.6] }],
                colors: [chartColors[2]],
                plotOptions: { bar: { borderRadius: 5, columnWidth: '48%' } },
                xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                yaxis: { title: { text: 'Hours' }, min: 0, max: 6 }
            }
        }
    ];

    function renderChart(selector, options) {
        const element = document.querySelector(selector);
        if (!element) return;
        if (typeof ApexCharts === 'undefined') {
            element.textContent = 'Charts could not be loaded. Check your internet connection and refresh.';
            return;
        }

        const chart = new ApexCharts(element, {
            ...sharedChartOptions,
            ...options,
            chart: { ...sharedChartOptions.chart, ...options.chart }
        });
        chart.render();
    }

    function renderVisibleCharts() {
        chartOptions.forEach(({ selector, options }) => {
            const element = document.querySelector(selector);
            if (element && element.dataset.chartReady !== 'true') {
                element.dataset.chartReady = 'true';
                renderChart(selector, options);
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
                const config = chartOptions.find(({ selector }) => entry.target.matches(selector));
                if (config) renderChart(config.selector, config.options);
                entry.target.dataset.chartReady = 'true';
                currentObserver.unobserve(entry.target);
            });
        }, { rootMargin: '200px' });

        chartContainers.forEach((element) => observer.observe(element));
    } else {
        renderVisibleCharts();
    }
})();
