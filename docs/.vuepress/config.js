const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Notes of Tan',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'tangentyh/notes-of-tan',
    editLinks: false,
    docsDir: 'docs',
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'See This Page On GitHub',
    lastUpdated: true,
    nav: [
      {
        text: 'Java',
        link: '/backend/java/javaBasics',
      },
      // {
      //   text: 'VuePress',
      //   link: 'https://v1.vuepress.vuejs.org'
      // }
    ],
    displayAllHeaders: true, // Default: false
    activeHeaderLinks: false, // Default: true
    sidebar: {
      '/backend/java/': [
        {
          title: 'Java',
          collapsable: false, // optional, defaults to true
          sidebarDepth: 6,    // optional, defaults to 1
          children: [
            // '',
            'javaBasics',
            'javaConcurrency',
            'javaIO',
            'javaMisc',
            'javaUtils',
            'JVM',
          ]
        },
      ],
      '/src/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            'using-vue',
          ]
        },
        {
          title: 'Group 1',   // required
          path: '/foo/',      // optional, link of the title, which should be an absolute path and must exist
          collapsable: false, // optional, defaults to true
          sidebarDepth: 1,    // optional, defaults to 1
          children: [
            '/'
          ]
        },
        {
          title: 'Group 2',
          children: [ /* ... */ ],
          initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
        }
      ],
      '/': 'auto',
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'vuepress-plugin-mathjax',
  ]
}
