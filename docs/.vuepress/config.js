module.exports = {
  title: 'ag-Grid 中文文档',
  description: 'ag-Grid 中文文档',
  base: '/ag-grid-docs-zh/',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    displayAllHeaders: true,
    collapsable: false,
    sidebar: [
      {
        title: 'Vue',
        children: [
          '',
          'Vue',
          'Components',
          'VueMarkUp'
        ]
      }
    ]
  },
  plugins: [
    ['@vuepress/back-to-top', true],
  ],
}