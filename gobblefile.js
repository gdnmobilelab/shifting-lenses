const gobble = require('gobble');

const rollup = {
    'buble': '',
    'node-resolve': '',
    'replace': '',
    'commonjs': '',
    'inject': '',
    'resolve-aliases': '',
    'json': ''
};

Object.keys(rollup).map((name) => {
    rollup[name] = require(`rollup-plugin-${name}`);
})

const rollupPlugins = [
    rollup.replace({
        values: {
            'process.env.NODE_ENV': JSON.stringify(gobble.env()),
            '__CONFIG__ENV': gobble.env(),
            '\/\/DEVTOOLSINSERT': "import 'inferno-devtools';"
        }
    }),
    rollup.json(),
    rollup.buble({
        jsx: 'createElement'
    }),
    rollup['node-resolve']({
        jsnext: true,
        preferBuiltins: false,
        browser: true
    }),
    
    rollup.commonjs({
        include: [
            'node_modules/**'
        ],
        namedExports: {
            'node_modules/inferno-router/inferno-router.js': [
                'Route',
                'IndexRoute',
                'Redirect',
                'IndexRedirect',
                'Router',
                'RouterContext',
                'Link',
                'IndexLink',
                'match'
            ],
            'node_modules/inferno-render-to-string/inferno-render-to-string.js': [
                'renderToString'
            ],
            'node_modules/inferno/inferno.js': [
                'EMPTY_OBJ'
            ]
        }
    }),
    rollup.inject({
        include: 'src/**',
        modules: {
            createElement: ['inferno-create-element', 'default']
        }
    }),
    // require('rollup-plugin-uglify')()
]

let tasks = gobble([
    gobble('src/static'),
    gobble('src/js')
        .transform('rollup', {
            entry: 'client/client.js',
            plugins: rollupPlugins,
            sourceMap: true,
            sourceMapFile: 'client.js.map'
        })
        .transform("flatten"),
    gobble('src/js')
        .transform('rollup', {
            entry: 'sw/sw.js',
            plugins: rollupPlugins,
            sourceMap: true,
            sourceMapFile: 'client.js.map'
        })
        .transform("flatten"),
    gobble('src/scss')
        .transform('sass', {
            src: 'styles.scss',
            dest: 'styles.css'
        })
        .transform('postcss', {
            src: 'styles.css',
            plugins: [
                require('autoprefixer')({ browsers: [ 'last 2 versions' ] })
            ],
            dest: 'styles.css',
            map: {
                inline: false
            }
        }),
        
])

if (gobble.env() === "development") {
    tasks = tasks.moveTo("inauguration")
}

module.exports = tasks;