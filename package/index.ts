import UserInteractionTracker, { UploadLogFunction } from './userTrackerDuration';

// 用户交互跟踪器插件，支持vue2、vue3
const userInteractionTracker = {
  install(app: any, options: { uploadLog: UploadLogFunction, globalName?:string, enabled?: boolean }) {
    const tracker = new UserInteractionTracker(options);
    const globalName = options.globalName || '$userTracker'

    // Vue 3
    if (app.config && app.config.globalProperties) {
      app.config.globalProperties[globalName] = tracker;
    } 
    // Vue 2
    else if (app.prototype) {
      app.prototype[globalName] = tracker;
    } else {
      console.error('当前 Vue 版本不支持！');
    }
  }
};

export default userInteractionTracker;

export {
  UserInteractionTracker
}

export type {
  UploadLogFunction
}
