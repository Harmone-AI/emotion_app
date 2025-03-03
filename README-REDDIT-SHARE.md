# Reddit 分享功能使用指南

本指南介绍如何在 Harmone AI 应用中使用 Reddit 分享功能。

## 功能概述

我们已经实现了两种将内容分享到 Reddit 的方式：

1. **简单分享** - 不需要用户登录 Reddit 账号，直接打开 Reddit 提交页面
2. **认证分享** - 用户需要先登录 Reddit 账号，然后可以直接分享到自己的账号

## 配置说明

### 1. Reddit 开发者账号配置

已经在 Reddit 开发者控制台中配置了以下内容：

- **应用名称**: snoo_quest
- **应用类型**: installed app
- **重定向 URI**: myapp://reddit-auth

### 2. 代码配置

主要文件和功能：

- **utils/redditAuth.js** - Reddit 认证和分享功能的核心实现
- **components/RedditAuthButton.js** - Reddit 登录和分享按钮组件
- **screens/quest/Share/index.tsx** - 应用中的分享界面，已添加 Reddit 分享选项
- **assets/images/reddit.svg** - Reddit 图标

## 使用方法

### 方法一：在分享界面使用

当用户完成任务并点击分享按钮时，会显示分享界面，其中包含 Reddit 分享选项。点击 Reddit 图标即可分享到 Reddit。

### 方法二：使用 RedditAuthButton 组件

可以在任何界面中使用 `RedditAuthButton` 组件来实现 Reddit 分享功能：

```jsx
import RedditAuthButton from '@/components/RedditAuthButton';

// 作为登录按钮使用
<RedditAuthButton />

// 作为分享按钮使用
<RedditAuthButton 
  imageUri="https://example.com/image.jpg"
  title="分享标题"
  onShare={(platform) => console.log(`分享到 ${platform} 成功`)}
/>
```

### 方法三：直接调用分享函数

也可以直接调用 `shareImageToReddit` 函数来分享内容：

```javascript
import { shareImageToReddit } from '@/utils/redditAuth';

// 分享图片到 Reddit
shareImageToReddit(
  'https://example.com/image.jpg',
  '分享标题',
  'subreddit名称' // 可选参数，指定要分享到的 subreddit
);
```

## 示例页面

我们提供了一个示例页面 `screens/RedditShareExample.js`，展示了如何捕获屏幕内容并分享到 Reddit。

## 注意事项

1. 分享图片时，图片必须是可公开访问的 URL 或 base64 编码的数据
2. 使用认证分享时，需要用户授予 `identity`, `read`, `submit` 权限
3. 在开发环境中测试时，请确保在 Reddit 开发者控制台中添加了正确的开发环境重定向 URI

## 故障排除

如果分享功能不正常，请检查：

1. Reddit 开发者控制台中的重定向 URI 是否正确配置
2. 应用的 scheme 是否在 app.json 中正确设置为 "myapp"
3. 网络连接是否正常
4. 分享的图片 URL 是否可公开访问
