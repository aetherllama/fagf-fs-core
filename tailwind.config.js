module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                success: {
                    DEFAULT: '#10b981',
                    soft: '#ecfdf5',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    soft: '#fffbeb',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    soft: '#fef2f2',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'mesh-gradient': 'radial-gradient(at 0% 0%, hsla(217,100%,50%,0.05) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(210,100%,50%,0.05) 0, transparent 50%)',
            }
        },
    },
    plugins: [],
}
