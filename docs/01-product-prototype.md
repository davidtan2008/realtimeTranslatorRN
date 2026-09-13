# 01 产品原型设计 · React Native

产品名：**对译 Duiyi**
形态：一套 JS 界面，三套原生能力。竖屏锁定。
定位：与原生版同一平台：面对面、同声传译、会议记录、任务历史。

可交互界面：[`../prototype/platform.html`](../prototype/platform.html)
产品语义对齐 iOS：[`../../../realtimeTranslatorOptimize/docs/09-platform-prototype.md`](../../../realtimeTranslatorOptimize/docs/09-platform-prototype.md)

RN 版**不得**为了「好写」改任务规则或允许云识别。差异只允许出现在：系统能力探测结果、延迟、语言灰掉、总结是否可用。

---

## 1. 产品承诺

四模块、任务生命周期、色板、禁外放、不存录音、系统分享 — 与原生版同一张表。

RN 特有、要在产品里说的：

- **同一账号商店包在不同系统上能力不同。** 启动后按 Catalog 灰掉语言，不要写死「六语全平台」。
- 面对面倒字、同传大字幕必须 60 fps 级刷新。做不到就承认该端走原生 App，而不是降到「两秒一刷新的字幕」。
- 鸿蒙 RN（RNOH）是附加目标，不是 v1 必发。v1 以 iOS + Android 为发布对；鸿蒙优先原生工程。

---

## 2. 信息架构

与 Android 文档第 2 节相同。导航用 React Navigation Native Stack（或各端原生栈的 RN 封装）。

系统返回：Android 预测性返回依赖 `react-native-screens`；iOS 滑动返回；鸿蒙侧滑由 RNOH 映射。进行中任务返回二次确认，逻辑放 JS，避免三端各写一遍。

---

## 3. 任务生命周期

状态机在 JS Domain（便于三端单测）。持久化经 `TaskStore` Native 或 JS SQLite：

- 推荐：JS 用同一 SQLite（`op-sqlite` / `react-native-quick-sqlite`）存任务，三端文件格式一致，便于以后导出备份。  
- 音频相关**不要**进 SQLite 以外的「智能」；ASR 事件只从 Native 来。

杀进程恢复：JS 起来后 `hydrate()`。不要指望 RN 后台保活听写。

---

## 4. 界面

组件全在 `src/features`，Tokens 与 iOS hex 一致。

面对面：`transform: [{ rotate: '180deg' }]` 包 peer pane。手势放在未旋转层。用 `react-native-reanimated` 做旋转（UI 线程），不要每句 `setState` 带动整树。

字幕 live 行：Native 传来的文本经 JSI 事件（不是旧 Bridge 每 50 ms 打一次）。产品要求与原生相同的「贴口型」；做不到则该端标明实验。

中间钮、TaskBar、语言 Chip、历史行：纯 JS。设置 sheet：JS Modal。权限失败页：JS，按钮调 Native `openSettings`。

---

## 5. 总结与导出

`Summarizer` Native：iOS Foundation Models、Android Nano、鸿蒙端侧生成。JS 只渲染三态。导出：Native 写文件 + 系统分享模块（`react-native-share` 可接受，但不要引入微信 SDK）。

---

## 6. 明确不做

- Expo Go / Expo 托管（无自定义 TurboModule）。  
- 用 JS 调云 WebSocket ASR 当跨平台捷径。  
- 一套 sherpa 模型当 v1 主路径（体积、审核、发热；可当 v2 一致性选项）。  
- 在 JS 里做回声消除。  
- 用 WebView 包系统翻译页。
