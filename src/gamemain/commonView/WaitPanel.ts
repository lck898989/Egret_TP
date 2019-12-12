  /*
    * 通讯等待类
    * All Rights Reserved.
    * 和服务端通讯时的显示效果
    */
class WaitPanel extends egret.Sprite {
    private waitImg: egret.Bitmap;
    private w: number = 0;
    private h: number = 0;
    private bg: egret.Sprite;      // 底遮罩

    private spGroup: egret.Sprite;       // loading图片组
    private imgRotatDragon: egret.Bitmap; // 旋转的龙
    private imgHand: egret.Bitmap;

    constructor(load: boolean= false) {
        super();

        this.createView();
    }

    public destory(): void {
        EffectUtils.removeRotationEffect(this.imgRotatDragon);
    }

    private createView(): void {

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

    }

    private addMask(): void {
        this.bg = new egret.Sprite();
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.graphics.beginFill(0x000000);
        this.bg.graphics.drawRect(0, 0, this.w, this.h);
        this.bg.graphics.endFill();
        this.addChild(this.bg);
        this.bg.alpha = 0;
    }

    private addGroupCont(res: string): void {
        const img = new egret.Bitmap();
        img.texture = RES.getRes(res);
        this.spGroup.addChild(img);
        img.x = this.spGroup.width / 2;
        img.y = this.spGroup.height / 2;
        img.anchorOffsetX = img.width / 2;
        img.anchorOffsetY = img.height / 2;
    }

}
