# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

- 安装依赖：`pnpm install`（新增依赖先编辑 `package.json`，再执行 `pnpm install`）
- 开发：`pnpm dev`（Vite 开发服务器，`/net-core-app/*` 代理到 `http://127.0.0.1:5050`）
- 构建：`pnpm build`（复制图标 → `tsc --noEmit` → `vite build`，产物在 `dist/`）
- 检查：`pnpm lint`
- 测试：`pnpm test`（Vitest，`src/**/*.test.ts`）

## 技术栈

React 19 + antd 6 + Vite 8 + TypeScript 5.9 + react-router 8 + zustand 5 + Tailwind CSS 4 + echarts 6，包管理器 `pnpm`。这是扁平的单应用仓库（不再是 Angular workspace），源码全部位于 `src/`。

## 运行时契约

- 上下文根 `/net-core-app`，API 根 `/net-core-app/api`，前端挂载点 `/net-core-app/web/`。
  三者分别对应 `src/config.ts` 的 `CONTEXT_ROOT` / `API_ROOT` / `BASE_PATH`、`vite.config.ts` 的 `base`、以及后端 `ASPNETCORE_PATHBASE`，改动时必须同步。
- token 存于 `localStorage['Bearer:/net-core-app/api']`，key 由 `API_ROOT` 拼出，**必须与后端/旧版保持一致**。
- 跨站跳转通过 URL 的 `tmpToken` 传递：`src/main.tsx` 写入 `sessionStorage`，`getAccountInfo()` 首次使用后移除。

## 结构

- `src/api/`：`http.ts` 是唯一的 fetch 封装（自动加 `X-Requested-With` 与 Bearer，非 2xx 抛 `ApiError`，生产环境上报 `/client-errors`）。`crud.ts` 的 `createCrud<T>()` 生成标准增删改查，各资源文件在其上追加专有接口。
- `src/stores/app-store.ts`：zustand 单 store，含 account、菜单树、UI 状态。
- `src/components/`：布局（`app-layout` / `nav-sidebar` / `app-header` / `require-auth`）与通用件（`data-list-card`、`detail-drawer`、`dynamic-icon`、`e-chart`、`storage-browser`）。
- `src/hooks/use-data-list.ts`：列表页的搜索、分页、加载状态；`research(patch)` 会合并过滤条件并从第一页重新加载，过滤条件统一放在 `list.search` 中，不要在页面里另建 `useState`。
- `src/pages/`：`admin/*` 每个模块一个列表页 + 若干详情抽屉；`account/*` 为当前用户信息与凭证。
- 路由在 `src/app.tsx`，全部用 `React.lazy` 按页拆分，页面模块必须 `export default`。

## 约定

- 文件名一律 kebab-case（`users-page.tsx`、`use-data-list.ts`），组件名保持 PascalCase。
- 权限判断统一用 `useAppStore(s => s.account.privileges['app_users.create'])`，权限字符串必须与后端数据库中的记录一致。
- 菜单图标来自数据库（`bi/person`、`fa/solid/user`），由 `dynamic-icon` 用 CSS `mask-image` 渲染；`scripts/copy-icons.mjs` 在构建前把 SVG 复制到 `public/assets`。
- ECharts 配置来自 `public/assets/echarts/**/*.json`，`parseEchartConfig` 支持三种扩展语法（`( ... }` 函数字符串、`--css-var`、`_lambda` 数组），移植或新增配置时保持该行为。
- 代码风格：单引号、100 字符宽度、4 空格缩进；`console` 只允许 `console.error`。
