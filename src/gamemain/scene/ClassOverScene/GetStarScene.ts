/**
 * XXXX之星
 */
class GetStarScene extends UIObject {
    public static key: string = "GetStarScene";

    private starImg: eui.Image;
    private lightImg: eui.Image;
    private goImg: eui.Image;

    public constructor() {
        super();
        this.skinName = "GetStarScene_Skin";
    }

    public onAdd(): void {
        this.initScene();
        this.initAddEvent();

        // data.starName
        // data.backIndex
        if (this.data && this.data.starName) {
            this.starImg.source = this.data.starName;
        }
    }

    /** 退出场景 */
    public onDestroy(): void {
        this.goImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doGoBackDolphinLandHandle, this);
    }

    /** 接收信令 */
    public execMessage(data: any): void {
        if (data["backDolphin"]) {
            this.backDolphinFunc();
        }
    }

    /** 初始化场景 */
    private initScene(): void {
        egret.Tween.get(this.lightImg, {loop: true}).to({scaleX : 0.7, scaleY : 0.7}, 500).to({scaleX : 1, scaleY : 1}, 500);
    }

    /** 初始化监听 */
    private initAddEvent(): void {
        this.goImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doGoBackDolphinLandHandle, this);
    }

    /** 返回海豚岛*/
    private doGoBackDolphinLandHandle(): void {
        this.backDolphinFunc();
        CommunicationManager.getInstance().makePostMessage("onFileMessage", "backDolphin", 1);
    }

    private backDolphinFunc() {
        if (this.data && this.data.backIndex) {
            CommunicationManager.getInstance().goTargetPageHandle(this.data.backIndex);
        } else {
            CommunicationManager.getInstance().goTargetPageHandle(3);
        }

    }
}
