# 对译 Duiyi · React Native

跨平台 UI：首页、任务条、历史、设置、字幕板用同一套 TypeScript。听写、翻译、TTS、音频会话**全部**经 TurboModule 落到各端原生实现，不在 JS 里做 ASR。

RN 不是 Android / 鸿蒙的替代品。没有 `realtimeTranslatorAndroid` 与 `realtimeTranslatorHarmony` 的引擎适配器，本目录只是能点的空壳。

基线：**React Native 0.77 New Architecture（Fabric + TurboModules）**。鸿蒙用 RNOH（`@react-native-oh/react-native-harmony`），当前生态跟的是 0.77 / 0.72，不跟 Expo 托管工作流。

## 文档

| 文档 | 内容 |
| --- | --- |
| [docs/01-product-prototype.md](docs/01-product-prototype.md) | 原型设计 |
| [docs/02-architecture.md](docs/02-architecture.md) | 架构设计 |
| [docs/03-tech-choices.md](docs/03-tech-choices.md) | 技术选型 |
| [docs/04-implementation-principles.md](docs/04-implementation-principles.md) | 实现原理 |
| [docs/05-obstacles.md](docs/05-obstacles.md) | 实现阻碍点 |
| [docs/06-compromises.md](docs/06-compromises.md) | 功能与效果打折扣的点 |
| [docs/07-roadmap.md](docs/07-roadmap.md) | 落地路线图 |
| [prototype/platform.html](prototype/platform.html) | 可交互原型 |

## 打开工程

```bash
cd realtimeTranslatorRN
npm install
npx react-native run-ios     # 需本机已有对译 iOS 能力或先跑占位 Native
npx react-native run-android
```

鸿蒙：按 RNOH 文档另开 DevEco 工程，指向同一 `src/`。

## 现阶段代码

TypeScript Domain、导航壳、Native 契约（Spec）、FakeSpeechEngine、首页。先 `npm test` 跑 Assembler。完整 `run-ios` / `run-android` 需要再用 RN CLI 生成宿主工程并链上适配器，见路线图 M1–M3。
