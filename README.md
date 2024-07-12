# User Interaction Tracker

用户交互跟踪器是一个用于跟踪用户行为和时间的库。它提供了一种轻量级的方式来记录用户的交互操作，如开始和结束某个操作的时间，以及操作的持续时间（duration）。

![npm version](https://img.shields.io/npm/v/user-interaction-tracker)

[English](https://github.com/SailingCoder/user-interaction-tracker/blob/main/doc/README_EN.md)


## 特性

*   跟踪用户开始和结束操作的时间
*   计算并记录操作的持续时间
*   支持自定义的上传日志函数
*   支持在 Vue 2 和 Vue 3 项目中使用
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

## 使用方法

### 在 Vue 项目中安装插件

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

// 示例上传日志函数
const uploadLog: UploadLogFunction = (action, type, data) => {
  // 实现你的上传日志逻辑
  console.log(`Upload log: action=${action}, type=${type}, data=`, data);
  // 比如，上传操作的持续时间（duration）
  if (type === 'duration') {
    // fetch
  }
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // 可选，自定义全局变量名，默认为 '$userTracker'
  enabled: true, // 可选，是否启用，默认为 false  NODE_ENV === 'production'
});

app.mount('#app');
```

**注意：** 目前 type 支持`startAction`、`duration`、`endAction`三种类型。

1. 当 `type` 为 `startAction`时，表示这个动作是一个计时开始的动作。
2. 当 `type` 为 `duration`时，表示这个动作是一个持续性动作，有明确的开始时间和结束时间。（可以作为 duration 日志上传）
3. 当 `type` 为 `endAction`时，表示这个动作只是一个交互的动作，没有开始时间。（代表 duration 计算失败了，也可作为交互埋点上传）

### 在组件中使用

Vue 3 组件示例

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
Vue 2 组件示例

```js
<template>
  <div>
    <button @click="handleStartAction">开始记录</button>
    <button @click="handleEndAction">结束记录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleStartAction() {
        this.$userTracker.startAction('action_name');
    },
    handleEndAction() {
        this.$userTracker.endAction('action_name');
    },
  }
};
</script>
```

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
