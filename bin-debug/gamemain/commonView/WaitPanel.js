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
/*
  * 通讯等待类
  * All Rights Reserved.
  * 和服务端通讯时的显示效果
  */
var WaitPanel = (function (_super) {
    __extends(WaitPanel, _super);
    function WaitPanel(load) {
        if (load === void 0) { load = false; }
        var _this = _super.call(this) || this;
        _this.w = 0;
        _this.h = 0;
        _this.createView();
        return _this;
    }
    WaitPanel.prototype.destory = function () {
        EffectUtils.removeRotationEffect(this.imgRotatDragon);
    };
    WaitPanel.prototype.createView = function () {
        this.w = egret.MainContext.instance.stage.stageWidth;
        this.h = egret.MainContext.instance.stage.stageHeight;
        this.addMask();
        this.spGroup = new egret.Sprite();
        this.spGroup.width = 150;
        this.spGroup.height = 150;
        this.addChild(this.spGroup);
        this.spGroup.x = this.w / 2;
        this.spGroup.y = this.h / 2;
        this.spGroup.anchorOffsetX = this.spGroup.width / 2;
        this.spGroup.anchorOffsetY = this.spGroup.height / 2;
        this.touchEnabled = false;
        this.imgRotatDragon = new egret.Bitmap();
        this.imgRotatDragon.texture = RES.getRes("dolphin_png"); // dragon_small_png
        this.spGroup.addChild(this.imgRotatDragon);
        this.imgRotatDragon.x = this.spGroup.width / 2;
        this.imgRotatDragon.y = this.spGroup.height / 2;
        this.imgRotatDragon.anchorOffsetX = this.imgRotatDragon.width / 2;
        this.imgRotatDragon.anchorOffsetY = this.imgRotatDragon.height / 2;
        this.addGroupCont("bg_ball_png");
        this.addGroupCont("font_loading_png");
        this.imgHand = new egret.Bitmap();
        this.imgHand.texture = RES.getRes("dolphin_arm_png");
        this.spGroup.addChild(this.imgHand);
        this.imgHand.x = this.spGroup.width / 2;
        this.imgHand.y = this.spGroup.height / 2;
        this.imgHand.anchorOffsetX = this.imgHand.width / 2;
        this.imgHand.anchorOffsetY = this.imgHand.height / 2;
        // 龙旋转
        EffectUtils.rotationEffect(this.imgHand, 1000);
        EffectUtils.rotationEffect(this.imgRotatDragon, 1000);
    };
    WaitPanel.prototype.addMask = function () {
        this.bg = new egret.Sprite();
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.graphics.beginFill(0x000000);
        this.bg.graphics.drawRect(0, 0, this.w, this.h);
        this.bg.graphics.endFill();
        this.addChild(this.bg);
        this.bg.alpha = 0;
    };
    WaitPanel.prototype.addGroupCont = function (res) {
        var img = new egret.Bitmap();
        img.texture = RES.getRes(res);
        this.spGroup.addChild(img);
        img.x = this.spGroup.width / 2;
        img.y = this.spGroup.height / 2;
        img.anchorOffsetX = img.width / 2;
        img.anchorOffsetY = img.height / 2;
    };
    return WaitPanel;
}(egret.Sprite));
__reflect(WaitPanel.prototype, "WaitPanel");
//# sourceMappingURL=WaitPanel.js.map