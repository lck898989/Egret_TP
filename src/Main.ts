//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {

    private coursewareName:string;
    private resIndex:number;
    private current:number;

    protected createChildren(): void {
        super.createChildren();

        this.coursewareName = "test";
        this.resIndex = 0;

        //初始化白鹭相关的配置
        this.initEgretConfig();

        // 初始化游戏相关的配置
        GM.init();
        Log.trace("version", "模板库的版本号：" + CoursewareDefines.version);

        this.addChild(GameLayerManager.gameLayer());

        this.runGame().catch((e) => {
            Log.trace("msg", e);
        });
    }

    private initEgretConfig():void {
        // 生命周期
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin、
            context.onUpdate = () => {

            };
        });

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        };

        egret.ImageLoader.crossOrigin = "anonymous";
        // 设置最大并发加载线程数量 默认为4
        RES.setMaxLoadingThread(8);

        // inject the custom material parser
        // 注入自定义的素材解析器
        const assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
    }

    private async runGame() {
        await this.loadResource();
    }

    private async loadResource() {
        try {
            await RES.loadConfig("resource/gamemain/default.res.json", "/resource");
            await RES.loadConfig("resource/" + this.coursewareName + "/" + this.coursewareName + ".res.json", "/resource");
            await this.loadTheme();
            await this.loadCoursewareTheme();

            ResLoad.getInstance().LoadRes("preload", new Handler(this, this.onResourceLoadComplete));
            ResLoad.getInstance().LoadRes(this.coursewareName + "_preload", new Handler(this, this.onResourceLoadComplete));
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            // 加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            const theme = new eui.Theme("resource/gamemain/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            },                     this);

        });
    }

    private loadCoursewareTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            // 加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            const theme = new eui.Theme("resource/" + this.coursewareName + "/" + this.coursewareName + ".thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            },                     this);

        });
    }

    /**
    * commonload
    */
    private onResourceLoadComplete(): void {
        this.resIndex++;
        if(this.resIndex >=2 ){
            CommunicationManager.getInstance().init(this.coursewareName);
            this.createGameScene();
        }
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    private createGameScene(): void {        
        if(DEBUG) {
            this.current = 1;
            CommunicationManager.getInstance().goTargetPageHandle(this.current);

            let _before = new egret.Shape();
            _before.graphics.beginFill(0x888888, 1);
            _before.graphics.drawRect(0, 0, 100, 100);
            _before.graphics.endFill();
            _before.x = 20;
            _before.y = 20;
            _before.touchEnabled = true;
            this.addChild(_before);

            let _after = new egret.Shape();
            _after.graphics.beginFill(0x888888, 1);
            _after.graphics.drawRect(0, 0, 100, 100);
            _after.graphics.endFill();
            _after.x = 140;
            _after.y = 20;
            _after.touchEnabled = true;
            this.addChild(_after);

            _before.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beforePage, this);
            _after.addEventListener(egret.TouchEvent.TOUCH_TAP, this.afterPage, this);
        }   
    }

    private beforePage(): void {
        this.current--;
        if(this.current <= 1) {
            this.current = 1;
        }
        Log.trace("debug", "跳转页:" + this.current)
        CommunicationManager.getInstance().goTargetPageHandle(this.current);
    }

    private afterPage(): void {
        this.current++;
        
        if(this.current >= CommunicationManager.getInstance().coursewareArray.length) {
            this.current = CommunicationManager.getInstance().coursewareArray.length;
        }
        Log.trace("debug", "跳转页:" + this.current)
        CommunicationManager.getInstance().goTargetPageHandle(this.current);
    }
}
