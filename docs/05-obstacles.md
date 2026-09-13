# 05 实现阻碍点 · React Native

RN 版的阻碍 = 各原生阻碍 **加上** 胶水层。下面只写胶水独有的。原生阻碍见 Android / 鸿蒙 `05`。

---

## 1. 跨层延迟与掉帧

部分结果若走旧 Bridge，倒字板会明显「一顿一顿」。必须 New Architecture + 合并最新包。RNOH 的 JSI 路径成熟度低于 iOS/Android，鸿蒙 RN 字幕可能达不到产品手感。

---

## 2. iOS TranslationSession 锚点

系统要求 Session 在 View 生命周期上。RN 页面 unmount、Fast Refresh、栈里藏页，都会弄死 Session。适配器必须：

- 与当前模块 View 同生共死  
- 换语言对重建  
- Fast Refresh 后 `prepare` 再来  

这是 iOS RN 特有坑，原生 Duiyi 没有（SwiftUI `.translationTask` 绑得更死）。

---

## 3. 三套适配器几乎是三个 App

`SpeechEngine` Spec 看似统一，实现分别是 Analyzer、SpeechRecognizer、Core Speech Kit。语言检测事件、错误码、续听，要对齐到同一 `SpeechEvent`，会持续出现「这一端多一个字段」。

阻碍：Spec 会膨胀。治理：Spec 保持最小；端差异进 `capabilities` 而不是让 JS `if (Platform.OS)`。

---

## 4. RNOH 生态缺口

Reanimated、Screens、Permissions、SQLite 在鸿蒙上要有 OH 移植。缺一个，首页都能塌。语音 TurboModule 要自己写 NAPI。

v1 把鸿蒙 RN 标成非承诺，否则日程被库绑定。

---

## 5. 权限与审核三套

同一 JS 引导文案，系统弹窗字符串在 Info.plist / Manifest / module.json5。RN 容易漏改一处导致拒审。清单要当发布检查项。

---

## 6. 调试听写

Chrome / Flipper 看不到 PCM。必须各端原生日志。RN 团队若不会 Swift/Kotlin/ArkTS，M2 会卡死。人员技能是阻碍，不是框架功能。

---

## 7. 热更新幻想

有人会提 CodePush 改「翻译逻辑」。媒体在 Native，热更新改不了 ASR。禁止把热更新当修复听写的手段。

---

## 8. 双份任务数据库

若 iOS 原生 Duiyi 已用 SwiftData，RN iOS 又用 SQLite，同一手机两个包不共享历史。产品若两个都上架必须改名或明确「这是另一款」。本仓库假设：**商店里每端只上一包**——要么纯原生，要么 RN，不要两个对译。

---

## 9. 测试盲区

Jest 保证 Assembler。真机矩阵变成 3× 设备。CI 仍不能发版。

---

## 10. 抽出 shared services 的时机

过早抽 Kotlin/Swift library 给 RN 链，会拖原生版自己的里程碑。过晚则 RN 复制一份引擎分叉。路线图：原生 M2 竖切成功后再抽，RN M1 只用 Fake + 一端真适配。
