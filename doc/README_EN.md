# User Interaction Tracker

The User Interaction Tracker is a library for tracking user actions and time. It provides a lightweight way to record user interactions, such as the start and end times of an action and the duration of the action.

![npm version](https://img.shields.io/npm/v/user-interaction-tracker)

[简体中文](https://github.com/SailingCoder/user-interaction-tracker/tree/main)

## Features

*   Track the start and end times of user actions
*   Calculate and record the duration of actions
*   Support custom log upload functions
*   Compatible with Vue 2 and Vue 3 projects
*   Simple operations: startAction, endAction, supports multiple tracking

## Installation

Install using npm:

```bash
npm install user-interaction-tracker
```

Install using yarn:

```bash
yarn add user-interaction-tracker
```

## Usage

### Install the Plugin in a Vue Project

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import userInteractionTracker, { UploadLogFunction } from 'user-interaction-tracker';

const app = createApp(App);

// Example log upload function
const uploadLog: UploadLogFunction = (action, type, data) => {
  // Implement your log upload logic
  console.log(`Upload log: action=${action}, type=${type}, data=`, data);
};

app.use(userInteractionTracker, {
  uploadLog,
  globalName: '$userTracker', // Optional, custom global variable name, default is '$userTracker'
  enabled: true, // Optional, whether to enable, default is false
});

app.mount('#app');
```

**Note:** Currently, the supported types are `startAction`, `duration`, and `endAction`.

1. When `type` is `startAction`, it indicates the action is a timing start action.
2. When `type` is `duration`, it indicates the action is a duration action, with a clear start and end time. (can be used as a duration log upload)
3. When `type` is `endAction`, it indicates the action is just an interaction action with no start time. (representing duration calculation failure, can also be used as an interaction log upload)

### Use in Components

Vue 3 Component Example

```js
<template>
  <div>
    <button @click="handleStartAction">Start Recording</button>
    <button @click="handleEndAction">End Recording</button>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from 'vue';

const tracker = getCurrentInstance()?.appContext.config.globalProperties.$userTracker;

// Start action
const handleStartAction = () => {
    tracker.startAction('action_name');
};

// End action
const handleEndAction = () => {
    tracker.endAction('action_name');
};
</script>
```
Vue 2 Component Example

```js
<template>
  <div>
    <button @click="handleStartAction">Start Recording</button>
    <button @click="handleEndAction">End Recording</button>
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

## Configuration Options

| Parameter     | Type   | Description                                         | Default            |
| ------------- | ------ | --------------------------------------------------- | ------------------ |
| `uploadLog`   | Function | Function for uploading logs, receives three parameters: `action` (operation name), `type` (operation type), `data` (operation data) | Required           |
| `enabled`     | Boolean | Whether to enable                                  | `false`            |
| `globalName`  | String  | Global name for the tracker in the Vue instance     | `$userTracker`     |

## API

| Method                         | Description                                      | Parameters                                                              | Return Value     |
| ------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------- | ---------------- |
| `startAction(action: string, options?: any)` | Start recording an action                       | `action` (string): action name<br>`options` (optional, any): start action options | None |
| `endAction(action: string, options?: any)`   | End recording an action                         | `action` (string): action name<br>`options` (optional, any): end action options | None |
| `getPendingActions(action?: string)`         | Get unfinished actions. If `action` is provided, return the details of that action; otherwise, return all unfinished actions. | `action` (optional, string): action name                                 | Object or Array |
| `clearActions(actions?: string[]): void`     | Clear the specified action records. If no parameters are passed, clear all action records. | `actions` (optional, array): array of action names to clear               | None |

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

## Contribution

Feel free to raise issues, report bugs, or request new features. Please submit them in [GitHub Issues](https://github.com/SailingCoder/user-interaction-tracker/issues).


## License

MIT License. For more details, please refer to the [LICENSE](https://github.com/SailingCoder/user-interaction-tracker/blob/main/LICENSE) file.