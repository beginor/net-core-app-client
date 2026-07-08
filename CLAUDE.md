# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 命令

- 安装依赖: `pnpm install`
- 添加依赖项： 先编辑 package.json ，在 dependencies 或 devDependencies 末尾添加包名称和版本，再执行 `pnpm install`
- 编译项目：`pnpm build <proj-name>`
- 启动项目：`pnpm start <proj-name>`

## 项目列表

这是一个 Angular 21 workspace，包管理器为 `pnpm`，源码位于 `projects/`。

### projects/app-shared

共享库公共导出集中在 `projects/app-shared/src/public-api.ts`。主要职责：

- `account.service.ts`：认证状态、登录/登出、当前账号 signal、Bearer token 持久化、账户和用户凭证 API。
- `api-interceptor.ts`：只为指向 `API_ROOT` 的请求添加 `X-Requested-With` 和 Bearer token。
- `auth.guard.ts`：`matchAfterAuth` / `activateAfterAuth` 在进入受保护路由前调用 `AccountService.getAccountInfo()`。
- `http-error.handler.ts`：开发环境打印错误，生产环境将客户端错误提交到 `${API_ROOT}/client-errors`。
- `inject-tokens.ts`：`CONTEXT_ROOT`、`API_ROOT`、`IS_PRODUCTION` 注入令牌。
- 还导出 validators、Base64 URL、ECharts 组件/服务和等待工具。

其它应用的 `main.ts` 都会读取 URL 中的 `tmpToken` 并写入 `sessionStorage`；`AccountService.getAccountInfo()` 使用后会移除它。

跨项目共享的 Angular 类库项目，通过 `pnpm build app-shared` 构建到 `dist/app-shared`； 如果这个项目有改动，则必须先执行 `pnpm build app-shared`， 没有错误才能继续构建其它应用。

### projects/web

- 入口：`projects/web/src/main.ts`
- 应用配置：`projects/web/src/app/app.config.ts`
- 根组件：`projects/web/src/app/app.component.ts`
- 路由：`projects/web/src/app/app.routes.ts`

桌面端路由包含 `home`、`about`、`account`、`admin`、`login`。除登录外的主路由使用 `matchAfterAuth` 和 `activateAfterAuth`，`account` 与 `admin` 使用 lazy routes。

桌面端导航在 `projects/web/src/app/common/services/navigation.service.ts` 中从 `${API_ROOT}/account/menu` 加载。`projects/web/src/app/common/index.ts` 汇总导出通用组件和服务；新增通用 UI/服务时优先放在 `common/` 并按需从该 index 导出。


### projects/handset

- 入口：`projects/handset/src/main.ts`
- 应用配置：`projects/handset/src/app/app.config.ts`
- 根组件：`projects/handset/src/app/app.component.ts`
- 路由：`projects/handset/src/app/app.routes.ts`

移动端路由较轻量，包含 `home`、`about`、`login`。受保护路由同样使用 `app-shared` 的认证守卫。导航菜单由 `projects/handset/src/app/nav-menu/nav-menu.service.ts` 本地维护，根组件通过 `UiService` 控制 Material drawer。

## 运行时配置与后端路径

- 基础路径：`/net-core-app`
- API 根路径：`/net-core-app/api`
- 开发代理：`proxy.conf.mjs` 将 `/net-core-app/` 下非 `web/`、非 `handset/` 的请求代理到 `http://127.0.0.1:5050`
- 服务端 OpenAPI 文档：`http://127.0.0.1:5050/net-core-app/openapi/v1.json`

应用的 `app.config.ts` 会提供：

- `CONTEXT_ROOT`：`/net-core-app`
- `APP_BASE_HREF`：
  - 桌面端为 `/net-core-app/web/`，
  - 移动端为 `/net-core-app/handset/`
- `API_ROOT`：由 `CONTEXT_ROOT` 拼出 `/net-core-app/api`
- `HttpClient`：使用 `withFetch()` 和 `apiInterceptor`
- `ErrorHandler`：使用 `HttpErrorHandler`
- `LOCALE_ID`：`zh-Hans`

## 样式与资源

- 生成或重构界面元素时，特别是桌面端 `web` ，必须尽量使用 `ng-zorro-antd` 中已有控件。
- Tailwind CSS 仅作为辅助布局工具使用，不作为主要组件样式方案。
- Tailwind CSS v4 通过 `.postcssrc.json` 中的 `@tailwindcss/postcss` 启用，应用样式入口分别是：
  - `projects/web/src/styles.css`
  - `projects/handset/src/styles.css`。
- 桌面端注入 `ng-zorro-antd.variable.css`，并复制 Bootstrap Icons、Font Awesome 和 Ant Design inline SVG 资源。
- 移动端注入 Angular Material `indigo-pink` 预构建主题和 Material Icons，并复制 Bootstrap Icons、Font Awesome 资源。

## 代码约束

- 按照 `ANGULAR.md` 中的 Angular/TypeScript 规则生成和重构代码。现有代码可以保留旧写法；新增或触碰相关代码时按 `ANGULAR.md` 收敛。
- ESLint 配置在 `eslint.config.mjs`：TypeScript 使用 strict + stylistic type-checked 配置，模板启用 Angular 推荐规则和 accessibility 规则。
- 代码风格重点：单引号、80 字符宽度、显式函数返回类型、显式成员可见性、禁止 `debugger`，`console` 只允许 `console.error`。
- Angular schematics 默认 `skipTests: true`，因此生成代码不会自动创建测试文件。
