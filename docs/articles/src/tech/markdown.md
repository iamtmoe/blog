---
date: 1970-01-01
tags: 
  - markdown
---

# markdown

## 背景

markdown是一种很流行的标记语言，用来写博客有以下好处

- 可以直接在`github`预览
- 可以用各种工具生成静态站点，比如`hexo`, `vuepress`, `mkdoc`
- 各大写作平台支持，比如掘金，简书
- 预览直接复制粘贴到微信公众号，或者经过第三方工具转换，比如[wechat-format](https://github.com/lyricat/wechat-format)

推荐一个markdown学习网站: <https://www.markdownguide.org/>

## 基础语法

1. \_斜体\_  
_斜体_
2. \*\*加粗\*\*  
**加粗**
3. \*\*\_斜体加粗\_\*\*  
**_斜体加粗_**
4. \# 一到六级标题，\#号数量决定，\#号后要跟空格
    # 一级标题
    ## 六级标题

5. `[链接](链接url)`
[链接](链接url)
6. `![图片描述](https://octodex.github.com/images/bannekat.png)`
![图片描述](https://octodex.github.com/images/bannekat.png)
7. \> 引用  
    > 引用
8. \* 列表item1  
\* 列表item2
    * 列表item1
    * 列表item2
9. 段落间换行，行末加两个空格再回车

当然还有没列举到的，后续再补充

## 扩展语法

> The basic syntax outlined in John Gruber’s original design document added many of the elements needed on a day-to-day basis, but it wasn’t enough for some people. That’s where extended syntax comes in.
>
> Several individuals and organizations took it upon themselves to extend the basic syntax by adding additional elements like tables, code blocks, syntax highlighting, URL auto-linking, and footnotes. These elements can be enabled by using a lightweight markup language that builds upon the basic Markdown syntax, or by adding an extension to a compatible Markdown processor.

1. 表格

    ```md
    |h1|h2|
    |-|-|
    |c1|c2|
    ```

    |h1|h2|
    |-|-|
    |c1|c2|
2. 代码块

    ```md
        ```js
        function(){}
        ```
    ```

    ```js
    function(){}
    ```

3. \~\~删除线~\~  
~~删除线~~
4. 脚注

    ```md
    后面跟着一个脚注[^1]

    放置在非列表，代码块，表格内等其他元素内的任意位置
    [^1]: 这个是那个脚注的内容
    ```

    后面跟着一个脚注[^1]
5. checklist

    ```md
    - [x] task1
    - [ ] task2
    - [ ] task3
    ```

    - [x] task1
    - [ ] task2
    - [ ] task3
6. :emoji:, emoji替换为表情码，比如joy -> :joy:

当然还有没列举到的，后续再补充

## vscode markdown 配置

- 安装`markdownlint`插件
- 安装`markdown preview enhance`插件，安装好后`cmd + shift + v`就可以预览了，可以看到vscode自带的预览时不支持的emoji和checklist都显示出来了
- 自定义预览样式
 vscode cmd + shift + p -> open user settings -> 搜索markdown -> markdown: styles里add item添加本地css文件路径就可以定制vscode markdown预览的样式

[^1]: 这个是那个脚注的内容