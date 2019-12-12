var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var DragAnyMakeOptionalChooseBtn = (function (_super) {
    __extends(DragAnyMakeOptionalChooseBtn, _super);
    function DragAnyMakeOptionalChooseBtn() {
        var _this = _super.call(this) || this;
        _this.isNewItem = false;
        _this.ImgList = [];
        _this.curMoveItemIndex = -2;
        _this.rectListSelect = [];
        _this.imgSelected = null;
        _this.indexTrueAnswer = -1;
        return _this;
    }
    /** 每次进入 */
    DragAnyMakeOptionalChooseBtn.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    DragAnyMakeOptionalChooseBtn.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destoryEvent();
        this.destoryData();
    };
    DragAnyMakeOptionalChooseBtn.prototype.execMessage = function (data) {
        if (data["reset"]) {
            this.resetData();
        }
        else if (data["choose"]) {
            var chooseIndex = parseInt(data["choose"]["chooseIndex"]);
            this.revChooseHandle(chooseIndex);
        }
        else if (data["touchBegin"]) {
            var isNewItem = data["touchBegin"]["isNewItem"];
            var curIndexStr = data["touchBegin"]["curIndexStr"];
            var targetX = parseInt(data["touchBegin"]["targetX"]);
            var targetY = parseInt(data["touchBegin"]["targetY"]);
            this.revStartHandle(isNewItem, curIndexStr, targetX, targetY);
        }
        else if (data["touchMove"]) {
            var targetX = parseInt(data["touchMove"]["targetX"]);
            var targetY = parseInt(data["touchMove"]["targetY"]);
            this.revMoveHandle(targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var isCancelStr = data["touchEndLayer"]["isCancelStr"];
            var isNewItemStr = data["touchEndLayer"]["isNewItemStr"];
            var targetX = parseInt(data["touchEndLayer"]["targetX"]);
            var targetY = parseInt(data["touchEndLayer"]["targetY"]);
            var deleteIndex = parseInt(data["touchEndLayer"]["deleteIndex"]);
            this.revEndHandle(isCancelStr, isNewItemStr, targetX, targetY, deleteIndex);
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.initData = function () {
        this.targetList = [];
        if (this.imgSelected) {
            this.imgSelected.visible = false;
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.initSelectData = function (rectListSelect, imgSelected, indexTrueAnswer) {
        if (rectListSelect && imgSelected && indexTrueAnswer != null) {
            this.rectListSelect = rectListSelect;
            this.imgSelected = imgSelected;
            this.indexTrueAnswer = indexTrueAnswer;
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", "initSelectData error args is null");
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.rectListSelect) {
            for (var _b = 0, _c = this.rectListSelect; _b < _c.length; _b++) {
                var obj = _c[_b];
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
        this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchTapChooseRectEvent = function (event) {
        var index = this.rectListSelect.indexOf(event.currentTarget);
        if (index > -1) {
            if (this.imgSelected) {
                this.imgSelected.visible = true;
                this.imgSelected.x = event.currentTarget.x;
                this.imgSelected.y = event.currentTarget.y;
            }
            if (index == this.indexTrueAnswer) {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 1, movie: "success", movieCount: 2 }, false));
            }
            else {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 2, movie: "failed", movieCount: 2 }, false));
            }
            var obj = new Object();
            obj["chooseIndex"] = index.toString();
            var msg = { method: "onFileMessage", keyName: "choose", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", " touchTapChooseRectEvent error  index error ");
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchBeginOriginalEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= -1) {
            // let childIndex = this.group.numChildren
            // this.group.setChildIndex(event.target, childIndex - 1)
            this.curMoveItemIndex = curIndex;
            this.isNewItem = true;
            this.curMoveItemObj = this.newObjForTouchBegin(event.target, event.stageX, event.stageY);
            var obj = new Object();
            obj["isNewItem"] = "1";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.newObjForTouchBegin = function (obj, xGlobal, yGlobal) {
        var localPos = this.group.globalToLocal(xGlobal, yGlobal);
        var path = obj.source;
        var img = new eui.Image(path);
        img.anchorOffsetX = obj.anchorOffsetX;
        img.anchorOffsetY = obj.anchorOffsetY;
        img.rotation = obj.rotation;
        img.x = localPos.x;
        img.y = localPos.y;
        this.group.addChild(img);
        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        return img;
    };
    DragAnyMakeOptionalChooseBtn.prototype.deleteObj = function (obj) {
        if (!obj) {
            return;
        }
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        this.group.removeChild(obj);
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchBeginMakedItemEvent = function (event) {
        var curIndex = 0;
        for (var index in this.targetList) {
            var obj = this.targetList[index];
            if (obj == event.currentTarget) {
                curIndex = parseInt(index);
            }
        }
        if (curIndex >= -1) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveItemIndex = curIndex;
            this.isNewItem = false;
            this.curMoveItemObj = event.target;
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["isNewItem"] = "0";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchMove", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchEndLayerEvent = function (event) {
        var isCancelStr = 0;
        var isNewItemStr = 0;
        var stageXStr = 0;
        var stageYStr = 0;
        var deleteIndex = -2;
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            var stageX = event.stageX;
            var stageY = event.stageY;
            stageXStr = event.stageX;
            stageYStr = event.stageY;
            this.curMoveItemObj.x = stageX;
            this.curMoveItemObj.y = stageY;
            var isCancel = this.rectCancle.hitTestPoint(stageX, stageY);
            if (isCancel) {
                isCancelStr = 1;
                // 取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示创建了一个新的 但是不需要了 需要删除
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 拖动的创建好的 需要删除数据
                    // let curIndex = this.targetList.indexOf(event.currentTarget)
                    var curIndex = 0;
                    for (var index in this.targetList) {
                        var _obj = this.targetList[index];
                        if (_obj == this.curMoveItemObj) {
                            curIndex = parseInt(index);
                        }
                    }
                    deleteIndex = curIndex;
                    this.targetList.splice(curIndex, 1);
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
            }
            else {
                isCancelStr = 0;
                // 不是取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示 创建了一个新的 需要保存到target列表
                    this.targetList.push(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 移动的是原来创建好的 , 只设置坐标就可以
                    this.curMoveItemObj = null;
                }
            }
        }
        // 给学生发送信令  移动中
        var obj = new Object();
        obj["isCancelStr"] = isCancelStr.toString();
        obj["isNewItemStr"] = isNewItemStr.toString();
        obj["targetX"] = stageXStr.toString();
        obj["targetY"] = stageYStr.toString();
        obj["deleteIndex"] = deleteIndex.toString();
        var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeOptionalChooseBtn.prototype.resetData = function () {
        if (this.targetList && this.targetList.length > 0) {
            for (var _i = 0, _a = this.targetList; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.deleteObj(obj);
            }
            this.targetList = [];
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.touchTapEvent = function (event) {
        this.resetData();
        var msg = { method: "onFileMessage", keyName: "reset", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeOptionalChooseBtn.prototype.destoryData = function () {
        this.resetData();
        delete this.ImgList;
        this.ImgList = [];
        delete this.rectListSelect;
        this.rectListSelect = [];
        delete this.imgSelected;
        this.imgSelected = null;
    };
    DragAnyMakeOptionalChooseBtn.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.rectListSelect) {
            for (var _b = 0, _c = this.rectListSelect; _b < _c.length; _b++) {
                var obj = _c[_b];
                obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
        this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeOptionalChooseBtn.prototype.revChooseHandle = function (chooseIndex) {
        if (chooseIndex > -1) {
            var target = this.rectListSelect[chooseIndex];
            if (this.imgSelected && target) {
                this.imgSelected.visible = true;
                this.imgSelected.x = target.x;
                this.imgSelected.y = target.y;
            }
            if (chooseIndex == this.indexTrueAnswer) {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 1, movie: "success", movieCount: 2 }, false));
            }
            else {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 2, movie: "failed", movieCount: 2 }, false));
            }
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.revStartHandle = function (isNewItemStr, curIndexStr, targetX, targetY) {
        if (isNewItemStr == "1") {
            var curIndex = parseInt(curIndexStr);
            var obj = this.ImgList[curIndex];
            if (obj) {
                this.curMoveItemObj = this.newObjForTouchBegin(obj, targetX, targetY);
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 1");
            }
        }
        else {
            var curIndex = parseInt(curIndexStr);
            var obj = this.targetList[curIndex];
            if (obj) {
                var childIndex = this.group.numChildren;
                this.group.setChildIndex(obj, childIndex - 1);
                this.curMoveItemObj = obj;
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 0");
            }
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.revMoveHandle = function (targetX, targetY) {
        var target = this.curMoveItemObj;
        if (target) {
            var posTarget = this.globalToLocal(targetX, targetY);
            target.x = posTarget.x;
            target.y = posTarget.y;
        }
    };
    DragAnyMakeOptionalChooseBtn.prototype.revEndHandle = function (isCancelStr, isNewItemStr, targetX, targetY, deleteIndex) {
        if (isCancelStr == "1") {
            // 取消
            if (isNewItemStr == "1") {
                // 表示创建了一个新的 但是不需要了 需要删除
                if (this.curMoveItemObj) {
                    this.deleteObj(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                if (deleteIndex >= -1) {
                    // 表示 拖动的创建好的 需要删除数据
                    var curIndex = deleteIndex;
                    this.targetList.splice(curIndex, 1);
                    if (this.curMoveItemObj) {
                        this.deleteObj(this.curMoveItemObj);
                    }
                    this.curMoveItemObj = null;
                }
                else {
                    Log.trace("DragAnyMakeForMaxAndCancleScene", "revEndHandle error  index to obj not find ");
                }
            }
        }
        else {
            // 不是取消
            if (isNewItemStr == "1") {
                // 表示 创建了一个新的 需要保存到target列表
                if (this.curMoveItemObj) {
                    this.targetList.push(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                // 表示 移动的是原来创建好的 , 只设置坐标就可以
                this.curMoveItemObj = null;
            }
        }
    };
    return DragAnyMakeOptionalChooseBtn;
}(UIObject));
__reflect(DragAnyMakeOptionalChooseBtn.prototype, "DragAnyMakeOptionalChooseBtn");
var CoursewareDefines = (function () {
    function CoursewareDefines() {
    }
    CoursewareDefines.version = 17;
    return CoursewareDefines;
}());
__reflect(CoursewareDefines.prototype, "CoursewareDefines");
var ClickBtnToShowScene = (function (_super) {
    __extends(ClickBtnToShowScene, _super);
    function ClickBtnToShowScene() {
        var _this = _super.call(this) || this;
        _this.CurState = -1;
        _this.btnList = [];
        _this.ImgList = [];
        return _this;
    }
    /** 每次进入 */
    ClickBtnToShowScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.CurState = -1;
        this.refreshStateView();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    ClickBtnToShowScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        for (var _i = 0, _a = this.btnList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        if (this.rect_bg) {
            this.rect_bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapBgEvent, this);
        }
        delete this.btnList;
        this.btnList = [];
        delete this.ImgList;
        this.ImgList = [];
    };
    ClickBtnToShowScene.prototype.execMessage = function (data) {
        if (data["refreshState"] != null) {
            this.revNextLayerHandle(data["refreshState"]);
        }
    };
    ClickBtnToShowScene.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.btnList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        if (this.rect_bg) {
            this.rect_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapBgEvent, this);
        }
    };
    ClickBtnToShowScene.prototype.touchTapEvent = function (event) {
        var index = this.btnList.indexOf(event.currentTarget);
        if (index <= -1) {
            return;
        }
        this.CurState = index;
        this.refreshStateView();
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "refreshState", this.CurState);
    };
    ClickBtnToShowScene.prototype.touchTapBgEvent = function (event) {
        this.CurState = -1;
        this.refreshStateView();
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "refreshState", this.CurState);
    };
    ClickBtnToShowScene.prototype.refreshStateView = function () {
        if (this.CurState <= -1) {
            for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
                var tempList = _a[_i];
                if (tempList && tempList.length > 0) {
                    for (var _b = 0, tempList_1 = tempList; _b < tempList_1.length; _b++) {
                        var obj = tempList_1[_b];
                        obj.visible = false;
                    }
                }
            }
        }
        else {
            for (var _c = 0, _d = this.ImgList; _c < _d.length; _c++) {
                var tempList = _d[_c];
                if (tempList && tempList.length > 0) {
                    for (var _e = 0, tempList_2 = tempList; _e < tempList_2.length; _e++) {
                        var obj = tempList_2[_e];
                        obj.visible = false;
                    }
                }
            }
            if (this.ImgList[this.CurState]) {
                var tempList = this.ImgList[this.CurState];
                if (tempList.length > 0) {
                    for (var _f = 0, tempList_3 = tempList; _f < tempList_3.length; _f++) {
                        var obj = tempList_3[_f];
                        obj.visible = true;
                    }
                }
            }
        }
    };
    ClickBtnToShowScene.prototype.revNextLayerHandle = function (index) {
        this.CurState = index;
        this.refreshStateView();
    };
    return ClickBtnToShowScene;
}(UIObject));
__reflect(ClickBtnToShowScene.prototype, "ClickBtnToShowScene");
var ClickHideScene = (function (_super) {
    __extends(ClickHideScene, _super);
    function ClickHideScene() {
        var _this = _super.call(this) || this;
        _this.ImgSelectedList = [];
        return _this;
    }
    /** 每次进入 */
    ClickHideScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    ClickHideScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destroyEvent();
        this.destroyData();
    };
    ClickHideScene.prototype.execMessage = function (data) {
        if (data["choose"]) {
            var chooseIndex = parseInt(data["choose"]["chooseIndex"]);
            this.revChooseHandle(chooseIndex);
        }
        else if (data["reset"]) {
            this.resetData();
        }
    };
    ClickHideScene.prototype.initData = function () {
        for (var index in this.ImgSelectedList) {
            var obj = this.ImgSelectedList[parseInt(index)];
            if (obj) {
                obj.visible = true;
            }
        }
    };
    ClickHideScene.prototype.initAddEvent = function () {
        if (this.ImgSelectedList) {
            for (var _i = 0, _a = this.ImgSelectedList; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapImgEvent, this);
            }
        }
        if (this.btnReset) {
            this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapResetEvent, this);
        }
    };
    ClickHideScene.prototype.resetData = function () {
        for (var index in this.ImgSelectedList) {
            var obj = this.ImgSelectedList[parseInt(index)];
            if (obj) {
                obj.visible = true;
            }
        }
    };
    ClickHideScene.prototype.touchTapImgEvent = function (event) {
        var index = this.ImgSelectedList.indexOf(event.currentTarget);
        if (index > -1) {
            for (var indexTemp in this.ImgSelectedList) {
                var obj = this.ImgSelectedList[parseInt(indexTemp)];
                if (obj) {
                    if (parseInt(indexTemp) == index) {
                        obj.visible = false;
                    }
                }
            }
            var _obj = new Object();
            _obj["chooseIndex"] = index.toString();
            var msg = { method: "onFileMessage", keyName: "choose", value: _obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
        else {
            Log.trace("ClickHideScene", " touchTapChooseRectEvent error  index error ");
        }
    };
    ClickHideScene.prototype.destroyData = function () {
        this.resetData();
        delete this.ImgSelectedList;
        this.ImgSelectedList = [];
    };
    ClickHideScene.prototype.destroyEvent = function () {
        if (this.ImgSelectedList) {
            for (var _i = 0, _a = this.ImgSelectedList; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapImgEvent, this);
            }
        }
        if (this.btnReset) {
            this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapResetEvent, this);
        }
    };
    ClickHideScene.prototype.touchTapResetEvent = function (event) {
        this.resetData();
        var msg = { method: "onFileMessage", keyName: "reset", value: "1" };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    ClickHideScene.prototype.revChooseHandle = function (chooseIndex) {
        if (chooseIndex > -1) {
            for (var indexTemp in this.ImgSelectedList) {
                var obj = this.ImgSelectedList[parseInt(indexTemp)];
                if (obj) {
                    if (parseInt(indexTemp) == chooseIndex) {
                        obj.visible = false;
                    }
                }
            }
        }
    };
    return ClickHideScene;
}(UIObject));
__reflect(ClickHideScene.prototype, "ClickHideScene");
/**
 * by zheng
 * 点击任意组件显示下一阶段
 * @param clickItemArr  点击的组件数组
 * @param showPhaseArr  显示下一场景数组
 * @param showIndexArr  显示阶段索引
 * 请一一对应
 */
var ClickItemForShowPhaseScene = (function (_super) {
    __extends(ClickItemForShowPhaseScene, _super);
    function ClickItemForShowPhaseScene() {
        var _this = _super.call(this) || this;
        _this.clickItemArr = new Array();
        _this.showPhaseArr = new Array();
        _this.showIndexArr = new Array();
        return _this;
    }
    /** 这里进行移出场景的处理 **/
    ClickItemForShowPhaseScene.prototype.onDestroy = function () {
        for (var i = 0; i < this.clickItemArr.length; i++) {
            this.clickItemArr[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doShowNextPhaseItemHandle, this);
        }
        for (var i = 0; i < this.showPhaseArr.length; i++) {
            for (var j = 0; j < this.showPhaseArr[i].length; j++) {
                this.showPhaseArr[i][j].visible = false;
            }
            this.showIndexArr[i] = 0;
        }
        if (this.backImg) {
            this.backImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doBackInitHandle, this);
        }
    };
    /** 接收信令 */
    ClickItemForShowPhaseScene.prototype.execMessage = function (data) {
        if (data["showPhase"]) {
            var nIndex = Number(data["showPhase"]["name"]);
            var phase = Number(data["showPhase"]["phase"]);
            this.showPhaseArr[nIndex - 1][phase].visible = true;
            this.showIndexArr[nIndex - 1] = phase;
        }
        else if (data["backInit"]) {
            this.initScene();
        }
    };
    /** 初始化场景 */
    ClickItemForShowPhaseScene.prototype.initScene = function () {
        if (this.clickItemArr.length <= 0 || this.showPhaseArr.length <= 0) {
            return;
        }
        this.showIndexArr = [];
        for (var i = 0; i < this.clickItemArr.length; i++) {
            this.clickItemArr[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.doShowNextPhaseItemHandle, this);
            this.clickItemArr[i].name = String(i + 1);
        }
        for (var i = 0; i < this.showPhaseArr.length; i++) {
            for (var j = 0; j < this.showPhaseArr[i].length; j++) {
                this.showPhaseArr[i][j].name = String(i + 1) + "_" + String(j);
                this.showPhaseArr[i][j].visible = false;
            }
            var index = 0;
            this.showIndexArr.push(index);
        }
        if (this.backImg) {
            this.backImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doBackInitHandle, this);
        }
    };
    /** 点击显示下一阶段 */
    ClickItemForShowPhaseScene.prototype.doShowNextPhaseItemHandle = function (e) {
        var nIndex = e.currentTarget.name;
        if (this.showIndexArr[Number(nIndex) - 1] > this.showPhaseArr[Number(nIndex) - 1].length - 1) {
            return;
        }
        this.showPhaseArr[Number(nIndex) - 1][this.showIndexArr[Number(nIndex) - 1]].visible = true;
        this.showIndexArr[Number(nIndex) - 1]++;
        var obj = new Object();
        obj["name"] = nIndex;
        obj["phase"] = this.showIndexArr[Number(nIndex) - 1] - 1;
        var msg = { method: "onFileMessage", keyName: "showPhase", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    /** 返回初始状态 */
    ClickItemForShowPhaseScene.prototype.doBackInitHandle = function () {
        this.initScene();
        var msg = { method: "onFileMessage", keyName: "backInit", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    return ClickItemForShowPhaseScene;
}(UIObject));
__reflect(ClickItemForShowPhaseScene.prototype, "ClickItemForShowPhaseScene");
var ClickMoveFromPathScene = (function (_super) {
    __extends(ClickMoveFromPathScene, _super);
    function ClickMoveFromPathScene() {
        var _this = _super.call(this) || this;
        _this.curPosIndex = 0;
        _this.curSpeed = 300 / 1000;
        _this.ImgSelectedList = [];
        _this.posList = [];
        _this.ImgIndexToPosIndex = [];
        _this.rightRot = 0;
        _this.isRotation = true;
        return _this;
    }
    /** 每次进入 */
    ClickMoveFromPathScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    ClickMoveFromPathScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destroyEvent();
        this.destroyData();
    };
    ClickMoveFromPathScene.prototype.execMessage = function (data) {
        if (data["moveToPosForIndex"]) {
            var index = Number(data["moveToPosForIndex"]["index"]);
            this.moveToPosForIndex(index);
        }
    };
    ClickMoveFromPathScene.prototype.initData = function () {
        this.curPosIndex = 0;
        if (this.curMoveObj) {
            this.initRot = this.curMoveObj.rotation;
            if (this.posList[0]) {
                var pos = this.posList[0];
                var obj = this.curMoveObj;
                obj.x = pos.x;
                obj.y = pos.y;
                this.curPosIndex = 0;
            }
        }
    };
    ClickMoveFromPathScene.prototype.getAngle = function (px1, py1, px2, py2) {
        // 两点的x、y值
        var x = px2 - px1;
        var y = py2 - py1;
        var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        // 斜边长度
        var cos = x / hypotenuse;
        var radian = Math.acos(cos);
        // 求出弧度
        var angle = 180 / (Math.PI / radian);
        // 用弧度算出角度
        if (y < 0) {
            angle = -angle;
        }
        else if ((y == 0) && (x < 0)) {
            angle = 180;
        }
        return angle;
    };
    ClickMoveFromPathScene.prototype.moveToPosForIndex = function (imgIndex) {
        if (!this.curMoveObj) {
            return;
        }
        var setRotFunc = function (pos, index) {
            this.setPosIndex(index);
            var obj = this.curMoveObj;
            var angle = this.getAngle(obj.x, obj.y, pos.x, pos.y);
            if (this.isRotation) {
                obj.rotation = angle + this.rightRot;
            }
        };
        var posList = [];
        var oldPosIndex = 0;
        var newPosIndex = 1;
        if (this.curPosIndex == 0) {
            oldPosIndex = 0;
        }
        else {
            oldPosIndex = this.curPosIndex;
        }
        newPosIndex = this.ImgIndexToPosIndex[imgIndex];
        if (oldPosIndex < newPosIndex) {
            for (var i = oldPosIndex + 1; i <= newPosIndex; i++) {
                var pos = this.posList[i];
                if (pos) {
                    posList.push(pos);
                }
            }
        }
        else if (oldPosIndex > newPosIndex) {
            for (var i = oldPosIndex - 1; i >= newPosIndex; i--) {
                var pos = this.posList[i];
                if (pos) {
                    posList.push(pos);
                }
            }
        }
        else {
            this.moveCallBack(imgIndex);
            return;
        }
        if (posList.length > 0) {
            egret.Tween.removeTweens(this.curMoveObj);
            var timeStart = egret.Point.distance(new egret.Point(this.curMoveObj.x, this.curMoveObj.y), posList[0]) / this.curSpeed;
            var curTween = egret.Tween.get(this.curMoveObj).call(setRotFunc, this, [posList[0], oldPosIndex + 0]).to({ x: posList[0].x, y: posList[0].y }, timeStart);
            if (posList.length > 1) {
                for (var i = 1; i < posList.length; i++) {
                    var index = i;
                    var timeTemp = egret.Point.distance(posList[index - 1], posList[index]) / this.curSpeed;
                    var tempTween = curTween.call(setRotFunc, this, [posList[index], oldPosIndex + index]).to({ x: posList[index].x, y: posList[index].y }, timeTemp);
                    curTween = tempTween;
                }
            }
            curTween.call(this.moveCallBack, this, [imgIndex]);
        }
    };
    ClickMoveFromPathScene.prototype.setPosIndex = function (posIndex) {
        this.curPosIndex = posIndex;
    };
    // 没有 0
    ClickMoveFromPathScene.prototype.moveCallBack = function (imgIndex) {
        this.curPosIndex = this.ImgIndexToPosIndex[imgIndex];
    };
    ClickMoveFromPathScene.prototype.initAddEvent = function () {
        if (this.ImgSelectedList) {
            for (var _i = 0, _a = this.ImgSelectedList; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapImgEvent, this);
            }
        }
    };
    ClickMoveFromPathScene.prototype.resetData = function () {
        // for(let index in this.ImgSelectedList){
        //     let obj = this.ImgSelectedList[parseInt(index)]
        //     if(obj){
        //         obj.visible = true
        //     }
        // }
    };
    ClickMoveFromPathScene.prototype.touchTapImgEvent = function (event) {
        var index = this.ImgSelectedList.indexOf(event.currentTarget);
        if (index > -1) {
            this.moveToPosForIndex(index);
            var obj = new Object();
            obj["index"] = (index).toString();
            var msg = { method: "onFileMessage", keyName: "moveToPosForIndex", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
        else {
            Log.trace("ClickMoveFromPathScene", " touchTapChooseRectEvent error  index error ");
        }
    };
    ClickMoveFromPathScene.prototype.destroyData = function () {
        this.resetData();
        if (this.curMoveObj) {
            this.curMoveObj.rotation = this.initRot;
            egret.Tween.removeTweens(this.curMoveObj);
        }
        delete this.ImgSelectedList;
        this.ImgSelectedList = [];
        delete this.posList;
        this.posList = [];
        delete this.ImgIndexToPosIndex;
        this.ImgIndexToPosIndex = [];
        this.rightRot = 0;
    };
    ClickMoveFromPathScene.prototype.destroyEvent = function () {
        if (this.ImgSelectedList) {
            for (var _i = 0, _a = this.ImgSelectedList; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapImgEvent, this);
            }
        }
    };
    return ClickMoveFromPathScene;
}(UIObject));
__reflect(ClickMoveFromPathScene.prototype, "ClickMoveFromPathScene");
var ClickOneChooseScene = (function (_super) {
    __extends(ClickOneChooseScene, _super);
    function ClickOneChooseScene() {
        var _this = _super.call(this) || this;
        _this.ImgSelectedList = [];
        _this.rectListSelect = [];
        return _this;
    }
    /** 每次进入 */
    ClickOneChooseScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    ClickOneChooseScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destroyEvent();
        this.destroyData();
    };
    ClickOneChooseScene.prototype.execMessage = function (data) {
        if (data["choose"]) {
            var chooseIndex = parseInt(data["choose"]["chooseIndex"]);
            this.revChooseHandle(chooseIndex);
        }
    };
    ClickOneChooseScene.prototype.initData = function () {
        for (var index in this.ImgSelectedList) {
            var obj = this.ImgSelectedList[parseInt(index)];
            if (obj) {
                obj.visible = false;
            }
        }
    };
    ClickOneChooseScene.prototype.initAddEvent = function () {
        if (this.rectListSelect) {
            for (var _i = 0, _a = this.rectListSelect; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
    };
    ClickOneChooseScene.prototype.resetData = function () {
        for (var index in this.ImgSelectedList) {
            var obj = this.ImgSelectedList[parseInt(index)];
            if (obj) {
                obj.visible = false;
            }
        }
    };
    ClickOneChooseScene.prototype.touchTapChooseRectEvent = function (event) {
        var index = this.rectListSelect.indexOf(event.currentTarget);
        if (index > -1) {
            for (var indexTemp in this.ImgSelectedList) {
                var obj = this.ImgSelectedList[parseInt(indexTemp)];
                if (obj) {
                    if (parseInt(indexTemp) == index) {
                        obj.visible = true;
                    }
                    else {
                        obj.visible = false;
                    }
                }
            }
            var _obj = new Object();
            _obj["chooseIndex"] = index.toString();
            var msg = { method: "onFileMessage", keyName: "choose", value: _obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", " touchTapChooseRectEvent error  index error ");
        }
    };
    ClickOneChooseScene.prototype.destroyData = function () {
        this.resetData();
        delete this.ImgSelectedList;
        this.ImgSelectedList = [];
        delete this.rectListSelect;
        this.rectListSelect = [];
    };
    ClickOneChooseScene.prototype.destroyEvent = function () {
        if (this.rectListSelect) {
            for (var _i = 0, _a = this.rectListSelect; _i < _a.length; _i++) {
                var obj = _a[_i];
                obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
    };
    ClickOneChooseScene.prototype.revChooseHandle = function (chooseIndex) {
        if (chooseIndex > -1) {
            for (var indexTemp in this.ImgSelectedList) {
                var obj = this.ImgSelectedList[parseInt(indexTemp)];
                if (obj) {
                    if (parseInt(indexTemp) == chooseIndex) {
                        obj.visible = true;
                    }
                    else {
                        obj.visible = false;
                    }
                }
            }
        }
    };
    return ClickOneChooseScene;
}(UIObject));
__reflect(ClickOneChooseScene.prototype, "ClickOneChooseScene");
/**
 * 时钟可触摸旋转
 */
var ClockTouchScene = (function (_super) {
    __extends(ClockTouchScene, _super);
    function ClockTouchScene() {
        var _this = _super.call(this) || this;
        _this.clockImgArr = [];
        _this._initPosArr = [];
        return _this;
    }
    /** 每次进入 */
    ClockTouchScene.prototype.onAdd = function () {
        this.initScene();
        this.initAddEvent();
    };
    /** 这里进行移除场景处理 */
    ClockTouchScene.prototype.onDestroy = function () {
        for (var i = 0; i < this.clockImgArr.length; i++) {
            if (this.clockImgArr[i].hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
                this.clockImgArr[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.doTouchBeginHandle, this);
            }
        }
        this.clockImgArr = [];
    };
    /** 接收信令 */
    ClockTouchScene.prototype.execMessage = function (data) {
        if (data["moveIng"]) {
            var name_1 = data["moveIng"]["itemName"];
            var ro = Number(data["moveIng"]["itemRotation"]);
            this.revMoveingHandle(name_1, ro);
        }
        else if (data["moveEnd"]) {
            var name_2 = data["moveEnd"]["itemName"];
            var ro = Number(data["moveEnd"]["itemRotation"]);
            this.revMoveEndHandle(name_2, ro);
        }
    };
    /** 初始化场景 */
    ClockTouchScene.prototype.initScene = function () {
        if (this._initPosArr.length <= 0) {
            for (var i = 0; i < this.clockImgArr.length; i++) {
                this._initPosArr.push(this.clockImgArr[i].x);
                this._initPosArr.push(this.clockImgArr[i].y);
            }
        }
        else {
            for (var i = 0; i < this.clockImgArr.length; i++) {
                this.clockImgArr[i].x = this._initPosArr[i * 2];
                this.clockImgArr[i].y = this._initPosArr[i * 2 + 1];
            }
        }
        for (var i = 0; i < this.clockImgArr.length; i++) {
            this.clockImgArr[i].pixelHitTest = true;
            this.clockImgArr[i].name = String(i);
        }
    };
    /** 初始添加监听 */
    ClockTouchScene.prototype.initAddEvent = function () {
        for (var i = 0; i < this.clockImgArr.length; i++) {
            this.clockImgArr[i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.doTouchBeginHandle, this);
        }
    };
    /** 处理开始点击 */
    ClockTouchScene.prototype.doTouchBeginHandle = function (e) {
        this._touchImg = e.currentTarget;
        if (!this._touchImg) {
            return;
        }
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.doTouchMoveHandle, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.doTouchEndHandle, this);
    };
    /** 处理移动中 */
    ClockTouchScene.prototype.doTouchMoveHandle = function (e) {
        if (!this._touchImg) {
            this.stop();
            return;
        }
        var dx = e.stageX - this._touchImg.x;
        var dy = e.stageY - this._touchImg.y;
        this._touchImg.rotation = Math.atan2(dy, dx) / Math.PI * 180 + 90;
        var obj = new Object();
        obj["itemName"] = this._touchImg.name;
        obj["itemRotation"] = this._touchImg.rotation;
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "moveIng", obj);
    };
    ClockTouchScene.prototype.stop = function () {
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_MOVE)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.doTouchMoveHandle, this);
        }
        if (this._touchImg.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
            this._touchImg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.doTouchBeginHandle, this);
        }
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_END)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.doTouchEndHandle, this);
        }
    };
    /** 处理移动结束 */
    ClockTouchScene.prototype.doTouchEndHandle = function (e) {
        if (!this._touchImg) {
            return;
        }
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_MOVE)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.doTouchMoveHandle, this);
        }
        if (this.stage.hasEventListener(egret.TouchEvent.TOUCH_END)) {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.doTouchEndHandle, this);
        }
        var obj = new Object();
        obj["itemName"] = this._touchImg.name;
        obj["itemRotation"] = this._touchImg.rotation;
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "moveEnd", obj);
    };
    /** 接收移动中 */
    ClockTouchScene.prototype.revMoveingHandle = function (itemName, itemRotation) {
        this._touchImg = this.group.getChildByName(itemName);
        if (!this._touchImg) {
            return;
        }
        this._touchImg.rotation = itemRotation;
    };
    /** 接收鼠标抬起 */
    ClockTouchScene.prototype.revMoveEndHandle = function (itemName, itemRotation) {
        this._touchImg = this.group.getChildByName(itemName);
        if (!this._touchImg) {
            return;
        }
        this._touchImg.rotation = itemRotation;
    };
    return ClockTouchScene;
}(UIObject));
__reflect(ClockTouchScene.prototype, "ClockTouchScene");
var DragAnyMakeAndCancleComponent = (function (_super) {
    __extends(DragAnyMakeAndCancleComponent, _super);
    function DragAnyMakeAndCancleComponent() {
        var _this = _super.call(this) || this;
        _this.isNewItem = false;
        _this.ImgList = [];
        _this.curMoveItemIndex = -2;
        _this.curComponentIndex = 0;
        return _this;
    }
    /** 每次进入 */
    DragAnyMakeAndCancleComponent.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
        // let img = new eui.Group()
        // img.width = this.width
        // img.height = this.height
        // this.addChild(img)
    };
    DragAnyMakeAndCancleComponent.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchMove" + this.curComponentIndex.toString(), value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DragAnyMakeAndCancleComponent.prototype.touchEndLayerEvent = function (event) {
        var isCancelStr = 0;
        var isNewItemStr = 0;
        var stageXStr = 0;
        var stageYStr = 0;
        var deleteIndex = -2;
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            var stageX = event.stageX;
            var stageY = event.stageY;
            stageXStr = event.stageX;
            stageYStr = event.stageY;
            this.curMoveItemObj.x = stageX;
            this.curMoveItemObj.y = stageY;
            var isCenSet = this.rectCanSet.hitTestPoint(stageX, stageY);
            if (!isCenSet) {
                isCancelStr = 1;
                // 取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示创建了一个新的 但是不需要了 需要删除
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 拖动的创建好的 需要删除数据
                    // let curIndex = this.targetList.indexOf(event.currentTarget)
                    var curIndex = 0;
                    for (var index in this.targetList) {
                        var _obj = this.targetList[index];
                        if (_obj == this.curMoveItemObj) {
                            curIndex = parseInt(index);
                        }
                    }
                    deleteIndex = curIndex;
                    this.targetList.splice(curIndex, 1);
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
            }
            else {
                isCancelStr = 0;
                // 不是取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示 创建了一个新的 需要保存到target列表
                    this.targetList.push(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 移动的是原来创建好的 , 只设置坐标就可以
                    this.curMoveItemObj = null;
                }
            }
        }
        // 给学生发送信令  移动中
        var obj = new Object();
        obj["isCancelStr"] = isCancelStr.toString();
        obj["isNewItemStr"] = isNewItemStr.toString();
        obj["targetX"] = stageXStr.toString();
        obj["targetY"] = stageYStr.toString();
        obj["deleteIndex"] = deleteIndex.toString();
        var msg = { method: "onFileMessage", keyName: "touchEndLayer" + this.curComponentIndex.toString(), value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    /** 这里进行移出场景的处理 **/
    DragAnyMakeAndCancleComponent.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destoryEvent();
        this.destoryData();
    };
    DragAnyMakeAndCancleComponent.prototype.execMessage = function (data) {
        if (data["reset" + this.curComponentIndex.toString()]) {
            this.resetData();
        }
        else if (data["touchBegin" + this.curComponentIndex.toString()]) {
            var keyData = data["touchBegin" + this.curComponentIndex.toString()];
            var isNewItem = keyData["isNewItem"];
            var curIndexStr = keyData["curIndexStr"];
            var targetX = parseInt(keyData["targetX"]);
            var targetY = parseInt(keyData["targetY"]);
            this.revStartHandle(isNewItem, curIndexStr, targetX, targetY);
        }
        else if (data["touchMove" + this.curComponentIndex.toString()]) {
            var keyData = data["touchMove" + this.curComponentIndex.toString()];
            var targetX = parseInt(keyData["targetX"]);
            var targetY = parseInt(keyData["targetY"]);
            this.revMoveHandle(targetX, targetY);
        }
        else if (data["touchEndLayer" + this.curComponentIndex.toString()]) {
            var keyData = data["touchEndLayer" + this.curComponentIndex.toString()];
            var isCancelStr = keyData["isCancelStr"];
            var isNewItemStr = keyData["isNewItemStr"];
            var targetX = parseInt(keyData["targetX"]);
            var targetY = parseInt(keyData["targetY"]);
            var deleteIndex = parseInt(keyData["deleteIndex"]);
            this.revEndHandle(isCancelStr, isNewItemStr, targetX, targetY, deleteIndex);
        }
    };
    DragAnyMakeAndCancleComponent.prototype.initData = function () {
        this.targetList = [];
    };
    DragAnyMakeAndCancleComponent.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.btnReset) {
            this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeAndCancleComponent.prototype.touchBeginOriginalEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= -1) {
            // let childIndex = this.group.numChildren
            // this.group.setChildIndex(event.target, childIndex - 1)
            this.curMoveItemIndex = curIndex;
            this.isNewItem = true;
            this.curMoveItemObj = this.newObjForTouchBegin(event.target, event.stageX, event.stageY);
            var obj = new Object();
            obj["isNewItem"] = "1";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin" + this.curComponentIndex.toString(), value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeAndCancleComponent.prototype.newObjForTouchBegin = function (obj, xGlobal, yGlobal) {
        var localPos = this.group.globalToLocal(xGlobal, yGlobal);
        var path = obj.source;
        var img = new eui.Image(path);
        img.anchorOffsetX = obj.anchorOffsetX;
        img.anchorOffsetY = obj.anchorOffsetY;
        img.rotation = obj.rotation;
        img.x = localPos.x;
        img.y = localPos.y;
        this.group.addChild(img);
        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        return img;
    };
    DragAnyMakeAndCancleComponent.prototype.deleteObj = function (obj) {
        if (!obj) {
            return;
        }
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        this.group.removeChild(obj);
    };
    DragAnyMakeAndCancleComponent.prototype.touchBeginMakedItemEvent = function (event) {
        var curIndex = 0;
        for (var index in this.targetList) {
            var obj = this.targetList[index];
            if (obj == event.currentTarget) {
                curIndex = parseInt(index);
            }
        }
        if (curIndex >= -1) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveItemIndex = curIndex;
            this.isNewItem = false;
            this.curMoveItemObj = event.target;
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["isNewItem"] = "0";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin" + this.curComponentIndex.toString(), value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeAndCancleComponent.prototype.resetData = function () {
        if (this.targetList && this.targetList.length > 0) {
            for (var _i = 0, _a = this.targetList; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.deleteObj(obj);
            }
            this.targetList = [];
        }
    };
    DragAnyMakeAndCancleComponent.prototype.touchTapEvent = function (event) {
        this.resetData();
        var msg = { method: "onFileMessage", keyName: "reset" + this.curComponentIndex.toString(), value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeAndCancleComponent.prototype.destoryData = function () {
        delete this.ImgList;
        this.ImgList = [];
        this.resetData();
    };
    DragAnyMakeAndCancleComponent.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.btnReset) {
            this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeAndCancleComponent.prototype.revStartHandle = function (isNewItemStr, curIndexStr, targetX, targetY) {
        if (isNewItemStr == "1") {
            var curIndex = parseInt(curIndexStr);
            var obj = this.ImgList[curIndex];
            if (obj) {
                this.curMoveItemObj = this.newObjForTouchBegin(obj, targetX, targetY);
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 1");
            }
        }
        else {
            var curIndex = parseInt(curIndexStr);
            var obj = this.targetList[curIndex];
            if (obj) {
                var childIndex = this.group.numChildren;
                this.group.setChildIndex(obj, childIndex - 1);
                this.curMoveItemObj = obj;
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 0");
            }
        }
    };
    DragAnyMakeAndCancleComponent.prototype.revMoveHandle = function (targetX, targetY) {
        var target = this.curMoveItemObj;
        if (target) {
            var posTarget = this.globalToLocal(targetX, targetY);
            target.x = posTarget.x;
            target.y = posTarget.y;
        }
    };
    DragAnyMakeAndCancleComponent.prototype.revEndHandle = function (isCancelStr, isNewItemStr, targetX, targetY, deleteIndex) {
        if (isCancelStr == "1") {
            // 取消
            if (isNewItemStr == "1") {
                // 表示创建了一个新的 但是不需要了 需要删除
                if (this.curMoveItemObj) {
                    this.deleteObj(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                if (deleteIndex >= -1) {
                    // 表示 拖动的创建好的 需要删除数据
                    var curIndex = deleteIndex;
                    this.targetList.splice(curIndex, 1);
                    if (this.curMoveItemObj) {
                        this.deleteObj(this.curMoveItemObj);
                    }
                    this.curMoveItemObj = null;
                }
                else {
                    Log.trace("DragAnyMakeForMaxAndCancleScene", "revEndHandle error  index to obj not find ");
                }
            }
        }
        else {
            // 不是取消
            if (isNewItemStr == "1") {
                // 表示 创建了一个新的 需要保存到target列表
                if (this.curMoveItemObj) {
                    this.targetList.push(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                // 表示 移动的是原来创建好的 , 只设置坐标就可以
                this.curMoveItemObj = null;
            }
        }
    };
    return DragAnyMakeAndCancleComponent;
}(eui.Component));
__reflect(DragAnyMakeAndCancleComponent.prototype, "DragAnyMakeAndCancleComponent");
var DragAnyMakeForMaxAndCancleScene = (function (_super) {
    __extends(DragAnyMakeForMaxAndCancleScene, _super);
    function DragAnyMakeForMaxAndCancleScene() {
        var _this = _super.call(this) || this;
        _this.isNewItem = false;
        _this.ImgList = [];
        _this.numMax = 1;
        _this.curMoveItemIndex = -2;
        return _this;
    }
    /** 每次进入 */
    DragAnyMakeForMaxAndCancleScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    DragAnyMakeForMaxAndCancleScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destoryEvent();
        this.destoryData();
    };
    DragAnyMakeForMaxAndCancleScene.prototype.execMessage = function (data) {
        if (data["reset"]) {
            this.resetData();
        }
        else if (data["touchBegin"]) {
            var isNewItem = data["touchBegin"]["isNewItem"];
            var curIndexStr = data["touchBegin"]["curIndexStr"];
            var targetX = parseInt(data["touchBegin"]["targetX"]);
            var targetY = parseInt(data["touchBegin"]["targetY"]);
            this.revStartHandle(isNewItem, curIndexStr, targetX, targetY);
        }
        else if (data["touchMove"]) {
            var targetX = parseInt(data["touchMove"]["targetX"]);
            var targetY = parseInt(data["touchMove"]["targetY"]);
            this.revMoveHandle(targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var isCancelStr = data["touchEndLayer"]["isCancelStr"];
            var isNewItemStr = data["touchEndLayer"]["isNewItemStr"];
            var targetX = parseInt(data["touchEndLayer"]["targetX"]);
            var targetY = parseInt(data["touchEndLayer"]["targetY"]);
            var deleteIndex = parseInt(data["touchEndLayer"]["deleteIndex"]);
            this.revEndHandle(isCancelStr, isNewItemStr, targetX, targetY, deleteIndex);
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.initData = function () {
        this.targetList = [];
    };
    DragAnyMakeForMaxAndCancleScene.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeForMaxAndCancleScene.prototype.touchBeginOriginalEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= -1) {
            // let childIndex = this.group.numChildren
            // this.group.setChildIndex(event.target, childIndex - 1)
            this.curMoveItemIndex = curIndex;
            this.isNewItem = true;
            this.curMoveItemObj = this.newObjForTouchBegin(event.target, event.stageX, event.stageY);
            var obj = new Object();
            obj["isNewItem"] = "1";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.newObjForTouchBegin = function (obj, xGlobal, yGlobal) {
        var localPos = this.group.globalToLocal(xGlobal, yGlobal);
        var path = obj.source;
        var img = new eui.Image(path);
        img.anchorOffsetX = obj.anchorOffsetX;
        img.anchorOffsetY = obj.anchorOffsetY;
        img.rotation = obj.rotation;
        img.x = localPos.x;
        img.y = localPos.y;
        this.group.addChild(img);
        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        return img;
    };
    DragAnyMakeForMaxAndCancleScene.prototype.deleteObj = function (obj) {
        if (!obj) {
            return;
        }
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        this.group.removeChild(obj);
    };
    DragAnyMakeForMaxAndCancleScene.prototype.touchBeginMakedItemEvent = function (event) {
        var curIndex = 0;
        for (var index in this.targetList) {
            var obj = this.targetList[index];
            if (obj == event.currentTarget) {
                curIndex = parseInt(index);
            }
        }
        if (curIndex >= -1) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveItemIndex = curIndex;
            this.isNewItem = false;
            this.curMoveItemObj = event.target;
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["isNewItem"] = "0";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchMove", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.touchEndLayerEvent = function (event) {
        var isCancelStr = 0;
        var isNewItemStr = 0;
        var stageXStr = 0;
        var stageYStr = 0;
        var deleteIndex = -2;
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            var stageX = event.stageX;
            var stageY = event.stageY;
            stageXStr = event.stageX;
            stageYStr = event.stageY;
            this.curMoveItemObj.x = stageX;
            this.curMoveItemObj.y = stageY;
            var isCancel = this.rectCancle.hitTestPoint(stageX, stageY);
            if (isCancel) {
                isCancelStr = 1;
                // 取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示创建了一个新的 但是不需要了 需要删除
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 拖动的创建好的 需要删除数据
                    // let curIndex = this.targetList.indexOf(event.currentTarget)
                    var curIndex = 0;
                    for (var index in this.targetList) {
                        var _obj = this.targetList[index];
                        if (_obj == this.curMoveItemObj) {
                            curIndex = parseInt(index);
                        }
                    }
                    deleteIndex = curIndex;
                    this.targetList.splice(curIndex, 1);
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
            }
            else {
                isCancelStr = 0;
                // 不是取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示 创建了一个新的 需要保存到target列表
                    this.targetList.push(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 移动的是原来创建好的 , 只设置坐标就可以
                    this.curMoveItemObj = null;
                }
            }
        }
        // 给学生发送信令  移动中
        var obj = new Object();
        obj["isCancelStr"] = isCancelStr.toString();
        obj["isNewItemStr"] = isNewItemStr.toString();
        obj["targetX"] = stageXStr.toString();
        obj["targetY"] = stageYStr.toString();
        obj["deleteIndex"] = deleteIndex.toString();
        var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeForMaxAndCancleScene.prototype.resetData = function () {
        if (this.targetList && this.targetList.length > 0) {
            for (var _i = 0, _a = this.targetList; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.deleteObj(obj);
            }
            this.targetList = [];
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.touchTapEvent = function (event) {
        this.resetData();
        var msg = { method: "onFileMessage", keyName: "reset", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeForMaxAndCancleScene.prototype.destoryData = function () {
        delete this.ImgList;
        this.ImgList = [];
        this.resetData();
    };
    DragAnyMakeForMaxAndCancleScene.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeForMaxAndCancleScene.prototype.revStartHandle = function (isNewItemStr, curIndexStr, targetX, targetY) {
        if (isNewItemStr == "1") {
            var curIndex = parseInt(curIndexStr);
            var obj = this.ImgList[curIndex];
            if (obj) {
                this.curMoveItemObj = this.newObjForTouchBegin(obj, targetX, targetY);
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 1");
            }
        }
        else {
            var curIndex = parseInt(curIndexStr);
            var obj = this.targetList[curIndex];
            if (obj) {
                var childIndex = this.group.numChildren;
                this.group.setChildIndex(obj, childIndex - 1);
                this.curMoveItemObj = obj;
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 0");
            }
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.revMoveHandle = function (targetX, targetY) {
        var target = this.curMoveItemObj;
        if (target) {
            var posTarget = this.globalToLocal(targetX, targetY);
            target.x = posTarget.x;
            target.y = posTarget.y;
        }
    };
    DragAnyMakeForMaxAndCancleScene.prototype.revEndHandle = function (isCancelStr, isNewItemStr, targetX, targetY, deleteIndex) {
        if (isCancelStr == "1") {
            // 取消
            if (isNewItemStr == "1") {
                // 表示创建了一个新的 但是不需要了 需要删除
                if (this.curMoveItemObj) {
                    this.deleteObj(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                if (deleteIndex >= -1) {
                    // 表示 拖动的创建好的 需要删除数据
                    var curIndex = deleteIndex;
                    this.targetList.splice(curIndex, 1);
                    if (this.curMoveItemObj) {
                        this.deleteObj(this.curMoveItemObj);
                    }
                    this.curMoveItemObj = null;
                }
                else {
                    Log.trace("DragAnyMakeForMaxAndCancleScene", "revEndHandle error  index to obj not find ");
                }
            }
        }
        else {
            // 不是取消
            if (isNewItemStr == "1") {
                // 表示 创建了一个新的 需要保存到target列表
                if (this.curMoveItemObj) {
                    this.targetList.push(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                // 表示 移动的是原来创建好的 , 只设置坐标就可以
                this.curMoveItemObj = null;
            }
        }
    };
    return DragAnyMakeForMaxAndCancleScene;
}(UIObject));
__reflect(DragAnyMakeForMaxAndCancleScene.prototype, "DragAnyMakeForMaxAndCancleScene");
var BalanceComponent = (function () {
    function BalanceComponent() {
        // 旋转最大角度
        this.rotMax = 30;
        // 旋转最大角度 所需要的左右差值
        this.numWeightRotMax = 30;
    }
    BalanceComponent.prototype.initData = function () {
        this.imgListLeft = [];
        this.imgListRight = [];
        this.imgListBalanceLine = [];
        this.numWeightLeftInit = 0;
        this.numWeightRightInit = 0;
        this.numWeightLeftCur = 0;
        this.numWeightRightCur = 0;
        this.rotMax = 30;
        this.numWeightRotMax = 30;
        this.pointCenter = new egret.Point(0, 0);
    };
    BalanceComponent.prototype.onInit = function () {
        this.startRotTween(0, 0, true);
    };
    BalanceComponent.prototype.onDestroy = function () {
    };
    BalanceComponent.prototype.setLeftItemObjList = function (time, xTemp, yTemp) {
        if (time === void 0) { time = null; }
        if (xTemp === void 0) { xTemp = null; }
        if (yTemp === void 0) { yTemp = null; }
    };
    BalanceComponent.prototype.setRightItemObjList = function (time, xTemp, yTemp) {
        if (time === void 0) { time = null; }
        if (xTemp === void 0) { xTemp = null; }
        if (yTemp === void 0) { yTemp = null; }
    };
    BalanceComponent.prototype.startRotTween = function (numWeightLeftNew, numWeightRightNew, isInit) {
        if (isInit === void 0) { isInit = false; }
        var isReturn = false;
        if (numWeightLeftNew == this.numWeightLeftCur && numWeightRightNew == this.numWeightRightCur) {
            // 和上次的数据相同 return
            isReturn = true;
        }
        if (this.numWeightLeftCur + this.numWeightLeftInit - this.numWeightRightCur - this.numWeightRightInit >= this.numWeightRotMax
            && numWeightLeftNew + this.numWeightLeftInit - numWeightRightNew - this.numWeightRightInit >= this.numWeightRotMax) {
            // 超过旋转上限 return  左侧
            isReturn = true;
        }
        if (this.numWeightRightCur + this.numWeightRightInit - this.numWeightLeftCur - this.numWeightLeftInit >= this.numWeightRotMax
            && numWeightRightNew + this.numWeightRightInit - numWeightLeftNew - this.numWeightLeftInit >= this.numWeightRotMax) {
            // 超过旋转上限 return  右侧
            isReturn = true;
        }
        if (isReturn && !isInit) {
            // left item
            this.setLeftItemObjList();
            // right item
            this.setRightItemObjList();
            return;
        }
        this.numWeightLeftCur = numWeightLeftNew;
        this.numWeightRightCur = numWeightRightNew;
        var time = 200;
        if (isInit) {
            time = 0;
        }
        // 开始旋转
        var ro = 0;
        if (this.numWeightLeftCur + this.numWeightLeftInit == this.numWeightRightCur + this.numWeightRightInit) {
            ro = 0;
        }
        else if (this.numWeightLeftCur + this.numWeightLeftInit == 0) {
            ro = this.rotMax;
        }
        else if (this.numWeightRightCur + this.numWeightRightInit == 0) {
            ro = -this.rotMax;
        }
        else {
            var percent = (-this.numWeightLeftCur - this.numWeightLeftInit + this.numWeightRightCur + this.numWeightRightInit) / this.numWeightRotMax;
            if (percent < -1) {
                percent = -1;
            }
            if (percent > 1) {
                percent = 1;
            }
            ro = this.rotMax * percent;
        }
        for (var _i = 0, _a = this.imgListBalanceLine; _i < _a.length; _i++) {
            var obj = _a[_i];
            egret.Tween.removeTweens(obj);
            egret.Tween.get(obj).to({ rotation: ro }, time);
        }
        // const half: number = this.baseImg.width / 2 - 33;
        // left
        var leftXTemp = null;
        var leftYTemp = null;
        for (var _b = 0, _c = this.imgListLeft; _b < _c.length; _b++) {
            var obj = _c[_b];
            var half = egret.Point.distance(this.pointCenter, new egret.Point(obj.x, obj.y));
            var leftX = this.pointCenter.x - Math.cos(ro * Math.PI / 180) * half;
            var leftY = this.pointCenter.y - Math.sin(ro * Math.PI / 180) * half;
            egret.Tween.removeTweens(obj);
            egret.Tween.get(obj).to({ x: leftX, y: leftY }, time);
            if (leftXTemp == null) {
                leftXTemp = leftX;
            }
            if (leftYTemp == null) {
                leftYTemp = leftY;
            }
        }
        // right
        var rightXTemp = null;
        var rightYTemp = null;
        for (var _d = 0, _e = this.imgListRight; _d < _e.length; _d++) {
            var obj = _e[_d];
            var half = egret.Point.distance(this.pointCenter, new egret.Point(obj.x, obj.y));
            var rightX = this.pointCenter.x + Math.cos(ro * Math.PI / 180) * half;
            var rightY = this.pointCenter.y + Math.sin(ro * Math.PI / 180) * half;
            egret.Tween.removeTweens(obj);
            egret.Tween.get(obj).to({ x: rightX, y: rightY }, time);
            if (rightXTemp == null) {
                rightXTemp = rightX;
            }
            if (rightYTemp == null) {
                rightYTemp = rightY;
            }
        }
        // left item
        this.setLeftItemObjList(time, leftXTemp, leftYTemp);
        // right item
        this.setRightItemObjList(time, rightXTemp, rightYTemp);
    };
    return BalanceComponent;
}());
__reflect(BalanceComponent.prototype, "BalanceComponent");
/* tslint:disable:no-shadowed-variable variable-name no-for-in-array*/
// 不允许子作用域与外层作用域声明同名变量  驼峰  不允许对Array使用for-in
var DragAnyMakeRuleListCommonScene = (function (_super) {
    __extends(DragAnyMakeRuleListCommonScene, _super);
    function DragAnyMakeRuleListCommonScene() {
        var _this = _super.call(this) || this;
        _this.targetDataMap = {}; // key index  value [{obj, index}]   target对应位置的列表 map example {1:[{obj:obj, index:index}], 2:[{obj:obj, index:index}]}
        _this.isNewItem = false;
        _this.ImgList = [];
        _this.rectCanSetList = [];
        _this.numMax = 1;
        _this.curMoveItemIndex = -2;
        _this.countImgList = [];
        _this.curNumImgList = [];
        return _this;
    }
    /** 每次进入 */
    DragAnyMakeRuleListCommonScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
        this.instanceDataForInitAll();
        this.refreshForListTouchEnd();
    };
    /** 这里进行移出场景的处理 **/
    DragAnyMakeRuleListCommonScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destoryEvent();
        this.destoryData();
    };
    DragAnyMakeRuleListCommonScene.prototype.execMessage = function (data) {
        if (true) {
            return;
        }
        if (data["reset"]) {
            this.resetData();
            this.instanceDataForInitAll();
            this.refreshForListTouchEnd();
        }
        else if (data["touchBegin"]) {
            var isNewItem = data["touchBegin"]["isNewItem"];
            var curIndexStr = data["touchBegin"]["curIndexStr"];
            var targetX = parseInt(data["touchBegin"]["targetX"]);
            var targetY = parseInt(data["touchBegin"]["targetY"]);
            this.revStartHandle(isNewItem, curIndexStr, targetX, targetY);
        }
        else if (data["touchMove"]) {
            var targetX = parseInt(data["touchMove"]["targetX"]);
            var targetY = parseInt(data["touchMove"]["targetY"]);
            this.revMoveHandle(targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var isCancelStr = data["touchEndLayer"]["isCancelStr"];
            var isNewItemStr = data["touchEndLayer"]["isNewItemStr"];
            var targetX = parseInt(data["touchEndLayer"]["targetX"]);
            var targetY = parseInt(data["touchEndLayer"]["targetY"]);
            var deleteIndex = parseInt(data["touchEndLayer"]["deleteIndex"]);
            var targetListIndex = parseInt(data["touchEndLayer"]["targetListIndex"]);
            this.revEndHandle(isCancelStr, isNewItemStr, targetX, targetY, deleteIndex, targetListIndex);
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.initData = function () {
        this.targetList = [];
        this.targetDataMap = {};
        this.curNumImgList = [];
        if (this.countImgList.length <= 0) {
            for (var i = 0; i < this.ImgList.length; i++) {
                this.countImgList[i] = 9999;
                this.curNumImgList[i] = 0;
            }
        }
        else {
            for (var i = 0; i < this.ImgList.length; i++) {
                this.curNumImgList[i] = 0;
            }
        }
    };
    //初始化rect中自带物品 
    DragAnyMakeRuleListCommonScene.prototype.instanceDataForInitAll = function () {
    };
    DragAnyMakeRuleListCommonScene.prototype.instanceForInit = function (sourcePath, indexItem, rectIndex) {
        var img = this.getItemForInit(sourcePath);
        this.instanceDataForInit(img, indexItem, rectIndex);
        return img;
    };
    DragAnyMakeRuleListCommonScene.prototype.getItemForInit = function (sourcePath) {
        var img = new eui.Image(sourcePath);
        this.group.addChild(img);
        return img;
    };
    DragAnyMakeRuleListCommonScene.prototype.instanceDataForInit = function (obj, indexItem, rectIndex) {
        if (obj && indexItem != null && rectIndex != null) {
            this.targetList.push(obj);
            this.pushToTarget(obj, indexItem, rectIndex);
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.btnReset) {
            this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeRuleListCommonScene.prototype.touchBeginOriginalEvent = function (event) {
        // 错误兼容处理 ( 如果点击的不是临时的..说明上次临时的没用.兼容处理 )
        this.errorEndEventFunc();
        event.stopPropagation();
        // event.stopImmediatePropagation()
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= -1) {
            // let childIndex = this.group.numChildren
            // this.group.setChildIndex(event.target, childIndex - 1)
            this.curMoveItemIndex = curIndex;
            this.isNewItem = true;
            this.curMoveItemObj = this.newObjForTouchBegin(event.target, event.stageX, event.stageY);
            var obj = new Object();
            obj["isNewItem"] = "1";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            // 刷新 是否超过可拖动的上限
            this.refreshToIsHideTouchBegin(curIndex);
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.newObjForTouchBegin = function (obj, xGlobal, yGlobal) {
        var localPos = this.group.globalToLocal(xGlobal, yGlobal);
        var path = obj.source;
        var img = new eui.Image(path);
        img.anchorOffsetX = obj.anchorOffsetX;
        img.anchorOffsetY = obj.anchorOffsetY;
        img.rotation = obj.rotation;
        img.x = localPos.x;
        img.y = localPos.y;
        this.group.addChild(img);
        img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        return img;
    };
    DragAnyMakeRuleListCommonScene.prototype.deleteObj = function (obj) {
        if (!obj) {
            return;
        }
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginMakedItemEvent, this);
        egret.Tween.removeTweens(obj);
        this.group.removeChild(obj);
    };
    DragAnyMakeRuleListCommonScene.prototype.touchBeginMakedItemEvent = function (event) {
        // 错误兼容处理 ( 如果点击的是临时的..如果点击的不是上次点击的.兼容处理)
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            if (this.curMoveItemObj == event.currentTarget) {
                // 如果是上次点击的 数据不变, return
                return;
            }
            else {
                // 如果不是上次点击的 数据清除 继续正常逻辑
                this.errorEndEventFunc();
            }
        }
        event.stopPropagation();
        var curIndex = -1;
        for (var index in this.targetList) {
            var obj = this.targetList[index];
            if (obj == event.currentTarget) {
                curIndex = parseInt(index);
            }
        }
        if (curIndex >= -1) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveItemIndex = curIndex;
            this.isNewItem = false;
            this.curMoveItemObj = event.target;
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["isNewItem"] = "0";
            obj["curIndexStr"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchMove", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.touchBeginLayerEvent = function (event) {
        // 错误兼容处理 ( 如果点击的不是临时的..说明上次临时的没用.兼容处理 )
        this.errorEndEventFunc();
    };
    DragAnyMakeRuleListCommonScene.prototype.touchEndLayerEvent = function (event) {
        var isCancelStr = 0;
        var isNewItemStr = 0;
        var stageXStr = 0;
        var stageYStr = 0;
        var deleteIndex = -2;
        var index = -1;
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            var target = this.curMoveItemObj;
            var stageX = event.stageX;
            var stageY = event.stageY;
            stageXStr = event.stageX;
            stageYStr = event.stageY;
            this.curMoveItemObj.x = stageX;
            this.curMoveItemObj.y = stageY;
            index = this.getRectIndexCanSet(stageX, stageY);
            if (!this.isCanSetToRect(this.curMoveItemIndex, index, this.curMoveItemObj, this.isNewItem)) {
                index = -1;
            }
            if (index <= -1) {
                isCancelStr = 1;
                // 取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示创建了一个新的 但是不需要了 需要删除
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 拖动的创建好的 需要删除数据
                    // let curIndex = this.targetList.indexOf(event.currentTarget)
                    var curIndex = 0;
                    for (var index_1 in this.targetList) {
                        var obj_1 = this.targetList[index_1];
                        if (obj_1 == this.curMoveItemObj) {
                            curIndex = parseInt(index_1);
                        }
                    }
                    deleteIndex = curIndex;
                    this.targetList.splice(curIndex, 1);
                    this.removeToTarget(this.curMoveItemObj);
                    this.deleteObj(this.curMoveItemObj);
                    this.curMoveItemObj = null;
                }
            }
            else {
                isCancelStr = 0;
                // 不是取消
                if (this.isNewItem) {
                    isNewItemStr = 1;
                    // 表示 创建了一个新的 需要保存到target列表
                    this.targetList.push(this.curMoveItemObj);
                    this.pushToTarget(this.curMoveItemObj, this.curMoveItemIndex, index);
                    this.curMoveItemObj = null;
                }
                else {
                    isNewItemStr = 0;
                    // 表示 移动的是原来创建好的 , 只设置坐标就可以
                    this.refreshToTarget(this.curMoveItemObj, index);
                    this.curMoveItemObj = null;
                }
            }
        }
        // 给学生发送信令  移动中
        var obj = new Object();
        obj["isCancelStr"] = isCancelStr.toString();
        obj["isNewItemStr"] = isNewItemStr.toString();
        obj["targetX"] = stageXStr.toString();
        obj["targetY"] = stageYStr.toString();
        obj["deleteIndex"] = deleteIndex.toString();
        obj["targetListIndex"] = index.toString();
        var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        this.refreshForListTouchEnd();
    };
    DragAnyMakeRuleListCommonScene.prototype.resetData = function () {
        if (this.targetList && this.targetList.length > 0) {
            for (var _i = 0, _a = this.targetList; _i < _a.length; _i++) {
                var obj = _a[_i];
                this.deleteObj(obj);
            }
            this.targetList = [];
        }
        this.targetDataMap = {};
        for (var i = 0; i < this.curNumImgList.length; i++) {
            this.curNumImgList[i] = 0;
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.touchTapEvent = function (event) {
        this.resetData();
        this.instanceDataForInitAll();
        this.refreshForListTouchEnd();
        var msg = { method: "onFileMessage", keyName: "reset", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyMakeRuleListCommonScene.prototype.destoryData = function () {
        delete this.ImgList;
        this.ImgList = [];
        delete this.rectCanSetList;
        this.rectCanSetList = [];
        delete this.targetDataMap;
        this.targetDataMap = {};
        delete this.countImgList;
        this.countImgList = [];
        delete this.curNumImgList;
        this.curNumImgList = [];
        this.resetData();
    };
    DragAnyMakeRuleListCommonScene.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginOriginalEvent, this);
        }
        if (this.btnReset) {
            this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyMakeRuleListCommonScene.prototype.revStartHandle = function (isNewItemStr, curIndexStr, targetX, targetY) {
        this.curMoveItemIndex = -2;
        if (isNewItemStr == "1") {
            var curIndex = parseInt(curIndexStr);
            var obj = this.ImgList[curIndex];
            if (obj) {
                this.curMoveItemObj = this.newObjForTouchBegin(obj, targetX, targetY);
                this.isNewItem = true;
                this.curMoveItemIndex = parseInt(curIndexStr);
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 1");
            }
            // 刷新 是否超过可拖动的上限(新拖动出来的才需要判断)
            this.refreshToIsHideTouchBegin(curIndex);
        }
        else {
            var curIndex = parseInt(curIndexStr);
            var obj = this.targetList[curIndex];
            if (obj) {
                this.isNewItem = false;
                var childIndex = this.group.numChildren;
                this.group.setChildIndex(obj, childIndex - 1);
                this.curMoveItemObj = obj;
            }
            else {
                Log.trace("DragAnyMakeForMaxAndCancleScene", "revStartHandle error  index to obj not find isNewItemStr = 0");
            }
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.revMoveHandle = function (targetX, targetY) {
        var target = this.curMoveItemObj;
        if (target) {
            var posTarget = this.globalToLocal(targetX, targetY);
            target.x = posTarget.x;
            target.y = posTarget.y;
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.revEndHandle = function (isCancelStr, isNewItemStr, targetX, targetY, deleteIndex, targetListIndex) {
        if (isCancelStr == "1") {
            // 取消
            if (isNewItemStr == "1") {
                // 表示创建了一个新的 但是不需要了 需要删除
                if (this.curMoveItemObj) {
                    this.deleteObj(this.curMoveItemObj);
                }
                this.curMoveItemObj = null;
            }
            else {
                if (deleteIndex >= -1) {
                    // 表示 拖动的创建好的 需要删除数据
                    var curIndex = deleteIndex;
                    this.targetList.splice(curIndex, 1);
                    if (this.curMoveItemObj) {
                        this.deleteObj(this.curMoveItemObj);
                        this.removeToTarget(this.curMoveItemObj);
                    }
                    this.curMoveItemObj = null;
                }
                else {
                    Log.trace("DragAnyMakeForMaxAndCancleScene", "revEndHandle error  index to obj not find ");
                }
            }
        }
        else {
            // 不是取消
            if (isNewItemStr == "1") {
                // 表示 创建了一个新的 需要保存到target列表
                if (this.curMoveItemObj) {
                    this.targetList.push(this.curMoveItemObj);
                    if (targetListIndex > -1) {
                        this.pushToTarget(this.curMoveItemObj, this.curMoveItemIndex, targetListIndex);
                    }
                }
                this.curMoveItemIndex = -2;
                this.curMoveItemObj = null;
            }
            else {
                // 表示 移动的是原来创建好的 , 只设置坐标就可以
                this.refreshToTarget(this.curMoveItemObj, targetListIndex);
                this.curMoveItemObj = null;
            }
        }
        this.refreshForListTouchEnd();
    };
    // 获取rect的index 如果嫌效率低.可以不用rect 重写此方法 手动控制index
    DragAnyMakeRuleListCommonScene.prototype.getRectIndexCanSet = function (stageX, stageY) {
        for (var indexCur in this.rectCanSetList) {
            var obj = this.rectCanSetList[indexCur];
            if (obj.hitTestPoint(stageX, stageY)) {
                return parseInt(indexCur);
            }
        }
        return -1;
    };
    // indexForImgList 图片索引(new = true为图片索引 为false 为target索引 需要getDataFromTargetDataMap 通过图片获取索引),
    // indexRect 目标方框索引
    // obj 当前拖动的对象
    // isNewItem 是否是新建的对象(新产生的=true  已经产生的二次拖动=false)
    DragAnyMakeRuleListCommonScene.prototype.isCanSetToRect = function (indexForImgList, indexRect, obj, isNewItem) {
        if (isNewItem) {
            return this.isCanSetToRectForReal(indexForImgList, indexRect, obj, isNewItem);
        }
        else {
            var dataTemp = this.getDataFromTargetDataMap(obj);
            if (dataTemp) {
                return this.isCanSetToRectForReal(dataTemp.index, indexRect, obj, isNewItem);
            }
        }
        return true;
    };
    // indexForImgList 图片索引
    // indexRect 目标方框索引
    // obj 当前拖动的对象
    // isNewItem 是否是新建的对象(新产生的=true  已经产生的二次拖动=false)
    DragAnyMakeRuleListCommonScene.prototype.isCanSetToRectForReal = function (indexForImgList, indexRect, obj, isNewItem) {
        return true;
    };
    // 扩展方法
    // 每个方框里只能放 numMax 张图片
    DragAnyMakeRuleListCommonScene.prototype.isCanSetToRectForRectMax = function (indexRect, obj, numMax) {
        if (this.targetDataMap[indexRect] && this.targetDataMap[indexRect].length > 0) {
            if (this.targetDataMap[indexRect].length < numMax) {
                return true;
            }
            else if (this.targetDataMap[indexRect].length == numMax) {
                for (var _i = 0, _a = this.targetDataMap[indexRect]; _i < _a.length; _i++) {
                    var data = _a[_i];
                    if (data.obj == obj) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return false;
            }
        }
        return true;
    };
    // 临时map对象 数据
    DragAnyMakeRuleListCommonScene.prototype.pushToTarget = function (obj, indexForImgList, indexRect) {
        var dataList = null;
        if (this.targetDataMap[indexRect]) {
            dataList = this.targetDataMap[indexRect];
            var data = { obj: obj, index: indexForImgList };
            dataList.push(data);
        }
        else {
            dataList = [{ obj: obj, index: indexForImgList }];
            this.targetDataMap[indexRect] = dataList;
        }
        this.curNumImgList[indexForImgList]++;
    };
    DragAnyMakeRuleListCommonScene.prototype.removeToTarget = function (objCur) {
        for (var key in this.targetDataMap) {
            var dataList = this.targetDataMap[key];
            if (dataList) {
                for (var i in dataList) {
                    var data = dataList[parseInt(i)];
                    if (data) {
                        if (data.obj == objCur) {
                            dataList.splice(i, 1);
                            this.curNumImgList[data.index]--;
                            return;
                        }
                    }
                }
            }
        }
    };
    // 需要test
    DragAnyMakeRuleListCommonScene.prototype.refreshToTarget = function (objCur, indexRect) {
        for (var key in this.targetDataMap) {
            var dataList = this.targetDataMap[key];
            if (dataList) {
                for (var i in dataList) {
                    var data = dataList[parseInt(i)];
                    if (data) {
                        if (data.obj == objCur) {
                            this.removeToTarget(objCur);
                            this.pushToTarget(data.obj, data.index, indexRect);
                            return;
                        }
                    }
                }
            }
        }
    };
    // 需要判空
    DragAnyMakeRuleListCommonScene.prototype.getDataFromTargetDataMap = function (objCur) {
        for (var key in this.targetDataMap) {
            var dataList = this.targetDataMap[key];
            if (dataList) {
                for (var i in dataList) {
                    var data = dataList[parseInt(i)];
                    if (data) {
                        if (data.obj == objCur) {
                            return data;
                        }
                    }
                }
            }
        }
        return null;
    };
    DragAnyMakeRuleListCommonScene.prototype.refreshToIsHideTouchBegin = function (imgIndex) {
        for (var i in this.ImgList) {
            var index = parseInt(i);
            var obj = this.ImgList[index];
            var numCurTake = 0;
            if (index == imgIndex) {
                numCurTake = 1;
            }
            if (obj) {
                if (this.curNumImgList[index] + numCurTake < this.countImgList[index]) {
                    // 数量没超上限
                    obj.visible = true;
                }
                else {
                    // 数量超过上限
                    obj.visible = false;
                }
            }
        }
    };
    // 每次点击结束都调用
    DragAnyMakeRuleListCommonScene.prototype.refreshForListTouchEnd = function () {
        for (var i in this.ImgList) {
            var index = parseInt(i);
            var obj = this.ImgList[index];
            if (obj) {
                if (this.curNumImgList[index] < this.countImgList[index]) {
                    // 数量没超上限
                    obj.visible = true;
                }
                else {
                    // 数量超过上限
                    obj.visible = false;
                }
            }
        }
    };
    DragAnyMakeRuleListCommonScene.prototype.errorEndEventFunc = function () {
        if (this.curMoveItemIndex >= -1 && this.curMoveItemObj) {
            // 错误兼容处理 如果上次的没释放.并且错误 .重新处理end
            var errorEndEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_END, null, null, 999999, 999999);
            this.touchEndLayerEvent(errorEndEvent);
        }
    };
    return DragAnyMakeRuleListCommonScene;
}(UIObject));
__reflect(DragAnyMakeRuleListCommonScene.prototype, "DragAnyMakeRuleListCommonScene");
var DragAnyOptionalChooseBtn = (function (_super) {
    __extends(DragAnyOptionalChooseBtn, _super);
    function DragAnyOptionalChooseBtn() {
        var _this = _super.call(this) || this;
        _this.ImgList = [];
        _this.rectListSelect = [];
        _this.imgPosList = [];
        _this.imgSelected = null;
        _this.curMoveIndex = -1;
        return _this;
    }
    /** 每次进入 */
    DragAnyOptionalChooseBtn.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    DragAnyOptionalChooseBtn.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destroyEvent();
        this.destroyData();
    };
    DragAnyOptionalChooseBtn.prototype.execMessage = function (data) {
        if (data["reset"]) {
            this.resetData();
        }
        else if (data["choose"]) {
            var chooseIndex = parseInt(data["choose"]["chooseIndex"]);
            this.revChooseHandle(chooseIndex);
        }
        else if (data["touchBegin"]) {
            var clickIndex = parseInt(data["touchBegin"]["clickIndex"]);
            var targetX = parseInt(data["touchBegin"]["targetX"]);
            var targetY = parseInt(data["touchBegin"]["targetY"]);
            this.revStartHandle(clickIndex, targetX, targetY);
        }
        else if (data["touchMoveLayer"]) {
            var clickIndex = parseInt(data["touchMoveLayer"]["clickIndex"]);
            var targetX = parseInt(data["touchMoveLayer"]["targetX"]);
            var targetY = parseInt(data["touchMoveLayer"]["targetY"]);
            this.revMoveLayerHandle(clickIndex, targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var clickIndex = parseInt(data["touchEndLayer"]["clickIndex"]);
            var targetX = parseInt(data["touchEndLayer"]["targetX"]);
            var targetY = parseInt(data["touchEndLayer"]["targetY"]);
            this.revEndLayerHandle(clickIndex, targetX, targetY);
        }
    };
    DragAnyOptionalChooseBtn.prototype.initData = function () {
        this.curMoveIndex = -1;
        this.imgPosList = [];
        for (var index in this.ImgList) {
            var obj = this.ImgList[parseInt(index)];
            if (obj) {
                this.imgPosList[parseInt(index)] = new egret.Point(obj.x, obj.y);
            }
        }
        if (this.imgSelected) {
            this.imgSelected.visible = false;
        }
    };
    DragAnyOptionalChooseBtn.prototype.initSelectData = function (rectListSelect, imgSelected, indexTrueAnswer) {
        if (rectListSelect && imgSelected && indexTrueAnswer != null) {
            this.rectListSelect = rectListSelect;
            this.imgSelected = imgSelected;
            this.indexTrueAnswer = indexTrueAnswer;
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", "initSelectData error args is null");
        }
    };
    DragAnyOptionalChooseBtn.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        if (this.rectListSelect) {
            for (var _b = 0, _c = this.rectListSelect; _b < _c.length; _b++) {
                var obj = _c[_b];
                obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
        this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapResetEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyOptionalChooseBtn.prototype.resetData = function () {
        for (var index in this.ImgList) {
            var obj = this.ImgList[parseInt(index)];
            var pos = this.imgPosList[parseInt(index)];
            if (obj) {
                obj.x = pos.x;
                obj.y = pos.y;
            }
        }
    };
    DragAnyOptionalChooseBtn.prototype.touchTapResetEvent = function (event) {
        this.resetData();
        var msg = { method: "onFileMessage", keyName: "reset", value: "1" };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DragAnyOptionalChooseBtn.prototype.touchTapChooseRectEvent = function (event) {
        var index = this.rectListSelect.indexOf(event.currentTarget);
        if (index > -1) {
            if (this.imgSelected) {
                this.imgSelected.visible = true;
                this.imgSelected.x = event.currentTarget.x;
                this.imgSelected.y = event.currentTarget.y;
            }
            if (index == this.indexTrueAnswer) {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 1, movie: "success", movieCount: 2 }, false));
            }
            else {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 2, movie: "failed", movieCount: 2 }, false));
            }
            var obj = new Object();
            obj["chooseIndex"] = index.toString();
            var msg = { method: "onFileMessage", keyName: "choose", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", " touchTapChooseRectEvent error  index error ");
        }
    };
    DragAnyOptionalChooseBtn.prototype.touchBeginEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.currentTarget);
        if (curIndex >= 0) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveIndex = curIndex;
            var obj = new Object();
            obj["clickIndex"] = curIndex.toString();
            obj["targetX"] = event.stageX.toString();
            obj["targetY"] = event.stageY.toString();
            var msg = { method: "onFileMessage", keyName: "touchBegin", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DragAnyOptionalChooseBtn.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["clickIndex"] = this.curMoveIndex.toString();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchMoveLayer", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DragAnyOptionalChooseBtn.prototype.touchEndLayerEvent = function (event) {
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["clickIndex"] = this.curMoveIndex.toString();
                obj["targetX"] = target.x.toString();
                obj["targetY"] = target.y.toString();
                var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
                this.curMoveIndex = -1;
            }
        }
    };
    DragAnyOptionalChooseBtn.prototype.destroyData = function () {
        this.resetData();
        delete this.ImgList;
        this.ImgList = [];
        delete this.rectListSelect;
        this.rectListSelect = [];
        delete this.imgSelected;
        this.imgSelected = null;
        delete this.imgPosList;
        this.imgPosList = [];
    };
    DragAnyOptionalChooseBtn.prototype.destroyEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        if (this.rectListSelect) {
            for (var _b = 0, _c = this.rectListSelect; _b < _c.length; _b++) {
                var obj = _c[_b];
                obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapChooseRectEvent, this);
            }
        }
        this.btnReset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapResetEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DragAnyOptionalChooseBtn.prototype.revChooseHandle = function (chooseIndex) {
        if (chooseIndex > -1) {
            var target = this.rectListSelect[chooseIndex];
            if (this.imgSelected && target) {
                this.imgSelected.visible = true;
                this.imgSelected.x = target.x;
                this.imgSelected.y = target.y;
            }
            if (chooseIndex == this.indexTrueAnswer) {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 1, movie: "success", movieCount: 2 }, false));
            }
            else {
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_commonmovie", { soundType: 2, movie: "failed", movieCount: 2 }, false));
            }
        }
    };
    DragAnyOptionalChooseBtn.prototype.revStartHandle = function (clickIndex, targetX, targetY) {
        var target = this.ImgList[clickIndex];
        if (target) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(target, childIndex - 1);
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", "revStartHandle error target not find");
        }
    };
    DragAnyOptionalChooseBtn.prototype.revMoveLayerHandle = function (clickIndex, targetX, targetY) {
        var target = this.ImgList[clickIndex];
        if (target) {
            target.x = targetX;
            target.y = targetY;
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", "revMoveLayerHandle error target not find");
        }
    };
    DragAnyOptionalChooseBtn.prototype.revEndLayerHandle = function (clickIndex, targetX, targetY) {
        var target = this.ImgList[clickIndex];
        if (target) {
            target.x = targetX;
            target.y = targetY;
        }
        else {
            Log.trace("DragAnyOptionalChooseBtn", "revEndLayerHandle error target not find");
        }
    };
    return DragAnyOptionalChooseBtn;
}(UIObject));
__reflect(DragAnyOptionalChooseBtn.prototype, "DragAnyOptionalChooseBtn");
var DropAnyToRuleRectScene = (function (_super) {
    __extends(DropAnyToRuleRectScene, _super);
    function DropAnyToRuleRectScene() {
        var _this = _super.call(this) || this;
        _this.ImgList = [];
        _this.ruleRectList = [];
        _this.imgPosList = [];
        _this.curMoveIndex = -1;
        return _this;
    }
    /** 每次进入 */
    DropAnyToRuleRectScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    DropAnyToRuleRectScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.resetImgPosForList();
        this.destoryEvent();
        this.destoryData();
    };
    /** 收到信令消息 */
    DropAnyToRuleRectScene.prototype.execMessage = function (data) {
        if (data["touchMove"]) {
            var name_3 = data["touchMove"]["name"];
            var targetX = Number(data["touchMove"]["targetX"]);
            var targetY = Number(data["touchMove"]["targetY"]);
            this.revMoveingHandle(name_3, targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var moveName = data["touchEndLayer"]["moveName"];
            var targetX = Number(data["touchEndLayer"]["targetX"]);
            var targetY = Number(data["touchEndLayer"]["targetY"]);
            var isResetStr = data["touchEndLayer"]["isResetStr"];
            this.revMoveEndLayerHandle(moveName, isResetStr, targetX, targetY);
        }
    };
    DropAnyToRuleRectScene.prototype.initData = function () {
        this.curMoveIndex = -1;
        this.imgPosList = [];
        for (var i = 0; i < this.ImgList.length; i++) {
            var obj = this.ImgList[i];
            if (obj) {
                this.imgPosList.push(new egret.Point(obj.x, obj.y));
            }
        }
    };
    DropAnyToRuleRectScene.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for (var _b = 0, _c = this.ruleRectList; _b < _c.length; _b++) {
            var rectObj = _c[_b];
            rectObj.touchEnabled = false;
        }
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DropAnyToRuleRectScene.prototype.resetImgPosForList = function () {
        for (var index in this.ImgList) {
            var obj = this.ImgList[index];
            var pos = this.imgPosList[index];
            if (obj && pos) {
                obj.x = pos.x;
                obj.y = pos.y;
            }
        }
    };
    DropAnyToRuleRectScene.prototype.destoryData = function () {
        this.curMoveIndex = -1;
        delete this.ImgList;
        this.ImgList = [];
        delete this.ruleRectList;
        this.ruleRectList = [];
        delete this.imgPosList;
        this.imgPosList = [];
    };
    DropAnyToRuleRectScene.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for (var _b = 0, _c = this.ruleRectList; _b < _c.length; _b++) {
            var rectObj = _c[_b];
            rectObj.touchEnabled = false;
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DropAnyToRuleRectScene.prototype.touchBeginEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= 0) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveIndex = curIndex;
        }
    };
    DropAnyToRuleRectScene.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x - target.width / 2;
                target.y = posTarget.y - target.height / 2;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["name"] = this.curMoveIndex.toString();
                obj["targetX"] = target.x;
                obj["targetY"] = target.y;
                var msg = { method: "onFileMessage", keyName: "touchMove", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DropAnyToRuleRectScene.prototype.touchEndLayerEvent = function (event) {
        var moveName = "";
        var isResetStr = "true";
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                // 2位以上 位点击的上边
                var stageX = event.stageX;
                var stageY = event.stageY;
                var siteIndex = this.getSiteIndexForGlobalPos(stageX, stageY);
                if (siteIndex >= 0) {
                    // 没有东西  放置数据
                    var posTarget = this.globalToLocal(stageX, stageY);
                    target.x = posTarget.x - target.width / 2;
                    target.y = posTarget.y - target.height / 2;
                    moveName = this.curMoveIndex.toString();
                    isResetStr = "false";
                }
                else {
                    if (this.imgPosList[this.curMoveIndex]) {
                        var pos = this.imgPosList[this.curMoveIndex];
                        target.x = pos.x;
                        target.y = pos.y;
                    }
                    moveName = this.curMoveIndex.toString();
                    isResetStr = "true";
                }
            }
            this.curMoveIndex = -1;
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["moveName"] = moveName;
            obj["targetX"] = target.x;
            obj["targetY"] = target.y;
            obj["isResetStr"] = isResetStr;
            var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    DropAnyToRuleRectScene.prototype.getSiteIndexForGlobalPos = function (xGlobal, yGlobal) {
        var localPos = this.globalToLocal(xGlobal, yGlobal);
        var curX = localPos.x;
        var curY = localPos.y;
        for (var siteIndex in this.ruleRectList) {
            var rectObj = this.ruleRectList[siteIndex];
            if (rectObj) {
                if (rectObj.hitTestPoint(curX, curY)) {
                    return parseInt(siteIndex);
                }
            }
        }
        return -1;
    };
    DropAnyToRuleRectScene.prototype.revMoveingHandle = function (name, targetX, targetY) {
        if (name && name.length > 0) {
            if (this.ImgList[name]) {
                var targetObj = this.ImgList[name];
                if (targetObj) {
                    targetObj.x = targetX;
                    targetObj.y = targetY;
                    var childIndex = this.group.numChildren;
                    this.group.setChildIndex(targetObj, childIndex - 1);
                }
                else {
                    Log.trace("DropAnyToRuleRectScene", "revMoveingHandle data error please check");
                }
            }
        }
        else {
            Log.trace("DropAnyToRuleRectScene", "revMoveingHandle data error please check");
        }
    };
    /** 接收停止移动 */
    DropAnyToRuleRectScene.prototype.revMoveEndLayerHandle = function (moveIndex, isResetStr, targetX, targetY) {
        var target = this.ImgList[moveIndex];
        if (target) {
            // 2位以上 位点击的上边
            var stageX = targetX;
            var stageY = targetY;
            if (isResetStr == "false") {
                // 没有东西  放置数据
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x;
                target.y = posTarget.y;
            }
            else {
                if (this.imgPosList[moveIndex]) {
                    var pos = this.imgPosList[moveIndex];
                    target.x = pos.x;
                    target.y = pos.y;
                }
            }
        }
        else {
            Log.trace("DropAnyToRuleRectScene", "revMoveEndLayerHandle data error please check");
        }
    };
    return DropAnyToRuleRectScene;
}(UIObject));
__reflect(DropAnyToRuleRectScene.prototype, "DropAnyToRuleRectScene");
var DropToRuleRectScene = (function (_super) {
    __extends(DropToRuleRectScene, _super);
    function DropToRuleRectScene() {
        var _this = _super.call(this) || this;
        _this.ImgList = [];
        _this.ruleRectList = [];
        _this.imgPosList = [];
        _this.curMoveIndex = -1;
        _this.objIndexToSiteIndexMap = {};
        _this.siteIndexToObjIndexMap = {};
        return _this;
    }
    /** 每次进入 */
    DropToRuleRectScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    DropToRuleRectScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.resetImgPosForList();
        this.destoryEvent();
        this.destoryData();
    };
    /** 收到信令消息 */
    DropToRuleRectScene.prototype.execMessage = function (data) {
        if (data["touchMove"]) {
            var name_4 = data["touchMove"]["name"];
            var targetX = Number(data["touchMove"]["targetX"]);
            var targetY = Number(data["touchMove"]["targetY"]);
            this.revMoveingHandle(name_4, targetX, targetY);
        }
        else if (data["touchEndLayer"]) {
            var moveName = data["touchEndLayer"]["moveName"];
            var moveSite = data["touchEndLayer"]["moveSite"];
            this.revMoveEndLayerHandle(moveName, moveSite);
        }
    };
    DropToRuleRectScene.prototype.initData = function () {
        this.siteIndexToObjIndexMap = {};
        this.objIndexToSiteIndexMap = {};
        this.curMoveIndex = -1;
        this.imgPosList = [];
        for (var i = 0; i < this.ImgList.length; i++) {
            var obj = this.ImgList[i];
            if (obj) {
                this.imgPosList.push(new egret.Point(obj.x, obj.y));
            }
            this.objIndexToSiteIndexMap[i] = -1;
        }
        for (var i = 0; i < this.ruleRectList.length; i++) {
            this.siteIndexToObjIndexMap[i] = -1;
        }
    };
    DropToRuleRectScene.prototype.initAddEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for (var _b = 0, _c = this.ruleRectList; _b < _c.length; _b++) {
            var rectObj = _c[_b];
            rectObj.touchEnabled = false;
        }
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DropToRuleRectScene.prototype.resetImgPosForList = function () {
        for (var index in this.ImgList) {
            var obj = this.ImgList[index];
            var pos = this.imgPosList[index];
            if (obj && pos) {
                obj.x = pos.x;
                obj.y = pos.y;
            }
        }
    };
    DropToRuleRectScene.prototype.destoryData = function () {
        this.curMoveIndex = -1;
        delete this.siteIndexToObjIndexMap;
        this.siteIndexToObjIndexMap = {};
        delete this.objIndexToSiteIndexMap;
        this.objIndexToSiteIndexMap = {};
        delete this.ImgList;
        this.ImgList = [];
        delete this.ruleRectList;
        this.ruleRectList = [];
        delete this.imgPosList;
        this.imgPosList = [];
    };
    DropToRuleRectScene.prototype.destoryEvent = function () {
        for (var _i = 0, _a = this.ImgList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginEvent, this);
        }
        for (var _b = 0, _c = this.ruleRectList; _b < _c.length; _b++) {
            var rectObj = _c[_b];
            rectObj.touchEnabled = false;
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    };
    DropToRuleRectScene.prototype.touchBeginEvent = function (event) {
        var curIndex = this.ImgList.indexOf(event.target);
        if (curIndex >= 0) {
            var childIndex = this.group.numChildren;
            this.group.setChildIndex(event.target, childIndex - 1);
            this.curMoveIndex = curIndex;
        }
    };
    DropToRuleRectScene.prototype.touchMoveLayerEvent = function (event) {
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                var stageX = event.stageX;
                var stageY = event.stageY;
                var posTarget = this.globalToLocal(stageX, stageY);
                target.x = posTarget.x - target.width / 2;
                target.y = posTarget.y - target.height / 2;
                // 给学生发送信令  移动中
                var obj = new Object();
                obj["name"] = this.curMoveIndex.toString();
                obj["targetX"] = target.x;
                obj["targetY"] = target.y;
                var msg = { method: "onFileMessage", keyName: "touchMove", value: obj };
                lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
            }
        }
    };
    DropToRuleRectScene.prototype.touchEndLayerEvent = function (event) {
        var moveName = "";
        var moveSite = "";
        if (this.curMoveIndex >= 0) {
            var target = this.ImgList[this.curMoveIndex];
            if (target) {
                // 2位以上 位点击的上边
                var stageX = event.stageX;
                var stageY = event.stageY;
                var siteIndex = this.getSiteIndexForGlobalPos(stageX, stageY);
                if (siteIndex >= 0) {
                    if (this.isCanSetForSiteIndex(siteIndex)) {
                        // 没有东西  放置数据
                        var oldSiteIndex = this.objIndexToSiteIndexMap[this.curMoveIndex];
                        if (oldSiteIndex >= 0) {
                            this.siteIndexToObjIndexMap[oldSiteIndex] = -1;
                        }
                        this.siteIndexToObjIndexMap[siteIndex] = this.curMoveIndex;
                        this.objIndexToSiteIndexMap[this.curMoveIndex] = siteIndex;
                        moveName = this.curMoveIndex.toString();
                        moveSite = siteIndex.toString();
                    }
                }
                else {
                    var oldSiteIndex = this.objIndexToSiteIndexMap[this.curMoveIndex];
                    if (oldSiteIndex >= 0) {
                        this.siteIndexToObjIndexMap[oldSiteIndex] = -1;
                    }
                    this.objIndexToSiteIndexMap[this.curMoveIndex] = -1;
                    moveName = this.curMoveIndex.toString();
                    moveSite = "-1";
                }
            }
        }
        this.curMoveIndex = -1;
        this.refreshView();
        // 给学生发送信令  移动中
        var obj = new Object();
        obj["moveName"] = moveName;
        obj["moveSite"] = moveSite;
        var msg = { method: "onFileMessage", keyName: "touchEndLayer", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    DropToRuleRectScene.prototype.isCanSetForSiteIndex = function (siteIndex) {
        if (this.siteIndexToObjIndexMap[siteIndex] != null && this.siteIndexToObjIndexMap[siteIndex] >= 0) {
            return false;
        }
        return true;
    };
    DropToRuleRectScene.prototype.getSiteIndexForGlobalPos = function (xGlobal, yGlobal) {
        var localPos = this.globalToLocal(xGlobal, yGlobal);
        var curX = localPos.x;
        var curY = localPos.y;
        for (var siteIndex in this.ruleRectList) {
            var rectObj = this.ruleRectList[siteIndex];
            if (rectObj) {
                if (rectObj.hitTestPoint(curX, curY)) {
                    return parseInt(siteIndex);
                }
            }
        }
        return -1;
    };
    DropToRuleRectScene.prototype.refreshView = function () {
        for (var objIndex in this.ImgList) {
            var obj = this.ImgList[objIndex];
            if (obj) {
                if (this.objIndexToSiteIndexMap[objIndex] != null && this.objIndexToSiteIndexMap[objIndex] >= 0) {
                    // 位置不在初始位置
                    var siteIndex = this.objIndexToSiteIndexMap[objIndex];
                    if (this.ruleRectList[siteIndex]) {
                        var rectObj = this.ruleRectList[siteIndex];
                        obj.x = rectObj.x + rectObj.width / 2 - obj.width / 2;
                        obj.y = rectObj.y + rectObj.height / 2 - obj.height / 2;
                    }
                }
                else {
                    // 位置在初始位置
                    if (this.imgPosList[objIndex]) {
                        var pos = this.imgPosList[objIndex];
                        obj.x = pos.x;
                        obj.y = pos.y;
                    }
                }
            }
        }
    };
    DropToRuleRectScene.prototype.revMoveingHandle = function (name, targetX, targetY) {
        if (name && name.length > 0) {
            var objIndex = parseInt(name);
            if (objIndex != null && this.ImgList[objIndex]) {
                var targetObj = this.ImgList[objIndex];
                if (targetObj) {
                    targetObj.x = targetX;
                    targetObj.y = targetY;
                    var childIndex = this.group.numChildren;
                    this.group.setChildIndex(targetObj, childIndex - 1);
                }
                else {
                    Log.trace("DropToRuleRectScene", "revMoveingHandle data error please check");
                }
            }
        }
        else {
            Log.trace("DropToRuleRectScene", "revMoveingHandle data error please check");
        }
    };
    /** 接收停止移动 */
    DropToRuleRectScene.prototype.revMoveEndLayerHandle = function (moveName, moveSite) {
        if (moveName && moveSite && moveSite.length > 0 && moveName.length > 0) {
            var objIndex = parseInt(moveName);
            var siteIndex = parseInt(moveSite);
            if (siteIndex >= 0) {
                var oldSiteIndex = this.objIndexToSiteIndexMap[objIndex];
                if (oldSiteIndex >= 0) {
                    this.siteIndexToObjIndexMap[oldSiteIndex] = -1;
                }
                this.siteIndexToObjIndexMap[siteIndex] = objIndex;
                this.objIndexToSiteIndexMap[objIndex] = siteIndex;
            }
            else {
                var oldSiteIndex = this.objIndexToSiteIndexMap[objIndex];
                if (oldSiteIndex >= 0) {
                    this.siteIndexToObjIndexMap[oldSiteIndex] = -1;
                }
                this.objIndexToSiteIndexMap[objIndex] = -1;
            }
        }
        else {
            Log.trace("DropToRuleRectScene", "revMoveEndHandle data error please check");
        }
        this.refreshView();
    };
    return DropToRuleRectScene;
}(UIObject));
__reflect(DropToRuleRectScene.prototype, "DropToRuleRectScene");
/**
 *
 */
var MakeNewToTargetScene = (function (_super) {
    __extends(MakeNewToTargetScene, _super);
    function MakeNewToTargetScene() {
        var _this = _super.call(this) || this;
        _this.clickItemArr = [];
        _this.newItemSrcArr = [];
        _this.comparisonArr = [];
        return _this;
    }
    /** 每次进入 */
    MakeNewToTargetScene.prototype.onAdd = function () {
        this.initScene();
        this.initAddEvent();
    };
    /** 移除场景销毁 */
    MakeNewToTargetScene.prototype.onDestory = function () {
        for (var i = 0; i < this.clickItemArr.length; i++) {
            this.clickItemArr[i].removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.doTouchBeginHandle, this);
        }
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.doTouchMoveHandle, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.doTouchEndHandle, this);
        this.backImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doBackInitHandle, this);
    };
    /** 接收信令 */
    MakeNewToTargetScene.prototype.execMessage = function (data) {
        if (!true) {
            if (data["moveBegin"]) {
                var name_5 = data["moveBegin"]["name"];
                var src = data["moveBegin"]["src"];
                var targetX = Number(data["moveBegin"]["targetX"]);
                var targetY = Number(data["moveBegin"]["targetY"]);
                this.revMoveBeginHandle(name_5, src, targetX, targetY);
            }
            else if (data["moveIng"]) {
                var name_6 = data["moveIng"]["name"];
                var targetX = Number(data["moveIng"]["targetX"]);
                var targetY = Number(data["moveIng"]["targetY"]);
                this.revMoveingHandle(name_6, targetX, targetY);
            }
            else if (data["moveEnd"]) {
                var name_7 = data["moveEnd"]["name"];
                var targetX = Number(data["moveEnd"]["targetX"]);
                var targetY = Number(data["moveEnd"]["targetY"]);
                var del = Number(data["moveEnd"]["del"]);
                this.revMoveEndHandle(name_7, targetX, targetY, del);
            }
            else if (data["backInit"]) {
                this.initScene();
            }
        }
    };
    /** 初始化场景 */
    MakeNewToTargetScene.prototype.initScene = function () {
        this._newIndex = 1;
        this.completeImg.visible = false;
        for (var i = 0; i < this.clickItemArr.length; i++) {
            this.clickItemArr[i].name = String(i + 1);
        }
        for (var i = 0; i < this.comparisonArr.length; i++) {
            this.comparisonArr[i].visible = false;
        }
    };
    /** 初始化监听 */
    MakeNewToTargetScene.prototype.initAddEvent = function () {
        for (var i = 0; i < this.clickItemArr.length; i++) {
            this.clickItemArr[i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.doTouchBeginHandle, this);
        }
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.doTouchMoveHandle, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.doTouchEndHandle, this);
        this.backImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doBackInitHandle, this);
    };
    /** 开始点击图片 */
    MakeNewToTargetScene.prototype.doTouchBeginHandle = function (e) {
        if (this.completeImg.visible) {
            return;
        }
        var nIndex = Number(e.currentTarget.name);
        var newImg = new eui.Image();
        this.moveGroup.addChild(newImg);
        this.moveGroup.setChildIndex(newImg, this.moveGroup.numChildren - 1);
        newImg.source = this.newItemSrcArr[nIndex - 1];
        newImg.x = e.stageX;
        newImg.y = e.stageY;
        newImg.scaleX = 2.3;
        newImg.scaleY = 2.3;
        newImg.anchorOffsetX = newImg.width / 2;
        newImg.anchorOffsetY = newImg.height / 2;
        newImg.name = "newImg" + String(this._newIndex);
        this._newIndex++;
        this._touchImg = newImg;
        this._offsetX = e.stageX - this._touchImg.x;
        this._offsetY = e.stageY - this._touchImg.y;
        var obj = new Object();
        obj["name"] = newImg.name;
        obj["src"] = newImg.source;
        obj["targetX"] = this._touchImg.x;
        obj["targetY"] = this._touchImg.y;
        var msg = { method: "onFileMessage", keyName: "moveBegin", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    /** 开始移动 */
    MakeNewToTargetScene.prototype.doTouchMoveHandle = function (e) {
        var tempImg = this._touchImg;
        if (!tempImg) {
            return;
        }
        if (this._touchImg) {
            this._touchImg.x = e.stageX - this._offsetX;
            this._touchImg.y = e.stageY - this._offsetY;
            // 不能移除边界
            if (this._touchImg.y - this._touchImg.height / 2 < 0) {
                this._touchImg.y = this._touchImg.height / 2;
            }
            if (this._touchImg.y + this._touchImg.height / 2 > 1348) {
                this._touchImg.y = 1348 - this._touchImg.height / 2;
            }
            if (this._touchImg.x - this._touchImg.width / 2 < 0) {
                this._touchImg.x = this._touchImg.width / 2;
            }
            if (this._touchImg.x + this._touchImg.width / 2 > 1562) {
                this._touchImg.x = 1562 - this._touchImg.width / 2;
            }
            // 给学生发送信令  移动中
            var obj = new Object();
            obj["name"] = this._touchImg.name;
            obj["targetX"] = this._touchImg.x;
            obj["targetY"] = this._touchImg.y;
            var msg = { method: "onFileMessage", keyName: "moveIng", value: obj };
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        }
    };
    /** 结束移动 */
    MakeNewToTargetScene.prototype.doTouchEndHandle = function (e) {
        if (!this._touchImg) {
            return;
        }
        var n = this.isBingoCoordinateTarget(this._touchImg);
        if (n > 0) {
            if (!this.completeImg.visible) {
                this.comparisonArr[n - 1].visible = true;
            }
            var b = false;
            for (var i = 0; i < this.comparisonArr.length; i++) {
                if (!this.comparisonArr[i].visible) {
                    b = true;
                    break;
                }
            }
            if (!b) {
                this.completeImg.visible = true;
                for (var i = 0; i < this.comparisonArr.length; i++) {
                    this.comparisonArr[i].visible = false;
                }
            }
        }
        this.moveGroup.removeChild(this._touchImg);
        var obj = new Object();
        obj["name"] = this._touchImg.name;
        obj["targetX"] = this._touchImg.x;
        obj["targetY"] = this._touchImg.y;
        obj["del"] = n;
        var msg = { method: "onFileMessage", keyName: "moveEnd", value: obj };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        this._touchImg = null;
    };
    /** 判断是否贴合 */
    MakeNewToTargetScene.prototype.isBingoCoordinateTarget = function (item) {
        for (var i = 0; i < this.comparisonArr.length; i++) {
            if (this.comparisonArr[i].hitTestPoint(item.x, item.y)) {
                if (item.source === this.comparisonArr[i].source) {
                    return i + 1;
                }
            }
        }
        return -1;
    };
    /** 处理返回初始状态 */
    MakeNewToTargetScene.prototype.doBackInitHandle = function () {
        var msg = { method: "onFileMessage", keyName: "backInit", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
        this.initScene();
    };
    /** 接收开始移动 */
    MakeNewToTargetScene.prototype.revMoveBeginHandle = function (name, src, x, y) {
        var newImg = new eui.Image();
        this.moveGroup.addChild(newImg);
        this.moveGroup.setChildIndex(newImg, this.moveGroup.numChildren - 1);
        newImg.source = src;
        newImg.x = x;
        newImg.y = y;
        newImg.scaleX = 2.3;
        newImg.scaleY = 2.3;
        newImg.anchorOffsetX = newImg.width / 2;
        newImg.anchorOffsetY = newImg.height / 2;
        newImg.name = name;
        this._touchImg = newImg;
    };
    /** 接收移动中 */
    MakeNewToTargetScene.prototype.revMoveingHandle = function (name, x, y) {
        this._touchImg = this.moveGroup.getChildByName(name);
        if (!this._touchImg) {
            return;
        }
        this._touchImg.x = x;
        this._touchImg.y = y;
    };
    /** 接收移动结束 */
    MakeNewToTargetScene.prototype.revMoveEndHandle = function (name, x, y, del) {
        this._touchImg = this.moveGroup.getChildByName(name);
        if (!this._touchImg) {
            return;
        }
        if (del > 0) {
            if (!this.completeImg.visible) {
                this.comparisonArr[del - 1].visible = true;
            }
            var b = false;
            for (var i = 0; i < this.comparisonArr.length; i++) {
                if (!this.comparisonArr[i].visible) {
                    b = true;
                    break;
                }
            }
            if (!b) {
                this.completeImg.visible = true;
                for (var i = 0; i < this.comparisonArr.length; i++) {
                    this.comparisonArr[i].visible = false;
                }
            }
        }
        this.moveGroup.removeChild(this._touchImg);
        this._touchImg = null;
    };
    return MakeNewToTargetScene;
}(UIObject));
__reflect(MakeNewToTargetScene.prototype, "MakeNewToTargetScene");
var OnlyClickForBtnScene = (function (_super) {
    __extends(OnlyClickForBtnScene, _super);
    function OnlyClickForBtnScene() {
        var _this = _super.call(this) || this;
        _this.CurState = 0;
        _this.ImgList = [];
        return _this;
    }
    /** 每次进入 */
    OnlyClickForBtnScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.CurState = 0;
        this.refreshStateView();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    OnlyClickForBtnScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        delete this.ImgList;
        this.ImgList = [];
        this.btnNext.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    OnlyClickForBtnScene.prototype.execMessage = function (data) {
        if (data["next"]) {
            this.revNextLayerHandle();
        }
    };
    OnlyClickForBtnScene.prototype.initAddEvent = function () {
        this.btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    OnlyClickForBtnScene.prototype.touchTapEvent = function (event) {
        if (this.CurState < this.ImgList.length) {
            this.CurState++;
        }
        this.refreshStateView();
        var msg = { method: "onFileMessage", keyName: "next", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    OnlyClickForBtnScene.prototype.refreshStateView = function () {
        for (var i in this.ImgList) {
            var index = parseInt(i);
            var obj = this.ImgList[index];
            if (obj) {
                if (this.CurState <= index) {
                    obj.visible = false;
                }
                else {
                    obj.visible = true;
                }
            }
        }
    };
    OnlyClickForBtnScene.prototype.revNextLayerHandle = function () {
        this.CurState++;
        this.refreshStateView();
    };
    return OnlyClickForBtnScene;
}(UIObject));
__reflect(OnlyClickForBtnScene.prototype, "OnlyClickForBtnScene");
var OnlyClickScene = (function (_super) {
    __extends(OnlyClickScene, _super);
    function OnlyClickScene() {
        var _this = _super.call(this) || this;
        _this.CurState = 0;
        _this.ImgList = [];
        return _this;
    }
    /** 每次进入 */
    OnlyClickScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.CurState = 0;
        this.refreshStateView();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    OnlyClickScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        delete this.ImgList;
        this.ImgList = [];
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    OnlyClickScene.prototype.execMessage = function (data) {
        if (data["next"]) {
            this.revNextLayerHandle();
        }
    };
    OnlyClickScene.prototype.initAddEvent = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    OnlyClickScene.prototype.touchTapEvent = function (event) {
        if (this.CurState < this.ImgList.length) {
            this.CurState++;
        }
        this.refreshStateView();
        var msg = { method: "onFileMessage", keyName: "next", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    OnlyClickScene.prototype.refreshStateView = function () {
        for (var i in this.ImgList) {
            var index = parseInt(i);
            var obj = this.ImgList[index];
            if (obj) {
                if (this.CurState <= index) {
                    obj.visible = false;
                }
                else {
                    obj.visible = true;
                }
            }
        }
    };
    OnlyClickScene.prototype.revNextLayerHandle = function () {
        this.CurState++;
        this.refreshStateView();
    };
    return OnlyClickScene;
}(UIObject));
__reflect(OnlyClickScene.prototype, "OnlyClickScene");
/**
 * by 郑岩
 * 需要显示选择状态的场景
 * @param arr : Array<Array<eui.Image>>
 * 当传入一个数组时，只显示点击选择状态
 * 当多个数组时，请把相同类型状态放入同一个数组 例如: A B  分别放入两个数组
 */
var OnlySelectedScene = (function (_super) {
    __extends(OnlySelectedScene, _super);
    function OnlySelectedScene() {
        var _this = _super.call(this) || this;
        _this._arr = new Array();
        return _this;
    }
    /** 移除场景处理 */
    OnlySelectedScene.prototype.onDestroy = function () {
        for (var i = 0; i < this._arr.length; i++) {
            for (var j = 0; j < this._arr[i].length; j++) {
                this._arr[i][j].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelectedTouchHandle, this);
            }
        }
        delete this._arr;
        this._arr = [];
    };
    /** 接收信令 */
    OnlySelectedScene.prototype.execMessage = function (data) {
        if (data["selected"]) {
            var imgName = String(data["selected"]);
            if (this._arr.length == 1) {
                for (var i = 0; i < this._arr.length; i++) {
                    for (var j = 0; j < this._arr[i].length; j++) {
                        if (this._arr[i][j].name === imgName) {
                            this._arr[i][j].alpha = 1;
                        }
                        else {
                            this._arr[i][j].alpha = 0;
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this._arr.length; i++) {
                    for (var j = 0; j < this._arr[i].length; j++) {
                        if (this._arr[i][j].name === imgName) {
                            this._arr[i][j].alpha = 1;
                            for (var n = 0; n < this._arr.length; n++) {
                                if (this._arr[n][j] === this._arr[i][j]) {
                                    continue;
                                }
                                this._arr[n][j].alpha = 0;
                            }
                            break;
                        }
                    }
                }
            }
        }
    };
    /** 初始化 */
    OnlySelectedScene.prototype.initScene = function (arr) {
        if (arr.length <= 0) {
            Log.trace("onlySelectedScene", "image arr error!!!");
            return;
        }
        this._arr = arr;
        var nameIndex = 1;
        for (var i = 0; i < this._arr.length; i++) {
            for (var j = 0; j < this._arr[i].length; j++) {
                this._arr[i][j].alpha = 0;
                this._arr[i][j].addEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelectedTouchHandle, this);
                this._arr[i][j].name = "image" + String(nameIndex) + String(j);
                nameIndex++;
            }
        }
    };
    /** 处理点击选中 */
    OnlySelectedScene.prototype.doSelectedTouchHandle = function (e) {
        if (this._arr.length == 1) {
            for (var i = 0; i < this._arr.length; i++) {
                for (var j = 0; j < this._arr[i].length; j++) {
                    if (this._arr[i][j] === e.currentTarget) {
                        this._arr[i][j].alpha = 1;
                        var msg = { method: "onFileMessage", keyName: "selected", value: this._arr[i][j].name };
                        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
                    }
                    else {
                        this._arr[i][j].alpha = 0;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this._arr.length; i++) {
                for (var j = 0; j < this._arr[i].length; j++) {
                    if (this._arr[i][j] === e.currentTarget) {
                        this._arr[i][j].alpha = 1;
                        var msg = { method: "onFileMessage", keyName: "selected", value: this._arr[i][j].name };
                        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
                        for (var n = 0; n < this._arr.length; n++) {
                            if (this._arr[n][j] === this._arr[i][j]) {
                                continue;
                            }
                            this._arr[n][j].alpha = 0;
                        }
                        break;
                    }
                }
            }
        }
    };
    return OnlySelectedScene;
}(UIObject));
__reflect(OnlySelectedScene.prototype, "OnlySelectedScene");
var TweenToCenterScene = (function (_super) {
    __extends(TweenToCenterScene, _super);
    function TweenToCenterScene() {
        var _this = _super.call(this) || this;
        _this.ImgLeftList = [];
        _this.ImgRightList = [];
        _this.ImgHideList = [];
        _this.ImgShowList = [];
        _this.numTweenTime = 1000;
        return _this;
    }
    /** 每次进入 */
    TweenToCenterScene.prototype.onAdd = function () {
        // this.scene_Ani.play(0);
        this.initData();
        this.initAddEvent();
    };
    /** 这里进行移出场景的处理 **/
    TweenToCenterScene.prototype.onDestroy = function () {
        // this.scene_Ani_next.play(0);
        this.destoryEvent();
        this.resetData();
        this.destoryData();
    };
    TweenToCenterScene.prototype.execMessage = function (data) {
        if (data["startTweenMerge"]) {
            this.startTweenMerge();
        }
    };
    TweenToCenterScene.prototype.initData = function () {
        this.numCurTween = 0;
        this.posLeftList = [];
        for (var index in this.ImgLeftList) {
            var obj = this.ImgLeftList[index];
            if (obj) {
                this.posLeftList[parseInt(index)] = new egret.Point(obj.x, obj.y);
            }
        }
        this.posRightList = [];
        for (var index in this.ImgRightList) {
            var obj = this.ImgRightList[index];
            if (obj) {
                this.posRightList[parseInt(index)] = new egret.Point(obj.x, obj.y);
            }
        }
        this.resetAllTweenAndPos();
    };
    TweenToCenterScene.prototype.initAddEvent = function () {
        this.btnMerge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    TweenToCenterScene.prototype.touchTapEvent = function (event) {
        this.startTweenMerge();
        var msg = { method: "onFileMessage", keyName: "startTweenMerge", value: 1 };
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("tky_makepost", msg, false));
    };
    TweenToCenterScene.prototype.startTweenMerge = function () {
        var self = this;
        this.numCurTween = 0;
        this.resetAllTweenAndPos();
        var tweenBackFunc = function () {
            self.removeNumCurTween();
            if (self.numCurTween <= 0) {
                // 全部移动完成
                self.endTweenMerge();
            }
        };
        var tweenStartFunc = function (obj, posOff) {
            self.addNumCurTween();
            var posX = obj.x + posOff.x;
            var posY = obj.y + posOff.y;
            egret.Tween.get(obj).to({ x: posX, y: posY }, self.numTweenTime).call(tweenBackFunc);
        };
        for (var _i = 0, _a = this.ImgLeftList; _i < _a.length; _i++) {
            var obj = _a[_i];
            tweenStartFunc(obj, this.posLeftOff);
        }
        for (var _b = 0, _c = this.ImgRightList; _b < _c.length; _b++) {
            var obj = _c[_b];
            tweenStartFunc(obj, this.posRightOff);
        }
    };
    TweenToCenterScene.prototype.resetAllTweenAndPos = function () {
        for (var index in this.ImgLeftList) {
            var obj = this.ImgLeftList[index];
            var pos = this.posLeftList[index];
            if (obj && pos) {
                obj.x = pos.x;
                obj.y = pos.y;
                egret.Tween.removeTweens(obj);
            }
        }
        for (var index in this.ImgRightList) {
            var obj = this.ImgRightList[index];
            var pos = this.posRightList[index];
            if (obj && pos) {
                obj.x = pos.x;
                obj.y = pos.y;
                egret.Tween.removeTweens(obj);
            }
        }
        for (var _i = 0, _a = this.ImgShowList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.visible = false;
        }
        for (var _b = 0, _c = this.ImgHideList; _b < _c.length; _b++) {
            var obj = _c[_b];
            obj.visible = true;
        }
    };
    TweenToCenterScene.prototype.addNumCurTween = function () {
        this.numCurTween++;
    };
    TweenToCenterScene.prototype.removeNumCurTween = function () {
        this.numCurTween--;
    };
    TweenToCenterScene.prototype.endTweenMerge = function () {
        for (var _i = 0, _a = this.ImgHideList; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.visible = false;
        }
        for (var _b = 0, _c = this.ImgShowList; _b < _c.length; _b++) {
            var obj = _c[_b];
            obj.visible = true;
        }
    };
    TweenToCenterScene.prototype.resetData = function () {
        this.resetAllTweenAndPos();
    };
    TweenToCenterScene.prototype.destoryData = function () {
        delete this.ImgLeftList;
        this.ImgLeftList = [];
        delete this.posLeftList;
        this.posLeftList = [];
        delete this.ImgRightList;
        this.ImgRightList = [];
        delete this.posRightList;
        this.posRightList = [];
        delete this.ImgHideList;
        this.ImgHideList = [];
        delete this.ImgShowList;
        this.ImgShowList = [];
    };
    TweenToCenterScene.prototype.destoryEvent = function () {
        this.btnMerge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTapEvent, this);
    };
    return TweenToCenterScene;
}(UIObject));
__reflect(TweenToCenterScene.prototype, "TweenToCenterScene");
