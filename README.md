**Read this in other languages: [English](README.md), [中文](README_zh.md).**
# HTML Element to PDF Export Tool
This browser extension allows users to select any HTML element and export it as a PDF document. It's perfect for capturing web content, generating reports, or saving web elements in offline form.  

## Features
+ ✅ Click or drag-and-drop to select elements  
+ ✅ Customizable PDF formatting (page size, margins, orientation)  
+ ✅ Preserves CSS styles and layout  
+ ✅ Supports text, images, and nested elements  
+ ✅ Mobile-responsive PDF layout

## Installation Instructions
### Chrome/Firefox
![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580752674-36aa63dd-defc-45fe-8c53-4ec7629caf7d.png)  
![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580769702-da90708f-e7df-4a7d-a1db-8ed1e342d69e.png)  

Open Chrome/Firefox, enter `chrome://extensions/` in the address bar, and press Enter.  
![](https://camo.githubusercontent.com/edef64b46b190f6deb17bad0802bffe29e6c6c745460b8015aea2833015e87e4/68747470733a2f2f63646e2e6e6c61726b2e636f6d2f79757175652f302f323032352f706e672f33383731313436392f313734313630343533373238302d64643635663937332d376532642d343136302d613133612d3766656437643732386539622e706e67)  

Click "Load unpacked extension" and select the extracted folder.  
![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580999568-248ef78f-153e-402e-84d9-1660330c6cfe.png)  

Installation complete.  
![](https://cdn.nlark.com/yuque/0/2025/png/38711469/1743580875671-f8cd9ca1-55ef-42cf-b3bf-92e6e4a78f78.png)  

### Manual Build
1. Clone the repository:

```bash
git clone https://github.com/benzhz/element2PDF.git  
cd element2PDF  
```

2. Install dependencies:

```bash
pnpm install  
```

3. Build the extension:

```bash
pnpm run build  
```

## User Guide
1. Press `Ctrl+Q` to activate element selection mode.  
2. The content within the red box on the page is the selected element. Click anywhere inside the red box.  
3. A pagination prompt will appear. Choose your options to start exporting the PDF.

![](https://cdn.nlark.com/yuque/0/2025/gif/38711469/1743580353533-7d11d95a-4b8d-4495-a990-3bd28e50c92f.gif)



