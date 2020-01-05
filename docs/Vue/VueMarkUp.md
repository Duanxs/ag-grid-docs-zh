# Vue 标记

表格列定义可以添加自定义属性。

网格一般如此声明：

```
<ag-grid-vue
        class="ag-theme-balham"
        style="width: 700px; height: 400px;"
        :rowData="rowData"
        ...rest of definition
```

然后可在此组件内部声明列定义：

```vue
<ag-grid-vue
    ...rest of definition
>
    <ag-grid-column headerName="IT Skills">
        <ag-grid-column field="skills" :width="120" suppressSorting
                        cellRendererFramework="SkillsCellRenderer"
                        :menuTabs="['filterMenuTab']">
        </ag-grid-column>
        <ag-grid-column field="proficiency" :width="135"
                        cellRendererFramework="ProficiencyCellRenderer"
                        :menuTabs="['filterMenuTab']"">
        </ag-grid-column>
    </ag-grid-column>
</ag-grid-vue>
```

在此示例中，定义一列，名为 `IT Skills`，其有子列两个, 名为`Skills`、 `Proficiency`。

不需要绑定字符串值以外的任何东西（即 `:width = "120"` ），因为Vue默认提供字符串形式的值。

完整示例参见 [Vue Playground Repo]() 