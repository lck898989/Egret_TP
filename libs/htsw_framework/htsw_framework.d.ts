declare class HttpConnect {
    /** 接口地址 */
    apiUrl: string;
    constructor();
    protected SendHttpMsg(msg: string, handler: Handler, isJson?: boolean): void;
    protected SendUrlHttpMsg(url: string, msg: string, hander: Handler, isJson?: boolean, type?: string): void;
    /**
     * 加载完成
     */
    private onPostComplete(event);
    /**
     * 报错
     */
    private onPostIOError(event);
    /**
     *
     */
    private onPostProgress(event);
}
declare class TcpServer implements IMessageListener {
    /**
         *  发送
         */
    static sendMessages(cmd: number, body: egret.ByteArray): void;
    /**
     * 关闭
     */
    static close(): void;
    /**
     *  废掉socket，再使用重新创建
     *
     */
    static unUseFul(): void;
    static hadSocket(): Boolean;
    protected static _socket: GameSocketNew;
    constructor();
    /** 初始化 */
    init(): void;
    /**
     * 连接
     */
    connect(host: string, port: number): void;
    /**
     * 得到是否连接中
     */
    getConnected(): Boolean;
    /**
     * 子类MessageManager重写了此方法
     */
    onConnect(): void;
    /**
     * 子类MessageManager重写了此方法
     */
    onMessageReceived(messageType: number, bytes: egret.ByteArray): void;
    /**
     * 处理连接断开
     */
    onDisConnect(): void;
    /**
     * 处理链接错误
     */
    onConnectError(): void;
    private showErrorMessageContent();
    /**
     * 处理数据链接IO错误
     */
    private receiveIOError();
    /**
     * 断开连接后
     */
    private onLoseConnectionWithServer();
}
/**
 * 基类
 */
