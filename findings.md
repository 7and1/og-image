# Findings & Decisions

## Requirements
- User要求：完整接管并交付生产级质量，覆盖 backend/frontend/content/SEO，最终单元测试+整体测试通过。
- 任务执行风格：分阶段推进，每阶段校验，优先稳定可交付。

## Research Findings
- `functions` 层已有 OG API 基础，但缺少 D1 可选读路径和模板/背景目录 API。
- `/docs/api` 文档与真实实现存在契约偏差（参数/格式说明过时）。
- 前端背景目录原先仅依赖静态 JSON，不支持 API-first 的动态来源。
- 根项目 `eslint` 本身长期存在大量历史文案规则问题（主要 `react/no-unescaped-entities`），非本次改动引入。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 增加 `catalog` 服务层（functions/api/_lib/catalog.ts） | 统一 D1 + static fallback，避免各 endpoint 重复逻辑 |
| 新增 `/api/backgrounds` 与 `/api/templates` | 为前端与外部集成提供稳定资源型 API |
| `/api/og` 支持 `format=svg` | 与文档/平台集成需求对齐，兼容 PNG 默认输出 |
| 前端目录读取 API-first + static fallback | 保证生产灵活性，同时不破坏纯静态部署 |
| 引入 Vitest 及核心测试 | 建立最小可持续测试基线，保证交付可信度 |
| D1 schema 独立文件化 | 降低部署认知成本，便于后续运维与迁移 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Cloudflare 全局类型在根 ts 编译不可见 | 在 functions 新文件中使用最小本地类型接口 (`D1DatabaseLike`, `PagesFunction`) |
| `functions/api/og.ts` 重写时误带 patch 前缀字符 | 清理语法污染并重新编译验证 |
| `app/audit` / `app/validator` 依赖缺失的 `meta-*` 模块 | 新增 `lib/meta-validator.ts` 与 `lib/meta-analyzer.ts` |
| Lint 全量失败（历史内容页规则） | 保持范围聚焦，不做大规模无关文案清洗，确保 type/build/test 全绿交付 |

## Resources
- `functions/api/_lib/catalog.ts`
- `functions/api/backgrounds.ts`
- `functions/api/templates.ts`
- `functions/api/og.ts`
- `lib/background-catalog.ts`
- `lib/template-catalog.ts`
- `lib/meta-validator.ts`
- `lib/meta-analyzer.ts`
- `app/docs/api/page.tsx`
- `functions/d1/schema.sql`
- `functions/d1/README.md`
- `tests/*.test.ts`

## Visual/Browser Findings
- 本轮以代码与构建验证为主，未进行浏览器截图流程。
