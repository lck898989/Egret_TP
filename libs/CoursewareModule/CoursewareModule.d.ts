declare class DragAnyMakeOptionalChooseBtn extends UIObject {
    protected ImgList: eui.Image[];
    protected rectCancle: eui.Rect;
    protected btnReset: eui.Image;
    protected group: eui.Group;
    protected targetList: eui.Image[];
    protected isNewItem: boolean;
    protected curMoveItemIndex: number;
    protected curMoveItemObj: eui.Image;
    protected curMoveItemObjStudent: eui.Image;
    protected rectListSelect: eui.Rect[];
    protected imgSelected: eui.Image;
    protected indexTrueAnswer: number;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initSelectData(rectListSelect: eui.Rect[], imgSelected: eui.Image, indexTrueAnswer: number): void;
    protected initAddEvent(): void;
    protected touchTapChooseRectEvent(event: egret.TouchEvent): void;
    protected touchBeginOriginalEvent(event: egret.TouchEvent): void;
    protected newObjForTouchBegin(obj: eui.Image, xGlobal: number, yGlobal: number): eui.Image;
    protected deleteObj(obj: eui.Image): void;
    protected touchBeginMakedItemEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected resetData(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected revChooseHandle(chooseIndex: number): void;
    protected revStartHandle(isNewItemStr: string, curIndexStr: string, targetX: number, targetY: number): void;
    protected revMoveHandle(targetX: number, targetY: number): void;
    protected revEndHandle(isCancelStr: string, isNewItemStr: string, targetX: number, targetY: number, deleteIndex: number): void;
}
declare class CoursewareDefines {
    static version: number;
}
declare class ClickBtnToShowScene extends UIObject {
    protected ImgList: egret.DisplayObject[][];
    protected btnList: egret.DisplayObject[];
    protected CurState: number;
    protected rect_bg: egret.DisplayObject;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initAddEvent(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected touchTapBgEvent(event: egret.TouchEvent): void;
    protected refreshStateView(): void;
    protected revNextLayerHandle(index: number): void;
}
declare class ClickHideScene extends UIObject {
    protected ImgSelectedList: eui.Image[];
    protected btnReset: eui.Image;
    private group;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected resetData(): void;
    protected touchTapImgEvent(event: egret.TouchEvent): void;
    protected destroyData(): void;
    protected destroyEvent(): void;
    protected touchTapResetEvent(event: egret.TouchEvent): void;
    protected revChooseHandle(chooseIndex: number): void;
}
/**
 * by zheng
 * 点击任意组件显示下一阶段
 * @param clickItemArr  点击的组件数组
 * @param showPhaseArr  显示下一场景数组
 * @param showIndexArr  显示阶段索引
 * 请一一对应
 */
declare class ClickItemForShowPhaseScene extends UIObject {
    protected clickItemArr: egret.DisplayObject[];
    protected showPhaseArr: egret.DisplayObject[][];
    protected showIndexArr: number[];
    protected backImg: eui.Image;
    constructor();
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    /** 接收信令 */
    execMessage(data: any): void;
    /** 初始化场景 */
    protected initScene(): void;
    /** 点击显示下一阶段 */
    protected doShowNextPhaseItemHandle(e: egret.TouchEvent): void;
    /** 返回初始状态 */
    private doBackInitHandle();
}
declare class ClickMoveFromPathScene extends UIObject {
    protected ImgSelectedList: egret.DisplayObject[];
    protected posList: egret.Point[];
    protected ImgIndexToPosIndex: number[];
    protected rightRot: number;
    protected isRotation: boolean;
    protected initRot: number;
    protected curPosIndex: number;
    protected curMoveObj: eui.Image;
    protected curSpeed: number;
    private group;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected getAngle(px1: number, py1: number, px2: number, py2: number): number;
    protected moveToPosForIndex(imgIndex: number): void;
    protected setPosIndex(posIndex: number): void;
    protected moveCallBack(imgIndex: number): void;
    protected initAddEvent(): void;
    protected resetData(): void;
    protected touchTapImgEvent(event: egret.TouchEvent): void;
    protected destroyData(): void;
    protected destroyEvent(): void;
}
declare class ClickOneChooseScene extends UIObject {
    protected ImgSelectedList: eui.Image[];
    protected rectListSelect: eui.Rect[];
    private group;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected resetData(): void;
    protected touchTapChooseRectEvent(event: egret.TouchEvent): void;
    protected destroyData(): void;
    protected destroyEvent(): void;
    protected revChooseHandle(chooseIndex: number): void;
}
/**
 * 时钟可触摸旋转
 */
declare class ClockTouchScene extends UIObject {
    protected clockImgArr: eui.Image[];
    protected group: eui.Group;
    protected _touchImg: eui.Image;
    private _offsetX;
    private _offsetY;
    private _initPosArr;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移除场景处理 */
    onDestroy(): void;
    /** 接收信令 */
    execMessage(data: any): void;
    /** 初始化场景 */
    protected initScene(): void;
    /** 初始添加监听 */
    protected initAddEvent(): void;
    /** 处理开始点击 */
    protected doTouchBeginHandle(e: egret.TouchEvent): void;
    /** 处理移动中 */
    protected doTouchMoveHandle(e: egret.TouchEvent): void;
    protected stop(): void;
    /** 处理移动结束 */
    protected doTouchEndHandle(e: egret.TouchEvent): void;
    /** 接收移动中 */
    protected revMoveingHandle(itemName: string, itemRotation: number): void;
    /** 接收鼠标抬起 */
    protected revMoveEndHandle(itemName: string, itemRotation: number): void;
}
declare class DragAnyMakeAndCancleComponent extends eui.Component {
    ImgList: eui.Image[];
    rectCanSet: eui.Rect;
    btnReset: eui.Image;
    group: eui.Group;
    curComponentIndex: number;
    protected targetList: eui.Image[];
    protected isNewItem: boolean;
    protected curMoveItemIndex: number;
    protected curMoveItemObj: eui.Image;
    protected curMoveItemObjStudent: eui.Image;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    touchMoveLayerEvent(event: egret.TouchEvent): void;
    touchEndLayerEvent(event: egret.TouchEvent): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected touchBeginOriginalEvent(event: egret.TouchEvent): void;
    protected newObjForTouchBegin(obj: eui.Image, xGlobal: number, yGlobal: number): eui.Image;
    protected deleteObj(obj: eui.Image): void;
    protected touchBeginMakedItemEvent(event: egret.TouchEvent): void;
    protected resetData(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected revStartHandle(isNewItemStr: string, curIndexStr: string, targetX: number, targetY: number): void;
    protected revMoveHandle(targetX: number, targetY: number): void;
    protected revEndHandle(isCancelStr: string, isNewItemStr: string, targetX: number, targetY: number, deleteIndex: number): void;
}
declare class DragAnyMakeForMaxAndCancleScene extends UIObject {
    protected ImgList: eui.Image[];
    protected rectCancle: eui.Rect;
    protected btnReset: eui.Image;
    protected group: eui.Group;
    protected numMax: number;
    protected targetList: eui.Image[];
    protected isNewItem: boolean;
    protected curMoveItemIndex: number;
    protected curMoveItemObj: eui.Image;
    protected curMoveItemObjStudent: eui.Image;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected touchBeginOriginalEvent(event: egret.TouchEvent): void;
    protected newObjForTouchBegin(obj: eui.Image, xGlobal: number, yGlobal: number): eui.Image;
    protected deleteObj(obj: eui.Image): void;
    protected touchBeginMakedItemEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected resetData(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected revStartHandle(isNewItemStr: string, curIndexStr: string, targetX: number, targetY: number): void;
    protected revMoveHandle(targetX: number, targetY: number): void;
    protected revEndHandle(isCancelStr: string, isNewItemStr: string, targetX: number, targetY: number, deleteIndex: number): void;
}
declare class BalanceComponent {
    imgListLeft: egret.DisplayObject[];
    imgListRight: egret.DisplayObject[];
    imgListBalanceLine: eui.Image[];
    numWeightLeftInit: number;
    numWeightRightInit: number;
    numWeightLeftCur: number;
    numWeightRightCur: number;
    rotMax: number;
    numWeightRotMax: number;
    pointCenter: egret.Point;
    constructor();
    initData(): void;
    onInit(): void;
    onDestroy(): void;
    setLeftItemObjList(time?: number, xTemp?: number, yTemp?: number): void;
    setRightItemObjList(time?: number, xTemp?: number, yTemp?: number): void;
    startRotTween(numWeightLeftNew: number, numWeightRightNew: number, isInit?: boolean): void;
}
declare class DragAnyMakeRuleListCommonScene extends UIObject {
    protected ImgList: eui.Image[];
    protected countImgList: number[];
    protected curNumImgList: number[];
    protected rectCanSetList: eui.Rect[];
    protected btnReset: eui.Image;
    protected group: eui.Group;
    protected numMax: number;
    protected targetList: eui.Image[];
    protected targetDataMap: {};
    protected isNewItem: boolean;
    protected curMoveItemIndex: number;
    protected curMoveItemObj: eui.Image;
    protected curMoveItemObjStudent: eui.Image;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected instanceDataForInitAll(): void;
    protected instanceForInit(sourcePath: string, indexItem: number, rectIndex: number): eui.Image;
    protected getItemForInit(sourcePath: string): eui.Image;
    protected instanceDataForInit(obj: eui.Image, indexItem: number, rectIndex: number): void;
    protected initAddEvent(): void;
    protected touchBeginOriginalEvent(event: egret.TouchEvent): void;
    protected newObjForTouchBegin(obj: eui.Image, xGlobal: number, yGlobal: number): eui.Image;
    protected deleteObj(obj: eui.Image): void;
    protected touchBeginMakedItemEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchBeginLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected resetData(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected revStartHandle(isNewItemStr: string, curIndexStr: string, targetX: number, targetY: number): void;
    protected revMoveHandle(targetX: number, targetY: number): void;
    protected revEndHandle(isCancelStr: string, isNewItemStr: string, targetX: number, targetY: number, deleteIndex: number, targetListIndex: number): void;
    protected getRectIndexCanSet(stageX: number, stageY: number): number;
    protected isCanSetToRect(indexForImgList: number, indexRect: number, obj: eui.Image, isNewItem: boolean): boolean;
    protected isCanSetToRectForReal(indexForImgList: number, indexRect: number, obj: eui.Image, isNewItem: boolean): boolean;
    protected isCanSetToRectForRectMax(indexRect: number, obj: eui.Image, numMax: number): boolean;
    protected pushToTarget(obj: eui.Image, indexForImgList: number, indexRect: number): void;
    protected removeToTarget(objCur: eui.Image): void;
    protected refreshToTarget(objCur: eui.Image, indexRect: number): void;
    protected getDataFromTargetDataMap(objCur: eui.Image): {
        obj: eui.Image;
        index: number;
    };
    protected refreshToIsHideTouchBegin(imgIndex: number): void;
    protected refreshForListTouchEnd(): void;
    private errorEndEventFunc();
}
declare class DragAnyOptionalChooseBtn extends UIObject {
    protected ImgList: eui.Image[];
    protected rectListSelect: eui.Rect[];
    protected imgSelected: eui.Image;
    protected indexTrueAnswer: number;
    protected imgPosList: egret.Point[];
    private group;
    private btnReset;
    private curMoveIndex;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initSelectData(rectListSelect: eui.Rect[], imgSelected: eui.Image, indexTrueAnswer: number): void;
    protected initAddEvent(): void;
    protected resetData(): void;
    protected touchTapResetEvent(event: egret.TouchEvent): void;
    protected touchTapChooseRectEvent(event: egret.TouchEvent): void;
    protected touchBeginEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected destroyData(): void;
    protected destroyEvent(): void;
    protected revChooseHandle(chooseIndex: number): void;
    protected revStartHandle(clickIndex: number, targetX: number, targetY: number): void;
    protected revMoveLayerHandle(clickIndex: number, targetX: number, targetY: number): void;
    protected revEndLayerHandle(clickIndex: number, targetX: number, targetY: number): void;
}
declare class DropAnyToRuleRectScene extends UIObject {
    protected ImgList: eui.Image[];
    protected imgPosList: egret.Point[];
    protected ruleRectList: eui.Rect[];
    protected group: eui.Group;
    protected curMoveIndex: number;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    /** 收到信令消息 */
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected resetImgPosForList(): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected touchBeginEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected getSiteIndexForGlobalPos(xGlobal: number, yGlobal: number): number;
    protected revMoveingHandle(name: string, targetX: number, targetY: number): void;
    /** 接收停止移动 */
    protected revMoveEndLayerHandle(moveIndex: string, isResetStr: string, targetX: number, targetY: number): void;
}
declare class DropToRuleRectScene extends UIObject {
    protected ImgList: eui.Image[];
    protected imgPosList: egret.Point[];
    protected ruleRectList: eui.Rect[];
    protected objIndexToSiteIndexMap: any;
    protected siteIndexToObjIndexMap: any;
    private group;
    protected curMoveIndex: number;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    /** 收到信令消息 */
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected resetImgPosForList(): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
    protected touchBeginEvent(event: egret.TouchEvent): void;
    protected touchMoveLayerEvent(event: egret.TouchEvent): void;
    protected touchEndLayerEvent(event: egret.TouchEvent): void;
    protected isCanSetForSiteIndex(siteIndex: number): boolean;
    protected getSiteIndexForGlobalPos(xGlobal: number, yGlobal: number): number;
    protected refreshView(): void;
    protected revMoveingHandle(name: string, targetX: number, targetY: number): void;
    /** 接收停止移动 */
    protected revMoveEndLayerHandle(moveName: string, moveSite: string): void;
}
/**
 *
 */
declare class MakeNewToTargetScene extends UIObject {
    protected clickItemArr: eui.Image[];
    protected newItemSrcArr: string[];
    protected comparisonArr: eui.Image[];
    protected moveGroup: eui.Group;
    protected completeImg: eui.Image;
    protected backImg: eui.Image;
    protected _touchImg: eui.Image;
    protected _offsetX: number;
    protected _offsetY: number;
    private _newIndex;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 移除场景销毁 */
    onDestory(): void;
    /** 接收信令 */
    execMessage(data: any): void;
    /** 初始化场景 */
    protected initScene(): void;
    /** 初始化监听 */
    protected initAddEvent(): void;
    /** 开始点击图片 */
    protected doTouchBeginHandle(e: egret.TouchEvent): void;
    /** 开始移动 */
    protected doTouchMoveHandle(e: egret.TouchEvent): void;
    /** 结束移动 */
    protected doTouchEndHandle(e: egret.TouchEvent): void;
    /** 判断是否贴合 */
    protected isBingoCoordinateTarget(item: eui.Image): number;
    /** 处理返回初始状态 */
    private doBackInitHandle();
    /** 接收开始移动 */
    private revMoveBeginHandle(name, src, x, y);
    /** 接收移动中 */
    private revMoveingHandle(name, x, y);
    /** 接收移动结束 */
    private revMoveEndHandle(name, x, y, del);
}
declare class OnlyClickForBtnScene extends UIObject {
    protected ImgList: eui.Image[];
    protected btnNext: eui.Image;
    protected CurState: number;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initAddEvent(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected refreshStateView(): void;
    protected revNextLayerHandle(): void;
}
declare class OnlyClickScene extends UIObject {
    protected ImgList: eui.Image[];
    protected CurState: number;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initAddEvent(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected refreshStateView(): void;
    protected revNextLayerHandle(): void;
}
/**
 * by 郑岩
 * 需要显示选择状态的场景
 * @param arr : Array<Array<eui.Image>>
 * 当传入一个数组时，只显示点击选择状态
 * 当多个数组时，请把相同类型状态放入同一个数组 例如: A B  分别放入两个数组
 */
declare class OnlySelectedScene extends UIObject {
    protected _arr: eui.Image[][];
    constructor();
    /** 移除场景处理 */
    onDestroy(): void;
    /** 接收信令 */
    execMessage(data: any): void;
    /** 初始化 */
    protected initScene(arr: eui.Image[][]): void;
    /** 处理点击选中 */
    protected doSelectedTouchHandle(e: egret.TouchEvent): void;
}
declare class TweenToCenterScene extends UIObject {
    protected ImgLeftList: eui.Image[];
    protected posLeftList: egret.Point[];
    protected ImgRightList: eui.Image[];
    protected posRightList: egret.Point[];
    protected posLeftOff: egret.Point;
    protected posRightOff: egret.Point;
    protected ImgHideList: eui.Image[];
    protected ImgShowList: eui.Image[];
    protected numTweenTime: number;
    protected numCurTween: number;
    protected btnMerge: eui.Image;
    constructor();
    /** 每次进入 */
    onAdd(): void;
    /** 这里进行移出场景的处理 **/
    onDestroy(): void;
    execMessage(data: any): void;
    protected initData(): void;
    protected initAddEvent(): void;
    protected touchTapEvent(event: egret.TouchEvent): void;
    protected startTweenMerge(): void;
    protected resetAllTweenAndPos(): void;
    protected addNumCurTween(): void;
    protected removeNumCurTween(): void;
    protected endTweenMerge(): void;
    protected resetData(): void;
    protected destoryData(): void;
    protected destoryEvent(): void;
}