declare class BaseClass {
    /**
     * 获取一个单例
     * @returns {any}
     */
    static getInstance(...args: any[]): any;
    constructor();
}
/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
declare class BaseSound {
    _cache: any;
    _loadingCache: string[];
    /**
     * 构造函数
     */
    constructor();
    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    getSound(key: string): egret.Sound;
    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    loadedPlay(key: string): void;
    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    checkCanClear(key: string): boolean;
    /**
     * 处理音乐文件的清理
     */
    private dealSoundTimer();
    /**
     * 资源加载完成
     * @param event
     */
    private onResourceLoadComplete(data, key);
}
declare namespace one {
    /**
     * 显示到 egret 中的 DOM 元件
     */
    class WebNode extends egret.DisplayObject {
        private tempStage;
        private domNode;
        constructor();
        /**
         * 绑定一个 DOM 元件
         * @element DOM 元件，不要修改此元件的 style 的位置、旋转、缩放、边框等属性
         */
        bind(element: HTMLElement): void;
        /**
         * 解绑 DOM 元件
         */
        unbind(): void;
        removeFromStage(): void;
        protected getDomNode(): DOMNode;
        private addToStage();
        private onResize();
    }
}
/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 **/
declare class ResourceUtils extends BaseClass {
    private _configs;
    private _onConfigComplete;
    private _onConfigCompleteTarget;
    private _groups;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    loadGroup($groupName: string, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void;
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    loadGroups($groupName: string, $subGroups: any[], $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void;
    /**
     * 静默加载
     * @param $groupName 资源组名称
     */
    pilfererLoadGroup($groupName: string): void;
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    addConfig(jsonPath: string, filePath: string): void;
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    loadConfig($onConfigComplete: Function, $onConfigCompleteTarget: any): void;
    /**
     * 加载
     */
    private loadNextConfig();
    /**
     * 加载完成
     * @param event
     */
    private onConfigCompleteHandle(event);
    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event);
    /**
     * 资源组加载进度
     */
    private onResourceProgress(event);
}
declare class DicErrorCode implements IReadJson {
    objErrorMsg: Object;
    constructor();
    initFromJson(name: string): void;
    getDesc(id: number): string;
}
declare class DicServerInfo implements IReadJson {
    serverUrl: string;
    /** 是否使用https */
    usehttps: number;
    constructor();
    /**
     * 初始化json
     */
    initFromJson(name: string): void;
}
interface IReadJson {
    initFromJson(name: string): void;
}
/**
  * 背景显示管理类
  */
declare class BGUpManager {
    static getInstance(): BGUpManager;
    private static instance;
    _mask: eui.UILayer;
    darkSprite: eui.Rect;
    parent: UIObject;
    constructor();
    /** 屏幕适配
     */
    reSizePop(): void;
    resizePannel(panel: any): void;
    /**
    * 添加面板方法
    * panel       		面板
    * dark        		背景是否变黑
    * popUpWidth      	指定弹窗宽度，定位使用
    * popUpHeight      	指定弹窗高度，定位使用
    * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    * isAlert
    * isTransparent     背景的透明度 0 完全透明
    */
    addBGUp(_parent: any, isTransparent: number): void;
    /**
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    removePopUp(panel: any, effectType?: number): void;
    close(): void;
    closeAllDlg(): void;
}
/**
 *
 */
declare class CommunicationManager {
    static getInstance(): CommunicationManager;
    private static instance;
    courcewareName: string;
    coursewareArray: any;
    mOpData: any;
    offlineRev: boolean;
    private curPage;
    constructor();
    /** 添加侦听 */
    addListener(listenerType: string): void;
    init(_name: string): void;
    /**
     * name
     */
    loadComplete(): void;
    /** 收原生js信令 */
    execMessage(e: any): void;
    /** 前往指定页面 */
    goTargetPageHandle(pageIndex: number): void;
    /** 发送消息 */
    makePostMessage(methodType: string, keyName: string, value: any): void;
    /** 离线接受通知 并 处理发送消息 */
    tkyOfflineRevAction(e: any): void;
    /** 接受通知 并 处理发送消息 */
    tkyMakePostAction(e: any): void;
    private goPage(e);
    /** 加载下一页 */
    private loadNextPage(nextGroup);
}
/**
 * 游戏中的Dlg管理类
 */
declare class DlgManager {
    constructor();
    popDlg(dlg: any, groups?: string, closeHander?: Handler, data?: any, effectType?: number, transparent?: number): void;
    popClickDlg(dlg: any, closeHander?: Handler, data?: any): void;
    dlgClose(key: string, effectType?: number): void;
    closeAllDlg(): void;
    private makeDlg(dlg, closeHander, data);
    private onLoad(dlg, closeHander, data, model, effectType, transparent, key);
    /**
     * 调用PopUpManager
     */
    private addPopDlg(panel, effectType, transparent);
}
declare class GameLayerManager extends eui.UILayer {
    static gameLayer(): GameLayerManager;
    private static _instance;
    sceneLayer: eui.UILayer;
    mainLayer: eui.UILayer;
    panelLayer: eui.UILayer;
    effectLayer: eui.UILayer;
    maskLayer: eui.UILayer;
    loadLayer: eui.UILayer;
    constructor();
    init(): void;
}
/**
 *  游戏中json数据的管理类
 *  主要功能
 *  管理所有游戏中所有需要特殊处理的json文件
 */
declare class JsonManager {
    private _jsonArry;
    private realClass;
    private realName;
    private _closeHander;
    private _proHander;
    constructor();
    getClass(key: string): any;
    init(): void;
    loadJson(group: string, endHander?: Handler, proHander?: Handler): void;
    private makeClass();
    private onResourceLoadComplete(event);
    private onResourceLoadError(event);
    private onResourceProgress(event);
    private clearResLoad();
}
/**
 * 本地存储信息管理
 */
declare class LocalStorageManager {
    private static _instance;
    /**
     * key: "LOGIN_INFO"
     * value: {"prev": {"uname":xx, "server": {}},
     *         "hist": {xx1: [serverInfo, serverInfo...]}, xx2, [serverInfo, serverInfo...], ...}}
     * key: "MUSIC_IS_OPEN"
     * value: "0"/"1"
     */
    constructor();
    static readonly instance: LocalStorageManager;
}
/**
 *  游戏中玩家数据类的管理类
 */
declare class PlayerManager {
    role: number;
    constructor();
    init(): void;
    getParamData(): any;
}
declare class PopUpManager {
    static getInstance(): PopUpManager;
    private static instance;
    _mask: eui.UILayer;
    darkSprite: eui.Rect;
    constructor();
    /** 屏幕适配
     */
    reSizePop(): void;
    resizePannel(panel: any): void;
    addPopUp(panel: any, dark: boolean, popUpWidth: number, popUpHeight: number, effectType: number, isAlert: boolean, isTransparent: number): void;
    removePopUp(panel: any, effectType?: number): void;
    close(panel: any): void;
    closeAllDlg(): void;
}
declare class ResInfo {
    _endHander: Handler;
    _proHander: Handler;
    _loadDlg: boolean;
    _groups: string;
    _sec: number;
    constructor();
}
/**
 * 资源加载类 对egret.RES的进一步封装
 */
declare class ResLoad {
    static getInstance(): ResLoad;
    private static instance;
    private _progressHander;
    private _callBackMap;
    private _callBackQueue;
    constructor();
    /**
     * 加载场景资源 并行下载 下载完立即执行
     * @param group 资源组名称
     * @param end   结束后回调
     * @param pro   进行中回调
     */
    LoadRes(group: string, complete?: Handler, progress?: Handler): void;
    /**
     * 加载场景资源 并行下载 按队列执行
     * @param group 资源组名称
     * @param end   结束后回调
     * @param pro   进行中回调
     */
    LoadResByQueue(group: string, complete?: Handler, progress?: Handler): void;
    private executeQueue(_name);
    /** 监听加载完成 */
    private onResourceLoadComplete(event);
    private onResourceLoadError(event);
    private onResourceProgress(event);
    private clearResLoad();
}
declare class SceneInfo {
    classFactory: any;
    resName: string;
    data: Object;
    constructor();
}
/**
 * Created by yangsong on 2014/11/28.
 * 场景管理类
 */
declare class SceneManager {
    _loadArray: SceneInfo[];
    private _currScene;
    /** 要传递给进入场景的参数 */
    private _data;
    /** 老场景 */
    private _oldName;
    private _oldScene;
    /** 是否正在载入场景 */
    private _loadingScene;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 切换场景
     * @param key      场景唯一标识
     * @param resName  场景需要加载的资源Group名称
     */
    runScene(classFactory: any, resName: string, data?: Object): void;
    /**
     * 载入资源完成后的回调函数
     */
    private loadEnd(group);
    /**
     * 同时加载多个场景，排入队列
     * param:  group:资源组名称
     */
    private insertSceneInfo(classFactory, resName, data?);
    /**
     * 加载数组中的场景
     */
    private addNext();
}
/**
 * Sound管理类
 */
declare class SoundManager extends BaseClass {
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    static CLEAR_TIME: number;
    static IS_OPEN_SOUND: boolean;
    private effect;
    private bg;
    private effectOn;
    private bgOn;
    private currBg;
    private bgVolume;
    private effectVolume;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 播放音效
     * @param effectName
     */
    playEffect(effectName: string): void;
    /**
     * 停止背景音乐
     */
    stopEffect(): void;
    /**
     * 播放背景音乐
     * @param key
     */
    playBg(bgName: string, volume?: number, loops?: number, end?: Handler): void;
    /**
     * 继续播放背景音乐
     */
    continuePlayBg(): void;
    /**
     * 停止背景音乐
     */
    stopBg(): void;
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    setEffectOn($isOn: boolean): void;
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    setBgOn($isOn: boolean): void;
    /**
    * 设置背景音乐音量
    * @param volume
    */
    setBgVolume(volume: number): void;
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    getBgVolume(): number;
    /**
     * 设置音效音量
     * @param volume
     */
    setEffectVolume(volume: number): void;
    /**
     * 获取音效音量
     * @returns {number}
     */
    getEffectVolume(): number;
}
/**
 *
 */
declare class GameSocketNew {
    static getInstance(): GameSocketNew;
    static setInstanceNull(): void;
    private static connected;
    private static socket;
    private static instance;
    private listener;
    constructor();
    register(listener: IMessageListener): void;
    unRegister(): void;
    /**
     * 是否为连接状态
     */
    getConnected(): Boolean;
    /**
     * 连接服务器 第一次握手
     */
    connect(host: string, port: number): void;
    /**
     * 使接口可用， 并且客户端不主动断开连接
     */
    close(): void;
    sendPackage(cmd: number, body: egret.ByteArray): void;
    /**
     * 初始化
     */
    private init();
    /**
     * 重置网络连接
     */
    private resetConnect();
    /**
     * 连接
     */
    private connectHandler(e);
    /**
     * 接收数据
     */
    private revSocketDataHandler(e);
    /**
     * 关闭连接
     */
    private closeHandler(e);
    /**
     * 抛出错误
     */
    private errorHandler(e);
    /**
     *
     */
    private excuteHandle(type, content);
}
/**
 * 游戏中全局模块的快速使用
 */
declare class GM {
    static pm: PlayerManager;
    static jm: JsonManager;
    static dlg: DlgManager;
    static scene: SceneManager;
    static gamec: GameConfigManager;
    static sound: SoundManager;
    static isDebug: boolean;
    static debugKey: HashMap;
    static _curTime: number;
    static _serverTime: number;
    static init(): void;
    static setTime(time: number): void;
    static getTime(time: number): number;
    constructor();
}
/**
 *
 */
declare class HttpServer extends HttpConnect {
    static getInstance(): HttpServer;
    private static instance;
    constructor();
    /** 发送消息 */
    sendHttpMsg(route: string, msg: string, hander: Handler): void;
    /** 发送消息 get*/
    sendHttpMsgWithType(route: string, msg: string, hander: Handler, isJson: boolean, type: string): void;
}
interface IMessageListener {
    onConnect(): void;
    onDisConnect(): void;
    onMessageReceived(messageType: number, bytes: egret.ByteArray): void;
    onConnectError(): void;
}
/**
 *
 */
declare class MessageManager extends TcpServer {
    static getInstance(): MessageManager;
    private static instance;
    constructor();
}
declare class UIObject extends eui.Component {
    static guid: Handler;
    keyName: string;
    data: any;
    _closeHander: Handler;
    constructor();
    onCreate(): void;
    /** 创建子原件 */
    onCreateChildren(): void;
    onAddEnd(e: egret.Event): void;
    onAddStage(e: egret.Event): void;
    onJoin(): void;
    onAdd(): void;
    onEnterFrame(advancedTime: number): void;
    msgDo(msgType: number, obj: Object): void;
    execMessage(data: any): void;
    onDestroy(): void;
    onClose(key: string, other?: any): void;
    /** 如果是弹出的对话框(dlg) 关闭的时候请调用
     *  other            传回给Hander的参数
     *  effectType       移出的动画效果   0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    onDlgClose(key: string, other?: any, effectType?: number): void;
    /** 如果是弹出的对话框(dlg) 关闭的时候请调用
     *  effectType       移出的动画效果   0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    onDlgOnlyClose(key: string, effectType?: number): void;
}
/**
 * Created by yangsong on 2014/11/22.
 */
declare class App {
    /**
     * 统一的计时器和帧刷管理类
     * @type {TimerManager}
     */
    static readonly TimerManager: TimerManager;
    /**
     * 日期工具类
     * @type {DateUtils}
     */
    static readonly DateUtils: DateUtils;
    /**
     * 数学计算工具类
     * @type {MathUtils}
     */
    static readonly MathUtils: MathUtils;
    /**
     * 随机数工具类
     * @type {RandomUtils}
     */
    static readonly RandomUtils: RandomUtils;
    static readonly BitmapNumber: BitmapNumber;
    /**
     * Stage操作相关工具类
     */
    static readonly StageUtils: StageUtils;
    /**
     * 字符串工具类
     */
    static readonly StringUtils: StringUtils;
    /**
     * 通过工具类
     */
    static readonly CommonUtils: CommonUtils;
    /**
     * 设备工具类
     */
    static readonly DeviceUtils: DeviceUtils;
    /**
     * 震动类
     */
    static readonly ShockUtils: ShockUtils;
    /**
     * TextFlow
     */
    static readonly TextFlowMaker: TextFlowMaker;
    /**
     * 数组工具类
     * @returns {any}
     * @constructor
     */
    static readonly ArrayUtils: ArrayUtils;
    /**
     * 加载资源类
     * @returns {any}
     * @constructor
     */
    static readonly ResourceUtils: ResourceUtils;
    /**
     * 初始化函数
     * @constructor
     */
    static Init(): void;
}
/**
 * 场景切换特效类
//切换场景的特效
//1.卷帘特效
//2.左右切换移动
//3.直接翻
//4.旋转掉落
//5.随机一种
 */
declare module ScreenMovies {
    function MovieStart(_txnums: any): void;
}
/**
 * 动画类
 */
declare class ActMovie {
    static getInstance(): ActMovie;
    private static instance;
    constructor();
    /** 得到帧动画 */
    getMovieClip(resName: string, movieName: string): egret.MovieClip;
}
/**
 * Created by egret on 15-8-7.
 */
declare class ArrayUtils extends BaseClass {
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    forEach(arr: any[], func: Function, funcObj: any): void;
    /** 累加操作 */
    addToltal(arr: any[]): number;
    /** 找出数组中的最小数 */
    findMin(arr: any[]): number;
    /** 找出数组中的最大数 */
    findMax(arr: any[]): number;
    /** 看数组中有没有需要查找的数   */
    findForm(arr: number[], a: number): boolean;
}
/**
 * Created by yangsong on 15-8-19.
 * 平均数工具类
 */
declare class AverageUtils {
    private maxNum;
    private nums;
    private numsLen;
    private numSum;
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    constructor($maxNum?: number);
    /**
     * 加入一个值
     * @param value
     */
    push(value: number): void;
    /**
     * 获取平均值
     * @returns {number}
     */
    getValue(): number;
    /**
     * 清空
     */
    clear(): void;
}
declare namespace tiled {
    class Base64 {
        /**
         * 判断是否原生支持Base64位解析
         * @version Egret 3.0.3
         */
        static readonly nativeBase64: boolean;
        /**
         * 解码
         * @param input
         * @version Egret 3.0.3
         */
        static decode(input: string): string;
        /**
         * 编码
         * @param input
         * @version Egret 3.0.3
         */
        static encode(input: string): string;
        /**
         * 解析Base64格式数据
         * @param input
         * @param bytes
         * @version egret 3.0.3
         */
        static decodeBase64AsArray(input: string, bytes: number): Uint32Array;
        /**
         * 暂时不支持
         * @param data
         * @param decoded
         * @param compression
         * @version egret 3.0.3
         * @private
         */
        static decompress(data: string, decoded: any, compression: string): any;
        /**
         * 解析csv数据
         * @param input
         * @version egret 3.0.3
         */
        static decodeCSV(input: string): number[];
        private static _keyStr;
    }
}
declare class UIPool {
    static getInstance(): UIPool;
    private static instance;
    private _pool;
    constructor();
    msgDO(msgtype: number, obj: Object): void;
    /** 处理动作消息 */
    execMessage(data: any): void;
    createObject(classFactory: any): any;
    getObject(key: string): UIObject;
    destroyObject(obj: UIObject): void;
    private onEnterFrame(advancedTime);
}
/**
 * 素材需要提前加载好
 * 素材命名规则：类型_数值（有类型是因为一般会同时有几种数字图片，比如大小号或不同颜色）
 * 点号素材命名：类型_dot
 * 创建BitmapNumber使用createNumPic返回DisplayObjectContainer
 * 创建好的BitmapNumber数值需要变化是调用changeNum
 * 回收使用desstroyNumPic
 *
 */
declare class BitmapNumber extends BaseClass {
    private _imgPool;
    private _containerPool;
    constructor();
    /**
     * 根据需要的数字和类型返回一个DisplayObjectContainer
     * @param num 字值，支持小数点 也可以为图片ID 默认为字值
     * @param type 素材类型
     * @param b 是否加载ID字符串名称图片 默认为false 不必填写这个参数 需要时传true
     */
    createNumPic(num: string, type: string, b?: boolean): egret.DisplayObjectContainer;
    desstroyNumPic(picContainer: egret.DisplayObjectContainer): void;
    changeNum(picContainer: egret.DisplayObjectContainer, num: number, type: string): void;
    private repositionNumPic(container);
    private clearContainer(picContainer);
    private recycleBM(bm);
    private getContainer();
    private getSingleNumPic(num, type);
    private getTexture(num, type);
    private getBitmap();
}
/**
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
declare class CommonUtils extends BaseClass {
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    static addLableStrokeColor(lable: eui.Label, color: any, width: any): void;
    /**
     * 深度复制
     * @param _data
     */
    static copyDataHandler(obj: any): any;
    /**
     * 锁屏
     */
    static lock(): void;
    /**
     * 解屏
     */
    static unlock(): void;
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    static labelIsOverLenght: (label: any, num: any) => void;
    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    static int64ToNumber(obj: any): number;
    constructor();
}
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
declare class DateUtils extends BaseClass {
    constructor();
    compareDay(time: string): boolean;
    compareMatch(time: string, hour: number): number;
    getDate(time: string): Date;
    /** 只保留小时 */
    getXiaoTime(dt: string): string;
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00   4:xx天前，xx小时前，xx分钟前
     * @return
     *
     */
    getFormatBySecond(second: number, type?: number): string;
    formatDate(date: Date): string;
    /** 判断是否是闰年 */
    isLeapYear(year: any): boolean;
    private getFormatBySecond1(t?);
    private getFormatBySecond3(t?);
    private getFormatBySecond2(time);
    private getFormatBySecond4(time);
    private getFormatBySecond5(time);
    private getFormatBySecond6(time);
    private getFormatBySecond7(time);
    private getFormatBySecond8(time);
}
/**
 */
declare class DeviceUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 当前是否Html5版本
     * @returns {boolean}
     * @constructor
     */
    readonly IsHtml5: boolean;
    /**
     * 当前是否是Native版本
     * @returns {boolean}
     * @constructor
     */
    readonly IsNative: boolean;
    /**
     * 是否是在手机上
     * @returns {boolean}
     * @constructor
     */
    readonly IsMobile: boolean;
    /**
     * 是否是在PC上
     * @returns {boolean}
     * @constructor
     */
    readonly IsPC: boolean;
    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsQQBrowser: boolean;
    /**
     * 是否是IE浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsIEBrowser: boolean;
    /**
     * 是否是Firefox浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsFirefoxBrowser: boolean;
    /**
     * 是否是Chrome浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsChromeBrowser: boolean;
    /**
     * 是否是Safari浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsSafariBrowser: boolean;
    /**
     * 是否是Opera浏览器
     * @returns {boolean}
     * @constructor
     */
    readonly IsOperaBrowser: boolean;
    readonly isIPhoneX: boolean;
}
/** 龙骨动画管理列 */
declare class DragonBoneManager {
    constructor();
    /** 记录是否加载过龙骨资源 */
    _hash: HashMap;
    /** 获取龙骨动画
     * @param dbName  			龙骨文件名称
     * @param armatureName      骨架名称
     */
    getDBArmature(dbName: string, armatureName: string): dragonBones.Armature;
    /** 给龙骨类工厂添加数据 */
    private makeDragonData(dbName);
    private static instance;
    static getInstance(): DragonBoneManager;
}
/**
 * Created by Saco on 2014/12/1.
 */
declare class LocationProperty {
    static getPara(paraName: string, paraUrl?: string): any;
    static setProperty(paraName: string, paraValue: string, paraUrl?: string): string;
    static hasProperty(paraName: string, paraUrl?: string): boolean;
}
/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
declare class MathUtils extends BaseClass {
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    getAngle(radian: number): number;
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    getRadian2(p1X: number, p1Y: number, p2X: number, p2Y: number): number;
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number): number;
    /**
     * 求组合C(n,m)
     * @param   n   集合元素个数
     * @param   m   取出元素个数
     * @param   callback    运行中的回调
     * @param   end         运行结束后的回调
     */
    Combination(n: number, m: number, callback: Handler, end: Handler): void;
    doCombination(n: number, m: number, i: number, rlen: number, result: number[], callback: Handler): boolean;
    /**
     * 求集合笛卡尔积
     * @param   sets    包含集合元素个数的数组
     */
    cartesian(sets: number[], callback: Handler, end: Handler): void;
    doCartesian(sets: number[], i: number, result: number[], callback: Handler): boolean;
    getNumberDigit(num: number): number;
    calNumberJieCheng(num: number): number;
}
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
declare class ObjectPool {
    /**
        * 取出一个对象
        * @param classZ Class
        * @return Object
        *
        */
    static pop(refKey: string, ...args: any[]): any;
    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
    static popWithExtraKey(refKey: string, extraKey: any): any;
    /**
     * 放入一个对象
     * @param obj
     *
     */
    static push(obj: any): boolean;
    /**
     * 清除所有对象
     */
    static clear(): void;
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
    static clearClass(refKey: string, clearFuncName?: string): void;
    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
    static dealFunc(refKey: string, dealFuncName: string): void;
    private static _content;
    private _objs;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 放回一个对象
     * @param obj
     */
    pushObj(obj: any): void;
    /**
     * 取出一个对象
     * @returns {*}
     */
    popObj(): any;
    /**
     * 清除所有缓存对象
     */
    clear(): void;
}
/**
 * Created by yangsong on 2014/11/23.
 */
