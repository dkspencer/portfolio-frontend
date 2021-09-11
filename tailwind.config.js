module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
    ],
    theme: {
        fontFamily: {
            'sans': ['Courier New', 'monospace'],
            'serif': ['Courier New', 'monospace'],
            'mono': ['Courier New', 'monospace']
        },
        extend: {
            colors: {
                bg: '#3c3836',
                fg: '#deb15a',
                white: '#fafafa'
            },
            fontSize: {
                'xxs': '.50rem'
            }
        },
    },
    variants: {},
    plugins: [],
}