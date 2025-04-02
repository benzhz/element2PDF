**Read this in other languages: [English](README.md), [中文](README_zh.md).**
# HTML 元素转 PDF 导出工具
这是一款浏览器扩展程序，能让用户选取任意 HTML 元素并将其导出为 PDF 文档。无论是抓取网页内容、生成报告，还是将网页元素保存为离线形式，它都能完美胜任。

## 功能特性
+ ✅ 可通过点击或拖放操作选取元素
+ ✅ 支持自定义 PDF 格式（页面大小、页边距、方向）
+ ✅ 保留 CSS 样式和布局
+ ✅ 支持文本、图片及嵌套元素
+ ✅ 生成的 PDF 具备移动响应式布局

## 安装方法
### Chrome/Firefox
![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580752674-36aa63dd-defc-45fe-8c53-4ec7629caf7d.png)

![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580769702-da90708f-e7df-4a7d-a1db-8ed1e342d69e.png)

<font style="color:rgba(0, 0, 0, 0.85);">打开 Chrome 浏览器，地址栏输入</font>`chrome://extensions/`<font style="color:rgba(0, 0, 0, 0.85);">并回车</font>  
![](https://camo.githubusercontent.com/edef64b46b190f6deb17bad0802bffe29e6c6c745460b8015aea2833015e87e4/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032352f706e672f33383731313436392f313734313630343533373238302d64643635663937332d376532642d343136302d613133612d3766656437643732386539622e706e67)

点击「加载已解压的扩展程序」，选择解压后的扩展程序文件夹

![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580999568-248ef78f-153e-402e-84d9-1660330c6cfe.png)

<font style="color:rgba(0, 0, 0, 0.85);">安装完成</font><font style="color:rgb(31, 35, 40);"></font>  
 ![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580875671-f8cd9ca1-55ef-42cf-b3bf-92e6e4a78f78.png)

### 手动构建
1. 克隆仓库：

```bash
git https://github.com/benzhz/element2PDF.git
cd element2PDF
```

2. 安装依赖：

```bash
pnpm install
```

3. 构建扩展程序：

```bash
pnpm run build
```

## 使用指南
1.快捷键ctrl+q，打开元素选择模式；

2.页面红框范围内容，即为选择元素，点击红框内容任意位置；

3.弹出是否分页弹窗，选择选项，开始导出pdf；



![](https://cdn.nlark.com/yuque/0/2025/gif/38711469/1743580353533-7d11d95a-4b8d-4495-a990-3bd28e50c92f.gif)