declare class RandomUtils extends BaseClass {
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    limit($from: number, $end: number): number;
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    limitInteger($from: number, $end: number): number;
    /**
     * 获取一个变分比是否成功
     * @param per   百分比 比如30% 给30
     */
    randPercent(per: number): boolean;
    /**
     * 获取一个万分比是否成功
     * @param rand  万分比的数
     */
    rand10000(rand: number): boolean;
    /**
    * 获取一个千分比是否成功
    * @param rand  万分比的数
    */
    rand1000(rand: number): boolean;
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    randomArray(arr: any[]): any;
    randomFrom(lowerValue: any, upperValue: any): number;
}
/**
 * 继承eui的Componet 添加了 OnAdd ondestory 和msgDO
 * @author
 *
 */
declare class EuiObject extends eui.Component {
    _data: Object;
    /** 里面的元件全部添加到舞台的通知 */
    private _hander;
    constructor();
    addHander(hander: Handler): void;
    onAddStage(e: egret.Event): void;
    onAdd(): void;
    /** 移出舞台后调用 */
    removeStage(): void;
    /** 这里进行移出场景的处理 */
    onDestroy(): void;
    /** 供继承的函数, 刷新显示 */
    updataShow(): void;
    msgDo(msgType: number, obj: Object): void;
}
/**
 * Created by Channing on 2014/12/6.
 * 震动
 */
