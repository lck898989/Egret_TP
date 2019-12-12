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
/**
 * XXXX之星
 */
var GetStarScene = (function (_super) {
    __extends(GetStarScene, _super);
    function GetStarScene() {
        var _this = _super.call(this) || this;
        _this.skinName = "GetStarScene_Skin";
        return _this;
    }
    GetStarScene.prototype.onAdd = function () {
        this.initScene();
        this.initAddEvent();
        // data.starName
        // data.backIndex
        if (this.data && this.data.starName) {
            this.starImg.source = this.data.starName;
        }
    };
    /** 退出场景 */
    GetStarScene.prototype.onDestroy = function () {
        this.goImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doGoBackDolphinLandHandle, this);
    };
    /** 接收信令 */
    GetStarScene.prototype.execMessage = function (data) {
        if (data["backDolphin"]) {
            this.backDolphinFunc();
        }
    };
    /** 初始化场景 */
    GetStarScene.prototype.initScene = function () {
        egret.Tween.get(this.lightImg, { loop: true }).to({ scaleX: 0.7, scaleY: 0.7 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
    };
    /** 初始化监听 */
    GetStarScene.prototype.initAddEvent = function () {
        this.goImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doGoBackDolphinLandHandle, this);
    };
    /** 返回海豚岛*/
    GetStarScene.prototype.doGoBackDolphinLandHandle = function () {
        this.backDolphinFunc();
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "backDolphin", 1);
    };
    GetStarScene.prototype.backDolphinFunc = function () {
        if (this.data && this.data.backIndex) {
            CommunicationManager.getInstance().goTargetPageHandle(this.data.backIndex);
        }
        else {
            CommunicationManager.getInstance().goTargetPageHandle(3);
        }
    };
    GetStarScene.key = "GetStarScene";
    return GetStarScene;
}(UIObject));
__reflect(GetStarScene.prototype, "GetStarScene");
//# sourceMappingURL=GetStarScene.js.map