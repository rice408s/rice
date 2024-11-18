# Vercel 项目部署指南

## 准备工作

1. 首先确保你有一个 [GitHub](https://github.com) 账号
2. 注册 [Vercel](https://vercel.com) 账号（可以直接使用 GitHub 账号登录）

## 部署步骤

### 1. 准备项目

- 确保你的项目已经推送到 GitHub 仓库
- 项目根目录需要包含以下文件之一：
  - `package.json`（Node.js 项目）
  - `requirements.txt`（Python 项目）
  - 其他支持的项目配置文件

### 2. 在 Vercel 上部署

1. 登录 Vercel 控制台
2. 点击 "New Project"
3. 选择你要部署的 GitHub 仓库
4. 配置部署选项：
   - 选择项目框架（如 Next.js、React、Vue 等）
   - 设置构建命令（如 `npm run build`）
   - 设置输出目录（通常是 `build` 或 `dist`）
5. 点击 "Deploy" 开始部署

### 3. 自动部署设置

- Vercel 会自动监听你的 GitHub 仓库变化
- 当你推送新代码时，Vercel 会自动重新部署
- 每个 PR 都会生成预览环境

### 4. 环境变量配置

1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加需要的环境变量
3. 可以为不同环境（开发、预览、生产）设置不同的值

### 5. 自定义域名设置

1. 在项目设置中找到 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 常见问题

1. 构建失败
   - 检查依赖是否正确安装
   - 查看构建日志排查错误

2. 部署后页面空白
   - 检查构建输出目录配置
   - 确认入口文件位置正确

3. 环境变量不生效
   - 确认环境变量名称正确
   - 重新部署项目

4. TypeScript 编译错误
   - 检查是否有未使用的导入或变量
   - 可以在 tsconfig.json 中设置 "noUnusedLocals": false 来忽略未使用变量的警告
   - 或在 package.json 的构建命令中添加 --noEmitOnError false

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/cli)
- [Vercel 部署指南](https://vercel.com/guides)

## 注意事项

- 免费版本有一定的使用限制
- 建议在部署前先在本地测试
- 保管好环境变量和密钥信息
