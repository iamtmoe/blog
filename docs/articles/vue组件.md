---
date: 1970-01-01
tags: 
  - vue
---

# vue组件

## vue生命周期

![vue生命周期图](../assets/vue-lifecycle.png)

1. 初始化event&lifecycle
2. callhook('beforeCreate')
3. 处理injection
4. 处理props
5. 处理methods
6. 处理data
7. 处理computed
8. 处理watch
9. 处理provide
10. callhook('created')
11. 选项里没有el，需调用$mount触发器渲染;选项里有el： 没有template, 将el的outerHTML作为template编译为render函数，有template,将template编译为render函数
12. callhook('beforeMount')
13. 执行render函数生成vnode并替换el
14. callhook('mounted')
15. 数据响应， callhook('beforeUpdate'), 重新执行render函数，diff, patch， callhook('updated')
16. 当$destoy调用, callhook('beforeDestroy'), 销毁watcher、event listener、child components, callhook('destroyed')

### props

1. 对象写法：type,default,validator
2. 指定是否继承html特性：`inheritAttrs: false`
3. 单向数据流

### slot

1. 具名插槽
2. 默认值

### event

1. $on $emit
2. 监听原生事件：`.native`

### 通信

1. $refs
2. $parent、$children
3. provide inject
    > provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。
4. dispatch broadcast

    ```js
    dispatch(componentName, eventName, params) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;

            if (parent) {
                name = parent.$options.name;
            }
        }
        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
        }
    },
    broadcast(componentName, eventName, params) {
      this.$children.forEach(child => {
        const name = child.$options.name;

        if (name === componentName) {
          child.$emit.apply(child, [eventName].concat(params));
        } else {
          broadcast.apply(child, [componentName, eventName].concat([params]));
        }
      });
    }
    ```