declare class ShockUtils extends BaseClass {
    MAP: number;
    SPRITE: number;
    private mapPoss;
    private spritePoss;
    private _shockPoss;
    private _shockLength;
    private _shockCount;
    private _target;
    private _rx;
    private _ry;
    private _type;
    private _repeatCount;
    constructor();
    destroy(): void;
    shock(type?: number, target?: egret.DisplayObject, repeatCount?: number): void;
    private start(num?);
    private stop();
    private onShockEnter(time);
    repeatCount: number;
}
/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
declare class StageUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    getHeight(): number;
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    getWidth(): number;
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    setTouchChildren(value: boolean): void;
    /**
     * 指定此对象是否接收鼠标/触摸事件
     * @param value
     */
    setTouchEnabled(value: boolean): void;
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    setMaxTouches(value: number): void;
    /**
     * 设置帧频
     * @param value
     */
    setFrameRate(value: number): void;
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    getStage(): egret.Stage;
}
/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
declare class StringUtils extends BaseClass {
    /**
     * 构造函数
     */
    constructor();
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    trimSpace(str: string): string;
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    getStringLength(str: string): number;
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    isChinese(str: string): boolean;
    /**  将字符串的后两位组成数字 */
    makeStrToNumer(str: string): number;
}
/**
 * Created by Saco on 2015/10/26.
 */
