const nodeExternals = require('webpack-node-externals')

module.exports = {
  siteName: 'CpanelPlugins',
  siteUrl: `https://cpanelplugins.com`,
  titleTemplate: '%s - CpanelPlugins',
  siteDescription: 'Extend your hosting customers experience with custom plugins for cPanel/WHM',

  chainWebpack(config, { isServer }) {
    config.module.rules.delete('svg')
    config.module.rule('svg')
      .test(/\.svg$/)
      .use('vue')
      .loader('vue-loader')
        .end()
      .use('svg-to-vue-component')
      .loader('svg-to-vue-component/loader')

    if (isServer) {
      config.externals(nodeExternals({
        whitelist: [
          /\.css$/,
          /\?vue&type=style/,
          /vue-instantsearch/,
          /instantsearch.js/,
          /typeface-league-spartan/
         ]
      }))
    }
  },

  templates: {
    BlogPost: '/blog/:slug',
    Contributor: '/contributor/:id',
    Plugin: '/plugins/:title',
    Platform: '/plugins/platform/:id',
    Example: node => node.path
  },

  plugins: [
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'G-B65WCZ2NH9'
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        exclude: ['/exclude-me'],
        config: {
          '/plugins/*': {
            changefreq: 'weekly',
            priority: 0.5,
            lastmod: '2020-02-19',
          },
          '/exams/*': {
            changefreq: 'weekly',
            priority: 0.5,
            lastmod: '2022-11-11',
          },
          '/blog/*': {
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: '2020-05-12',
          }
        }
      }
    },
    {
      use: '@gridsome/plugin-critical',
      options: {
        paths: ['/'],
        width: 1300,
        height: 900
      }
    },
    {
      use: '@gridsome/vue-remark',
      options: {
        index: ['README'],
        baseDir: './exams',
        pathPrefix: '/exams',
        typeName: 'DocPage',
        template: './src/templates/DocPage.vue',
        plugins: [
          '@gridsome/remark-prismjs'
        ],
        remark: {
          autolinkHeadings: {
            content: {
              type: 'text',
              value: '#'
            }
          }
        }
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'examples/*.md',
        typeName: 'Example',
        remark: {
          plugins: [
            '@gridsome/remark-prismjs'
          ]
        }
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'BlogPost',
        path: './blog/*/index.md',
        refs: {
          author: 'Contributor'
        },
        remark: {
          plugins: [
            '@gridsome/remark-prismjs'
          ]
        }
      }
    }
  ]
}
