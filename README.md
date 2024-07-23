# User Interaction Tracker

用户交互跟踪器是一个用于跟踪用户行为和时间的库。它提供了一种轻量级的方式来记录用户的交互操作，支持Vue2、Vue3以及其他JavaScript框架。它提供了灵活的API和插件机制，方便集成到各种项目中。如：开始和结束某个操作的时间，以及操作的持续时间（duration）。

![npm version](https://img.shields.io/npm/v/user-interaction-tracker)

[English](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN.md)


## 特性

*   跟踪用户开始和结束操作的时间
*   计算并记录操作的持续时间 duration
*   支持自定义的上传日志函数
*   支持在 Vue 2 、 Vue 3 和 React 项目中使用，以及其他框架示例（如jQuery或原生JavaScript）
*   操作简单：startAction、endAction，支持多个跟踪

## 安装

使用 npm 安装：

```bash
npm install user-interaction-tracker
```

使用 yarn 安装：

```bash
yarn add user-interaction-tracker
```

## 简单示例（以 Vue 3 为例）

### 在 main.ts 中注册插件

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

const uploadLog: UploadLogFunction = (action, type, data) => {
  console.log(`Action: ${action}, Type: ${type}`, data);
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // 可选，默认为'$userTracker'
  enabled: true // 可选，默认为false
});

app.mount('#app');
```

### 在组件中使用

```js
<template>
  <div>
    <button @click="handleStartAction">开始记录</button>
    <button @click="handleEndAction">结束记录</button>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from 'vue';

const tracker = getCurrentInstance()?.appContext.config.globalProperties.$userTracker;

// 开始操作
const handleStartAction = () => {
    tracker.startAction('action_name');
};

// 结束操作
const handleEndAction = () => {
    tracker.endAction('action_name');
};
</script>
```

## 示例详情

1、[Vue2 代码详细示例](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_CN_VUE2.md)

2、[Vue3 代码详细示例](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_CN_VUE3.md)

3、[React 代码详细示例](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_CN_REACT.md)

4、[其他框架示例（如jQuery或原生JavaScript）代码详细示例](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_CN_OTHER.md)


## 配置选项

| 参数           | 类型  | 描述         | 默认值            |
| ------------ | --- | ------------- | -------------- |
| `uploadLog`  | 函数  | 用于上传日志的函数，接收三个参数：`action`（操作名称），`type`（操作类型），`data`（操作数据） | 必填             |
| `enabled`    | 布尔值 | 是否启用         | `false`        |
| `globalName` | 字符串 | 在 Vue 实例中全局挂载追踪器的名称  | `$userTracker` |

## API

| 方法    | 描述     | 参数       | 返回值         |
| ------ | -------- | -------- | --------- |
| `startAction(action: string, options?: any)`  | 开始记录一个操作  | `action` (字符串): 操作名称<br>`options` (可选, any): 开始操作的额外信息 | 无|
| `endAction(action: string, options?: any) `    | 结束记录一个操作 | `action` (字符串): 操作名称<br>`options` (可选, any): 结束操作的额外信息 | 无  |
| `getPendingActions(action?: string) ` | 获取未完成的操作。如果传递 `action` 参数，返回该操作的详细信息；否则返回所有未完成的操作。 | `action` (可选, 字符串): 操作名称  | Object or Array |
| `clearActions(actions?: string[]): void`  | 清除指定的操作记录。如果不传递参数，清除所有操作记录。  | `actions` (可选, 数组): 要清除的操作名称数组  | 无                      |


`UploadLogFunction`

```typescript
type UploadLogFunction = (
  action: string,
  type: 'duration' | 'endAction' | 'startAction',
  data?: {
    duration: number,
    start: number | null,
    end: number | null,
    startOptions: any,
    endOptions: any,
  }
) => void;
```

## 贡献

欢迎提出问题、报告 bug 或提出新功能请求。请在 [GitHub Issues](https://github.com/SailingCoder/user-interaction-tracker/issues) 中提出。


## 许可证

MIT 许可证。请参阅 [LICENSE](https://github.com/SailingCoder/user-interaction-tracker/blob/main/LICENSE) 文件了解更多详情。
