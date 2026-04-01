# Claude Code 指南

这个文件为 Claude Code (claude.ai/code) 处理这个仓库中的代码时提供指导。

## 命令

- 安装依赖: `pnpm install`
- 编译共享项目：`pnpm build app-shared`
- 编译 Web 项目：`pnpm build web`
- 编译 Handset 项目：`pnpm build handset`
- 启动 Web 项目：`pnpm start web`
- 启动 Handset 项目：`pnpm start handset`

## 实事项

- 项目列表：
  - `web`（桌面端）使用 `ng-zorro-antd` + Tailwind CSS ；
  - `handset`（移动端）使用 `Angular Component/Material` + Tailwind CSS ；
  - `app-shared`（共享的认证/HTTP/错误处理）
- 基础路径：`/net-core-app`
- API 根路径：`/net-core-app/api`
- 开发代理：`proxy.conf.mjs` -> `http://127.0.0.1:5050`
- 服务端的 OpenAPI 文档： `http://127.0.0.1:5050/openapi/v1.json`
- 认证流程：`projects/app-shared/src/lib/account.service.ts`
- HTTP 拦截器：`projects/app-shared/src/lib/api-interceptor.ts`
- 路由守卫：`projects/app-shared/src/lib/auth.guard.ts`
- 全局错误处理：`projects/app-shared/src/lib/http-error.handler.ts`
- Web 外壳：
  - `projects/web/src/main.ts`
  - `projects/web/src/app/app.config.ts`
  - `projects/web/src/app/app.component.ts`
- Handset 外壳：
  - `projects/handset/src/main.ts`
  - `projects/handset/src/app/app.config.ts`
  - `projects/handset/src/app/app.component.ts`
- Web 导航：`projects/web/src/app/common/services/navigation.service.ts`
- 登录：
  - `projects/web/src/app/login/login/`
  - `projects/handset/src/app/login/login/`
- 配置：`eslint.config.mjs`，Angular schematics 默认 `skipTests: true`

按照 `ANGULAR.md` 中的最佳实践与规则要求生成和重构代码；
