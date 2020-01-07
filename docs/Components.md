# Vue 组件

VueJS 组件可以定义为简单的内联组件，也可以定义为完整/复杂的外部组件（即在单独的文件中）。

### 简单的内联组件

```js
components: {
    'CubeComponent': {
        template: '<span>{{ valueCubed() }}</span>',
        methods: {
            valueCubed() {
                return this.params.value * this.params.value * this.params.value;
            }
        }
    },
    ParamsComponent: {
        template: '<span>Field: {{params.colDef.field}}, Value: {{params.value}}</span>',
        methods: {
            valueCubed() {
                return this.params.value * this.params.value * this.params.value;
            }
        }
    }
}
```

此处组件名的引号是可选的，但请注意，为了在列定义中引用这些组件，组件名需为区分大小写的字符串。

### 简单的本地声明组件

```js
let SquareComponent = {
  template: '<span>{{ valueSquared() }}</span>',
  methods: {
    valueSquared() {
      return this.params.value * this.params.value
    }
  }
}
```

### 外部 .js 组件

```js
// SquareComponent.js
export default {
  template: '<span>{{ valueSquared() }}</span>',
  methods: {
    valueSquared() {
      return this.params.value * this.params.value
    }
  }
}

// MyGridApp.vue (your Component holding the ag-Grid component)
import SquareComponent from './SquareComponent'
```

### 更复杂的外部单文件组件（.vue）

```vue
<template>
  <span class="currency">{{ params.value | currency('EUR') }}</span>
</template>

<script>
export default {
  filters: {
    currency(value, symbol) {
      let result = value
      if (!isNaN(value)) {
        result = value.toFixed(2)
      }
      return symbol ? symbol + result : result
    }
  }
}
</script>

<style scoped>
.currency {
  color: blue;
}
</style>
```

对于非内联组件，需要在 `components` 中定义：

```js
components: {
  AgGridVue, SquareComponent
}
```

通常，组件名称将与实际的引用一样，但可通过以下方式自定义名称：

```js {3}
components: {
    AgGridVue,
    'MySquareComponent': SquareComponent
}
```

## 为 ag-Grid 提供 VueJS 组件

组件定义后，可在列定义中引用。

要在表格内使用组件，可通过区分大小写的名称引用组件，例如：

```js {5,13}
// defined as a quoted string above: 'CubeComponent'
{
  headerName: "Cube",
  field: "value",
  cellRendererFramework: 'CubeComponent',
  colId: "cube",
  width: 125
},
// defined as a value above: ParamsComponent
{
  headerName: "Row Params",
  field: "row",
  cellRendererFramework: 'ParamsComponent',
  colId: "params",
  width: 245
},
```

若要在 ag-Grid 中配置和使用 VueJS 组件，请参阅[单元格渲染器]()，[单元格编辑器]()和[过滤器]()。

## 父子间的通信

在 Vue 中可以使用多种方法来管理组件通信（共享服务，局部变量等），但通常需要一种简单的方法，让“父”组件知道“子”组件上发生了某些事情。在这种情况下，最简单的方法是使用 `gridOptions.context` 保留对父级的引用，然后子级可以访问该引用。

```js
// in the parent component - the component that hosts ag-grid-angular and specifies which angular components to use in the grid
beforeMount() {
    this.gridOptions = {
    context: {
    componentParent: this
    }
  };
  this.createRowData();
  this.createColumnDefs();
},

// in the child component - the Vue components created dynamically in the grid
// the parent component can then be accessed as follows:
this.params.context.componentParent
```

请注意，此处的 `componentParent` 可以自定义 - 重点是您可以使用**上下文**机制在组件之间共享信息。