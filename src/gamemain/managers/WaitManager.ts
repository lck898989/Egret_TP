/*
  * 等待界面
  */

class  WaitManager {

    public static getInstance(): WaitManager {
        if (!WaitManager.instance) {
            WaitManager.instance = new WaitManager();
        }
        return WaitManager.instance;
    }

    private static instance: WaitManager;

    // 等待界面，主要用在通讯等待展示
    public waitPanel: WaitPanel;
    constructor() {
    }

        // 显示等待界面
    public init(): void {
        this.waitPanel = null;

        lcp.LListener.getInstance().addEventListener("show_wait", this.showWaritPanel, this);
        lcp.LListener.getInstance().addEventListener("hide_wait", this.hideWaritPanel, this);
    }

    // 显示等待界面
    public showWaritPanel(): void {

        if (!this.waitPanel) {
            this.waitPanel = new WaitPanel();
        }

        GameLayerManager.gameLayer().maskLayer.removeChildren();
        GameLayerManager.gameLayer().maskLayer.addChild(this.waitPanel);
    }

    // 移除界面
    public hideWaritPanel(): void {
        if (this.waitPanel && GameLayerManager.gameLayer().maskLayer.contains(this.waitPanel)) {
            GameLayerManager.gameLayer().maskLayer.removeChild(this.waitPanel);
        }
    }
}