declare class TextFlowMaker extends BaseClass {
    private STYLE_COLOR;
    private STYLE_SIZE;
    private PROP_TEXT;
    constructor();
    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    generateTextFlow(sourceText: string): egret.ITextElement[];
    private getSingleTextFlow(text);
}
declare class TimerHandler {
    /**执行间隔*/
    delay: number;
    /**是否重复执行*/
    repeat: boolean;
    /**重复执行次数*/
    repeatCount: number;
    /**是否用帧率*/
    userFrame: boolean;
    /**执行时间*/
    exeTime: number;
    /**处理函数*/
    method: Function;
    /**处理函数所属对象*/
    methodObj: any;
    /**完成处理函数*/
    complateMethod: Function;
    /**完成处理函数所属对象*/
    complateMethodObj: any;
    /**上次的执行时间*/
    dealTime: number;
    /**清理*/
    clear(): void;
}
/**
 * Created by yangsong on 2014/11/23.
 * Timer管理器
 */
declare class TimerManager extends BaseClass {
    private _handlers;
    private _delHandlers;
    private _currTime;
    private _currFrame;
    private _count;
    private _timeScale;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 设置时间参数
     * @param timeScale
     */
    setTimeScale(timeScale: number): void;
    /**
  *
  * 定时执行
  * @param delay 执行间隔:毫秒
  * @param repeatCount 执行次数, 0为无限次
  * @param method 执行函数
  * @param methodObj 执行函数所属对象
  * @param complateMethod 完成执行函数
  * @param complateMethodObj 完成执行函数所属对象
  *
  */
    doTimer(delay: number, repeatCount: number, method: Function, methodObj: any, complateMethod?: Function, complateMethodObj?: any): void;
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    doFrame(delay: number, repeatCount: number, method: Function, methodObj: any, complateMethod?: Function, complateMethodObj?: any): void;
    /**
     * 定时器执行数量
     * @return
     *
     */
    readonly count: number;
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    remove(method: Function, methodObj: any): void;
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    removeAll(methodObj: any): void;
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    isExists(method: Function, methodObj: any): boolean;
    /**
     * 每帧执行函数
     * @param frameTime
     */
    private onEnterFrame();
    private create(useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
}
declare class BaseDefines {
    static TKCLOUD_TYPE: {
        TO_PAGE: string;
    };
    static VIEW_TYPE: {
        SHOW_WAIT: string;
        HIDE_WAIT: string;
    };
    static FrameworkVersion: number;
}
/**
 * 背景音乐类
 */
declare class SoundBg extends BaseSound {
    private _currBg;
    private _currSound;
    private _currSoundChannel;
    private _volume;
    private _endHandler;
    private _loops;
    private _soundTimer;
    private _soundLength;
    private _soundFlag;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 停止当前音乐
     */
    stop(): void;
    /**
     * 播放某个音乐
     * @param effectName
     */
    play(effectName: string, volume: number, loops: number, end?: Handler): void;
    /**
     *如果有些机型 需要触发的话 就接着 播放login音乐
     */
    continuePlay(): void;
    /**
    * 设置音量
    * @param volume
    */
    setVolume(volume: number): void;
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    loadedPlay(key: string): void;
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    checkCanClear(key: string): boolean;
    private timerFunc();
    /**
     * 播放
     * @param sound
     */
    private playSound(sound, loops, end);
}
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
declare class SoundEffects extends BaseSound {
    private _volume;
    private _currSoundChannel;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 播放一个音效
     * @param effectName
     */
    play(effectName: string, volume?: number): void;
    /**
    * 设置音量
    * @param volume
    */
    setVolume(volume: number): void;
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    loadedPlay(key: string): void;
    /**
     * 停止当前音乐
     */
    stop(): void;
    /**
     * 播放
     * @param sound
     */
    private playSound(sound);
}
/**
 * 该工具类用于解决EgretEngine2.5版本没有anchorX/anchorY属性值的问题
 * 在创建游戏场景前需要执行AnchorUtil.init();初始化工具并完成属性的注入
 * 方式一（推荐）：
 * AnchorUtil.setAnchorX(target, anchorX); //设置对象的anchorX值
 * AnchorUtil.setAnchorY(target, anchorY); //设置对象的anchorY值
 * AnchorUtil.setAnchor(target, anchor); //同时设置对象的anchorX和anchorY值
 * 方式二：
 * target["anchorX"] = value; //设置对象的anchorX值
 * target["anchorY"] = value; //设置对象的anchorY值
 * target["anchor"] = value; //同时设置对象的anchorX和anchorY值
 * 方式三：
 * 修改egret.d.ts，在DisplayObject声明中添加anchorX、anchorY和anchor属性，代码的写法和引擎之前版本相同：
 * target.anchorX = value; //设置对象的anchorX值
 * target.anchorY = value; //设置对象的anchorY值
 * target.anchor = value; //同时设置对象的anchorX和anchorY值
 *
 * Created by Saco on 2015/9/16.
 */
declare class AnchorUtil {
    /**
     * 初始化工具类，并完成注入anchorX/anchorY属性
     */
    static init(): void;
    /**
     * 设置对象的anchorX值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    static setAnchorX(target: egret.DisplayObject, value: number): void;
    /**
     * 设置对象的anchorY值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    static setAnchorY(target: egret.DisplayObject, value: number): void;
    /**
     * 设置对象的anchor值，同时改变anchorX和anchorY值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    static setAnchor(target: egret.DisplayObject, value: number): void;
    /**
     * 获得对象的anchorX值
     * @param target 取值的对象
     * @returns {any|number} anchorX值
     */
    static getAnchorX(target: egret.DisplayObject): number;
    /**
     * 获得对象的anchorY值
     * @param target 取值的对象
     * @returns {any|number} anchorY值
     */
    static getAnchorY(target: egret.DisplayObject): number;
    private static _isInited;
    private static _propertyChange;
    private static _anchorChange;
    /**
     * 注入anchorX/anchorY属性，并重写引擎底层方法实现相对锚点
     */
    private static injectAnchor();
    private static changeAnchor(tar);
}
declare namespace Base64 {
    function base64_Decode(input: string): string;
    function base64_Encode(input: string): string;
}
declare class BaseDataEvent extends egret.Event {
    data: any;
}
/**
 *   常用的静态函数类
 */
declare class BaseFunc {
    static objToClass(obj: Object, cl: any): void;
    static objToObj(obj: Object, desc: Object): void;
    /** 深度复制一个类实例的属性（string，number)给另一个类实例
     *
     */
    static ClassToClass(c1: any, c2: any): void;
    static strToObj(str: string, s1?: string, s2?: string): Object;
    static randomInRange(min: number, max: number): number;
    static FormatTimeMM(sec: number): string;
    static alignText(txt: eui.Label, max?: number): void;
    static formatTimeString(n: number): String;
    static getHeroOcImg(q: number): string;
    static formatDate(num: any, type?: number): any;
    static timestampDate(): any;
    static getqualitymark(level: number): string;
    static getqualitycolor(level: number): number;
    /** 将带差字符串转化
     * @param source 员字符串
     * @param ...args 参数
     */
    static getLang(source: string, ...args: any[]): string;
    /** 将带差字符串转化
     * @param source 员字符串
     * @param ...args 参数
     */
    static getLangNum(source: string, ...args: any[]): string;
    /** 将带差字符串转化
     * @param testStr 替换 test 的字符串
     * @param source 员字符串
     * @param ...args 参数
     */
    static getLangNumWithTest(testStr: string, source: string, ...args: any[]): string;
    static GetDay(day: number): string;
}
/** 大数计算类 */
declare class BigMath {
    /** 得到大数string */
    static toString(a: any): string;
    /** 加 */
    static add(a: any, b: any): string;
    /** 减 */
    static sub(a: any, b: any): string;
    /** 乘 */
    static mul(a: any, b: any): string;
    /** 除 */
    static div(a: any, b: any): string;
    /** 平方根 */
    static sqrt(e: any): string;
    /** 返回基数（base）的指数（exponent）次幂 */
    static pow(e: any, i: number): string;
    /** 比较大小 e > i true*/
    static greater(e: any, i: any): boolean;
    /** 大于等于 */
    static greaterOrEqual(e: any, i: any): boolean;
    /** 小于 */
    static less(e: any, i: any): boolean;
    /** 小于等于 */
    static lessOrEqual(e: any, i: any): boolean;
    /** 等于 */
    static equal(e: any, i: any): boolean;
    /** 取小 */
    static min(e: any, i: any): string;
    /** 取大 */
    static max(e: any, i: any): string;
    /** 取中间数 */
    static clamp(e: any, i: any, n: any): string;
    /** 转换成number */
    static parseNumber(e: any): number;
    /** 向下取整 */
    static floor(e: any): string;
    /** 对齐e */
    static alignExp(t: BigNum, e: BigNum): number;
    constructor();
}
/** 大数类 */
declare class BigNum {
    /** e前面的数 */
    _n: number;
    /** e后面的数 */
    _e: number;
    constructor(num: any);
    /** 设置大数类 */
    setNum(num: any): void;
    /** 重新组织数据，比如将10e2改成1.0e3 */
    format(): void;
    /** 大数的对数运算 */
    log10(num: number): number;
    /** 转成字符串 */
    toString(): string;
}
/**
 *
 * @author
 * 飞出效果类
 *
 */
declare namespace EffectFly {
    /**开始显示提示 */
    function showTips(data: Object): void;
}
/**
 * 游戏中使用到的特效
 */
declare namespace EffectUtils {
    /**
   *                 飘字特效
   * str             提示内容
   * effectType      动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失 5：从大变小 等等
   * isWarning       是否是警告，警告是红色
   */
    function showTips(str?: string, effectType?: number, isWarning?: boolean): void;
    /** 对象闪烁特效
     * obj         闪烁对象
     * interval    闪烁总时间 (毫秒)
     */
    function blinkEffect(obj: any, interval?: number): void;
    /** 对象旋转特效
     * obj   旋转对象
     * time  旋转一周用时，毫秒
    **/
    function rotationEffect(obj: any, time?: number): void;
    /** 取消对象旋转 **/
    function removeRotationEffect(obj: any): void;
    /**抖动对象特效 **/
    function shakeObj(obj: any): void;
    /** 抖动对象特效(震屏)
      * effectType 1:抖动 2：震动
     **/
    function shakeScreen(obj: any, effectType?: number): void;
    /**
   * 显示对象上下浮动特效
   * obj           对象
   * time          浮动时间 毫秒
   * space         浮动高度
   */
    function flyObj(obj: any, time: any, space?: number): void;
    /**
    * 给显示对象增加特效
    * obj           对象
    * cartoonType   动画类型 1:【可爱】按下变小，放开弹大 2:按下变小，放开轻微弹大 3：按下变小，放开变大
    */
    function playEffect(obj: any, cartoonType?: number): void;
    /**
     * 给显示对象增加从中心放大的效果(放大到1.5倍)
     */
    function playCenterScale(obj: any): void;
    /**
   * 给显示对象增加持续放大特效
   * obj           对象
   */
    function playScaleEffect(obj: any): void;
    function twComplete(tw: egret.Tween, img: eui.Image): void;
}
/**
 *
 * 游戏中用到的动画效果 可以复用的效果（单体类)
 *
 */
declare namespace GameEffcet {
    function onlineShow(source: string, x: number, y: number): void;
    /** 用于物体的闪烁效果 alpha循环从0到1 */
    function alphaChange(obj: any, time?: number): void;
    /** 用于文字的放大和回原效果 */
    function bigText(obj: any, time?: number): void;
    /** 用于上下移动 */
    function UpMove(obj: any, time?: number): void;
    /** 用于上下连续移动 */
    function upAndDowMove(obj: any, time?: number): void;
}
declare class GameMusic {
    /**
     * 设置音量
     * @param va
     */
    static soundVolume: any;
    /**
     * 播放
     * @param name  音乐文件名
     * @param startTime 开始播放的时间 默认是0
     * @param loops  播放次数<= 0循环播放，>0播放该次数,默认为0
     * @constructor
     */
    static play(name: string, startTime?: number, loops?: number): void;
    /**
     * 关闭
     */
    static stop(): void;
    /**
   * 设置音量
   * @param volume
   */
    static setVolume(volume: number): void;
    private static sound;
    private static soundChannel;
    private static soundPlaying;
}
/** 游戏中的回调类
 *  主要功能
 *  处理游戏中的回调
 */
declare class Handler {
    /** 处理方法 **/
    method: Function;
    /** 参数 **/
    args: any[];
    thisArg: any;
    constructor(thisArg?: any, method?: Function, args?: any[]);
    /** 执行处理 **/
    execute(): void;
    /** 执行处理（增加参数的输出) */
    executeWith(data: any[]): void;
}
/**
 *  hahsMap
 */
declare class HashMap {
    private _keys;
    private props;
    constructor();
    clear(): void;
    /** 是否已经有着个key **/
    containsKey(key: any): boolean;
    containsValue(value: Object): boolean;
    getValue(key: any): any;
    put(key: any, value: Object): any;
    remove(key: any): Object;
    putAll(map: HashMap): void;
    /**  hash表的长度 **/
    size(): number;
    isEmpty(): boolean;
    values(): any[];
    keys(): any[];
}
declare class HEvent extends egret.EventDispatcher {
    static getInstance(): HEvent;
    private static Instance;
    private static init();
    constructor();
}
/**
 *
 * @author
 *
 */
declare class HLoad extends egret.HttpRequest {
    hander: Handler;
    time: number;
    isJson: boolean;
    constructor();
}
/**
 * @module Lcp
 * @class LEvent
 * @constructor
 */
declare namespace lcp {
    /**
     * 自定义事件类
     */
    class LEvent extends egret.Event {
        CLASS_NAME: string;
        private _obj;
        constructor(type: string, obj?: Object, bubbles?: boolean, cancelable?: boolean);
        clone(obj?: Object): LEvent;
        toString(): void;
        /**
         * 传参获取
         * @returns {Object}
         */
        readonly param: Object;
    }
}
/**
 * Created by d8q8 on 2014/8/12.
 * @module Lcp
 * @class LListener
 * @constructor
 */
declare namespace lcp {
    /**
     * 全局侦听类及消息处理
     */
    class LListener {
        static getInstance(): LListener;
        private static _instance;
        CLASS_NAME: string;
        private _dispatcher;
        private isInit;
        constructor();
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        dispatchEvent(event: LEvent): boolean;
        dispatchEventWithType(type: string, bubbles?: boolean, data?: any, cancelable?: boolean): boolean;
        toString(): string;
    }
}
/**
 * 缓动eui.label 的数字
 * @author
 *
 */
declare class LN {
    static getInstance(): LN;
    private static instance;
    _hash: HashMap;
    constructor();
    /** 缓动数字的变化
     * @param label 缓动的label
     * @param num   变化后的数字
     * @param time  缓动的时间，默认2秒
     */
    playNum(label: eui.Label, num: number, time?: number): void;
    deleteMoveNum(m: MoveNum): void;
    /** 创建图形数字 */
    addPicNum(g: eui.Group, num: number, gray?: boolean): void;
    /** 根据name和num得到zmovie **/
    getMovieClip(moveName: string, num: number): zmovie.ZMovieClip;
    /** 博放技能状态的动画(循环播放，最后要调用stopZmove停止 )
    * @param key       动画名称
    * @param num       动画图片数量
    * @param x
    * @param y
    */
    playZmoveLoop(key: string, num: number, x: number, y: number, scale?: number): zmovie.ZMovieClip;
    /** 停止播放动画
    */
    stopZmove(z: zmovie.ZMovieClip): void;
    /** 博放技能状态的动画
     * @param key       动画名称
     * @param num       动画图片数量
     * @param x
     * @param y
     * @param hander    动画播放完后的回调函数
     */
    playZmove(key: string, num: number, x: number, y: number, hander?: Handler, scale?: number, stopName?: string): void;
    /** 飞文字的函数 可以有多排文字 用数组给进 可以是html */
    flyText(str: any[], cor?: any[], p?: egret.Point): void;
    /** 将妖侠增加的攻击 生命  物防 法防 生成字符串 并放入数组 */
    getHeroAddInfoArray(arr: any[], atk: number, hp: number, def: number, m: number): void;
    private endZmove(e);
    private hSize(e);
    private flyOne(g);
    private flyTwo(g);
    private flyEnd(g);
}
/**
 * Created by yangsong on 2014/11/22.
 */
declare class Log {
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    static trace(key: any, ...optionalParams: any[]): void;
}
declare class MoveNum {
    /** 变化前的数字 */
    _oldValue: number;
    /** 变化后的数字 */
    _cValue: number;
    /** 增加或减少的数字 */
    _addVelue: number;
    /** 是增加还是减少 */
    _bAdd: boolean;
    /** 变化的时间 */
    _ctime: number;
    /** 缓动的事件 */
    _endTime: number;
    /** 变化的label */
    _label: eui.Label;
    constructor();
    play(label: eui.Label, num: number, time: number): void;
    stop(): void;
    private onEnterFrame(advancedTime);
}
/**
 *   处理消息号的类
 */
declare namespace MsgType {
    enum MSG {
        SV_LOGIN = 2000,
        PLAYER_HEART_INFO = 2101,
        SV_ADD_BLOCK = 3001,
        SV_CHAT = 3000,
        SV_DEL_ONECHAT = 3002,
        SV_DEL_BLOCK = 3003,
        MSG_END = 3004,
    }
}
/** 划线，实现屏幕的划屏特效 */
declare class SlideLine extends egret.Sprite {
    constructor();
    /** 画线
     * @param	p1		第一点坐标
     * @param 	p2		第2点坐标
     */
    drawPoint(p1: egret.Point, p2: egret.Point): void;
}
/** 管理屏幕划痕的管理类 */
declare class SlideLineManager {
    static getInstance(): SlideLineManager;
    private static instance;
    /** 线条 */
    _slideLines: SlideLine[];
    _recordPoint: egret.Point;
    constructor();
    /** 画线 */
    drawPoint(x: number, y: number): void;
    /** 画线完成的返回 */
    backLine(slide: SlideLine): void;
    /** 完成划线 */
    endDraw(): void;
}
/**
 *  处理JS字符的静态函数类
 *  主要功能
 *  处理字符串的一些静态函数
 */
declare namespace MyUtil {
    class ST {
        /**
         *  字符串转Uint8的数组
         */
        static stringToUint(str: string): Uint8Array;
        /**
         *  将uint8数组转换成字符串
         */
        static uint8Tostring(unit: Uint8Array): string;
        static strToUTF8(str: string): any;
    }
}
/** 将大数(BigNum),表示为数+英文符号 */
declare class UnitUtil {
    static getInstance(): UnitUtil;
    private static instance;
    /** 用来表示单位的数字 */
    _tag: string[];
    _low: string[];
    _cap: string[];
    /** 所有数字的下标组合 */
    unitKey: string[];
    _r: number[];
    constructor();
    /** 向上去整 */
    easyNumberCeil(e: any): string;
    /** 数 */
    easyNumber(e: any): string;
    /** 得到大数登机 */
    getUnitLevel(e: any): string;
    /** 组合数组,并把值放入unitkey */
    private comArray(res, des);
}
/**
 * 闪烁特效类
 */
declare class Blink extends egret.EventDispatcher {
    private _target;
    private _time;
    private _currTime;
    /*** @param target 目标
    * @param time 闪啊闪的时间
    * @isAuto 是否立即执行，默认是ture，也可以设置false，外部调用start方法
    */
    constructor(target: egret.DisplayObjectContainer, time: number, isAuto?: boolean);
    start(): void;
    private runDown(e);
    private runUp(e);
    private checkOver();
    private destroy();
}
/**
  * tips特效汇总
  * TipsUtils.showTipsDownToUp()
  */
declare namespace TipsUtils {
    function showTipsDownToUp(str?: string, isWarning?: boolean): void;
    function showTipsLeftOrRight(str?: string, isWarning?: boolean, isFromeLeft?: boolean): void;
    function showTipsFromCenter(str?: string, isWarning?: boolean): void;
    function showTipsBigToSmall(str?: string, isWarning?: boolean): void;
    function showTipsNotice(str?: string, isWarning?: boolean): void;
}
declare namespace one {
    /**
     * DOM 元件和 egret 显示对象的映射。 egret 显示对象属性的修改会同时改变 DOM 元件属性
     */
    class DOMNode {
        private node;
        private element;
        private dp;
        private lastMatrix;
        private lastWidth;
        private lastHeight;
        constructor();
        /**
         * 将 DOM 节点和 egret 对象映射
         */
        mapDisplayObject(displayObject: egret.DisplayObject): void;
        /**
         * 交换节点的位置
         */
        swapDom(dom1: any, dom2: any): void;
        /**
         * 显示 DOM 节点
         */
        show(): void;
        /**
         * 隐藏 DOM 节点
         */
        hide(): void;
        /**
         * 绑定一个 DOM 元件
         * @element DOM 元件，不要修改此元件的 style 的位置、旋转、缩放、边框等属性
         */
        bind(element: HTMLElement): void;
        /**
         * 解绑 DOM 元件
         */
        unbind(): void;
        updatePosition(): void;
    }
}
declare class GameConfigManager {
    TEXT_COLORS: {
        black: number;
        blue: number;
        green: number;
        grayblue: number;
        golden: number;
        white: number;
        milkWhite: number;
        grayWhite: number;
        yellow: number;
        lightYellow: number;
        orangeYellow: number;
        red: number;
        purple: number;
        pink: number;
        ligthRed: number;
    };
    LABEL_FONT_SIZE: {
        bigSize: number;
        littleSize: number;
        middleSize: number;
        normalSize: number;
    };
    curPanel: egret.DisplayObjectContainer;
    originWidth: number;
    originHeight: number;
    systemType(): string;
    init(): void;
    curStage(): egret.Stage;
    curWidth(): number;
    curHeight(): number;
    getOriginWidth(): number;
    getOriginHeight(): number;
}
declare namespace one {
    class WebVideo extends WebNode {
        src: string;
        video: HTMLVideoElement;
        private _src;
        constructor();
        contentFullScreen(): void;
        enableAutoPlay(_b: boolean): void;
        enableControls(_b: boolean): void;
        swapHierarchy(): void;
    }
}
declare namespace one {
    class WebView extends WebNode {
        src: string;
        iframe: HTMLIFrameElement;
        private _src;
        constructor();
        setAllowFullscreen(v: boolean): void;
    }
}
/**
 * Created by ASUS on 15-2-9.
 */
declare namespace zmovie {
    class LargeImage extends egret.DisplayObjectContainer {
        libName: string;
        displayLibName: string;
        imgDepth: number;
        private libObj;
        constructor(imgArr: any, libObj: any, libName: string);
        setObject(imgArr: any, libObj: any, libName: string): void;
    }
}
declare namespace zmovie {
    class Util {
        static clearDisposeDisplay(d: egret.DisplayObjectContainer): void;
        static getTextureArrByName(imgArr: any, libObj: any, libName: string): any[];
        static getTextureByName(imgArr: any, libName: string): egret.Texture;
    }
}
/**
 * Created by zringhost on 14-12-14.
 */
declare namespace zmovie {
    class ZAssetManager {
        constructor();
    }
}
/**
 * Created by ASUS on 15-2-9.
 */
declare namespace zmovie {
    class ZImage extends egret.DisplayObjectContainer {
        imgDepth: number;
        displayLibName: string;
        private img;
        constructor(t: egret.Texture);
        setTexture(t: egret.Texture): void;
        setScale(s: number): void;
    }
}
/**
 * Created by zringhost on 14-12-14.
 */
declare namespace zmovie {
    class ZMovieClip extends egret.DisplayObjectContainer {
        static EVENT_FRAME_COMPLETE: string;
        static EVENT_MOVE: string;
        static EVENT_ENTER_FRAME: string;
        static EVENT_MC_NAME: string;
        static EVENT_AREA: string;
        static EVENT_GOTOANDPLAYLABEL: string;
        static getFrameMovieObject(o: any, frameI: number): any;
        _mcName: string;
        libScale: number;
        _direction: number;
        fmObj: any;
        beginFrame: number;
        endFrame: number;
        parentCFOObj: any;
        areaObj: any;
        totalFrame: number;
        frameTime: number;
        isPlay: boolean;
        currPlaylabel: string;
        isLoop: boolean;
        currArea: any[];
        imgDepth: number;
        mcObj: any;
        parentPlayTime: number;
        scale: number;
        imgArr: any;
        endHander: Handler;
        _scale: number;
        private libObj;
        private currFrame;
        private layerArr;
        private _timeScale;
        constructor(imgArr: any, libObj: any, mcName?: string, scale_?: number);
        onDestory(): void;
        getTotalFrame(): number;
        getCurrPlayLabel(): string;
        getCurrFrame(): number;
        getIsPlay(): boolean;
        setTimeScale(num: number): void;
        getTimeScale(): number;
        getLabels(): any;
        getIsExistLabel(lName: string): boolean;
        getCurrLabelObj(): any;
        gotoAndPlayLabel(label: string, isPlayToEnd?: boolean): any;
        disposeLayerImg(): void;
        setMovieObject(imgArr: any, libObj: any, mcName: string, scale_?: number): void;
        nextFrame(): void;
        prevFrame(): void;
        stop(): void;
        play(): void;
        gotoAndStop(frame: number): void;
        gotoAndPlay(frame: number): void;
        advanceTime(): void;
        private frameComplete();
        private framePlay();
        private addChildToDepth(id);
    }
}
