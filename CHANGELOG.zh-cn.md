# Changelog

## [0.1.3] - 2025-06-07
### 新增功能
- 新增关闭 VSCode 时是否终止 OpenCode 进程的配置（`opencode-web.killOnExit`）
- 侧边栏新增设置菜单，可快速访问扩展配置
- 支持检测并连接外部已运行的 OpenCode 进程（修改端口号匹配外部进程即可）
- 自动从旧版 `opencode.*` 配置键迁移至 `opencode-web.*`

### 重构
- 重命名配置键从 `opencode` 到 `opencode-web`，并添加自动迁移逻辑

---

## [0.1.2] - 2025-05-23
### 功能
- 多语言支持（英文、中文、日语、韩语）

### 重构
- 重构 WebviewProvider 架构

---

## [0.1.1] - 初始版本

### 功能
- VSCode 终端集成 OpenCode 进程管理
- 双终端架构（后台守护进程 + TUI 终端）
- 跨 Shell 兼容性（PowerShell、cmd、Git Bash、WSL）
- Webview 面板支持侧边栏和编辑器视图
- 语言切换功能
- 语言状态和进程健康调试命令
- 进程健康监控和调试工具

---