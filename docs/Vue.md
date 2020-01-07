# ag-Grid 和 Vue 入门

## 起步

此文向您展示一些表格基础知识（传递属性，调用 API 等），引导您完成往现有 Vue 项目中添加 ag-Grid，并配置基本功能。此外，表格外观用 Sass 来调整。

## 往项目中添加 ad-Grid

本教程使用 [Vue Cli](https://cli.vuejs.org/) 搭建 Vue 应用. Ag-Grid 及其 Vue wrapper 使用 NPM 分发，可与任何常见的 Vue 项目模块一同使用。按照 [Vue Cli 的说明](https://cli.vuejs.org/)，在终端运行以下命令：

```bash
npm install -g @vue/cli
vue create my-project
```

选择 "Manually select features":

![手选功能](https://www.ag-grid.com/vuejs-grid/cli-step1.png)

接下来，选择 **Babel** 和 **CSS** 预处理器（此处取消了 **Linter** ）：

![选择功能](https://www.ag-grid.com/vuejs-grid/cli-step2.png)

接下来，选择 **SASS** / **SCSS** 作为 CSS 预处理器：

![选择预处理器](https://www.ag-grid.com/vuejs-grid/cli-step3.png)

最后，选择何处存放配置数据，此处选择第一项：

![存放配置数据](https://www.ag-grid.com/vuejs-grid/cli-step4.png)

此时项目尚不能运行：

```bash
cd my-project
npm run serve
```

上面操作完成，则可用 `npm run serve` 启动项目，并在 `localhost:8080` 打开默认应用程序。

下一步，添加 **ag-Grid** NPM 包。在 **my project** 文件夹下运行以下命令：

```bash
npm install --save ag-grid-community ag-grid-vue vue-property-decorator
```

等待安装完成后，导入 **ag-Grid** 样式到 `src/App.vue`：

```vue
<style lang="scss">
@import '../node_modules/ag-grid-community/dist/styles/ag-grid.css';
@import '../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
</style>
```

上面代码导入了表格“结构“样式表(`ag-grid.css`)和一个表格主题(`ag-theme-balham.css`)。Ag-grid 提供了多种不同的表格主题，可自行选择。

::: tip 提示
下一节，将介绍如何自定义主题，推荐使用 `SCSS` 定制。
:::

此示例颇简单，因而可以删除目录 `src/components`，直接在 `src/App.vue` 中展示。

将组件代码添加到 `template` 中，替换 `src/App.vue` 中相关代码：

```vue
<template>
  <ag-grid-vue
    style="width: 500px; height: 500px;"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
  >
  </ag-grid-vue>
</template>
```

下一步， 声明表格基础配置。编辑 `src/App.vue`:

```vue
<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Make', field: 'make' },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price' }
    ]

    this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 }
    ]
  }
}
</script>
```

上面代码展示了表格的两个基本配置属性-列定义（`columnDefs`）和数据（`rowData`）。 此例中，有列定义三列，并指定每列的表头和数据字段。

如此定义的 **ag-grid** 组件，绑定两个属性 - `rowData` 和 `columnDefs`。 此外组件还接受标准的 DOM 样式和类。 设置类 `ag-theme-balham`，用以定义表格主题。 您或已注意到，CSS 类与之前导入的 CSS 文件名相同。

`Ag-Grid` 功能由导入的 `ag-grid-vue` 组件提供。

若一切正常，将会看到如下表格：

![表格](https://www.ag-grid.com/getting-started/step1.png)

## 排序和过滤

若想知道哪辆车贵哪辆车便宜，就需用到排序了。在 **ag-Grid** 中实现排序非常简单，只需在列定义中添加 `sortable` 属性即可。

```js
this.columnDefs = [
  { headerName: 'Make', field: 'make', sortable: true },
  { headerName: 'Model', field: 'model', sortable: true },
  { headerName: 'Price', field: 'price', sortable: true }
]
```

添加属性后，排序表格只需单击表头，便可切换升序，降序和无序。

在此例中仅有数行数据，因而查找数据相当容易。但世间程序大都有成千上万行数据，这就需要用到过滤了。

与排序一样，启用过滤只需添加 `filter` 属性：

```js
this.columnDefs = [
  { headerName: 'Make', field: 'make', sortable: true, filter: true },
  { headerName: 'Model', field: 'model', sortable: true, filter: true },
  { headerName: 'Price', field: 'price', sortable: true, filter: true }
]
```

设置此属性后，将鼠标悬停在表头上，会出现一个小的列菜单图标。单击显示过滤弹窗，可在其中选择过滤条件。

![过滤器](https://www.ag-grid.com/getting-started/step2.png)

## 获取远程数据

用 JavaScript 写死数据显然不妥。其实多数情况数据存在服务器上。 多亏有 **React**，让这些数据处理起来异常简单。请注意，实际获取数据是在表格组件外部执行的-此处使用 HTML5 的 `fetch` 接口。

现在，删除写死的数据，然后从远程服务器中获取。 编辑 `src / App.vue` 并添加以下 `fetch` 语句：

```js {8,9,10}
beforeMount() {
    this.columnDefs = [
        {headerName: 'Make', field: 'make'},
        {headerName: 'Model', field: 'model'},
        {headerName: 'Price', field: 'price'}
    ];

    fetch('https://api.myjson.com/bins/15psn9')
        .then(result => result.json())
        .then(rowData => this.rowData = rowData);
}
```

获取的远程数据与最初写死的相同，因此表格没变化。但若打开开发者工具，可看到一个额外的 HTTP 请求。

## 启用选择框

```vue {7,28}
<template>
  <ag-grid-vue
    style="width: 500px; height: 500px;"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
    rowSelection="multiple"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Make', field: 'make', checkboxSelection: true },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price' }
    ]

    fetch('https://api.myjson.com/bins/15psn9')
      .then((result) => result.json())
      .then((rowData) => (this.rowData = rowData))
  }
}
</script>

<style></style>
```

使用 `checkboxSelection：true` 向 `make` 列添加复选框，使用 `rowSelection = "multiple"` 启用[多选]()。

目前，首列含有复选框，单击复选框可以选择该行。若要将所选数据发送到服务器，则需要添加一个按钮。可以使用 [ag-Grid API]() - 此处在 `gridReady` 事件中存储表格和列 API 的引用：

```vue {3,11}
<template>
  <div>
    <button @click="getSelectedRows()">Get Selected Rows</button>

    <ag-grid-vue
      style="width: 500px; height: 500px;"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="rowData"
      rowSelection="multiple"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null
    }
  },
  components: {
    AgGridVue
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => node.make + ' ' + node.model)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
    }
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Make', field: 'make', checkboxSelection: true },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price' }
    ]

    fetch('https://api.myjson.com/bins/15psn9')
      .then((result) => result.json())
      .then((rowData) => (this.rowData = rowData))
  }
}
</script>

<style></style>
```

## 分组

::: warning 注意
分组是 **ag-Grid** 企业版独有功能。您可以免费试用 **ag-Grid** 企业版。 如果您要在实际开发中使用 **ag-Grid** 企业版，则需取得授权。
:::

除过滤和排序外，分组是用户理清大量数据的另一种有效方法。在上述例子中，数据并不多。此处使用稍大的数据集：

```git
beforeMount() {
    this.columnDefs = [
        {headerName: 'Make', field: 'make', checkboxSelection: true},
        {headerName: 'Model', field: 'model'},
        {headerName: 'Price', field: 'price'}
    ];

-    fetch('https://api.myjson.com/bins/15psn9')
-        .then(result => result.json())
-        .then(rowData => this.rowData = rowData);
+    fetch('https://api.myjson.com/bins/ly7d1')
+        .then(result => result.json())
+        .then(rowData => this.rowData = rowData);
}
```

然后，启用 **ag-grid** 的企业功能。安装依赖包：

```bash
npm install --save ag-grid-enterprise
```

在 `src/main.js` 中引入包：

```git
import Vue from 'vue'

+import 'ag-grid-enterprise';

import App from './App'
```

若操作无误，则可在控制台中看到一条消息，告诉您没有企业许可证密钥。您可以在试用过程中忽略此消息。此外，还微调了表格界面，可以自定义上下文菜单和更高级的列菜单弹出，如下：

![高级功能](https://www.ag-grid.com/getting-started/step3.png)

现在，可以启用分组了！ 添加 `autoGroupColumnDef` 属性，绑定到该属性，并使用 `rowGroup` 更新 `columnDefs`：

```vue {27,49,54-61}
<template>
  <div>
    <button @click="getSelectedRows()">Get Selected Rows</button>
    <ag-grid-vue
      style="width: 500px; height: 500px;"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="rowData"
      rowSelection="multiple"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue'

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null,
      gridApi: null,
      columnApi: null,
      autoGroupColumnDef: null
    }
  },
  components: {
    AgGridVue
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      const selectedData = selectedNodes.map((node) => node.data)
      const selectedDataStringPresentation = selectedData
        .map((node) => node.make + ' ' + node.model)
        .join(', ')
      alert(`Selected nodes: ${selectedDataStringPresentation}`)
    }
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Make', field: 'make', rowGroup: true },
      { headerName: 'Model', field: 'model' },
      { headerName: 'Price', field: 'price' }
    ]

    this.autoGroupColumnDef = {
      headerName: 'Model',
      field: 'model',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    }

    fetch('https://api.myjson.com/bins/15psn9')
      .then((result) => result.json())
      .then((rowData) => (this.rowData = rowData))
  }
}
</script>

<style></style>
```

如上操作后，可以看到表格将数据按照 `make` 分组，同时展开时的 `model` 字段值。
当然，分组也可以与复选框同时使用，添加 `groupSelectsChildren` 属性即可实现组级别的复选框，选择/取消选择该组中的所有项目。

::: tip 提示
分组功能非常强大，交互方案众多且复杂。但是完全不用担心无从下手，在分组文档可以看到许多示例，可以针对练习。
:::

## 自定义主题

在文章的最后，介绍如何通过修改一些 Sass 变量来改变表格外观

`Ag-Grid` 附带了一组预先构建的[主题样式表]()。若需调整颜色和字体，则可在项目中添加一个 Sass 预处理程序，覆盖主题变量值，并引用 ag-grid Sass 文件。

Vue cli 为我们做了很多事情，包括为 Sass 提供支持。切换到自带 ag-Grid SCSS 文件，将 `src/App.vue` 中的样式块替换为：

```vue
<style lang="scss">
@import '../node_modules/ag-grid-community/src/styles/ag-grid.scss';
@import '../node_modules/ag-grid-community/src/styles/ag-theme-balham/sass/ag-theme-balham.scss';
</style>
```

如果操作正确，表格的第二行将变得稍暗。恭喜！现在您已经知道可以随意调整网格外观了-还有几十个 Sass 变量，可用于控制字体系列和大小，边框颜色，标题背景颜色，甚至单元格和列中的间距。完整的 [Sass 变量列表]()可在主题文档部分中找到。

## 总结

通过本教程，实现了众多功能。从三行/列的设置开始，有了一个表格，且支持排序，过滤，获取远程数据，选择甚至分组！同时，学习了如何配置网表格，如何访问 API 以及如何更改组件的样式。