const browser = process.env.BROWSER || 'chromium';

export default {
    default: {
        paths: ['features/**/*.feature'],
        import: [
            'features/hooks/*.js',
            'features/step_defininitions/**/*.js',
        ],
        format: [
            'progress-bar',
            `html:reports/html/report-${browser}.html`,   // ← HTML report
            `json:reports/json/report-${browser}.json`,   // ← JSON (needed for Allure)
            'allure-cucumberjs/reporter',                 // ← Allure formatter
        ],
        formatOptions: {
            resultsDir: 'reports/allure-results',         // ← where raw results go
        },
        publishQuiet: true
    }
};