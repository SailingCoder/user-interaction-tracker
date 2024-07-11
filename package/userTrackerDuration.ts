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
  
interface TrackerOptions {
    uploadLog: UploadLogFunction;
    enabled?: boolean;
}

// 用户交互跟踪器 计算 duration
class UserInteractionTracker {
    private actions: Map<string, { start: number | null; end: number | null; startOptions: any; endOptions: any }>;
    private uploadLog: UploadLogFunction;
    private enabled: boolean;

    constructor(options: TrackerOptions) {
        this.actions = new Map();
        this.uploadLog = options.uploadLog;
        this.enabled = options.enabled !== undefined ? options.enabled : false;
    }

    public startAction(action: string, options?: any): void {
        if (!this.enabled) return;
        const timestamp = Date.now();
        if (!this.actions.has(action)) {
            this.actions.set(action, { 
                start: null, 
                end: null, 
                startOptions: null, 
                endOptions: null 
            });
        }
        const actionData = this.actions.get(action)!;
        actionData.start = timestamp;
        actionData.startOptions = options || null;
        this.actions.set(action, actionData)
        this.uploadStartAction(action);
    }

    public endAction(action: string, options?: any): void {
        if (!this.enabled) return;
        const timestamp = Date.now();
        const actionData = this.actions.get(action);
        if (actionData) {
            actionData.end = timestamp;
            actionData.endOptions = options || null;
            this.actions.set(action, actionData)
            if (actionData.start !== null) {
                this.calculateAndUploadIfNeeded(action);
            } else {
                this.uploadEndAction(action, actionData, options);
            }
            this.actions.delete(action); // 清除操作记录
        } else {
            this.uploadEndAction(action, { 
                start: null, 
                end: timestamp, 
                startOptions: null, 
                endOptions: null 
            }, options);
        }
    }

    public getPendingActions(action?: string): any {
        if (!this.enabled) return;
        if (action) {
            const actionData = this.actions.get(action);
            if (actionData) {
                return {
                    action: action,
                    ...actionData
                };
            }
            return {};  // 如果action不存在，返回空对象
        }
        const result: Array<any> = [];
        this.actions.forEach((value, key) => {
            result.push({ action: key, ...value });
        });
        return result;
    }
    

    public clearActions(actions?: Array<string>): void {
        if (!this.enabled) return;
        if (actions) {
            actions.forEach((item: string) => {
                this.actions.delete(item);
            });
        } else {
            this.actions.clear();
        }
    }

    private calculateAndUploadIfNeeded(action: string): void {
        const actionData = this.actions.get(action)!;
        const { start, end } = actionData;
        if (start && end) {
            const duration = end - start;
            this.safeUploadLog(action, 'duration', {
                duration,
                ...actionData
            });
        }
    }

    private uploadStartAction(action: string): void {
        const actionData = this.actions.get(action);
        if (actionData) {
            this.safeUploadLog(action, 'startAction', {
                duration: 0,
                ...actionData
            }); // 上传时不计算持续时间，传递持续时间为0
        }
    }

    private uploadEndAction(action:string, actionData: any = {}, options?:any): void {
        let optionData = {}
        if (options) {
            optionData = isObject(options) ? options : {
                data: options
            }
        }
        this.safeUploadLog(action, 'endAction', {
            duration: 0,
            ...actionData,
            ...optionData
        }); // 上传时不计算持续时间，传递持续时间为0
    }

    private safeUploadLog(action: string, type: 'duration' | 'endAction' | 'startAction', data: any): void {
        try {
            this.uploadLog(action, type, data);
        } catch (error) {
            console.error(`Error UserInteractionTracker，action ${action}:`, error);
        }
    }
}

const isObject = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

export default UserInteractionTracker;
export type {
    UploadLogFunction
}
  