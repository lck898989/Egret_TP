/** 通用按钮 */
class CommonButton extends eui.Button {
    protected imgSrcName: eui.Image;

    public constructor() {
        super();
        this.skinName = "CommonButton_Skin";
    }

    /** 设置图片 */
    public setSrcName(src: string): void {
        this.imgSrcName.source = src;
    }

    /** 实例后设置 */
    public setConfig(): void {
        this.imgSrcName.anchorOffsetX = this.imgSrcName.width / 2;
        this.imgSrcName.anchorOffsetY = this.imgSrcName.height / 2;
    }
}
