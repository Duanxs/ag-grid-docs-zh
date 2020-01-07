module.exports = {
  title: 'ag-Grid 中文文档',
  description: 'ag-Grid 中文文档',
  // base: '/Vue/',
  markdown: {
    lineNumbers: true
  },
  theme: '@vuepress/vue',
  themeConfig: {
    displayAllHeaders: true,
    collapsable: false,
    sidebar: {
      '/': [{
        title: 'Vue',
        redirect: '/Vue/',
        children: [
          '/Vue/',
          '/Vue/Components',
          '/Vue/VueMarkUp',
        ]
      }
      ]
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
  ],
}