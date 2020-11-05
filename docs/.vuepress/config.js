const { description, repository } = require('../../package')

module.exports = {
  base: repository.slice(repository.lastIndexOf('/')) + '/',
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
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: 'https://v1.vuepress.vuejs.org/hero.png' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: repository,
    editLinks: false,
    docsDir: 'docs',
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Edit This Page On GitHub',
    lastUpdated: true,
    nav: [
      {
        text: 'Java',
        items: [
          { text: 'Java Basics', link: '/backend/java/javaBasics' },
          { text: 'Java Utilities', link: '/backend/java/javaUtils' },
          { text: 'Java Concurrency', link: '/backend/java/javaConcurrency' },
          { text: 'Java IO', link: '/backend/java/javaIO' },
          { text: 'Java Miscellanea', link: '/backend/java/javaMisc' },
          { text: 'Java Virtual Machine', link: '/backend/java/JVM' },
        ]
      },
      {
        text: 'Backend',
        items: [
          { text: 'Spring', link: '/backend/SpringNotes' },
          { text: 'OS', link: '/backend/OS-Notes' },
          { text: 'Database', link: '/backend/database' },
          { text: 'SQL', link: '/backend/SQL_notes' },
          { text: 'Distributed System', link: '/backend/distributed' },
          { text: 'Redis', link: '/backend/redis-notes' },
        ]
      },
      {
        text: 'Frontend',
        items: [
          { text: 'CSS', link: '/CSS-notes' },
          { text: 'HTML', link: '/html-notes' },
          { text: 'JS, TS', link: '/todo/jsNotes' },
          { text: 'BOM, DOM, Web API', link: '/BOM_DOM_notes' },
          { text: 'React', link: '/todo/react_notes' },
        ]
      },
      {
        text: 'Other',
        items: [
          { text: 'Algorithm', link: '/algo_notes' },
          { text: 'Git', link: '/git_notes' },
          { text: 'Design Pattern', link: 'DesignPatternNotes' },
          { text: 'HTTP', link: 'HTTP' },
          { text: 'MacOS', link: 'mac-notes' },
        ]
      },
      // {
      //   text: 'VuePress',
      //   link: 'https://v1.vuepress.vuejs.org'
      // }
    ],
    // displayAllHeaders: true, // Default: false
    // activeHeaderLinks: false, // Default: true
    sidebarDepth: 5,    // optional, defaults to 1
    sidebar: {
      '/backend/java/': [
        {
          title: 'Java',
          collapsable: false, // optional, defaults to true
          children: [
            // '',
            'javaBasics',
            'javaUtils',
            'javaConcurrency',
            'javaIO',
            'javaMisc',
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
    '@maginapp/vuepress-plugin-katex',
  ],
  markdown: {
    extractHeaders: [ 'h2', 'h3', 'h4', 'h5', 'h6' ],
    slugify: (str) => {
      // eslint-disable-next-line no-control-regex
      const rControl = /[\u0000-\u001f]/g
      const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’–—<>,.?/]+/g
      const rCombining = /[\u0300-\u036F]/g
      // Split accented characters into components
      return str.normalize('NFKD')
        // Remove accents
        .replace(rCombining, '')
        // Remove control characters
        .replace(rControl, '')
        // Replace special characters
        .replace(rSpecial, '-')
        // Remove continuous separators
        .replace(/\-{2,}/g, '-')
        // Remove prefixing and trailing separators
        .replace(/^\-+|\-+$/g, '')
        // ensure it doesn't start with a number (#121)
        .replace(/^(\d)/, '_$1')
        // lowercase
        // .toLowerCase()
    },
  },
  evergreen: true,
}
