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
var HttpConnect = (function () {
    function HttpConnect() {
    }
    HttpConnect.prototype.SendHttpMsg = function (msg, handler, isJson) {
        Log.trace("debug", "请求消息= " + msg);
        var request = new HLoad();
        request.time = egret.getTimer();
        request.hander = handler;
        if (isJson !== undefined) {
            request.isJson = isJson;
        }
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(this.apiUrl, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(msg);
        request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
    };
    HttpConnect.prototype.SendUrlHttpMsg = function (url, msg, hander, isJson, type) {
        if (isJson === void 0) { isJson = false; }
        if (type === void 0) { type = egret.HttpMethod.POST; }
        Log.trace("debug", "请求消息= " + msg);
        var request = new HLoad();
        request.time = egret.getTimer();
        request.hander = hander;
        if (isJson !== undefined) {
            request.isJson = isJson;
        }
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url, type);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(msg);
        request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
    };
    /**
     * 加载完成
     */
    HttpConnect.prototype.onPostComplete = function (event) {
        var request = event.currentTarget;
        Log.trace("debug", "回来消息用时= " + (egret.getTimer() - request.time));
        Log.trace("debug", "消息：" + JSON.stringify(request.response));
        if (request.hander) {
            if (request.isJson) {
                var obj = JSON.parse(request.response);
                request.hander.executeWith([obj]);
            }
            else {
                request.hander.executeWith([request.response]);
            }
        }
    };
    /**
     * 报错
     */
    HttpConnect.prototype.onPostIOError = function (event) {
        Log.trace("debug", "post error : " + event);
    };
    /**
     *
     */
    HttpConnect.prototype.onPostProgress = function (event) {
        Log.trace("debug", "post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    };
    return HttpConnect;
}());
__reflect(HttpConnect.prototype, "HttpConnect");
var TcpServer = (function () {
    function TcpServer() {
        this.init();
    }
    /**
         *  发送
         */
    TcpServer.sendMessages = function (cmd, body) {
        if (TcpServer._socket && TcpServer._socket.getConnected()) {
            TcpServer._socket.sendPackage(cmd, body);
        }
    };
    /**
     * 关闭
     */
    TcpServer.close = function () {
        if (TcpServer._socket) {
            if (TcpServer._socket.getConnected()) {
                TcpServer._socket.close();
            }
        }
    };
    /**
     *  废掉socket，再使用重新创建
     *
     */
    TcpServer.unUseFul = function () {
        close();
        GameSocketNew.setInstanceNull();
        TcpServer._socket = null;
    };
    TcpServer.hadSocket = function () {
        if (TcpServer._socket) {
            return true;
        }
        else {
            return false;
        }
    };
    /** 初始化 */
    TcpServer.prototype.init = function () {
        TcpServer._socket = GameSocketNew.getInstance();
        TcpServer._socket.register(this);
    };
    /**
     * 连接
     */
    TcpServer.prototype.connect = function (host, port) {
        if (!TcpServer._socket) {
            this.init();
        }
        if (!TcpServer._socket.getConnected()) {
            TcpServer._socket.connect(host, port);
        }
    };
    /**
     * 得到是否连接中
     */
    TcpServer.prototype.getConnected = function () {
        return TcpServer._socket ? TcpServer._socket.getConnected() : false;
    };
    /**
     * 子类MessageManager重写了此方法
     */
    TcpServer.prototype.onConnect = function () { };
    /**
     * 子类MessageManager重写了此方法
     */
    TcpServer.prototype.onMessageReceived = function (messageType, bytes) { };
    /**
     * 处理连接断开
     */
    TcpServer.prototype.onDisConnect = function () {
        this.onLoseConnectionWithServer();
    };
    /**
     * 处理链接错误
     */
    TcpServer.prototype.onConnectError = function () {
        this.showErrorMessageContent();
        this.receiveIOError();
    };
    TcpServer.prototype.showErrorMessageContent = function () {
        // TODO 显示连接失败信息
    };
    /**
     * 处理数据链接IO错误
     */
    TcpServer.prototype.receiveIOError = function () {
        close();
        this.onLoseConnectionWithServer();
    };
    /**
     * 断开连接后
     */
    TcpServer.prototype.onLoseConnectionWithServer = function () {
    };
    return TcpServer;
}());
__reflect(TcpServer.prototype, "TcpServer", ["IMessageListener"]);
/**
 * 基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    /**
     * 获取一个单例
     * @returns {any}
     */
    BaseClass.getInstance = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var classZ = this;
        if (!classZ._instance) {
            var argsLen = args.length;
            if (argsLen === 0) {
                classZ._instance = new classZ();
            }
            else if (argsLen === 1) {
                classZ._instance = new classZ(args[0]);
            }
            else if (argsLen === 2) {
                classZ._instance = new classZ(args[0], args[1]);
            }
            else if (argsLen === 3) {
                classZ._instance = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen === 4) {
                classZ._instance = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen === 5) {
                classZ._instance = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
        }
        return classZ._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
var BaseSound = (function () {
    /**
     * 构造函数
     */
    function BaseSound() {
        this._cache = {};
        this._loadingCache = new Array();
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    BaseSound.prototype.getSound = function (key) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        }
        else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    };
    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    BaseSound.prototype.checkCanClear = function (key) {
        return true;
    };
    /**
     * 处理音乐文件的清理
     */
    BaseSound.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key)) {
                continue;
            }
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                delete this._cache[key];
                RES.destroyRes(key);
            }
        }
    };
    /**
     * 资源加载完成
     * @param event
     */
    BaseSound.prototype.onResourceLoadComplete = function (data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    };
    return BaseSound;
}());
__reflect(BaseSound.prototype, "BaseSound");
var one;
(function (one) {
    /**
     * 显示到 egret 中的 DOM 元件
     */
    var WebNode = (function (_super) {
        __extends(WebNode, _super);
        function WebNode() {
            var _this = _super.call(this) || this;
            _this.domNode = new one.DOMNode();
            _this.domNode.mapDisplayObject(_this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
            _this.$renderNode = new egret.sys.RenderNode();
            return _this;
        }
        /**
         * 绑定一个 DOM 元件
         * @element DOM 元件，不要修改此元件的 style 的位置、旋转、缩放、边框等属性
         */
        WebNode.prototype.bind = function (element) {
            this.domNode.bind(element);
        };
        /**
         * 解绑 DOM 元件
         */
        WebNode.prototype.unbind = function () {
            this.domNode.unbind();
        };
        WebNode.prototype.removeFromStage = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            this.domNode.hide();
            this.tempStage = null;
        };
        WebNode.prototype.getDomNode = function () {
            return this.domNode;
        };
        WebNode.prototype.addToStage = function () {
            if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                this.domNode.show();
                this.domNode.updatePosition();
                this.tempStage = this.stage;
                // this.tempStage.addEventListener(egret.Event.RESIZE, this.onResize, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onResize, this);
            }
        };
        WebNode.prototype.onResize = function () {
            if (this.domNode) {
                this.domNode.updatePosition();
            }
        };
        return WebNode;
    }(egret.DisplayObject));
    one.WebNode = WebNode;
    __reflect(WebNode.prototype, "one.WebNode");
})(one || (one = {}));
/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 **/
var ResourceUtils = (function (_super) {
    __extends(ResourceUtils, _super);
    /**
     * 构造函数
     */
    function ResourceUtils() {
        var _this = _super.call(this) || this;
        _this._configs = new Array();
        _this._groups = {};
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceProgress, _this);
        return _this;
    }
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroup = function ($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    };
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroups = function ($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        RES.createGroup($groupName, $subGroups);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget);
    };
    /**
     * 静默加载
     * @param $groupName 资源组名称
     */
    ResourceUtils.prototype.pilfererLoadGroup = function ($groupName) {
        // 添加前缀，防止与正常加载组名重复
        RES.loadGroup("pilferer_" + $groupName, -1);
    };
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    ResourceUtils.prototype.addConfig = function (jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    ResourceUtils.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * 加载
     */
    ResourceUtils.prototype.loadNextConfig = function () {
        // 加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    };
    /**
     * 加载完成
     * @param event
     */
    ResourceUtils.prototype.onConfigCompleteHandle = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * 资源组加载完成
     */
    ResourceUtils.prototype.onResourceLoadComplete = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadComplete = this._groups[groupName][0];
            var loadCompleteTarget = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.call(loadCompleteTarget);
            }
            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    };
    /**
     * 资源组加载进度
     */
    ResourceUtils.prototype.onResourceProgress = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadProgress = this._groups[groupName][1];
            var loadProgressTarget = this._groups[groupName][2];
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        }
    };
    return ResourceUtils;
}(BaseClass));
__reflect(ResourceUtils.prototype, "ResourceUtils");
/*
 *
 * @author
 * 错误码
 */
var DicErrorCode = (function () {
    function DicErrorCode() {
    }
    /*
    * 初始化json
    */
    DicErrorCode.prototype.initFromJson = function (name) {
        this.objErrorMsg = RES.getRes(name);
    };
    /*
    *  根据id 返回 Desc
    */
    DicErrorCode.prototype.getDesc = function (id) {
        var errMsg = this.objErrorMsg[id];
        if (errMsg) {
            return errMsg;
        }
        return "不存在的错误号";
    };
    return DicErrorCode;
}());
__reflect(DicErrorCode.prototype, "DicErrorCode", ["IReadJson"]);
/*
 *
 * @author
 * 服务器信息json表
 */
var DicServerInfo = (function () {
    function DicServerInfo() {
        this.serverUrl = "";
        /** 是否使用https */
        this.usehttps = 0;
    }
    /**
     * 初始化json
     */
    DicServerInfo.prototype.initFromJson = function (name) {
        var js = RES.getRes(name);
        BaseFunc.objToClass(js, this);
    };
    return DicServerInfo;
}());
__reflect(DicServerInfo.prototype, "DicServerInfo", ["IReadJson"]);
/**
  * 背景显示管理类
  */
var BGUpManager = (function () {
    function BGUpManager() {
        this._mask = new eui.UILayer();
        this.darkSprite = new eui.Rect();
        this.darkSprite.fillColor = 0x000000;
        this.darkSprite.top = 0;
        this.darkSprite.bottom = 0;
        this._mask.addChild(this.darkSprite);
    }
    BGUpManager.getInstance = function () {
        if (BGUpManager.instance == null) {
            BGUpManager.instance = new BGUpManager();
        }
        return BGUpManager.instance;
    };
    /** 屏幕适配
     */
    BGUpManager.prototype.reSizePop = function () {
        if (this._mask.numChildren <= 1) {
            return;
        }
        for (var i = 0; i < this._mask.numChildren; i++) {
            var obj = this._mask.getChildAt(i);
            if (obj instanceof UIObject) {
                this.resizePannel(obj);
            }
        }
    };
    BGUpManager.prototype.resizePannel = function (panel) {
        var popUpWidth = panel.width;
        var popUpHeight = panel.height;
        panel.x = GM.gamec.curWidth() / 2 - popUpWidth / 2;
        panel.y = GM.gamec.curHeight() / 2 - popUpHeight / 2;
    };
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
    BGUpManager.prototype.addBGUp = function (_parent, isTransparent) {
        this.darkSprite.width = GM.gamec.curWidth();
        this.darkSprite.height = GM.gamec.curHeight();
        this.darkSprite.alpha = isTransparent;
        this.darkSprite.touchEnabled = true;
        this.darkSprite.visible = true;
        if (!_parent.contains(this._mask)) {
            _parent.addChild(this._mask);
        }
    };
    /**
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    BGUpManager.prototype.removePopUp = function (panel, effectType) {
        if (effectType === void 0) { effectType = 0; }
        var onComplete = function (sp) {
        };
        if (this.darkSprite) {
            egret.Tween.get(this.darkSprite).to({ alpha: 0 }, 100).call(onComplete, this, [this.darkSprite]);
        }
    };
    BGUpManager.prototype.close = function () {
        if (this._mask.numChildren > 1) {
            this._mask.swapChildrenAt(this._mask.getChildIndex(this.darkSprite), this._mask.numChildren - 2);
        }
        else {
            if (this._mask.parent) {
                this._mask.parent.removeChild(this._mask);
            }
        }
    };
    BGUpManager.prototype.closeAllDlg = function () {
        while (this._mask.numChildren > 1) {
            var obj = this._mask.getChildAt(0);
            if (obj instanceof UIObject) {
                this._mask.removeChild(obj);
                UIPool.getInstance().destroyObject(obj);
            }
            else {
                this._mask.swapChildrenAt(this._mask.getChildIndex(this.darkSprite), this._mask.numChildren - 1);
            }
        }
        if (this.parent && this.parent.contains(this._mask)) {
            this.parent.removeChild(this._mask);
        }
    };
    return BGUpManager;
}());
__reflect(BGUpManager.prototype, "BGUpManager");
/**
 *
 */
var CommunicationManager = (function () {
    function CommunicationManager() {
        this.offlineRev = false;
        this.curPage = -1;
        lcp.LListener.getInstance().addEventListener("tky_topage", this.goPage, this);
        lcp.LListener.getInstance().addEventListener("tky_makepost", this.tkyMakePostAction, this);
    }
    CommunicationManager.getInstance = function () {
        if (!CommunicationManager.instance) {
            CommunicationManager.instance = new CommunicationManager();
        }
        return CommunicationManager.instance;
    };
    /** 添加侦听 */
    CommunicationManager.prototype.addListener = function (listenerType) {
        window.addEventListener(listenerType, this.execMessage.bind(this), false);
    };
    CommunicationManager.prototype.init = function (_name) {
        //拓课云默认会在学生端刷新的时候返回老师端操作的最后一个信令，学生端暂时不处理这个信令。
        Log.trace("当前的身份：", GM.pm.role);
        if (GM.pm.role == 0) {
            lcp.LListener.getInstance().addEventListener("tky_offlinepost", this.tkyOfflineRevAction, this);
        }
        else {
            this.offlineRev = true;
        }
        this.courcewareName = _name;
        var _obj = RES.getRes(this.courcewareName + "_json");
        this.mOpData = [];
        if (_obj) {
            this.coursewareArray = _obj.courseware;
            /** 发送课件页数 */
            CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", this.coursewareArray.length);
            this.loadComplete();
        }
        else {
            this.coursewareArray = [];
        }
    };
    /**
     * name
     */
    CommunicationManager.prototype.loadComplete = function () {
        /** 发送加载完成  发送屏幕适配比例*/
        var cour = 1562 / 1348;
        CommunicationManager.getInstance().makePostMessage("onLoadComplete", "coursewareRatio", cour);
    };
    /** 收原生js信令 */
    CommunicationManager.prototype.execMessage = function (e) {
        if (e.source !== window.parent) {
            return;
        }
        var data;
        try {
            data = JSON.parse(e.data);
        }
        catch (error) {
            Log.trace("error", error);
        }
        Log.trace("收到的信令", JSON.stringify(data));
        if (data["method"] === "onJumpPage") {
            var toPage = Number(data["toPage"]);
            lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent(BaseDefines.TKCLOUD_TYPE.TO_PAGE, toPage, false));
            this.curPage = toPage;
            this.mOpData[this.curPage] = [];
        }
        else if (data["method"] === "onFileMessage") {
            var _str = e.data;
            if (!this.offlineRev && this.mOpData.length > 0) {
                this.mOpData[this.curPage].push(data);
            }
            UIPool.getInstance().execMessage(data);
        }
    };
    /** 前往指定页面 */
    CommunicationManager.prototype.goTargetPageHandle = function (pageIndex) {
        if (pageIndex <= 0) {
            Log.trace("error", "找不到指定页面=" + pageIndex);
            return;
        }
        var pageJumpNum = pageIndex - 1;
        if (this.coursewareArray && this.coursewareArray.length > pageJumpNum) {
            var pageJumpOjb = this.coursewareArray[pageJumpNum];
            var _pageJumpData = null;
            if (pageJumpOjb.hasOwnProperty("data")) {
                _pageJumpData = pageJumpOjb.data;
            }
            // tslint:disable-next-line: no-eval
            GM.scene.runScene(eval(pageJumpOjb.name), pageJumpOjb.curLoad, _pageJumpData);
            var nextPageJumpOjb = null;
            if (this.coursewareArray.length > pageJumpNum + 1) {
                nextPageJumpOjb = this.coursewareArray[pageJumpNum + 1];
                this.loadNextPage(nextPageJumpOjb.curLoad);
            }
            Log.trace("debug", "已经跳往指定页面,page=" + pageJumpNum);
        }
        else {
            Log.trace("error", "跳往指定页失败,page=" + pageJumpNum);
        }
    };
    /** 发送消息 */
    CommunicationManager.prototype.makePostMessage = function (methodType, keyName, value) {
        // 格式{"method":methodType, "keyName":value};
        // 调用例子 CommunicationManager.getInstance().makePostMessage("onPagenum", "totalPages", 17);
        var obj = new Object();
        obj["method"] = methodType;
        obj[keyName] = value;
        window.parent.postMessage(JSON.stringify(obj), "*");
        Log.trace("发出的信令", JSON.stringify(obj));
    };
    /** 离线接受通知 并 处理发送消息 */
    CommunicationManager.prototype.tkyOfflineRevAction = function (e) {
        lcp.LListener.getInstance().removeEventListener("tky_offlinepost", this.tkyOfflineRevAction, this);
        this.offlineRev = true;
        if (this.mOpData && this.mOpData[this.curPage] && this.mOpData[this.curPage].length > 0) {
            var _data = this.mOpData[this.curPage];
            for (var _i = 0, _data_1 = _data; _i < _data_1.length; _i++) {
                var _temp = _data_1[_i];
                UIPool.getInstance().execMessage(_temp);
            }
            this.mOpData[this.curPage] = [];
        }
    };
    /** 接受通知 并 处理发送消息 */
    CommunicationManager.prototype.tkyMakePostAction = function (e) {
        Log.trace("debug", e.param);
        var _obj = e.param;
        this.makePostMessage(_obj.method, _obj.keyName, _obj.value);
    };
    CommunicationManager.prototype.goPage = function (e) {
        Log.trace("debug", e.param);
        var page = parseInt(e.param);
        this.goTargetPageHandle(page);
    };
    /** 加载下一页 */
    CommunicationManager.prototype.loadNextPage = function (nextGroup) {
        ResLoad.getInstance().LoadRes(nextGroup);
    };
    return CommunicationManager;
}());
__reflect(CommunicationManager.prototype, "CommunicationManager");
/**
 * 游戏中的Dlg管理类
 */
var DlgManager = (function () {
    function DlgManager() {
    }
    /*
    * 弹出模态对话框
    * @param dlg           要弹出的dlg类名
    * @param groups        要加载的资源组名
    * @param closeHander   对话框关闭后的回调函数
    * @param data          要传递给对话框的参数
    * @param effectType    动画类型 0:没有动画 1:从中间轻微弹出 2:从中间猛烈弹出 3:从左到右 4:从右向左 5:从上到下 6:从下到上
    * @param transparent   背景颜色的透明度
    */
    DlgManager.prototype.popDlg = function (dlg, groups, closeHander, data, effectType, transparent) {
        if (groups === void 0) { groups = ""; }
        if (closeHander === void 0) { closeHander = null; }
        if (data === void 0) { data = null; }
        if (effectType === void 0) { effectType = 1; }
        if (transparent === void 0) { transparent = 0.6; }
        if (!groups) {
            var pop = this.makeDlg(dlg, closeHander, data);
            this.addPopDlg(pop, effectType, transparent);
        }
        else {
            var _handle = new Handler(this, this.onLoad, [dlg, closeHander, data, true, effectType, transparent]);
            ResLoad.getInstance().LoadRes(groups, _handle);
        }
    };
    DlgManager.prototype.popClickDlg = function (dlg, closeHander, data) {
        if (closeHander === void 0) { closeHander = null; }
        if (data === void 0) { data = null; }
        var pop = this.makeDlg(dlg, closeHander, data);
        PopUpManager.getInstance().addPopUp(pop, false, 0, 0, 0, false, 0);
    };
    /*
    * 移除对话框
    * key            要移出的对话框的key
    * effectType     移出的动画效果   0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    DlgManager.prototype.dlgClose = function (key, effectType) {
        if (effectType === void 0) { effectType = 0; }
        var obj = UIPool.getInstance().getObject(key);
        if (obj) {
            PopUpManager.getInstance().removePopUp(obj, effectType);
            UIPool.getInstance().destroyObject(obj);
            // HM.getInstance().onDlgClose(key);
        }
    };
    DlgManager.prototype.closeAllDlg = function () {
        PopUpManager.getInstance().closeAllDlg();
    };
    DlgManager.prototype.makeDlg = function (dlg, closeHander, data) {
        var pop = UIPool.getInstance().createObject(dlg);
        pop._closeHander = closeHander;
        pop.data = data;
        return pop;
    };
    /* 加载完成 **/
    DlgManager.prototype.onLoad = function (dlg, closeHander, data, model, effectType, transparent, key) {
        var pop = this.makeDlg(dlg, closeHander, data);
        this.addPopDlg(pop, effectType, transparent);
    };
    /**
     * 调用PopUpManager
     */
    DlgManager.prototype.addPopDlg = function (panel, effectType, transparent) {
        if (effectType === void 0) { effectType = 0; }
        PopUpManager.getInstance().addPopUp(panel, true, 0, 0, effectType, false, transparent);
    };
    return DlgManager;
}());
__reflect(DlgManager.prototype, "DlgManager");
/*
  * 游戏容器类
  * EgerPro显示对象层级
  * Main-GameScene（sceneLayer、mainLayer、popLayer、effectLayer、maskLayer、loadLayer）
  *
  */
var GameLayerManager = (function (_super) {
    __extends(GameLayerManager, _super);
    // 构造方法
    function GameLayerManager() {
        var _this = _super.call(this) || this;
        // 场景层 如 战场、主城、副本战场之类的
        _this.sceneLayer = new eui.UILayer();
        // 主UI层 如 底部功能栏
        _this.mainLayer = new eui.UILayer();
        // 弹窗层 如 设置、背包、装备之类的
        _this.panelLayer = new eui.UILayer();
        // 特效层 如 闪烁、飘字之类的
        _this.effectLayer = new eui.UILayer();
        // 通讯遮罩层 和服务器通讯UI
        _this.maskLayer = new eui.UILayer();
        // 加载遮罩层 场景切换的时候加载资源UI
        _this.loadLayer = new eui.UILayer();
        _this.init();
        return _this;
    }
    // 游戏容器管理器单例
    GameLayerManager.gameLayer = function () {
        if (!this._instance) {
            this._instance = new GameLayerManager();
        }
        return this._instance;
    };
    // 初始化场景类
    GameLayerManager.prototype.init = function () {
        this.touchThrough = true;
        this.sceneLayer.touchThrough = true;
        this.mainLayer.touchThrough = true;
        this.panelLayer.touchThrough = true;
        this.effectLayer.touchThrough = true;
        this.maskLayer.touchThrough = true;
        this.loadLayer.touchThrough = true;
        this.addChild(this.sceneLayer);
        this.addChild(this.mainLayer);
        this.addChild(this.panelLayer);
        this.addChild(this.effectLayer);
        this.addChild(this.maskLayer);
        this.addChild(this.loadLayer);
    };
    return GameLayerManager;
}(eui.UILayer));
__reflect(GameLayerManager.prototype, "GameLayerManager");
/**
 *  游戏中json数据的管理类
 *  主要功能
 *  管理所有游戏中所有需要特殊处理的json文件
 */
var JsonManager = (function () {
    function JsonManager() {
        this._jsonArry = [
            { DicServerInfo: DicServerInfo, name: "serverInfo_json" },
        ];
        this.realClass = new Object();
        this.realName = new Object();
        this._closeHander = null;
        this._proHander = null;
    }
    JsonManager.prototype.getClass = function (key) {
        return this.realClass[key];
    };
    JsonManager.prototype.init = function () {
        this.makeClass();
    };
    JsonManager.prototype.loadJson = function (group, endHander, proHander) {
        if (endHander === void 0) { endHander = null; }
        if (proHander === void 0) { proHander = null; }
        this._closeHander = endHander;
        this._proHander = proHander;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    };
    JsonManager.prototype.makeClass = function () {
        var self = this;
        var max = self._jsonArry.length;
        for (var i = 0; i < max; i++) {
            var obj = self._jsonArry[i];
            for (var j in obj) {
                var key = obj["name"];
                if (String(j) !== "name") {
                    var cl = new obj[j]();
                    cl.constructor.apply(cl);
                    self.realClass[j] = cl;
                    self.realName[key] = j;
                }
            }
        }
    };
    JsonManager.prototype.onResourceLoadComplete = function (event) {
        this.clearResLoad();
        var name = event.groupName;
        var res = RES.getGroupByName(name);
        var max = res.length;
        for (var i = 0; i < max; i++) {
            var item = res[i];
            var cl = this.getClass(this.realName[item.data["name"]]);
            var read = cl;
            if (read) {
                read.initFromJson(item.data["name"]);
            }
        }
        if (this._closeHander) {
            this._closeHander.executeWith([name]);
        }
    };
    JsonManager.prototype.onResourceLoadError = function (event) {
        Log.trace("debug", event);
        Log.trace("debug", "json文件加载失败 = " + event.groupName);
    };
    JsonManager.prototype.onResourceProgress = function (event) {
        if (this._proHander) {
            this._proHander.executeWith([event.itemsLoaded, event.itemsTotal]);
        }
    };
    /*
     *  清除资源的监听
    */
    JsonManager.prototype.clearResLoad = function () {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    };
    return JsonManager;
}());
__reflect(JsonManager.prototype, "JsonManager");
/**
 * 本地存储信息管理
 */
var LocalStorageManager = (function () {
    /**
     * key: "LOGIN_INFO"
     * value: {"prev": {"uname":xx, "server": {}},
     *         "hist": {xx1: [serverInfo, serverInfo...]}, xx2, [serverInfo, serverInfo...], ...}}
     * key: "MUSIC_IS_OPEN"
     * value: "0"/"1"
     */
    function LocalStorageManager() {
    }
    Object.defineProperty(LocalStorageManager, "instance", {
        get: function () {
            if (!LocalStorageManager._instance) {
                LocalStorageManager._instance = new LocalStorageManager();
            }
            return LocalStorageManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    return LocalStorageManager;
}());
__reflect(LocalStorageManager.prototype, "LocalStorageManager");
/**
 *  游戏中玩家数据类的管理类
 */
var PlayerManager = (function () {
    function PlayerManager() {
        //role:用户角色，-1-回放者，0-老师，1-助教，2-学生，4-巡课
        this.role = -2;
    }
    PlayerManager.prototype.init = function () {
        var _param = this.getParamData();
        this.role = _param.role;
    };
    PlayerManager.prototype.getParamData = function () {
        var search = window.location.search; //获取location的search属性，保存在search中
        var params = {}; //创建空对象params
        if (search != "") {
            search.slice(1).split("&").forEach(//?username=zhangdong&pwd=123456;//search去开头?，按&切割为数组，forEach
            function (val) {
                var arr = val.split("="); //将当前元素值按=切割，保存在arr中
                params[arr[0]] = arr[1]; //向params中添加一个元素,属性名为arr[0],值为arr[1]
            });
        }
        return params; //返回params
    };
    return PlayerManager;
}());
__reflect(PlayerManager.prototype, "PlayerManager");
/*
  * 面板弹出管理类
  * 面板弹出的管理类
  */
var PopUpManager = (function () {
    function PopUpManager() {
        this._mask = new eui.UILayer(); // new egret.Sprite();
        this.darkSprite = new eui.Rect();
        this.darkSprite.fillColor = 0x000000;
        this.darkSprite.top = 0;
        this.darkSprite.bottom = 0;
        this._mask.addChild(this.darkSprite);
    }
    PopUpManager.getInstance = function () {
        if (!PopUpManager.instance) {
            PopUpManager.instance = new PopUpManager();
        }
        return PopUpManager.instance;
    };
    /** 屏幕适配
     */
    PopUpManager.prototype.reSizePop = function () {
        if (this._mask.numChildren <= 1) {
            return;
        }
        for (var i = 0; i < this._mask.numChildren; i++) {
            var obj = this._mask.getChildAt(i);
            if (obj instanceof UIObject) {
                this.resizePannel(obj);
            }
        }
        // this.darkSprite.width =   GM.gamec.curHeight();//GM.gamec.curWidth();
        //  this.darkSprite.height =  GM.gamec.curWidth(); //GM.gamec.curHeight();
    };
    PopUpManager.prototype.resizePannel = function (panel) {
        var popUpWidth = panel.width;
        var popUpHeight = panel.height;
        panel.x = GM.gamec.curWidth() / 2 - popUpWidth / 2;
        panel.y = GM.gamec.curHeight() / 2 - popUpHeight / 2;
    };
    /*
    * 添加面板方法
    * panel       		面板
    * dark        		背景是否变黑
    * popUpWidth      	指定弹窗宽度，定位使用
    * popUpHeight      	指定弹窗高度，定位使用
    * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    * isAlert
    * isTransparent     背景的透明度 0 完全透明
    */
    PopUpManager.prototype.addPopUp = function (panel, dark, popUpWidth, popUpHeight, effectType, isAlert, isTransparent) {
        if (dark === void 0) { dark = false; }
        if (popUpWidth === void 0) { popUpWidth = 0; }
        if (popUpHeight === void 0) { popUpHeight = 0; }
        if (effectType === void 0) { effectType = 0; }
        if (isAlert === void 0) { isAlert = false; }
        if (GameLayerManager.gameLayer().panelLayer.contains(panel)) {
            return;
        }
        panel.scaleX = 1;
        panel.scaleY = 1;
        panel.x = 0;
        panel.y = 0;
        panel.alpha = 1;
        if (dark) {
            this.darkSprite.width = GM.gamec.curWidth();
            this.darkSprite.height = GM.gamec.curHeight();
            this.darkSprite.alpha = isTransparent;
            this.darkSprite.touchEnabled = true;
            this.darkSprite.visible = true;
        }
        else {
            this.darkSprite.visible = false;
        }
        this._mask.left = 0;
        this._mask.right = 0;
        this._mask.addChild(panel);
        this._mask.swapChildrenAt(this._mask.getChildIndex(this.darkSprite), this._mask.numChildren - 2);
        if (!GameLayerManager.gameLayer().panelLayer.contains(this._mask)) {
            GameLayerManager.gameLayer().panelLayer.addChild(this._mask);
        }
        // GameLayerManager.gameLayer().panelLayer.addChild(panel);
        GM.gamec.curPanel = panel;
        if (popUpWidth !== 0) {
            panel.x = GM.gamec.curWidth() / 2 - popUpWidth / 2;
            panel.y = GM.gamec.curHeight() / 2 - popUpHeight / 2;
        }
        else {
            popUpWidth = panel.width;
            popUpHeight = panel.height;
            panel.x = GM.gamec.curWidth() / 2 - popUpWidth / 2;
            panel.y = GM.gamec.curHeight() / 2 - popUpHeight / 2;
        }
        if (panel.x < 0) {
            panel.x = 0;
        }
        if (panel.y < 0) {
            panel.y = 0;
        }
        // 以下是弹窗动画
        var leftX = GM.gamec.curWidth() / 2 - popUpWidth / 2;
        var upY = GM.gamec.curHeight() / 2 - popUpHeight / 2;
        switch (effectType) {
            case 0:
                break;
            case 1:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth / 4;
                panel.y = panel.y + popUpHeight / 4;
                egret.Tween.get(panel)
                    .to({ alpha: 1, scaleX: 1, scaleY: 1, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, 300, egret.Ease.backOut);
                break;
            case 2:
                panel.alpha = 0;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.x = panel.x + popUpWidth / 4;
                panel.y = panel.y + popUpHeight / 4;
                egret.Tween.get(panel)
                    .to({ alpha: 1, scaleX: 1, scaleY: 1, x: panel.x - popUpWidth / 4, y: panel.y - popUpHeight / 4 }, 600, egret.Ease.elasticOut);
                break;
            case 3:
                if (isAlert) {
                    panel.x = -popUpWidth;
                    egret.Tween.get(panel).to({ x: leftX }, 500, egret.Ease.cubicOut);
                }
                else {
                    panel.x = -popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            case 4:
                if (isAlert) {
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({ x: leftX }, 500, egret.Ease.cubicOut);
                }
                else {
                    panel.x = popUpWidth;
                    egret.Tween.get(panel).to({ x: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            case 5:
                panel.y = -popUpHeight;
                egret.Tween.get(panel).to({ y: upY }, 500, egret.Ease.cubicOut);
                break;
            case 6:
                if (isAlert) {
                    panel.y = GM.gamec.curHeight();
                    egret.Tween.get(panel).to({ y: upY }, 500, egret.Ease.cubicOut);
                }
                else {
                    panel.y = popUpHeight;
                    egret.Tween.get(panel).to({ y: 0 }, 500, egret.Ease.cubicOut);
                }
                break;
            default:
                break;
        }
    };
    /*
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
    PopUpManager.prototype.removePopUp = function (panel, effectType) {
        if (effectType === void 0) { effectType = 0; }
        // tslint:disable-next-line: only-arrow-functions
        var onComplete = function (sp) {
        };
        if (this.darkSprite) {
            egret.Tween.get(this.darkSprite).to({ alpha: 0 }, 100).call(onComplete, this, [this.darkSprite]);
        }
        // 以下是弹窗动画
        switch (effectType) {
            case 0:
                break;
            case 1:
                egret.Tween.get(panel)
                    .to({ alpha: 0, scaleX: 0, scaleY: 0, x: panel.x + panel.width / 2, y: panel.y + panel.height / 2 }, 300);
                break;
            case 2:
                break;
            case 3:
                egret.Tween.get(panel).to({ x: panel.width }, 500, egret.Ease.cubicOut);
                break;
            case 4:
                egret.Tween.get(panel).to({ x: -panel.width }, 500, egret.Ease.cubicOut);
                break;
            case 5:
                egret.Tween.get(panel).to({ y: panel.height }, 500, egret.Ease.cubicOut);
                break;
            case 6:
                egret.Tween.get(panel).to({ y: -panel.height }, 500, egret.Ease.cubicOut);
                break;
            default:
                break;
        }
        var waitTime = 500;
        if (effectType === 0) {
            waitTime = 0;
        }
        egret.setTimeout(this.close, this, waitTime, panel);
    };
    PopUpManager.prototype.close = function (panel) {
        if (this._mask.contains(panel)) {
            this._mask.removeChild(panel);
        }
        if (this._mask.numChildren > 1) {
            this._mask.swapChildrenAt(this._mask.getChildIndex(this.darkSprite), this._mask.numChildren - 2);
        }
        else {
            if (GameLayerManager.gameLayer().panelLayer.contains(this._mask)) {
                GameLayerManager.gameLayer().panelLayer.removeChild(this._mask);
            }
        }
    };
    PopUpManager.prototype.closeAllDlg = function () {
        while (this._mask.numChildren > 1) {
            var obj = this._mask.getChildAt(0);
            if (obj instanceof UIObject) {
                this._mask.removeChild(obj);
                UIPool.getInstance().destroyObject(obj);
            }
            else {
                this._mask.swapChildrenAt(this._mask.getChildIndex(this.darkSprite), this._mask.numChildren - 1);
            }
        }
        if (GameLayerManager.gameLayer().panelLayer.contains(this._mask)) {
            GameLayerManager.gameLayer().panelLayer.removeChild(this._mask);
        }
    };
    return PopUpManager;
}());
__reflect(PopUpManager.prototype, "PopUpManager");
var ResInfo = (function () {
    function ResInfo() {
        this._endHander = null;
        this._proHander = null;
        this._loadDlg = false;
        this._groups = "";
        this._sec = 0;
    }
    return ResInfo;
}());
__reflect(ResInfo.prototype, "ResInfo");
/**
 * 资源加载类 对egret.RES的进一步封装
 */
var ResLoad = (function () {
    function ResLoad() {
        this._progressHander = null;
        this._callBackMap = {};
        this._callBackQueue = [];
    }
    ResLoad.getInstance = function () {
        if (!ResLoad.instance) {
            ResLoad.instance = new ResLoad();
        }
        return ResLoad.instance;
    };
    /**
     * 加载场景资源 并行下载 下载完立即执行
     * @param group 资源组名称
     * @param end   结束后回调
     * @param pro   进行中回调
     */
    ResLoad.prototype.LoadRes = function (group, complete, progress) {
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        Log.trace("debug", "加载的资源组: " + group);
        if (group === "") {
            Log.trace("error", "加载的资源组名称为空");
            return;
        }
        // 已有不再加载
        if (RES.isGroupLoaded(group)) {
            Log.trace("debug", "资源组: " + group + "已加载过");
            if (complete) {
                complete.executeWith([group]);
            }
            return;
        }
        var list = this._callBackMap[group];
        if (list) {
            list.push(complete);
            return;
        }
        this._callBackMap[group] = [complete];
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    };
    /**
     * 加载场景资源 并行下载 按队列执行
     * @param group 资源组名称
     * @param end   结束后回调
     * @param pro   进行中回调
     */
    ResLoad.prototype.LoadResByQueue = function (group, complete, progress) {
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        Log.trace("debug", "加载的资源组: " + group);
        if (group === "") {
            Log.trace("error", "加载的资源组名称为空");
            return;
        }
        // 已有不再加载
        if (RES.isGroupLoaded(group)) {
            Log.trace("debug", "资源组: " + group + "已加载过");
            if (complete) {
                complete.executeWith([group]);
            }
            return;
        }
        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("show_wait"));
        var qLength = this._callBackQueue.length;
        this._callBackQueue[qLength] = { name: group, handler: complete, done: false, loaded: false };
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup(group);
    };
    ResLoad.prototype.executeQueue = function (_name) {
        var qLength = this._callBackQueue.length;
        for (var q = 0; q < qLength; q++) {
            var _callBack = this._callBackQueue[q];
            if (_callBack) {
                if (!_callBack.done) {
                    if (!_callBack.loaded) {
                        // 停止，等待加载完成, 由于脚本是按顺序添加到队列的，因此这里保证了脚本的执行顺序
                        break;
                    }
                    else {
                        _callBack.done = true;
                        var _handler = _callBack.handler;
                        Log.trace("debug", "==资源组加载完成执行回调==" + _callBack.name);
                        lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("hide_wait"));
                        if (_handler) {
                            _handler.executeWith([_callBack.name]);
                        }
                    }
                }
            }
        }
    };
    /** 监听加载完成 */
    ResLoad.prototype.onResourceLoadComplete = function (event) {
        Log.trace("debug", "资源组 " + event.groupName + " 加载完成");
        if (event && event.groupName) {
            var qLength = this._callBackQueue.length;
            for (var q = 0; q < qLength; q++) {
                var _callBack = this._callBackQueue[q];
                if (_callBack && _callBack.name === event.groupName) {
                    _callBack.loaded = true;
                }
            }
            this.executeQueue(event.groupName);
            var list = this._callBackMap[event.groupName];
            delete this._callBackMap[event.groupName];
            var length_1 = list ? list.length : 0;
            for (var i = 0; i < length_1; i++) {
                var _handler = list[i];
                if (_handler) {
                    _handler.executeWith([event.groupName]);
                }
            }
        }
    };
    ResLoad.prototype.onResourceLoadError = function (event) {
        Log.trace("debug", "图片资源加载错误" + event);
    };
    ResLoad.prototype.onResourceProgress = function (event) {
        // Log.trace("debug", "onResourceProgress:" + event.groupName);
        // Log.trace("debug", "onResourceProgress_event.itemsLoaded:" + event.itemsLoaded);
        // Log.trace("debug", "onResourceProgress_event.itemsTotal:" + event.itemsTotal);
        if (this._progressHander) {
            this._progressHander.executeWith([event.itemsLoaded, event.itemsTotal]);
        }
    };
    /*
     *  清除资源的监听
    */
    ResLoad.prototype.clearResLoad = function () {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    };
    return ResLoad;
}());
__reflect(ResLoad.prototype, "ResLoad");
var SceneInfo = (function () {
    function SceneInfo() {
        this.classFactory = null;
        this.resName = "";
        this.data = null;
    }
    return SceneInfo;
}());
__reflect(SceneInfo.prototype, "SceneInfo");
/**
 * Created by yangsong on 2014/11/28.
 * 场景管理类
 */
var SceneManager = (function () {
    /**
     * 构造函数
     */
    function SceneManager() {
        this._oldScene = null;
        this._currScene = null;
        this._loadingScene = false;
        this._loadArray = new Array();
    }
    /**
     * 切换场景
     * @param key      场景唯一标识
     * @param resName  场景需要加载的资源Group名称
     */
    SceneManager.prototype.runScene = function (classFactory, resName, data) {
        if (data === void 0) { data = null; }
        Log.trace("debug", "运行前场景========" + classFactory.key + "====" + this._loadingScene);
        // 正在加载场景资源和界面，新添加的场景放到队列中
        if (this._loadingScene) {
            this.insertSceneInfo(classFactory, resName, data);
            return;
        }
        // 查看队列中是否有已存在的场景，有的话优先加载
        if (this.addNext()) {
            // Log.trace("debug", "加载队列中的场景");
            return;
        }
        // 载入资源
        this._loadingScene = true;
        this._currScene = classFactory;
        this._data = data;
        ResLoad.getInstance().LoadResByQueue(resName, new Handler(this, this.loadEnd));
    };
    /**
     * 载入资源完成后的回调函数
     */
    SceneManager.prototype.loadEnd = function (group) {
        // 移除上一个显示的场景  (异步，有可能不按顺序)
        if (this._oldScene && GameLayerManager.gameLayer().sceneLayer.contains(this._oldScene)) {
            // Log.trace("debug", "移除画布有该场景:"+this._oldScene.keyName);
            UIPool.getInstance().destroyObject(this._oldScene);
            GameLayerManager.gameLayer().sceneLayer.removeChild(this._oldScene);
        }
        Log.trace("debug", "运行后场景===" + this._currScene.key);
        // 当前显示的场景
        var curScene = UIPool.getInstance().createObject(this._currScene);
        if (curScene) {
            if (!GameLayerManager.gameLayer().sceneLayer.contains(curScene)) {
                Log.trace("debug", "画布中没有该场景:" + this._currScene.key);
                curScene.data = this._data;
                var dis = GameLayerManager.gameLayer().sceneLayer.addChild(curScene);
                if (!dis) {
                    Log.trace("debug", "加入场景失败");
                }
                else {
                    // 当前场景赋给要删除的场景
                    this._oldScene = curScene;
                }
            }
            else {
                Log.trace("debug", "画布中已经有该场景:" + this._currScene.key);
            }
        }
        if (this._loadArray.length <= 0) {
            this._loadingScene = false;
        }
        this.addNext();
    };
    /**
     * 同时加载多个场景，排入队列
     * param:  group:资源组名称
     */
    SceneManager.prototype.insertSceneInfo = function (classFactory, resName, data) {
        if (data === void 0) { data = null; }
        var info = new SceneInfo();
        info.classFactory = classFactory;
        info.resName = resName;
        info.data = data;
        this._loadArray.push(info);
    };
    /**
     * 加载数组中的场景
     */
    SceneManager.prototype.addNext = function () {
        if (this._loadArray.length <= 0) {
            return false;
        }
        // 载入资源
        this._loadingScene = true;
        var info = this._loadArray.shift();
        this._currScene = info.classFactory;
        this._data = info.data;
        ResLoad.getInstance().LoadResByQueue(info.resName, new Handler(this, this.loadEnd));
        return true;
    };
    return SceneManager;
}());
__reflect(SceneManager.prototype, "SceneManager");
/**
 * Sound管理类
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * 构造函数
     */
    function SoundManager() {
        var _this = _super.call(this) || this;
        _this.bg = new SoundBg();
        _this.effect = new SoundEffects();
        _this.bgVolume = 0.5;
        _this.effectVolume = 0.5;
        _this.bgOn = true;
        _this.effectOn = true;
        _this.bg.setVolume(_this.bgVolume);
        _this.effect.setVolume(_this.effectVolume);
        return _this;
    }
    /**
     * 播放音效
     * @param effectName
     */
    SoundManager.prototype.playEffect = function (effectName) {
        if (!SoundManager.IS_OPEN_SOUND) {
            return;
        }
        if (!this.effectOn) {
            return;
        }
        this.effect.play(effectName, this.effectVolume);
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.stopEffect = function () {
        this.effect.stop();
    };
    /**
     * 播放背景音乐
     * @param key
     */
    SoundManager.prototype.playBg = function (bgName, volume, loops, end) {
        if (volume === void 0) { volume = 0.5; }
        if (loops === void 0) { loops = 0; }
        if (end === void 0) { end = null; }
        if (!SoundManager.IS_OPEN_SOUND) {
            return;
        }
        if (this.currBg != bgName) {
            if (this.bg) {
                this.bg.stop();
            }
        }
        this.currBg = bgName;
        if (!this.bgOn) {
            return;
        }
        this.bg.play(bgName, volume, loops, end);
    };
    /**
     * 继续播放背景音乐
     */
    SoundManager.prototype.continuePlayBg = function () {
        if (!SoundManager.IS_OPEN_SOUND) {
            return;
        }
        this.bg.continuePlay();
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.stopBg = function () {
        this.bg.stop();
    };
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    SoundManager.prototype.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
    };
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    SoundManager.prototype.setBgOn = function ($isOn) {
        this.bgOn = $isOn;
        if (!this.bgOn) {
            this.stopBg();
        }
        else {
            if (this.currBg) {
                this.playBg(this.currBg, 0);
            }
        }
    };
    /**
    * 设置背景音乐音量
    * @param volume
    */
    SoundManager.prototype.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     * @param volume
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     * @returns {number}
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    // 新增全局声音开关
    SoundManager.IS_OPEN_SOUND = true;
    return SoundManager;
}(BaseClass));
__reflect(SoundManager.prototype, "SoundManager");
/**
 *
 */
var GameSocketNew = (function () {
    function GameSocketNew() {
        if (GameSocketNew.instance) {
            throw new Error("GameSocket instance has already been constructed!");
        }
        GameSocketNew.instance = this;
        GameSocketNew.connected = false;
    }
    GameSocketNew.getInstance = function () {
        if (!GameSocketNew.instance) {
            GameSocketNew.instance = new GameSocketNew();
        }
        return GameSocketNew.instance;
    };
    GameSocketNew.setInstanceNull = function () {
        GameSocketNew.instance = null;
    };
    GameSocketNew.prototype.register = function (listener) {
        if (!listener) {
            throw new Error("Cannot registe a null hanlder to GameSocket");
        }
        this.listener = listener;
    };
    GameSocketNew.prototype.unRegister = function () {
        this.listener = null;
    };
    /**
     * 是否为连接状态
     */
    GameSocketNew.prototype.getConnected = function () {
        return GameSocketNew.connected;
    };
    /**
     * 连接服务器 第一次握手
     */
    GameSocketNew.prototype.connect = function (host, port) {
        Log.trace("debug", "GameSocketNew.connect()");
        this.resetConnect();
        var ws = "wss://" + host + ":" + port;
        Log.trace("debug", "wss=" + ws);
        var dic = GM.jm.getClass("DicServerInfo");
        if (dic.usehttps == 1) {
            GameSocketNew.socket.connectByUrl(ws);
        }
        else {
            GameSocketNew.socket.connect(host, port);
        }
    };
    /**
     * 使接口可用， 并且客户端不主动断开连接
     */
    GameSocketNew.prototype.close = function () {
        if (GameSocketNew.socket && GameSocketNew.socket.connected) {
            GameSocketNew.socket.close();
        }
    };
    GameSocketNew.prototype.sendPackage = function (cmd, body) {
        if (!GameSocketNew.socket.connected) {
            Log.trace("debug", "GameSocket.sendPackage(), 无连接");
            return;
        }
        var bytes = new egret.ByteArray();
        bytes.writeShort(body.length + 4);
        bytes.writeShort(cmd);
        bytes.writeBytes(body, 0, body.length);
        bytes.position = 0;
        GameSocketNew.socket.writeBytes(bytes);
        GameSocketNew.socket.flush();
    };
    /**
     * 初始化
     */
    GameSocketNew.prototype.init = function () {
        GameSocketNew.socket = new egret.WebSocket();
        GameSocketNew.socket.type = egret.WebSocket.TYPE_BINARY;
        GameSocketNew.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.revSocketDataHandler, this);
        GameSocketNew.socket.addEventListener(egret.Event.CONNECT, this.connectHandler, this);
        GameSocketNew.socket.addEventListener(egret.Event.CLOSE, this.closeHandler, this);
        GameSocketNew.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
    };
    /**
     * 重置网络连接
     */
    GameSocketNew.prototype.resetConnect = function () {
        if (GameSocketNew.socket) {
            GameSocketNew.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.revSocketDataHandler, this);
            GameSocketNew.socket.removeEventListener(egret.Event.CONNECT, this.connectHandler, this);
            GameSocketNew.socket.removeEventListener(egret.Event.CLOSE, this.closeHandler, this);
            GameSocketNew.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
            GameSocketNew.socket = null;
        }
        this.init();
    };
    /**
     * 连接
     */
    GameSocketNew.prototype.connectHandler = function (e) {
        Log.trace("debug", "GameSocket.connectHandler(), socket 连接成功");
        GameSocketNew.connected = true;
        this.excuteHandle(egret.Event.CONNECT, e);
    };
    /**
     * 接收数据
     */
    GameSocketNew.prototype.revSocketDataHandler = function (e) {
        Log.trace("debug", "WebSocket receiveData");
        var receiveBa = new egret.ByteArray();
        GameSocketNew.socket.readBytes(receiveBa);
        receiveBa.position = 0;
        var packLen = receiveBa.readShort();
        var msgId = receiveBa.readShort();
        Log.trace("debug", "packLen", packLen, "msgId", msgId);
        var bytes = new egret.ByteArray();
        bytes.writeBytes(receiveBa, 0, packLen);
        bytes.position = 4;
        // 是否需要处理粘包
        this.listener.onMessageReceived(msgId, bytes);
    };
    /**
     * 关闭连接
     */
    GameSocketNew.prototype.closeHandler = function (e) {
        Log.trace("debug", "WebSocket close");
        GameSocketNew.connected = false;
        this.excuteHandle(egret.Event.CLOSE, e);
    };
    /**
     * 抛出错误
     */
    GameSocketNew.prototype.errorHandler = function (e) {
        Log.trace("debug", "egret io_error");
        GameSocketNew.connected = false;
        this.excuteHandle(egret.IOErrorEvent.IO_ERROR, e);
    };
    /**
     *
     */
    GameSocketNew.prototype.excuteHandle = function (type, content) {
        switch (type) {
            case egret.Event.CONNECT:
                this.listener.onConnect();
                break;
            case egret.Event.CLOSE:
                // 连接关闭处理
                this.listener.onDisConnect();
                Log.trace("debug", "GameSocket.excuteHandle(), 数据连接关闭");
                break;
            case egret.IOErrorEvent.IO_ERROR:
                // 连接错误处理
                this.listener.onDisConnect();
                Log.trace("debug", "GameSocket.excuteHandle(), 数据连接异常!");
                break;
        }
    };
    GameSocketNew.connected = false; // 连接状态
    return GameSocketNew;
}());
__reflect(GameSocketNew.prototype, "GameSocketNew");
/**
 * 游戏中全局模块的快速使用
 */
var GM = (function () {
    function GM() {
    }
    GM.init = function () {
        this.gamec = new GameConfigManager();
        this.gamec.init();
        this.pm = new PlayerManager();
        this.pm.init();
        this.jm = new JsonManager();
        this.jm.init();
        this.dlg = new DlgManager();
        this.scene = new SceneManager();
        this.sound = new SoundManager();
        this.debugKey = new HashMap();
        if (false) {
            this.debugKey.put("debug", "");
        }
        CommunicationManager.getInstance().addListener("message");
        Log.trace("version", "FrameworkVersion:" + BaseDefines.FrameworkVersion);
    };
    /*
    * @param time 服务器的时间
    */
    GM.setTime = function (time) {
        this._serverTime = Number(time);
        this._curTime = egret.getTimer();
    };
    /*
    * 根据服务器传来的时间得到此时间和当前时间的秒数 如果当前时间已经大于服务器传来的时间 返回0
    * @param time 服务器传来的时间
    */
    GM.getTime = function (time) {
        var c = egret.getTimer() - this._curTime; // 毫秒
        var cs = this._serverTime + (c / 1000);
        var r = time - cs;
        if (r < 0) {
            r = 0;
        }
        return r;
    };
    GM.isDebug = true;
    return GM;
}());
__reflect(GM.prototype, "GM");
/**
 *
 */
var HttpServer = (function (_super) {
    __extends(HttpServer, _super);
    function HttpServer() {
        return _super.call(this) || this;
    }
    HttpServer.getInstance = function () {
        if (HttpServer.instance == null) {
            HttpServer.instance = new HttpServer();
        }
        return HttpServer.instance;
    };
    /** 发送消息 */
    HttpServer.prototype.sendHttpMsg = function (route, msg, hander) {
        var dicServerInfo = GM.jm.getClass("DicServerInfo");
        var url = dicServerInfo.serverUrl + route;
        this.SendUrlHttpMsg(url, msg, hander);
    };
    /** 发送消息 get*/
    HttpServer.prototype.sendHttpMsgWithType = function (route, msg, hander, isJson, type) {
        var dicServerInfo = GM.jm.getClass("DicServerInfo");
        var url = dicServerInfo.serverUrl + route;
        this.SendUrlHttpMsg(url, msg, hander, isJson, type);
    };
    return HttpServer;
}(HttpConnect));
__reflect(HttpServer.prototype, "HttpServer");
/**
 *
 */
var MessageManager = (function (_super) {
    __extends(MessageManager, _super);
    function MessageManager() {
        var _this = _super.call(this) || this;
        if (MessageManager.instance) {
            throw new Error("GameSocket instance has already been constructed!");
        }
        MessageManager.instance = null;
        return _this;
    }
    MessageManager.getInstance = function () {
        if (!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    };
    return MessageManager;
}(TcpServer));
__reflect(MessageManager.prototype, "MessageManager");
/*
  *  程序中所有UI显示的基类
  *  要显示的UI必须继承此类
 */
var UIObject = (function (_super) {
    __extends(UIObject, _super);
    function UIObject() {
        var _this = _super.call(this) || this;
        _this.keyName = "";
        _this.data = null;
        _this._closeHander = null;
        return _this;
    }
    /* 生成类实例后的处理（未加入显示列表) **/
    UIObject.prototype.onCreate = function () {
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.addEventListener(eui.UIEvent.CHANGE_END, this.onAddEnd, this);
    };
    /** 创建子原件 */
    UIObject.prototype.onCreateChildren = function () {
    };
    UIObject.prototype.onAddEnd = function (e) {
        this.removeEventListener(eui.UIEvent.CHANGE_END, this.onAddEnd, this);
        this.onJoin();
    };
    /* 加入到舞台后的调用 **/
    UIObject.prototype.onAddStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.onAdd();
        if (UIObject.guid) {
            UIObject.guid.execute();
        }
        if (!CommunicationManager.getInstance().offlineRev) {
            lcp.LListener.getInstance().dispatchEventWithType("tky_offlinepost");
        }
    };
    UIObject.prototype.onJoin = function () {
    };
    /* 加入舞台后的处理 继承此函数**/
    UIObject.prototype.onAdd = function () {
    };
    /* 如果需要每帧处理，重写此函数 **/
    UIObject.prototype.onEnterFrame = function (advancedTime) {
    };
    /* 如果需要处理网络消息，请重写此函数 **/
    UIObject.prototype.msgDo = function (msgType, obj) {
    };
    /* 如果需要处理动作消息，请重写此函数 **/
    UIObject.prototype.execMessage = function (data) {
    };
    /* 这里进行移出场景的处理 **/
    UIObject.prototype.onDestroy = function () {
    };
    /* 关闭时的处理 **/
    UIObject.prototype.onClose = function (key, other) {
        if (other === void 0) { other = null; }
        if (this._closeHander) {
            this._closeHander.executeWith([key, other]);
        }
    };
    /** 如果是弹出的对话框(dlg) 关闭的时候请调用
     *  other            传回给Hander的参数
     *  effectType       移出的动画效果   0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    UIObject.prototype.onDlgClose = function (key, other, effectType) {
        if (other === void 0) { other = null; }
        if (effectType === void 0) { effectType = 0; }
        this.onClose(key, other);
        GM.dlg.dlgClose(key, effectType);
    };
    /** 如果是弹出的对话框(dlg) 关闭的时候请调用
     *  effectType       移出的动画效果   0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
     */
    UIObject.prototype.onDlgOnlyClose = function (key, effectType) {
        if (effectType === void 0) { effectType = 0; }
        GM.dlg.dlgClose(key, effectType);
    };
    return UIObject;
}(eui.Component));
__reflect(UIObject.prototype, "UIObject");
/**
 * Created by yangsong on 2014/11/22.
 */
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "TimerManager", {
        /**
         * 统一的计时器和帧刷管理类
         * @type {TimerManager}
         */
        get: function () {
            return TimerManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DateUtils", {
        /**
         * 日期工具类
         * @type {DateUtils}
         */
        get: function () {
            return DateUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "MathUtils", {
        /**
         * 数学计算工具类
         * @type {MathUtils}
         */
        get: function () {
            return MathUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RandomUtils", {
        /**
         * 随机数工具类
         * @type {RandomUtils}
         */
        get: function () {
            return RandomUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "BitmapNumber", {
        /*
         * 图片合成数字工具类
         * */
        get: function () {
            return BitmapNumber.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageUtils", {
        /**
         * Stage操作相关工具类
         */
        get: function () {
            return StageUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StringUtils", {
        /**
         * 字符串工具类
         */
        get: function () {
            return StringUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "CommonUtils", {
        /**
         * 通过工具类
         */
        get: function () {
            return CommonUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DeviceUtils", {
        /**
         * 设备工具类
         */
        get: function () {
            return DeviceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ShockUtils", {
        /**
         * 震动类
         */
        get: function () {
            return ShockUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TextFlowMaker", {
        /**
         * TextFlow
         */
        get: function () {
            return TextFlowMaker.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ArrayUtils", {
        /**
         * 数组工具类
         * @returns {any}
         * @constructor
         */
        get: function () {
            return ArrayUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        /**
         * 加载资源类
         * @returns {any}
         * @constructor
         */
        get: function () {
            return ResourceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化函数
     * @constructor
     */
    App.Init = function () {
    };
    return App;
}());
__reflect(App.prototype, "App");
/**
 * 场景切换特效类
//切换场景的特效
//1.卷帘特效
//2.左右切换移动
//3.直接翻
//4.旋转掉落
//5.随机一种
 */
var ScreenMovies;
(function (ScreenMovies) {
    //当前舞台
    function MovieStart(_txnums) {
        //创建一个截图Bitmap
        var taget = GM.gamec.curStage();
        var w = GM.gamec.curWidth();
        var h = GM.gamec.curHeight();
        //新建一个group
        var loadTxGrp = new eui.Group();
        loadTxGrp.width = w;
        loadTxGrp.height = h;
        taget.addChild(loadTxGrp);
        //循环创建多个截图bitmap 这里num自由设置
        var tx1Number = 40;
        //每个横着的数量
        var Xnumber = 5;
        //高数量自动计算
        var Ynumber = tx1Number / Xnumber;
        for (var i = 0; i < tx1Number; i++) {
            //计算每个的XY及宽高
            var _mcW = w / Xnumber;
            var _mcH = h / Ynumber;
            var _mcX = i % Xnumber * _mcW;
            var _mcY = Math.floor(i / Xnumber) * _mcH;
            var renderTexture = new egret.RenderTexture();
            var mypic = renderTexture.drawToTexture(taget, new egret.Rectangle(_mcX, _mcY, _mcW, _mcH));
            var bmp = new egret.Bitmap;
            bmp.texture = renderTexture;
            bmp.anchorOffsetX = _mcW / 2;
            bmp.anchorOffsetY = _mcH / 2;
            bmp.x = _mcX + _mcW / 2;
            bmp.y = _mcY + _mcH / 2;
            loadTxGrp.addChild(bmp);
            if (_txnums == 5) {
                _txnums = Math.ceil(Math.random() * 4);
            }
            //开始特效
            switch (_txnums) {
                case 1:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0, scaleY: 0, alpha: 0, rotation: 359 }, 800, egret.Ease.circIn).call(onComplete, this);
                    break;
                case 2:
                    var my_x = -w;
                    if (!(i % 2)) {
                        my_x = w * 2;
                    }
                    var tw = egret.Tween.get(bmp);
                    tw.to({ x: my_x, alpha: 0 }, 800, egret.Ease.circIn).call(onComplete, this);
                    break;
                case 3:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0.2, scaleY: 1, alpha: 0, blurFliter: 0 }, 800, egret.Ease.backInOut).call(onComplete, this);
                    break;
                case 4:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ alpha: 0 }, 900, egret.Ease.circIn).call(onComplete, this);
                    break;
                default:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 1, scaleY: 0, alpha: 0 }, 800, egret.Ease.circIn).call(onComplete, this);
            }
        }
        var upNumber = 0;
        function onComplete(evt) {
            upNumber++;
            if (upNumber == tx1Number) {
                taget.removeChild(loadTxGrp);
            }
        }
    }
    ScreenMovies.MovieStart = MovieStart;
})(ScreenMovies || (ScreenMovies = {}));
/**
 * 动画类
 */
var ActMovie = (function () {
    function ActMovie() {
    }
    ActMovie.getInstance = function () {
        if (ActMovie.instance == null) {
            ActMovie.instance = new ActMovie();
        }
        return ActMovie.instance;
    };
    /** 得到帧动画 */
    ActMovie.prototype.getMovieClip = function (resName, movieName) {
        var jsonName = resName + "_json";
        var _mcData = RES.getRes(jsonName);
        var _mcTexture = RES.getRes(resName + "_png");
        var mcDataFactory = new egret.MovieClipDataFactory(_mcData, _mcTexture);
        var movie = new egret.MovieClip(mcDataFactory.generateMovieClipData(movieName));
        return movie;
    };
    return ActMovie;
}());
__reflect(ActMovie.prototype, "ActMovie");
/**
 * Created by egret on 15-8-7.
 */
var ArrayUtils = (function (_super) {
    __extends(ArrayUtils, _super);
    function ArrayUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    ArrayUtils.prototype.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    /** 累加操作 */
    ArrayUtils.prototype.addToltal = function (arr) {
        var max = arr.length;
        var total = 0;
        for (var i = 0; i < max; i++) {
            total += Number(arr[i]);
        }
        return total;
    };
    /** 找出数组中的最小数 */
    ArrayUtils.prototype.findMin = function (arr) {
        if (arr.length === 0) {
            return 0;
        }
        var m = Number(arr[0]);
        var max = arr.length;
        for (var i = 0; i < max; i++) {
            var a = Number(arr[i]);
            if (a < m) {
                m = a;
            }
        }
        return m;
    };
    /** 找出数组中的最大数 */
    ArrayUtils.prototype.findMax = function (arr) {
        var m = Number(arr[0]);
        var max = arr.length;
        for (var i = 0; i < max; i++) {
            var a = Number(arr[i]);
            if (a > m) {
                m = a;
            }
        }
        return m;
    };
    /** 看数组中有没有需要查找的数   */
    ArrayUtils.prototype.findForm = function (arr, a) {
        var max = arr.length;
        for (var i = 0; i < max; i++) {
            if (arr[i] === a) {
                return true;
            }
        }
        return false;
    };
    return ArrayUtils;
}(BaseClass));
__reflect(ArrayUtils.prototype, "ArrayUtils");
/**
 * Created by yangsong on 15-8-19.
 * 平均数工具类
 */
var AverageUtils = (function () {
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    function AverageUtils($maxNum) {
        if ($maxNum === void 0) { $maxNum = 10; }
        this.nums = [];
        this.numsLen = 0;
        this.numSum = 0;
        this.maxNum = $maxNum;
    }
    /**
     * 加入一个值
     * @param value
     */
    AverageUtils.prototype.push = function (value) {
        if (this.numsLen > this.maxNum) {
            this.numsLen--;
            this.numSum -= this.nums.shift();
        }
        this.nums.push(value);
        this.numSum += value;
        this.numsLen++;
    };
    /**
     * 获取平均值
     * @returns {number}
     */
    AverageUtils.prototype.getValue = function () {
        return this.numSum / this.numsLen;
    };
    /**
     * 清空
     */
    AverageUtils.prototype.clear = function () {
        this.nums.splice(0);
        this.numsLen = 0;
        this.numSum = 0;
    };
    return AverageUtils;
}());
__reflect(AverageUtils.prototype, "AverageUtils");
var tiled;
(function (tiled) {
    var Base64 = (function () {
        function Base64() {
        }
        Object.defineProperty(Base64, "nativeBase64", {
            /**
             * 判断是否原生支持Base64位解析
             * @version Egret 3.0.3
             */
            get: function () {
                return (typeof (window.atob) === "function");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 解码
         * @param input
         * @version Egret 3.0.3
         */
        Base64.decode = function (input) {
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            if (this.nativeBase64) {
                return window.atob(input);
            }
            else {
                // tslint:disable-next-line: one-variable-per-declaration
                var output = [], chr1 = void 0, chr2 = void 0, chr3 = void 0, enc1 = void 0, enc2 = void 0, enc3 = void 0, enc4 = void 0, i = 0;
                while (i < input.length) {
                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output.push(String.fromCharCode(chr1));
                    if (enc3 !== 64) {
                        output.push(String.fromCharCode(chr2));
                    }
                    if (enc4 !== 64) {
                        output.push(String.fromCharCode(chr3));
                    }
                }
                output = output.join("");
                return output;
            }
        };
        /**
         * 编码
         * @param input
         * @version Egret 3.0.3
         */
        Base64.encode = function (input) {
            input = input.replace(/\r\n/g, "\n");
            // tslint:disable-next-line: one-variable-per-declaration
            var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                }
                else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output.push(this._keyStr.charAt(enc1));
                output.push(this._keyStr.charAt(enc2));
                output.push(this._keyStr.charAt(enc3));
                output.push(this._keyStr.charAt(enc4));
            }
            output = output.join("");
            Log.trace("debug", "返回= " + output);
            return output;
        };
        /**
         * 解析Base64格式数据
         * @param input
         * @param bytes
         * @version egret 3.0.3
         */
        Base64.decodeBase64AsArray = function (input, bytes) {
            bytes = bytes || 1;
            var dec = Base64.decode(input);
            var i;
            var j;
            var len;
            var ar = new Uint32Array(dec.length / bytes);
            for (i = 0, len = dec.length / bytes; i < len; i++) {
                ar[i] = 0;
                for (j = bytes - 1; j >= 0; --j) {
                    ar[i] += dec.charCodeAt((i * bytes) + j) << (j << 3);
                }
            }
            return ar;
        };
        /**
         * 暂时不支持
         * @param data
         * @param decoded
         * @param compression
         * @version egret 3.0.3
         * @private
         */
        Base64.decompress = function (data, decoded, compression) {
            throw new Error("GZIP/ZLIB compressed TMX Tile Map not supported!");
        };
        /**
         * 解析csv数据
         * @param input
         * @version egret 3.0.3
         */
        Base64.decodeCSV = function (input) {
            var entries = input.replace("\n", "").trim().split(",");
            var result = [];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < entries.length; i++) {
                result.push(+entries[i]);
            }
            return result;
        };
        Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        return Base64;
    }());
    tiled.Base64 = Base64;
    __reflect(Base64.prototype, "tiled.Base64");
})(tiled || (tiled = {}));
/*
  *   UI管理池
 */
var UIPool = (function () {
    function UIPool() {
        this._pool = new HashMap();
        egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }
    UIPool.getInstance = function () {
        if (!UIPool.instance) {
            UIPool.instance = new UIPool();
        }
        return UIPool.instance;
    };
    UIPool.prototype.msgDO = function (msgtype, obj) {
        var list = this._pool.values();
        for (var i = 0, length_2 = list.length; i < length_2; i++) {
            var gameObject = list[i];
            if (gameObject.parent) {
                gameObject.msgDo(msgtype, obj);
            }
        }
    };
    /** 处理动作消息 */
    UIPool.prototype.execMessage = function (data) {
        var list = this._pool.values();
        for (var i = 0, length_3 = list.length; i < length_3; i++) {
            var gameObject = list[i];
            if (gameObject.parent) {
                gameObject.execMessage(data);
            }
        }
    };
    UIPool.prototype.createObject = function (classFactory) {
        var result;
        var key = classFactory.key;
        result = this._pool.getValue(key);
        if (!result) {
            result = new classFactory();
            this._pool.put(key, result);
            result.onCreateChildren();
        }
        result.keyName = key;
        result.onCreate();
        return result;
    };
    /* 根据key 找到GameObject **/
    UIPool.prototype.getObject = function (key) {
        return this._pool.getValue(key);
    };
    UIPool.prototype.destroyObject = function (obj) {
        obj.onDestroy();
    };
    UIPool.prototype.onEnterFrame = function (advancedTime) {
        var list = this._pool.values();
        for (var i = 0, length_4 = list.length; i < length_4; i++) {
            var obj = list[i];
            if (!obj.parent) {
                obj.onEnterFrame(advancedTime);
            }
        }
    };
    return UIPool;
}());
__reflect(UIPool.prototype, "UIPool");
/**
 * 素材需要提前加载好
 * 素材命名规则：类型_数值（有类型是因为一般会同时有几种数字图片，比如大小号或不同颜色）
 * 点号素材命名：类型_dot
 * 创建BitmapNumber使用createNumPic返回DisplayObjectContainer
 * 创建好的BitmapNumber数值需要变化是调用changeNum
 * 回收使用desstroyNumPic
 *
 */
var BitmapNumber = (function (_super) {
    __extends(BitmapNumber, _super);
    function BitmapNumber() {
        var _this = _super.call(this) || this;
        _this._imgPool = [];
        _this._containerPool = [];
        return _this;
    }
    /**
     * 根据需要的数字和类型返回一个DisplayObjectContainer
     * @param num 字值，支持小数点 也可以为图片ID 默认为字值
     * @param type 素材类型
     * @param b 是否加载ID字符串名称图片 默认为false 不必填写这个参数 需要时传true
     */
    BitmapNumber.prototype.createNumPic = function (num, type, b) {
        if (b === void 0) { b = false; }
        var container = this.getContainer();
        var numStr = num.toString();
        var index = 0;
        var tempBm;
        // 加入判断用来读取技能和buff文字
        if (b) {
            tempBm = this.getSingleNumPic(numStr, type);
            container.addChild(tempBm);
        }
        else {
            for (index; index < numStr.length; index++) {
                tempBm = this.getSingleNumPic(numStr.charAt(index), type);
                container.addChild(tempBm);
            }
        }
        this.repositionNumPic(container);
        return container;
    };
    // 回收带数字的DisplayObjectContainer
    BitmapNumber.prototype.desstroyNumPic = function (picContainer) {
        this.clearContainer(picContainer);
        if (picContainer.parent) {
            picContainer.parent.removeChild(picContainer);
        }
    };
    /*
     * 改变带数字的DisplayObjectContainer数字值
     * 提供这个方法是为了提高效率，直接更换之前创建对象的texture，避免多余的删除和创建
     * */
    BitmapNumber.prototype.changeNum = function (picContainer, num, type) {
        var numStr = num.toString();
        // 如果当前数字个数多于目标个数则把多余的回收
        if (picContainer.numChildren > numStr.length) {
            while (picContainer.numChildren > numStr.length) {
                this.recycleBM(picContainer.getChildAt(picContainer.numChildren - 1));
            }
        }
        var index = 0;
        var tempStr;
        for (index; index < numStr.length; index++) {
            // 如果当前的Bitmap数量不够则获取新的Bitmap补齐
            if (index >= picContainer.numChildren) {
                picContainer.addChild(this.getBitmap());
            }
            tempStr = numStr.charAt(index);
            tempStr = tempStr === "." ? "dot" : tempStr;
            picContainer.getChildAt(index).texture = this.getTexture(tempStr, type);
        }
        this.repositionNumPic(picContainer);
    };
    // 每个数字宽度不一样，所以重新排列
    BitmapNumber.prototype.repositionNumPic = function (container) {
        var index = 0;
        var lastX = 0;
        var temp;
        for (index; index < container.numChildren; index++) {
            temp = container.getChildAt(index);
            temp.x = lastX;
            lastX = temp.x + temp.width - 10;
        }
    };
    // 清理容器
    BitmapNumber.prototype.clearContainer = function (picContainer) {
        while (picContainer.numChildren) {
            this.recycleBM(picContainer.removeChildAt(0));
        }
    };
    // 回收Bitmap
    BitmapNumber.prototype.recycleBM = function (bm) {
        if (bm && bm.parent) {
            bm.parent.removeChild(bm);
            bm.texture = null;
            this._imgPool.push(bm);
        }
    };
    BitmapNumber.prototype.getContainer = function () {
        if (this._containerPool.length) {
            return this._containerPool.shift();
        }
        return new egret.DisplayObjectContainer();
    };
    // 获得单个数字Bitmap
    BitmapNumber.prototype.getSingleNumPic = function (num, type) {
        if (num === ".") {
            num = "dot";
        }
        var bm = this.getBitmap();
        bm.texture = this.getTexture(num, type);
        return bm;
    };
    BitmapNumber.prototype.getTexture = function (num, type) {
        return RES.getRes(type + "_" + num + "_png");
    };
    BitmapNumber.prototype.getBitmap = function () {
        if (this._imgPool.length) {
            return this._imgPool.shift();
        }
        return new egret.Bitmap();
    };
    return BitmapNumber;
}(BaseClass));
__reflect(BitmapNumber.prototype, "BitmapNumber");
/**
 * Created by yangsong on 15-1-12.
 * 通用工具类
 */
var CommonUtils = (function (_super) {
    __extends(CommonUtils, _super);
    function CommonUtils() {
        return _super.call(this) || this;
    }
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    CommonUtils.addLableStrokeColor = function (lable, color, width) {
        var tempLable = lable;
        tempLable.strokeColor = color;
        tempLable.stroke = width;
    };
    /**
     * 深度复制
     * @param _data
     */
    CommonUtils.copyDataHandler = function (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    /**
     * 锁屏
     */
    CommonUtils.lock = function () {
        App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = false;
    };
    /**
     * 解屏
     */
    CommonUtils.unlock = function () {
        App.StageUtils.getStage().touchEnabled = App.StageUtils.getStage().touchChildren = true;
    };
    /**
     * int64转number
     * @param obj
     * @returns {number}
     */
    CommonUtils.int64ToNumber = function (obj) {
        return parseInt(obj.toString());
    };
    /**
     * 万字的显示
     * @param label
     * @param num
     */
    CommonUtils.labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 100000) {
            str = num;
        }
        else if (num < 1000000) {
            str = Math.floor(num / 1000 / 10).toString() + "万";
        }
        else {
            str = Math.floor(num / 10000).toString() + "万";
        }
        label.text = str;
    };
    return CommonUtils;
}(BaseClass));
__reflect(CommonUtils.prototype, "CommonUtils");
/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
var DateUtils = (function (_super) {
    __extends(DateUtils, _super);
    function DateUtils() {
        return _super.call(this) || this;
    }
    /* 判断当前时间是否大于指定时间
     *@param    time    时间格式的字符串 比如 2016-12-10 23:00
     *@return   如果当前时间大于指定时间 返回true;
    */
    DateUtils.prototype.compareDay = function (time) {
        var cur = new Date();
        var end = this.getDate(time);
        var n = cur.getTime() - end.getTime();
        if (n > 0) {
            return true;
        }
        return false;
    };
    /* 根据时间，判断比赛的状态 0:未开始 1：进行中 2：已完场*/
    DateUtils.prototype.compareMatch = function (time, hour) {
        var cur = new Date();
        var end = this.getDate(time);
        var n = cur.getTime() - end.getTime();
        if (n > 0) {
            if (n > hour * 60 * 60 * 1000) {
                return 2;
            }
            else {
                return 1;
            }
        }
        return 0;
    };
    DateUtils.prototype.getDate = function (time) {
        var arr = time.split(" ");
        var y = arr[0];
        var yt = y.split("-");
        var d = arr[1];
        var dt = d.split(":");
        var date = new Date(Number(yt[0]), Number(yt[1]) - 1, Number(yt[2]), Number(dt[0]), Number(dt[1]));
        return date;
    };
    /** 只保留小时 */
    DateUtils.prototype.getXiaoTime = function (dt) {
        var arr = dt.split(" ");
        return arr[1];
    };
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00   4:xx天前，xx小时前，xx分钟前
     * @return
     *
     */
    DateUtils.prototype.getFormatBySecond = function (second, type) {
        if (type === void 0) { type = 1; }
        var str = "";
        switch (type) {
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            case 4:
                str = this.getFormatBySecond4(second);
                break;
            case 5:
                str = this.getFormatBySecond5(second);
                break;
            case 6:
                str = this.getFormatBySecond6(second);
                break;
            case 7:
                str = this.getFormatBySecond7(second);
                break;
            case 8:
                str = this.getFormatBySecond8(second);
                break;
        }
        return str;
    };
    DateUtils.prototype.formatDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "-" + month + "-" + day;
    };
    /** 判断是否是闰年 */
    DateUtils.prototype.isLeapYear = function (year) {
        return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
    };
    // 1: 00:00:00
    DateUtils.prototype.getFormatBySecond1 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var hours;
        if (hourst === 0) {
            hours = "00";
        }
        else {
            if (hourst < 10) {
                hours = "0" + hourst;
            }
            else {
                hours = "" + hourst;
            }
        }
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst === 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt === 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return hours + ":" + mins + ":" + sens;
    };
    // 3: 00:00
    DateUtils.prototype.getFormatBySecond3 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst === 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt === 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return mins + ":" + sens;
    };
    // 2:yyyy-mm-dd h:m:s
    DateUtils.prototype.getFormatBySecond2 = function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    // 4:xx天前，xx小时前，xx分钟前
    DateUtils.prototype.getFormatBySecond4 = function (time) {
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "天前";
            }
            else {
                return t + "小时前";
            }
        }
        else {
            return Math.floor(time / 60) + "分钟前";
        }
    };
    DateUtils.prototype.getFormatBySecond5 = function (time) {
        // 每个时间单位所对应的秒数
        var oneDay = 3600 * 24;
        var oneHourst = 3600;
        var oneMinst = 60;
        var days = Math.floor(time / oneDay);
        var hourst = Math.floor(time % oneDay / oneHourst);
        var minst = Math.floor((time - hourst * oneHourst) / oneMinst);
        var secondt = Math.floor((time - hourst * oneHourst) % oneMinst); // time;
        var dayss = "";
        var hourss = "";
        var minss = "";
        var secss = "";
        if (time > 0) {
            // 天
            if (days === 0) {
                // 小时
                if (hourst === 0) {
                    // 分
                    if (minst === 0) {
                        if (secondt === 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else {
                        minss = "" + minst + "分";
                        if (secondt === 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                    }
                    return minss + secss;
                }
                else {
                    hourss = hourst + "小时";
                    if (minst === 0) {
                        if (secondt === 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else if (minst < 10) {
                        minss = "0" + minst + "分";
                    }
                    else {
                        minss = "" + minst + "分";
                    }
                    return hourss + minss;
                }
            }
            else {
                dayss = days + "天";
                if (hourst === 0) {
                    hourss = "";
                }
                else {
                    if (hourst < 10) {
                        hourss = "0" + hourst + "小时";
                    }
                    else {
                        hourss = "" + hourst + "小时";
                    }
                }
                return dayss + hourss;
            }
        }
        return "";
    };
    DateUtils.prototype.getFormatBySecond6 = function (time) {
        // 每个时间单位所对应的秒数
        var oneDay = 3600 * 24;
        var oneHourst = 3600;
        var oneMinst = 60;
        var days = Math.floor(time / oneDay);
        var hourst = Math.floor(time % oneDay / oneHourst);
        var minst = Math.floor((time - days * oneDay - hourst * oneHourst) / oneMinst);
        var secondt = Math.floor((time - days * oneDay - hourst * oneHourst) % oneMinst); // time;
        var b = false;
        var str = "";
        if (days > 0) {
            str += days + "天";
            b = true;
        }
        if (b || hourst > 0) {
            str += hourst + "小时";
            b = true;
        }
        if (b || minst > 0) {
            str += minst + "分";
            b = true;
        }
        if (b || secondt) {
            str += secondt + "秒";
        }
        return str;
    };
    // 2:yyyy-mm-dd h:m:s
    DateUtils.prototype.getFormatBySecond7 = function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 返回的月份从0-11；
        var day = date.getDate();
        return year + "年" + month + "月" + day + "日";
    };
    DateUtils.prototype.getFormatBySecond8 = function (time) {
        // 每个时间单位所对应的秒数
        var oneDay = 3600 * 24;
        var days = Math.floor(time / oneDay);
        var str = "";
        if (days > 0) {
            str = (days + 1) + "天";
        }
        else {
            str = "1天";
        }
        return str;
    };
    return DateUtils;
}(BaseClass));
__reflect(DateUtils.prototype, "DateUtils");
/**
 */
var DeviceUtils = (function (_super) {
    __extends(DeviceUtils, _super);
    /**
     * 构造函数
     */
    function DeviceUtils() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DeviceUtils.prototype, "IsHtml5", {
        /**
         * 当前是否Html5版本
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType === egret.RuntimeType.WEB;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsNative", {
        /**
         * 当前是否是Native版本
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsMobile", {
        /**
         * 是否是在手机上
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsPC", {
        /**
         * 是否是在PC上
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsQQBrowser", {
        /**
         * 是否是QQ浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("MQQBrowser") !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsIEBrowser", {
        /**
         * 是否是IE浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsFirefoxBrowser", {
        /**
         * 是否是Firefox浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsChromeBrowser", {
        /**
         * 是否是Chrome浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsSafariBrowser", {
        /**
         * 是否是Safari浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Safari") !== -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsOperaBrowser", {
        /**
         * 是否是Opera浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            // tslint:disable-next-line: triple-equals
            return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "isIPhoneX", {
        get: function () {
            var u = navigator.userAgent;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
            if (isIOS) {
                if (screen.height == 812 && screen.width == 375) {
                    // 是iphoneX
                    return true;
                }
                else {
                    // 不是iphoneX
                    return false;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return DeviceUtils;
}(BaseClass));
__reflect(DeviceUtils.prototype, "DeviceUtils");
/** 龙骨动画管理列 */
var DragonBoneManager = (function () {
    function DragonBoneManager() {
        this._hash = new HashMap();
    }
    /** 获取龙骨动画
     * @param dbName  			龙骨文件名称
     * @param armatureName      骨架名称
     */
    DragonBoneManager.prototype.getDBArmature = function (dbName, armatureName) {
        this.makeDragonData(dbName);
        var egretFactory = dragonBones.EgretFactory.factory;
        //let armatureDisplay: dragonBones.EgretArmatureDisplay = egretFactory.buildArmatureDisplay("Armature");
        if (dbName == "suiphd")
            dbName += "_ske";
        else if (dbName == "ssxg")
            dbName += "_ske_2";
        else if (dbName == "ksxg1")
            dbName = "ksxg_ske";
        var armature = egretFactory.buildArmature(armatureName, dbName);
        var armatureDisplay = armature.getDisplay();
        dragonBones.WorldClock.clock.add(armature);
        return armature;
    };
    /** 给龙骨类工厂添加数据 */
    DragonBoneManager.prototype.makeDragonData = function (dbName) {
        if (this._hash.containsKey(dbName)) {
            return;
        }
        var dragonbonesData = RES.getRes(dbName + "_ske_json");
        var textureData = RES.getRes(dbName + "_tex_json");
        var texture = RES.getRes(dbName + "_tex_png");
        var egretFactory = dragonBones.EgretFactory.factory;
        egretFactory.parseDragonBonesData(dragonbonesData);
        egretFactory.parseTextureAtlasData(textureData, texture);
        this._hash.put(dbName, 1);
    };
    DragonBoneManager.getInstance = function () {
        if (DragonBoneManager.instance == null) {
            DragonBoneManager.instance = new DragonBoneManager();
        }
        return DragonBoneManager.instance;
    };
    return DragonBoneManager;
}());
__reflect(DragonBoneManager.prototype, "DragonBoneManager");
/**
 * Created by Saco on 2014/12/1.
 */
var LocationProperty = (function () {
    function LocationProperty() {
    }
    /*
     * 获取url参数值，没有返回null
     * 不传递paraUrl参数默认获取当前url
     * */
    LocationProperty.getPara = function (paraName, paraUrl) {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            return null;
        }
        var url = paraUrl || location.href;
        if (url.indexOf("?") != -1) {
            var urlPara = "&" + url.split("?")[1];
            var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
            var result = reg.exec(urlPara);
            if (result) {
                var value = result[0];
                return value.split("&")[1].split("=")[1];
            }
        }
        return null;
    };
    /*
     * 给Url参数赋值
     * 不传递paraUrl参数默认获取当前url
     * */
    LocationProperty.setProperty = function (paraName, paraValue, paraUrl) {
        var url = paraUrl || location.href;
        var urlPara = "&" + url.split("?")[1];
        if (url.indexOf("?") == -1) {
            return url += "?" + paraName + "=" + paraValue;
        }
        else {
            var urlParam = url.split("?")[1];
            if (urlParam == "") {
                return url += paraName + "=" + paraValue;
            }
            var regParaKV = new RegExp("(?:^|\&)" + paraName + "\=.*?(?:\&|$)");
            var result = regParaKV.exec(urlParam);
            if (!result || result[0] == "") {
                return url += "&" + paraName + "=" + paraValue;
            }
            else {
                var oldValue = result[0];
                var regParaKey = new RegExp("\=.*$");
                var newValue = oldValue.replace(regParaKey, "=" + paraValue);
                return url.replace(oldValue, newValue);
            }
        }
    };
    /*
     * 检查url中是否包含某参数
     * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
     * 相信你不会这么用的 =.=
     * */
    LocationProperty.hasProperty = function (paraName, paraUrl) {
        var url = paraUrl || location.href;
        var para = "&" + url.split("?")[1]; // 加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
        return para.indexOf("&" + paraName + "=") != -1;
    };
    return LocationProperty;
}());
__reflect(LocationProperty.prototype, "LocationProperty");
/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
var MathUtils = (function (_super) {
    __extends(MathUtils, _super);
    function MathUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    MathUtils.prototype.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    //    /**
    //     * 角度值转换为弧度制
    //     * @param angle
    //     */
    //    public getRadian(angle:number):number {
    //        return Math.PI = angle / 180 * Math.PI;
    //    }
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    /**
     * 求组合C(n,m)
     * @param   n   集合元素个数
     * @param   m   取出元素个数
     * @param   callback    运行中的回调
     * @param   end         运行结束后的回调
     */
    MathUtils.prototype.Combination = function (n, m, callback, end) {
        var result = new Array();
        for (var i = 0; i < n; ++i) {
            result[0] = i;
            if (!this.doCombination(n, m, i, 1, result, callback)) {
                end.execute();
                return;
            }
        }
        end.execute();
        return;
    };
    MathUtils.prototype.doCombination = function (n, m, i, rlen, result, callback) {
        if (rlen == m) {
            callback.executeWith([result, rlen]);
            return true;
        }
        for (var j = ++i; j < n; ++j) {
            result[rlen] = j;
            if (!this.doCombination(n, m, j, rlen + 1, result, callback)) {
                return false;
            }
        }
        return true;
    };
    /**
     * 求集合笛卡尔积
     * @param   sets    包含集合元素个数的数组
     */
    MathUtils.prototype.cartesian = function (sets, callback, end) {
        var result = new Array(sets.length);
        this.doCartesian(sets, 0, result, callback);
        end.execute();
    };
    MathUtils.prototype.doCartesian = function (sets, i, result, callback) {
        for (var j = 0; j < sets[i]; ++j) {
            result[i] = j;
            if (i == sets.length - 1) {
                callback.executeWith([result, result.length]);
            }
            else {
                if (!this.doCartesian(sets, i + 1, result, callback)) {
                    return false;
                }
            }
        }
        return true;
    };
    // 得到指定数的位数
    MathUtils.prototype.getNumberDigit = function (num) {
        var n = 1;
        var m = Math.floor(num / 10);
        while (m > 0) {
            n++;
            m = Math.floor(m / 10);
        }
        return n;
    };
    // 计算阶乘
    MathUtils.prototype.calNumberJieCheng = function (num) {
        if (num < 1) {
            return 0;
        }
        var n = 1;
        for (var i = 1; i <= num; i++) {
            n = Math.floor(n * i);
        }
        return n;
    };
    return MathUtils;
}(BaseClass));
__reflect(MathUtils.prototype, "MathUtils");
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
var ObjectPool = (function () {
    /**
     * 构造函数
     */
    function ObjectPool() {
        this._objs = new Array();
    }
    /**
        * 取出一个对象
        * @param classZ Class
        * @return Object
        *
        */
    ObjectPool.pop = function (refKey) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var list = ObjectPool._content[refKey];
        if (list.length) {
            return list.pop();
        }
        else {
            var classZ = egret.getDefinitionByName(refKey);
            var argsLen = args.length;
            var obj = void 0;
            if (argsLen == 0) {
                obj = new classZ();
            }
            else if (argsLen == 1) {
                obj = new classZ(args[0]);
            }
            else if (argsLen == 2) {
                obj = new classZ(args[0], args[1]);
            }
            else if (argsLen == 3) {
                obj = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                obj = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
            obj.ObjectPoolKey = refKey;
            return obj;
        }
    };
    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
    ObjectPool.popWithExtraKey = function (refKey, extraKey) {
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var obj;
        var list = ObjectPool._content[refKey];
        if (list.length) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].extraKey == extraKey) {
                    obj = list[i];
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (!obj) {
            var classZ = egret.getDefinitionByName(refKey);
            obj = new classZ(extraKey);
            obj.extraKey = extraKey;
            obj.ObjectPoolKey = refKey;
        }
        return obj;
    };
    /**
     * 放入一个对象
     * @param obj
     *
     */
    ObjectPool.push = function (obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        // 保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
        if (!ObjectPool._content[refKey]) {
            return false;
        }
        ObjectPool._content[refKey].push(obj);
        return true;
    };
    /**
     * 清除所有对象
     */
    ObjectPool.clear = function () {
        ObjectPool._content = {};
    };
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
    ObjectPool.clearClass = function (refKey, clearFuncName) {
        if (clearFuncName === void 0) { clearFuncName = null; }
        var list = ObjectPool._content[refKey];
        while (list && list.length) {
            var obj = list.pop();
            if (clearFuncName) {
                obj[clearFuncName]();
            }
            obj = null;
        }
        ObjectPool._content[refKey] = null;
        delete ObjectPool._content[refKey];
    };
    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
    ObjectPool.dealFunc = function (refKey, dealFuncName) {
        var list = ObjectPool._content[refKey];
        if (list == null) {
            return;
        }
        var i = 0;
        var len = list.length;
        for (i; i < len; i++) {
            list[i][dealFuncName]();
        }
    };
    /**
     * 放回一个对象
     * @param obj
     */
    ObjectPool.prototype.pushObj = function (obj) {
        this._objs.push(obj);
    };
    /**
     * 取出一个对象
     * @returns {*}
     */
    ObjectPool.prototype.popObj = function () {
        if (this._objs.length > 0) {
            return this._objs.pop();
        }
        else {
            return null;
        }
    };
    /**
     * 清除所有缓存对象
     */
    ObjectPool.prototype.clear = function () {
        while (this._objs.length > 0) {
            this._objs.pop();
        }
    };
    ObjectPool._content = {};
    return ObjectPool;
}());
__reflect(ObjectPool.prototype, "ObjectPool");
/**
 * Created by yangsong on 2014/11/23.
 */
var RandomUtils = (function (_super) {
    __extends(RandomUtils, _super);
    function RandomUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limitInteger = function ($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    /**
     * 获取一个变分比是否成功
     * @param per   百分比 比如30% 给30
     */
    RandomUtils.prototype.randPercent = function (per) {
        var r = this.limitInteger(1, 100);
        if (r <= per) {
            return true;
        }
        return false;
    };
    /**
     * 获取一个万分比是否成功
     * @param rand  万分比的数
     */
    RandomUtils.prototype.rand10000 = function (rand) {
        var r = this.limitInteger(1, 10000);
        if (r <= rand) {
            return true;
        }
        return false;
    };
    /**
    * 获取一个千分比是否成功
    * @param rand  万分比的数
    */
    RandomUtils.prototype.rand1000 = function (rand) {
        var r = this.limitInteger(1, 1000);
        if (r <= rand) {
            return true;
        }
        return false;
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    RandomUtils.prototype.randomArray = function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    // 获取指定区间范围随机数，包括lowerValue和upperValue
    RandomUtils.prototype.randomFrom = function (lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    };
    return RandomUtils;
}(BaseClass));
__reflect(RandomUtils.prototype, "RandomUtils");
/**
 * 继承eui的Componet 添加了 OnAdd ondestory 和msgDO
 * @author
 *
 */
var EuiObject = (function (_super) {
    __extends(EuiObject, _super);
    function EuiObject() {
        var _this = _super.call(this) || this;
        _this._hander = null;
        _this._data = null;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddStage, _this);
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeStage, _this);
        return _this;
    }
    /* 添加hander 要在加入舞台前面 */
    EuiObject.prototype.addHander = function (hander) {
        this._hander = hander;
    };
    /* 加入到舞台后的调用 */
    EuiObject.prototype.onAddStage = function (e) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
        this.onAdd();
    };
    /* 供继承的函数 */
    EuiObject.prototype.onAdd = function () {
    };
    /** 移出舞台后调用 */
    EuiObject.prototype.removeStage = function () {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onAddStage, this);
        this._hander = null;
        this.onDestroy();
    };
    /** 这里进行移出场景的处理 */
    EuiObject.prototype.onDestroy = function () {
        // 这里是清理数据
    };
    /** 供继承的函数, 刷新显示 */
    EuiObject.prototype.updataShow = function () {
    };
    /* 如果需要处理网络消息，请重写此函数 **/
    EuiObject.prototype.msgDo = function (msgType, obj) {
    };
    return EuiObject;
}(eui.Component));
__reflect(EuiObject.prototype, "EuiObject");
/**
 * Created by Channing on 2014/12/6.
 * 震动
 */
var ShockUtils = (function (_super) {
    __extends(ShockUtils, _super);
    function ShockUtils() {
        var _this = _super.call(this) || this;
        _this.MAP = 0;
        _this.SPRITE = 1;
        _this.mapPoss = [new egret.Point(0, 3), new egret.Point(0, 0), new egret.Point(0, -2)];
        _this.spritePoss = [new egret.Point(5, 0), new egret.Point(-5, 0), new egret.Point(5, 0)];
        _this._shockLength = 0;
        _this._shockCount = 0;
        _this._rx = 0;
        _this._ry = 0;
        _this._type = 0;
        _this._repeatCount = 0;
        return _this;
    }
    ShockUtils.prototype.destroy = function () {
        this.stop();
    };
    ShockUtils.prototype.shock = function (type, target, repeatCount) {
        if (type === void 0) { type = 0; }
        if (target === void 0) { target = null; }
        if (repeatCount === void 0) { repeatCount = 3; }
        if (this._target) {
            return;
        }
        this._type = type;
        this._target = target;
        if (this._type == this.MAP) {
            this._shockPoss = this.mapPoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        else if (this._type == this.SPRITE) {
            this._shockPoss = this.spritePoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        this.start(repeatCount);
    };
    ShockUtils.prototype.start = function (num) {
        if (num === void 0) { num = 1; }
        this.repeatCount = num;
        this._shockCount = 0;
        if (this._target) {
            if (this._type != this.MAP) {
                this._rx = this._target.x;
            }
            this._ry = this._target.y;
            App.TimerManager.doFrame(1, 0, this.onShockEnter, this);
        }
    };
    ShockUtils.prototype.stop = function () {
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx;
            }
            this._target.y = this._ry;
            App.TimerManager.remove(this.onShockEnter, this);
        }
        this._target = null;
    };
    ShockUtils.prototype.onShockEnter = function (time) {
        var maxCount = this._shockLength * this._repeatCount;
        if (this._shockCount >= maxCount) {
            this.stop();
            return;
        }
        var index = this._shockCount % this._shockLength;
        var pos = this._shockPoss[index];
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx + pos.x;
            }
            this._target.y = this._ry + pos.y;
        }
        this._shockCount++;
    };
    Object.defineProperty(ShockUtils.prototype, "repeatCount", {
        get: function () {
            return this._repeatCount;
        },
        set: function (value) {
            this._repeatCount = value;
        },
        enumerable: true,
        configurable: true
    });
    return ShockUtils;
}(BaseClass));
__reflect(ShockUtils.prototype, "ShockUtils");
/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
var StageUtils = (function (_super) {
    __extends(StageUtils, _super);
    /**
     * 构造函数
     */
    function StageUtils() {
        return _super.call(this) || this;
    }
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    StageUtils.prototype.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    StageUtils.prototype.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * 指定此对象是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchEnabled = function (value) {
        this.getStage().touchEnabled = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    StageUtils.prototype.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * 设置帧频
     * @param value
     */
    StageUtils.prototype.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    StageUtils.prototype.getStage = function () {
        // return egret.MainContext.instance.stage;
        return null;
    };
    return StageUtils;
}(BaseClass));
__reflect(StageUtils.prototype, "StageUtils");
/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
var StringUtils = (function (_super) {
    __extends(StringUtils, _super);
    /**
     * 构造函数
     */
    function StringUtils() {
        return _super.call(this) || this;
    }
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    StringUtils.prototype.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, "$1");
    };
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    StringUtils.prototype.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var _i = 0, strArr_1 = strArr; _i < strArr_1.length; _i++) {
            var iterator = strArr_1[_i];
            if (this.isChinese(iterator)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    StringUtils.prototype.isChinese = function (str) {
        var reg = /^[u4E00-u9FA5]+$/;
        if (!reg.test(str)) {
            return true;
        }
        return false;
    };
    /**  将字符串的后两位组成数字 */
    StringUtils.prototype.makeStrToNumer = function (str) {
        if (str.length < 2) {
            return 0;
        }
        var b = str.charAt(str.length - 2);
        var g = str.charAt(str.length - 1);
        var bn = Number(b);
        var gn = Number(g);
        return bn * 10 + gn;
    };
    return StringUtils;
}(BaseClass));
__reflect(StringUtils.prototype, "StringUtils");
/**
 * Created by Saco on 2015/10/26.
 */
var TextFlowMaker = (function (_super) {
    __extends(TextFlowMaker, _super);
    function TextFlowMaker() {
        var _this = _super.call(this) || this;
        _this.STYLE_COLOR = "C";
        _this.STYLE_SIZE = "S";
        _this.PROP_TEXT = "T";
        return _this;
    }
    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    TextFlowMaker.prototype.generateTextFlow = function (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    TextFlowMaker.prototype.getSingleTextFlow = function (text) {
        var textArr = text.split("&");
        var tempArr;
        var textFlow = { style: {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                textFlow.text = tempArr[1];
            }
            else if (tempArr[0] == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(tempArr[1]);
            }
            else if (tempArr[0] == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(tempArr[1]);
            }
            else {
                textFlow.text = tempArr[0];
            }
        }
        return textFlow;
    };
    return TextFlowMaker;
}(BaseClass));
__reflect(TextFlowMaker.prototype, "TextFlowMaker");
var TimerHandler = (function () {
    function TimerHandler() {
        /**执行间隔*/
        this.delay = 0;
        /**重复执行次数*/
        this.repeatCount = 0;
        /**执行时间*/
        this.exeTime = 0;
        /**上次的执行时间*/
        this.dealTime = 0;
    }
    /**清理*/
    TimerHandler.prototype.clear = function () {
        this.method = null;
        this.methodObj = null;
        this.complateMethod = null;
        this.complateMethodObj = null;
    };
    return TimerHandler;
}());
__reflect(TimerHandler.prototype, "TimerHandler");
window["TimerHandler"] = TimerHandler;
/**
 * Created by yangsong on 2014/11/23.
 * Timer管理器
 */
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    /**
     * 构造函数
     */
    function TimerManager() {
        var _this = _super.call(this) || this;
        _this._handlers = new Array();
        _this._delHandlers = new Array();
        _this._currTime = egret.getTimer();
        _this._currFrame = 0;
        _this._count = 0;
        _this._timeScale = 1;
        return _this;
        // egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }
    /**
     * 设置时间参数
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
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
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
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
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    Object.defineProperty(TimerManager.prototype, "count", {
        /**
         * 定时器执行数量
         * @return
         *
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.remove = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                ObjectPool.push(handler);
                this._count--;
                break;
            }
        }
    };
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    TimerManager.prototype.removeAll = function (methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.methodObj == methodObj) {
                this._handlers.splice(i, 1);
                ObjectPool.push(handler);
                this._count--;
                i--;
            }
        }
    };
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    TimerManager.prototype.isExists = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj) {
                return true;
            }
        }
        return false;
    };
    /**
     * 每帧执行函数
     * @param frameTime
     */
    TimerManager.prototype.onEnterFrame = function () {
        this._currFrame++;
        this._currTime = egret.getTimer();
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            var t = handler.userFrame ? this._currFrame : this._currTime;
            if (t >= handler.exeTime) {
                handler.method.call(handler.methodObj, (this._currTime - handler.dealTime) * this._timeScale);
                handler.dealTime = this._currTime;
                handler.exeTime += handler.delay;
                if (!handler.repeat) {
                    if (handler.repeatCount > 1) {
                        handler.repeatCount--;
                    }
                    else {
                        if (handler.complateMethod) {
                            handler.complateMethod.apply(handler.complateMethodObj);
                        }
                        this._delHandlers.push(handler);
                    }
                }
            }
        }
        while (this._delHandlers.length) {
            var handler = this._delHandlers.pop();
            this.remove(handler.method, handler.methodObj);
        }
    };
    TimerManager.prototype.create = function (useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        // 参数监测
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        // 先删除相同函数的计时
        this.remove(method, methodObj);
        // 创建
        var handler = ObjectPool.pop("TimerHandler");
        handler.userFrame = useFrame;
        handler.repeat = repeatCount == 0;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.complateMethod = complateMethod;
        handler.complateMethodObj = complateMethodObj;
        handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
        handler.dealTime = this._currTime;
        this._handlers.push(handler);
        this._count++;
    };
    return TimerManager;
}(BaseClass));
__reflect(TimerManager.prototype, "TimerManager");
var BaseDefines = (function () {
    function BaseDefines() {
    }
    BaseDefines.TKCLOUD_TYPE = {
        TO_PAGE: "tky_topage",
    };
    BaseDefines.VIEW_TYPE = {
        SHOW_WAIT: "show_wait",
        HIDE_WAIT: "hide_wait",
    };
    BaseDefines.FrameworkVersion = 17;
    return BaseDefines;
}());
__reflect(BaseDefines.prototype, "BaseDefines");
/**
 * 背景音乐类
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * 构造函数
     */
    function SoundBg() {
        var _this = _super.call(this) || this;
        _this._currBg = "";
        _this._soundLength = 0;
        _this._soundFlag = 0;
        _this._soundTimer = null;
        return _this;
    }
    /**
     * 停止当前音乐
     */
    SoundBg.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
        if (this._soundTimer) {
            this._soundTimer.stop();
        }
    };
    /**
     * 播放某个音乐
     * @param effectName
     */
    SoundBg.prototype.play = function (effectName, volume, loops, end) {
        if (end === void 0) { end = null; }
        this._volume = volume;
        if (this._currBg == effectName) {
            return;
        }
        this.stop();
        this._currBg = effectName;
        this._loops = loops;
        this._endHandler = end;
        // 创建一个计时器对象
        this._soundTimer = new egret.Timer(1000, 0);
        // 注册事件侦听器
        this._soundTimer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        Log.trace("debug", "effectName:" + effectName);
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound, loops, end);
        }
    };
    /**
     *如果有些机型 需要触发的话 就接着 播放login音乐
     */
    SoundBg.prototype.continuePlay = function () {
        if (this._currSoundChannel) {
            var volume = this._currSoundChannel.volume;
            var pos = this._currSoundChannel.position;
            this._currSoundChannel.stop();
            this._currSoundChannel = this._currSound.play(pos, 0);
            this._currSoundChannel.volume = volume;
        }
    };
    /**
    * 设置音量
    * @param volume
    */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key), this._loops, this._endHandler);
        }
    };
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    SoundBg.prototype.checkCanClear = function (key) {
        return this._currBg != key;
    };
    SoundBg.prototype.timerFunc = function () {
        this._soundFlag++;
        if (this._soundFlag >= this._soundLength) {
            this._soundTimer.stop();
            if (this._endHandler) {
                this._endHandler.execute();
            }
        }
    };
    /**
     * 播放
     * @param sound
     */
    SoundBg.prototype.playSound = function (sound, loops, end) {
        if (!sound) {
            return;
        }
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(0, loops);
        this._currSoundChannel.volume = this._volume;
        this._soundLength = Math.round(this._currSound.length);
        this._soundFlag = 0;
        this._soundTimer.start();
    };
    return SoundBg;
}(BaseSound));
__reflect(SoundBg.prototype, "SoundBg");
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
var SoundEffects = (function (_super) {
    __extends(SoundEffects, _super);
    /**
     * 构造函数
     */
    function SoundEffects() {
        return _super.call(this) || this;
    }
    /**
     * 播放一个音效
     * @param effectName
     */
    SoundEffects.prototype.play = function (effectName, volume) {
        if (volume === void 0) { volume = 0.5; }
        this._volume = volume;
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
    * 设置音量
    * @param volume
    */
    SoundEffects.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundEffects.prototype.loadedPlay = function (key) {
        this.playSound(RES.getRes(key));
    };
    /**
     * 停止当前音乐
     */
    SoundEffects.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
    };
    /**
     * 播放
     * @param sound
     */
    SoundEffects.prototype.playSound = function (sound) {
        if (!sound) {
            return;
        }
        this._currSoundChannel = sound.play(0, 1);
        this._currSoundChannel.volume = this._volume;
    };
    return SoundEffects;
}(BaseSound));
__reflect(SoundEffects.prototype, "SoundEffects");
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
var AnchorUtil = (function () {
    function AnchorUtil() {
    }
    /**
     * 初始化工具类，并完成注入anchorX/anchorY属性
     */
    AnchorUtil.init = function () {
        if (this._isInited) {
            return;
        }
        this._propertyChange = Object.create(null);
        this._anchorChange = Object.create(null);
        this.injectAnchor();
        this._isInited = true;
    };
    /**
     * 设置对象的anchorX值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    AnchorUtil.setAnchorX = function (target, value) {
        target["anchorX"] = value;
    };
    /**
     * 设置对象的anchorY值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    AnchorUtil.setAnchorY = function (target, value) {
        target["anchorY"] = value;
    };
    /**
     * 设置对象的anchor值，同时改变anchorX和anchorY值
     * @param target 被设置相对冒点属性的对象
     * @param value 相对锚点值
     */
    AnchorUtil.setAnchor = function (target, value) {
        target["anchorX"] = target["anchorY"] = value;
    };
    /**
     * 获得对象的anchorX值
     * @param target 取值的对象
     * @returns {any|number} anchorX值
     */
    AnchorUtil.getAnchorX = function (target) {
        return target["anchorX"] || 0;
        // return 0;
    };
    /**
     * 获得对象的anchorY值
     * @param target 取值的对象
     * @returns {any|number} anchorY值
     */
    AnchorUtil.getAnchorY = function (target) {
        return target["anchorY"] || 0;
        //  return 0;
    };
    /**
     * 注入anchorX/anchorY属性，并重写引擎底层方法实现相对锚点
     */
    AnchorUtil.injectAnchor = function () {
        Object.defineProperty(egret.DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                var _this = this;
                this.$setWidth(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(egret.DisplayObject.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            set: function (value) {
                var _this = this;
                this.$setHeight(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorX", {
            get: function () {
                return this["_anchorX"];
            },
            set: function (value) {
                var _this = this;
                this._anchorX = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorY", {
            get: function () {
                return this["_anchorY"];
            },
            set: function (value) {
                var _this = this;
                this._anchorY = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchor", {
            get: function () {
                return this["_anchorX"];
            },
            set: function (value) {
                var _this = this;
                this._anchorX = value;
                this._anchorY = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true,
        });
        if (eui && eui.Component) {
            Object.defineProperty(eui.Component.prototype, "width", {
                get: function () {
                    return this._UIC_Props_._uiWidth;
                },
                set: function (value) {
                    var _this = this;
                    this.$setWidth(value);
                    AnchorUtil._propertyChange[this.hashCode] = true;
                    egret.callLater(function () {
                        AnchorUtil.changeAnchor(_this);
                    }, this);
                },
                enumerable: true,
                configurable: true,
            });
            Object.defineProperty(eui.Component.prototype, "height", {
                get: function () {
                    return this._UIC_Props_._uiHeight;
                },
                set: function (value) {
                    var _this = this;
                    this.$setHeight(value);
                    AnchorUtil._propertyChange[this.hashCode] = true;
                    egret.callLater(function () {
                        AnchorUtil.changeAnchor(_this);
                    }, this);
                },
                enumerable: true,
                configurable: true,
            });
            eui.Component.prototype.setMeasuredSize = function (w, h) {
                var _this = this;
                var change = false;
                if (this._UIC_Props_._uiWidth != w) {
                    this._UIC_Props_._uiWidth = w;
                    change = true;
                }
                if (this._UIC_Props_._uiHeight != h) {
                    this._UIC_Props_._uiHeight = h;
                    change = true;
                }
                if (change) {
                    this.invalidateDisplayList();
                    this.dispatchResizeEvent();
                    AnchorUtil._propertyChange[this.hashCode] = true;
                    egret.callLater(function () {
                        AnchorUtil.changeAnchor(_this);
                    }, this);
                }
            };
        }
    };
    AnchorUtil.changeAnchor = function (tar) {
        if (AnchorUtil._propertyChange[tar.hashCode] && AnchorUtil._anchorChange[tar.hashCode]) {
            tar.anchorOffsetX = tar._anchorX * tar.width;
            tar.anchorOffsetY = tar._anchorY * tar.height;
            delete AnchorUtil._propertyChange[tar.hashCode];
        }
    };
    return AnchorUtil;
}());
__reflect(AnchorUtil.prototype, "AnchorUtil");
/*
  *  Base64的解码
 */
var Base64;
(function (Base64) {
    function base64_Decode(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // private method for UTF-8 decoding
        var utf8Decode = function (utftext) {
            var str = "";
            var i2 = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;
            while (i2 < utftext.length) {
                c = utftext.charCodeAt(i2);
                if (c < 128) {
                    str += String.fromCharCode(c);
                    i2++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i2 + 1);
                    str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i2 += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i2 + 1);
                    var c3 = utftext.charCodeAt(i2 + 2);
                    str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i2 += 3;
                }
            }
            return str;
        };
        // public method for decoding
        var output = "";
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = utf8Decode(output);
        return output;
    }
    Base64.base64_Decode = base64_Decode;
    // 加码
    function base64_Encode(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // private method for UTF-8 encoding
        var utf8Encode = function (str) {
            str = str.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < str.length; n++) {
                var c = str.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var output = "";
        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;
        input = utf8Encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    Base64.base64_Encode = base64_Encode;
})(Base64 || (Base64 = {}));
var BaseDataEvent = (function (_super) {
    __extends(BaseDataEvent, _super);
    function BaseDataEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseDataEvent;
}(egret.Event));
__reflect(BaseDataEvent.prototype, "BaseDataEvent");
/**
 *   常用的静态函数类
 */
var BaseFunc = (function () {
    function BaseFunc() {
    }
    // 解析json
    BaseFunc.objToClass = function (obj, cl) {
        var key = "";
        for (key in obj) {
            if (key === "") {
                continue;
            }
            if (cl.hasOwnProperty(key)) {
                if (typeof (cl[key]) === "string") {
                    cl[key] = String(obj[key]);
                }
                else if (typeof (cl[key]) === "number") {
                    cl[key] = Number(obj[key]);
                }
                else {
                    cl[key] = obj[key];
                }
            }
        }
    };
    // 解析json
    BaseFunc.objToObj = function (obj, desc) {
        var key = "";
        for (key in obj) {
            desc[key] = obj[key];
        }
    };
    /** 深度复制一个类实例的属性（string，number)给另一个类实例
     *
     */
    BaseFunc.ClassToClass = function (c1, c2) {
        var key = "";
        for (key in c1) {
            if (key === "") {
                continue;
            }
            if (c2.hasOwnProperty(key)) {
                if (typeof (c1[key]) === "string") {
                    c2[key] = String(c1[key]);
                }
                else if (typeof (c1[key]) === "number") {
                    c2[key] = Number(c1[key]);
                }
            }
        }
    };
    /*
    *   将一个key:value的字符串 转化成一个Object
    *   字符串格式 key:value,key:value
    */
    BaseFunc.strToObj = function (str, s1, s2) {
        if (s1 === void 0) { s1 = ","; }
        if (s2 === void 0) { s2 = ":"; }
        var obj = {};
        var arr = str.split(s1);
        var max = arr.length;
        var ar;
        for (var i = 0; i < max; i++) {
            var t = arr[i];
            if (t.search(s2) === -1) {
                continue;
            }
            ar = t.split(s2);
            if (ar.length < 2) {
                continue;
            }
            obj[ar[0]] = ar[1];
        }
        return obj;
    };
    // 随机函数
    BaseFunc.randomInRange = function (min, max) {
        var scale = max - min;
        return Math.ceil(Math.random() * scale + min);
    };
    // 将秒格式化 hh:MM:ss;
    BaseFunc.FormatTimeMM = function (sec) {
        var strTime = "";
        var hour = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - hour * 3600) / 60);
        var seconds = Math.floor(sec - minutes * 60 - hour * 3600);
        if (sec > 0) {
            strTime = this.formatTimeString(hour) + ":";
            strTime += this.formatTimeString(minutes) + ":";
            strTime += this.formatTimeString(seconds);
        }
        else {
            strTime = "00:00:00";
        }
        return strTime;
    };
    BaseFunc.alignText = function (txt, max) {
        if (max === void 0) { max = 4; }
        if (txt.text.length > max) {
            txt.textAlign = "left";
        }
        else {
            txt.textAlign = "center";
        }
    };
    /*
    * 格式话数字成00格式
    */
    BaseFunc.formatTimeString = function (n) {
        var s = "";
        if (n < 10) {
            s = "0" + String(n);
        }
        else {
            s = String(n);
        }
        return s;
    };
    /*
    * 得到武将的职业图标
    * @param
    */
    BaseFunc.getHeroOcImg = function (q) {
        var str = "icon_job" + q + "_png";
        return str;
    };
    /*
    * 时间戳转换成年月日时分秒
    * @param
    */
    BaseFunc.formatDate = function (num, type) {
        if (type === void 0) { type = 0; }
        //        return new Date(parseInt(Num) * 1000).toLocaleString().replace("/", "-").replace("/", "-");
        //        new Date(parseInt(Num) * 1000).toLocaleString().replace(/\//gi, '-');
        var day = new Date(parseInt(num) * 1000)
            .toLocaleTimeString().replace("上午", "").replace("下午", "").replace(":", "").replace(":", "");
        var dayBy = new Date(parseInt(num) * 1000).toLocaleTimeString().replace("上午", "").replace("下午", "");
        var dayDal = new Date(parseInt(num) * 1000).toLocaleTimeString();
        var text = dayDal.substr(0, 1);
        var dayA = day;
        var dayB = day;
        var dayC = day;
        var dayH;
        var dayM;
        var dayS;
        var dateDal = new Date(parseInt(num) * 1000).toLocaleDateString().replace(/\//gi, "-");
        if (text === "下") {
            for (var i = 0; i < 4; i++) {
                dayA = dayA.substring(0, dayA.length - 1);
            }
            if (Number(dayA) >= 1 && Number(dayA) <= 9) {
                dayB = dayB.substring(1);
                for (var ic = 0; ic < 3; ic++) {
                    dayC = dayC.substring(1);
                }
            }
            else {
                for (var ib = 0; ib < 2; ib++) {
                    dayB = dayB.substring(1);
                }
                for (var ia = 0; ia < 4; ia++) {
                    dayC = dayC.substring(1);
                }
            }
            for (var id = 0; id < 2; id++) {
                dayB = dayB.substring(0, dayB.length - 1);
            }
            if (Number(dayA) === 12) {
                dayH = "12";
            }
            else {
                dayH = 12 + Number(dayA);
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                dayA = dayA.substring(0, dayA.length - 1);
            }
            if (Number(dayA) >= 0 && Number(dayA) <= 9) {
                dayB = dayB.substring(1);
                for (var ic = 0; ic < 3; ic++) {
                    dayC = dayC.substring(1);
                }
            }
            else {
                for (var ib = 0; ib < 2; ib++) {
                    dayB = dayB.substring(1);
                }
                for (var ia = 0; ia < 4; ia++) {
                    dayC = dayC.substring(1);
                }
            }
            for (var id = 0; id < 2; id++) {
                dayB = dayB.substring(0, dayB.length - 1);
            }
            if (Number(dayA) === 12) {
                dayH = "00";
            }
            else if (Number(dayA) >= 10 && Number(dayA) <= 11) {
                dayH = "0" + Number(dayA);
            }
            else {
                dayH = Number(dayA);
            }
        }
        dayM = dayB;
        dayS = dayC;
        if (type === 0) {
            dayBy = dateDal + " " + dayH + ":" + dayM + ":" + dayS;
        }
        if (type === 1) {
            dayBy = dateDal;
        }
        return dayBy;
    };
    //
    BaseFunc.timestampDate = function () {
        return Math.round(new Date().getTime() / 1000);
    };
    // 传入数字返回品质符号
    BaseFunc.getqualitymark = function (level) {
        var mark = "";
        switch (level) {
            case 1:
                {
                    mark = "Ⅰ";
                }
                break;
            case 2:
                {
                    mark = "Ⅱ";
                }
                break;
            case 3:
                {
                    mark = "Ⅲ";
                }
                break;
            case 4:
                {
                    mark = "Ⅳ";
                }
                break;
            case 5:
                {
                    mark = "Ⅴ";
                }
                break;
            case 6:
                {
                    mark = "Ⅵ";
                }
                break;
        }
        return mark;
    };
    // 传入数字返回品质颜色
    BaseFunc.getqualitycolor = function (level) {
        var color = 0x0;
        switch (level) {
            case 1:
                {
                    color = 0xcdff91;
                }
                break;
            case 2:
                {
                    color = 0x90f5ff;
                }
                break;
            case 3:
                {
                    color = 0xff8ffe;
                }
                break;
            case 4:
                {
                    color = 0xff9d1f;
                }
                break;
        }
        return color;
    };
    /** 将带差字符串转化
     * @param source 员字符串
     * @param ...args 参数
     */
    BaseFunc.getLang = function (source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var str = source;
        if (args.length > 0) {
            for (var i = 0, n = args.length; i < n; i++) {
                str = str.replace(("%" + (i + 1)), args[i]);
            }
        }
        return str;
    };
    /** 将带差字符串转化
     * @param source 员字符串
     * @param ...args 参数
     */
    BaseFunc.getLangNum = function (source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var str = source;
        if (args.length > 0) {
            for (var i = 0, n = args.length; i < n; i++) {
                str = str.replace(("#num" + (i + 1) + "#"), args[i]);
            }
        }
        str = str.replace("#test#", "");
        return str;
    };
    /** 将带差字符串转化
     * @param testStr 替换 test 的字符串
     * @param source 员字符串
     * @param ...args 参数
     */
    BaseFunc.getLangNumWithTest = function (testStr, source) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var str = source;
        if (args.length > 0) {
            for (var i = 0, n = args.length; i < n; i++) {
                str = str.replace(("#num" + (i + 1) + "#"), args[i]);
            }
        }
        str = str.replace("#test#", testStr);
        return str;
    };
    /* 根据传入的数得到相应的日期
    * @param day 0为今天 1为昨天 以此类推
    */
    BaseFunc.GetDay = function (day) {
        var today = new Date();
        // tslint:disable-next-line: variable-name
        var yesterday_milliseconds = today.getTime() - (1000 * 60 * 60 * 24 * day);
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth() + 1;
        if (Number(strMonth) < 10) {
            strMonth = "0" + strMonth;
        }
        if (Number(strDay) < 10) {
            strDay = "0" + strDay;
        }
        var strYesterday = String(strYear) + String(strMonth) + String(strDay);
        return strYesterday;
    };
    return BaseFunc;
}());
__reflect(BaseFunc.prototype, "BaseFunc");
/** 大数计算类 */
var BigMath = (function () {
    function BigMath() {
    }
    /** 得到大数string */
    BigMath.toString = function (a) {
        return new BigNum(a).toString();
    };
    /** 加 */
    BigMath.add = function (a, b) {
        var n = new BigNum(a);
        var s = new BigNum(b);
        var back = new BigNum(0);
        var r = this.alignExp(n, s);
        if (0 == r) {
            back._n = n._n + s._n;
            back._e = n._e;
            return back.toString();
        }
        else if (-1 == r) {
            return s.toString();
        }
        return n.toString();
    };
    /** 减 */
    BigMath.sub = function (a, b) {
        var n = new BigNum(a);
        var s = new BigNum(b);
        var back = new BigNum(0);
        var r = this.alignExp(n, s);
        if (0 == r) {
            back._n = n._n - s._n;
            back._e = n._e;
            return back.toString();
        }
        else if (-1 == r) {
            s._n = -s._n;
            return s.toString();
        }
        return n.toString();
    };
    /** 乘 */
    BigMath.mul = function (a, b) {
        var n = new BigNum(a);
        var s = new BigNum(b);
        var back = new BigNum(0);
        back._n = n._n * s._n;
        back._e = n._e + s._e;
        return back.toString();
    };
    /** 除 */
    BigMath.div = function (a, b) {
        var n = new BigNum(a);
        var s = new BigNum(b);
        var back = new BigNum(0);
        back._n = n._n / s._n;
        back._e = n._e - s._e;
        return back.toString();
    };
    /** 平方根 */
    BigMath.sqrt = function (e) {
        var i = new BigNum(e);
        if (i._n < 0) {
            return "";
        }
        if (i._e % 2 == 1) {
            i._n *= 10;
            i._e--;
        }
        i._n = Math.sqrt(i._n);
        i._e = i._e / 2;
        return i.toString();
    };
    /** 返回基数（base）的指数（exponent）次幂 */
    BigMath.pow = function (e, i) {
        if (0 > i) {
            return "";
        }
        if (e == 0) {
            return new BigNum(0).toString();
        }
        if (1 == e) {
            return new BigNum(1).toString();
        }
        if (0 == i) {
            return new BigNum(1).toString();
        }
        var n;
        var s;
        var a = new BigNum(e).toString();
        var r = "1";
        for (n = 2 * i, s = 2; Math.round(n) < 1 || Math.abs(Math.round(n) / s - i) > 1e-5;) {
            n *= 2, s *= 2;
        }
        for (n = Math.round(n); 0 != n;) {
            if (n % 2 == 1) {
                r = this.mul(r, a);
            }
            n = Math.floor(n / 2);
            a = this.mul(a, a);
        }
        for (; s > 1;) {
            s /= 2;
            r = this.sqrt(r);
        }
        return r;
    };
    /** 比较大小 e > i true*/
    BigMath.greater = function (e, i) {
        var n = new BigNum(e);
        var s = new BigNum(i);
        if (n._n < 0) {
            if (s._n < 0) {
                if (n._e < s._e) {
                    return true;
                }
                if (n._e == s._e && n._n < s._n) {
                    return true;
                }
            }
        }
        else if (n._n == 0) {
            if (s._n < 0) {
                return true;
            }
        }
        else if (n._n > 0) {
            if (s._n <= 0) {
                return true;
            }
            if (n._e > s._e) {
                return true;
            }
            if (n._e == s._e && n._n > s._n) {
                return true;
            }
        }
        return false;
    };
    /** 大于等于 */
    BigMath.greaterOrEqual = function (e, i) {
        return false == this.less(e, i);
    };
    /** 小于 */
    BigMath.less = function (e, i) {
        var n = new BigNum(e);
        var s = new BigNum(i);
        if (n._n < 0) {
            if (s._n >= 0) {
                return true;
            }
            if (n._e > s._e) {
                return true;
            }
            if (n._e == s._e && n._n > s._n) {
                return true;
            }
        }
        else if (0 == n._n) {
            if (s._n > 0) {
                return true;
            }
        }
        else if (n._n > 0 && s._n > 0) {
            if (n._e < s._e) {
                return true;
            }
            if (n._e == s._e && n._n < s._n) {
                return true;
            }
        }
        return false;
    };
    /** 小于等于 */
    BigMath.lessOrEqual = function (e, i) {
        return false == this.greater(e, i);
    };
    /** 等于 */
    BigMath.equal = function (e, i) {
        var n = new BigNum(e);
        var s = new BigNum(i);
        return n._e == s._e && n._n == s._n ? true : false;
    };
    /** 取小 */
    BigMath.min = function (e, i) {
        var n = new BigNum(e);
        var s = new BigNum(i);
        return this.less(n, s) ? n.toString() : s.toString();
    };
    /** 取大 */
    BigMath.max = function (e, i) {
        var n = new BigNum(e);
        var s = new BigNum(i);
        return this.greater(n, s) ? n.toString() : s.toString();
    };
    /** 取中间数 */
    BigMath.clamp = function (e, i, n) {
        var s = new BigNum(e);
        var a = new BigNum(i);
        var r = new BigNum(n);
        return this.min(this.max(s, a), r);
    };
    /** 转换成number */
    BigMath.parseNumber = function (e) {
        var i = new BigNum(e);
        return i._n * Math.pow(10, i._e);
    };
    /** 向下取整 */
    BigMath.floor = function (e) {
        var i = new BigNum(e);
        if (i._e < 0) {
            i._n = 0;
            i._e = 0;
            return i.toString();
        }
        if (i._e > 200) {
            return i.toString();
        }
        for (; Math.floor(i._n) != i._n && i._e > 0;) {
            i._n *= 10;
            i._e--;
        }
        i._n = Math.floor(i._n);
        i.format();
        return i.toString();
    };
    /** 对齐e */
    BigMath.alignExp = function (t, e) {
        var i = Math.abs(t._e - e._e);
        if (t._e < e._e) {
            if (i > 100) {
                return -1;
            }
            e._n *= Math.pow(10, i);
            e._e -= i;
        }
        if (t._e > e._e) {
            if (i > 100) {
                return 1;
            }
            t._n *= Math.pow(10, i);
            t._e -= i;
        }
        return 0;
    };
    return BigMath;
}());
__reflect(BigMath.prototype, "BigMath");
/** 大数类 */
var BigNum = (function () {
    function BigNum(num) {
        this.setNum(num);
    }
    /** 设置大数类 */
    BigNum.prototype.setNum = function (num) {
        this._n = 0;
        this._e = 0;
        if ("string" == typeof (num)) {
            num = num.replace(/exp/g, "e");
            var arr = String(num).split("e"); // 分解
            if (arr.length == 1) {
                this._n = Number(arr[0]);
                if (isNaN(this._n)) {
                    this._n = 0;
                }
            }
            else {
                if (arr.length >= 2) {
                    this._n = Number(arr[0]);
                    this._e = Number(arr[1]);
                    if (isNaN(this._n)) {
                        this._n = 0;
                    }
                    if (isNaN(this._e)) {
                        this._e = 0;
                    }
                }
            }
        }
        else if ("number" == typeof num) {
            this._n = num;
        }
        else if (num instanceof BigNum) {
            this._n = num._n;
            this._e = num._e;
        }
        // 重新组织数据
        this.format();
    };
    /** 重新组织数据，比如将10e2改成1.0e3 */
    BigNum.prototype.format = function () {
        if (0 == this._n) {
            this._e = 0;
            return;
        }
        var b = false; // 是否负数
        if (this._n < 0) {
            this._n = -this._n; // 将负数转成正数
            b = true;
        }
        if (this._n >= 10) {
            var add = Math.floor(this.log10(this._n));
            this._e += add;
            this._n /= Math.pow(10, add);
        }
        // 数是小数
        if (this._n < 1) {
            var n = -Math.ceil(-this.log10(this._n));
            this._e += n;
            this._n *= Math.pow(10, -n);
        }
        if (b) {
            this._n = -this._n;
        }
    };
    /** 大数的对数运算 */
    BigNum.prototype.log10 = function (num) {
        if (0 > num) {
            return;
        }
        return Math.log(num) * Math.LOG10E;
    };
    /** 转成字符串 */
    BigNum.prototype.toString = function () {
        this.format();
        return this._n + "e" + this._e;
    };
    return BigNum;
}());
__reflect(BigNum.prototype, "BigNum");
/**
 *
 * @author
 * 飞出效果类
 *
 */
var EffectFly;
(function (EffectFly) {
    /**开始显示提示 */
    function showTips(data) {
        // var tip: FlyInfoDlg = new FlyInfoDlg();
        // tip.showInfo(data);
        // tip.x = 640;
        // tip.y = 0;
        // GameLayerManager.gameLayer().effectLayer.addChild(tip);
        // this.showMove(tip);
    }
    EffectFly.showTips = showTips;
    /**显示飞出 */
    // export function showMove(tip: FlyInfoDlg): void
    // {
    //     var posx = 640 * GM.viewpointScale - tip.width;
    //     egret.Tween.get(tip).to({x: posx},200,egret.Ease.backOut).wait(1500).to({alpha: 0},500).call(this.tipRemove,this,[tip]);
    // }
    /**移除tween */
    // export function tipRemove(tip: FlyInfoDlg): void
    // {
    //     tip.showRemove();
    // }
})(EffectFly || (EffectFly = {}));
/**
 * 游戏中使用到的特效
 */
var EffectUtils;
(function (EffectUtils) {
    /**
   *                 飘字特效
   * str             提示内容
   * effectType      动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失 5：从大变小 等等
   * isWarning       是否是警告，警告是红色
   */
    function showTips(str, effectType, isWarning) {
        if (str === void 0) { str = ""; }
        if (effectType === void 0) { effectType = 1; }
        if (isWarning === void 0) { isWarning = false; }
        switch (effectType) {
            case 1: {
                TipsUtils.showTipsDownToUp(str, isWarning);
                break;
            }
            case 2: {
                TipsUtils.showTipsLeftOrRight(str, isWarning, true);
                break;
            }
            case 3: {
                TipsUtils.showTipsLeftOrRight(str, isWarning, false);
                break;
            }
            case 4: {
                TipsUtils.showTipsFromCenter(str, isWarning);
                break;
            }
            case 5: {
                TipsUtils.showTipsBigToSmall(str, isWarning);
                break;
            }
            case 6: {
                TipsUtils.showTipsNotice(str, isWarning);
                break;
            }
            default: {
                // TODO: Implemente default case
            }
        }
    }
    EffectUtils.showTips = showTips;
    /** 对象闪烁特效
     * obj         闪烁对象
     * interval    闪烁总时间 (毫秒)
     */
    function blinkEffect(obj, interval) {
        if (interval === void 0) { interval = 1000; }
        // tslint:disable-next-line: no-unused-expression
        new Blink(obj, interval);
    }
    EffectUtils.blinkEffect = blinkEffect;
    // 存储旋转对象
    var rotationArr = [];
    /** 对象旋转特效
     * obj   旋转对象
     * time  旋转一周用时，毫秒
    **/
    function rotationEffect(obj, time) {
        if (time === void 0) { time = 1000; }
        if (this.rotationArr == null) {
            this.rotationArr = [];
        }
        if (this.rotationArr[obj.hashCode]) {
            return;
        }
        if ((this.rotationArr[obj.hashCode] == null) || !this.rotationArr[obj.hashCode]) {
            this.rotationArr[obj.hashCode] = true;
        }
        var onComplete1 = function () {
            if (this.rotationArr[obj.hashCode] && (obj != null)) {
                obj.rotation = 0;
                egret.Tween.get(obj).to({ rotation: 360 }, time).call(onComplete1, this);
            }
        };
        obj.rotation = 0;
        egret.Tween.get(obj).to({ rotation: 360 }, time).call(onComplete1, this);
    }
    EffectUtils.rotationEffect = rotationEffect;
    /** 取消对象旋转 **/
    // obj    旋转对象
    function removeRotationEffect(obj) {
        if (this.rotationArr == null) {
            this.rotationArr = [];
        }
        this.rotationArr[obj.hashCode] = false;
    }
    EffectUtils.removeRotationEffect = removeRotationEffect;
    /**抖动对象特效 **/
    // 类似ios密码输入错误的特效
    function shakeObj(obj) {
        var shakeNum = 80;
        var oldX = obj.x;
        egret.Tween.get(obj).to({ x: obj.x - 10 }, shakeNum);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x + 20 }, shakeNum);
        }, this, shakeNum * 2);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x - 20 }, shakeNum);
        }, this, shakeNum * 3);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x + 20 }, shakeNum);
        }, this, shakeNum * 4);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: oldX }, shakeNum);
        }, this, shakeNum * 5);
    }
    EffectUtils.shakeObj = shakeObj;
    /** 抖动对象特效(震屏)
      * effectType 1:抖动 2：震动
     **/
    function shakeScreen(obj, effectType) {
        if (effectType === void 0) { effectType = 1; }
        var panel = obj;
        var shakeNum = 40;
        var oldX = panel.x;
        var oldY = panel.y;
        if (effectType == 1) {
            egret.Tween.get(panel).to({ x: panel.x - 10 }, shakeNum);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x - 20 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX }, shakeNum);
            }, this, shakeNum * 5);
        }
        else {
            egret.Tween.get(panel).to({ x: panel.x - 10, y: panel.y }, shakeNum);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20, y: panel.y }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 15 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y - 20 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 10 }, shakeNum);
            }, this, shakeNum * 5);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX, y: oldY }, shakeNum);
            }, this, shakeNum * 6);
        }
    }
    EffectUtils.shakeScreen = shakeScreen;
    // ------------------------  给显示对象增加一些固定的效果 ------------------------------------//
    /**
   * 显示对象上下浮动特效
   * obj           对象
   * time          浮动时间 毫秒
   * space         浮动高度
   */
    function flyObj(obj, time, space) {
        if (space === void 0) { space = 50; }
        var onComplete1 = function () {
            if (obj != null) {
                var onComplete2 = function () {
                    egret.Tween.get(obj).to({ y: obj.y + space }, time / 3).call(onComplete1, this);
                };
                egret.Tween.get(obj).to({ y: obj.y - space }, time).call(onComplete2, this);
            }
        };
        onComplete1();
    }
    EffectUtils.flyObj = flyObj;
    var isPlayEffectPlay = false;
    /**
    * 给显示对象增加特效
    * obj           对象
    * cartoonType   动画类型 1:【可爱】按下变小，放开弹大 2:按下变小，放开轻微弹大 3：按下变小，放开变大
    */
    function playEffect(obj, cartoonType) {
        if (cartoonType === void 0) { cartoonType = 1; }
        if (this.isPlayEffectPlay) {
            return;
        }
        this.isPlayEffectPlay = true;
        var onComplete2 = function () {
            this.isPlayEffectPlay = false;
        };
        var onComplete1 = function () {
            if (cartoonType == 1) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 500, egret.Ease.elasticOut).call(onComplete2, this);
            }
            else if (cartoonType == 2) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 500, egret.Ease.backOut).call(onComplete2, this);
            }
            else if (cartoonType == 3) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 100).call(onComplete2, this);
            }
        };
        egret.Tween.get(obj).to({ scaleX: 0.5, scaleY: 0.5, x: obj.x + obj.width / 4, y: obj.y + obj.height / 4 }, 100, egret.Ease.sineIn).call(onComplete1, this);
    }
    EffectUtils.playEffect = playEffect;
    /**
     * 给显示对象增加从中心放大的效果(放大到1.5倍)
     */
    function playCenterScale(obj) {
        egret.Tween.removeTweens(obj);
        var onComplete1 = function () {
            egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: 162, y: 55 }, 800, egret.Ease.backOut);
        };
        egret.Tween.get(obj).to({ scaleX: 1.5, scaleY: 1.5, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 500, egret.Ease.sineIn).call(onComplete1, this);
    }
    EffectUtils.playCenterScale = playCenterScale;
    /**
   * 给显示对象增加持续放大特效
   * obj           对象
   */
    function playScaleEffect(obj) {
        var onComplete1 = function () {
            if (obj != null) {
                var onComplete2 = function () {
                    obj.scaleX = 1;
                    obj.scaleY = 1;
                    egret.Tween.get(obj).to({ alpha: 1 }, 1000).call(onComplete1, self);
                };
                obj.alpha = 1;
                egret.Tween.get(obj).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 1000).call(onComplete2, self);
            }
        };
        onComplete1();
    }
    EffectUtils.playScaleEffect = playScaleEffect;
    // 完成飞道具
    function twComplete(tw, img) {
        // 移除动画
        egret.Tween.removeTweens(tw);
        if (img != null) {
            GameLayerManager.gameLayer().effectLayer.removeChild(img);
        }
    }
    EffectUtils.twComplete = twComplete;
})(EffectUtils || (EffectUtils = {}));
/**
 *
 * 游戏中用到的动画效果 可以复用的效果（单体类)
 *
 */
var GameEffcet;
(function (GameEffcet) {
    function onlineShow(source, x, y) {
        var img = new eui.Image();
        img.source = source + "_png";
        img.x = x;
        img.y = y;
        var onComplete2 = function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(img)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(img);
            }
        };
        if (!GameLayerManager.gameLayer().effectLayer.contains(img)) {
            GameLayerManager.gameLayer().effectLayer.addChild(img);
        }
        egret.Tween.get(img).wait(1500).to({ alpha: 1 }, 100).call(onComplete2, this);
    }
    GameEffcet.onlineShow = onlineShow;
    /** 用于物体的闪烁效果 alpha循环从0到1 */
    function alphaChange(obj, time) {
        if (time === void 0) { time = 200; }
        var onComplete1 = function () {
            // tslint:disable-next-line: no-use-before-declare
            egret.Tween.get(obj).to({ alpha: 0 }, time).call(onComplete2, this);
        };
        var onComplete2 = function () {
            egret.Tween.get(obj).to({ alpha: 1 }, 1200).call(onComplete1, this);
        };
        onComplete1();
    }
    GameEffcet.alphaChange = alphaChange;
    /** 用于文字的放大和回原效果 */
    function bigText(obj, time) {
        if (time === void 0) { time = 300; }
        var onComplete2 = function () {
            egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1 }, 1200);
        };
        var onComplete1 = function () {
            egret.Tween.get(obj).to({ scaleX: 1.5, scaleY: 1.5 }, time).call(onComplete2, this);
        };
        onComplete1();
    }
    GameEffcet.bigText = bigText;
    /** 用于上下移动 */
    function UpMove(obj, time) {
        if (time === void 0) { time = 1200; }
        var old = obj.y;
        var onComplete1 = function () {
            // tslint:disable-next-line: no-use-before-declare
            egret.Tween.get(obj).to({ y: old - 10 }, time).call(onComplete2, this);
        };
        var onComplete2 = function () {
            egret.Tween.get(obj).to({ y: old }, time).call(onComplete1, this);
            // onComplete1();
        };
        onComplete1();
    }
    GameEffcet.UpMove = UpMove;
    /** 用于上下连续移动 */
    function upAndDowMove(obj, time) {
        if (time === void 0) { time = 1200; }
        var old = obj.y;
        var onComplete1 = function () {
            // tslint:disable-next-line: no-use-before-declare
            egret.Tween.get(obj).to({ y: old - 10 }, time).call(onComplete2, this);
        };
        var onComplete2 = function () {
            egret.Tween.get(obj).to({ y: old }, time).call(onComplete1, this);
        };
        onComplete1();
    }
    GameEffcet.upAndDowMove = upAndDowMove;
})(GameEffcet || (GameEffcet = {}));
var GameMusic = (function () {
    function GameMusic() {
    }
    Object.defineProperty(GameMusic, "soundVolume", {
        /**
         * 设置音量
         * @param va
         */
        set: function (va) {
            if (this.soundChannel) {
                this.soundChannel.volume = +va;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 播放
     * @param name  音乐文件名
     * @param startTime 开始播放的时间 默认是0
     * @param loops  播放次数<= 0循环播放，>0播放该次数,默认为0
     * @constructor
     */
    GameMusic.play = function (name, startTime, loops) {
        if (startTime === void 0) { startTime = 0; }
        if (loops === void 0) { loops = 0; }
        if (!this.sound) {
            if (RES.hasRes(name)) {
                var _this_1 = this;
                RES.getResAsync(name, function () {
                    _this_1.sound = RES.getRes(name);
                    _this_1.play(name);
                }, this);
            }
            return;
        }
        if (this.soundPlaying) {
            return;
        }
        this.soundChannel = this.sound.play(startTime, loops);
        // this.soundVolume = (Number(uo.musicVolume) * 0.1);
        this.soundVolume = 1;
        this.soundPlaying = true;
    };
    /**
     * 关闭
     */
    GameMusic.stop = function () {
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        this.sound = null;
        this.soundChannel = null;
        this.soundPlaying = false;
    };
    /**
   * 设置音量
   * @param volume
   */
    GameMusic.setVolume = function (volume) {
        if (this.soundChannel) {
            this.soundChannel.volume = volume;
        }
    };
    GameMusic.soundPlaying = false;
    return GameMusic;
}());
__reflect(GameMusic.prototype, "GameMusic");
/** 游戏中的回调类
 *  主要功能
 *  处理游戏中的回调
 */
var Handler = (function () {
    function Handler(thisArg, method, args) {
        if (thisArg === void 0) { thisArg = null; }
        if (method === void 0) { method = null; }
        if (args === void 0) { args = null; }
        this.thisArg = thisArg;
        this.method = method;
        this.args = args;
    }
    /** 执行处理 **/
    Handler.prototype.execute = function () {
        if (this.method != null) {
            this.method.apply(this.thisArg, this.args);
        }
    };
    /** 执行处理（增加参数的输出) */
    Handler.prototype.executeWith = function (data) {
        if (data == null) {
            return this.execute();
        }
        else {
            if (this.method != null) {
                this.method.apply(this.thisArg, this.args ? this.args.concat(data) : data);
            }
        }
    };
    return Handler;
}());
__reflect(Handler.prototype, "Handler");
window["Handler"] = Handler;
/**
 *  hahsMap
 */
var HashMap = (function () {
    function HashMap() {
        this._keys = null;
        this.props = null;
        this.clear();
    }
    HashMap.prototype.clear = function () {
        this.props = new Object();
        this._keys = new Array();
    };
    /** 是否已经有着个key **/
    HashMap.prototype.containsKey = function (key) {
        return this.props[key] != null;
    };
    HashMap.prototype.containsValue = function (value) {
        var result = false;
        var len = this.size();
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (this.props[this._keys[i]] == value) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    };
    HashMap.prototype.getValue = function (key) {
        return this.props[key];
    };
    HashMap.prototype.put = function (key, value) {
        var result = null;
        if (this.containsKey(key)) {
            result = this.getValue(key);
            this.props[key] = value;
        }
        else {
            this.props[key] = value;
            this._keys.push(key);
        }
        return result;
    };
    HashMap.prototype.remove = function (key) {
        var result = null;
        if (this.containsKey(key)) {
            delete this.props[key];
            var index = this._keys.indexOf(key);
            if (index > -1) {
                this._keys.splice(index, 1);
            }
        }
        return result;
    };
    HashMap.prototype.putAll = function (map) {
        this.clear();
        var len = map.size();
        if (len > 0) {
            var arr = map.keys();
            for (var i = 0; i < len; i++) {
                this.put(arr[i], map.getValue(arr[i]));
            }
        }
    };
    /**  hash表的长度 **/
    HashMap.prototype.size = function () {
        return this._keys.length;
    };
    HashMap.prototype.isEmpty = function () {
        return this.size() < 1;
    };
    HashMap.prototype.values = function () {
        var result = new Array();
        var len = this.size();
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                result.push(this.props[this._keys[i]]);
            }
        }
        return result;
    };
    HashMap.prototype.keys = function () {
        return this._keys;
    };
    return HashMap;
}());
__reflect(HashMap.prototype, "HashMap");
var HEvent = (function (_super) {
    __extends(HEvent, _super);
    function HEvent() {
        return _super.call(this) || this;
    }
    HEvent.getInstance = function () {
        HEvent.init();
        return HEvent.Instance;
    };
    HEvent.init = function () {
        if (HEvent.Instance == null) {
            HEvent.Instance = new HEvent();
        }
    };
    HEvent.Instance = null;
    return HEvent;
}(egret.EventDispatcher));
__reflect(HEvent.prototype, "HEvent");
/**
 *
 * @author
 *
 */
var HLoad = (function (_super) {
    __extends(HLoad, _super);
    function HLoad() {
        var _this = _super.call(this) || this;
        _this.hander = null;
        _this.time = 0;
        _this.isJson = true;
        return _this;
    }
    return HLoad;
}(egret.HttpRequest));
__reflect(HLoad.prototype, "HLoad");
/**
 * @module Lcp
 * @class LEvent
 * @constructor
 */
var lcp;
(function (lcp) {
    /**
     * 自定义事件类
     */
    var LEvent = (function (_super) {
        __extends(LEvent, _super);
        function LEvent(type, obj, bubbles, cancelable) {
            if (obj === void 0) { obj = null; }
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.CLASS_NAME = "LEvent";
            if (obj) {
                _this._obj = obj;
            }
            return _this;
        }
        LEvent.prototype.clone = function (obj) {
            return new LEvent(this.type, obj ? obj : this._obj, this.bubbles, this.cancelable);
        };
        LEvent.prototype.toString = function () {
            // tslint:disable-next-line: no-console
            // console.log(this.CLASS_NAME, "type", "bubbles", "cancelable");
        };
        Object.defineProperty(LEvent.prototype, "param", {
            /**
             * 传参获取
             * @returns {Object}
             */
            get: function () {
                return this._obj;
            },
            enumerable: true,
            configurable: true
        });
        return LEvent;
    }(egret.Event));
    lcp.LEvent = LEvent;
    __reflect(LEvent.prototype, "lcp.LEvent");
})(lcp || (lcp = {}));
/**
 * Created by d8q8 on 2014/8/12.
 * @module Lcp
 * @class LListener
 * @constructor
 */
// 使用方法
//  sp.touchEnabled=true;//开启触点事件
// //单击
// sp.addEventListener(egret.TouchEvent.TOUCH_TAP,(e)=>{
//     console.log("我单击了圆",e.stageX,e.stageY);
//     //全局侦听发送消息和自定义事件,这里的自定义事件,也可以自己封装成强类型即可,比如LEvent.MYCIRCLE
//     lcp.LListener.getInstance().dispatchEvent(new lcp.LEvent("mycircle",.1,false));
//     //元件自身发送消息和自定义事件,同上
//     sp.dispatchEvent(new lcp.LEvent("mycircle1",.5));
// },this);
// //当前元件侦听自定义事件获取数据
// sp.addEventListener("mycircle1",(e)=>{
//    console.log(e.param);//自定义事件参数param,可以传入任意对象,然后自行解析即可.
//    sp.y=1000*parseFloat(e.param);
// },this);
// //全局侦听自定义事件获取数据
// lcp.LListener.getInstance().addEventListener("mycircle",(e)=>{
//     console.log(e.param);//同上
//     sp.alpha=parseFloat(e.param);
// },this);
var lcp;
(function (lcp) {
    /**
     * 全局侦听类及消息处理
     */
    var LListener = (function () {
        function LListener() {
            this.CLASS_NAME = "LListener";
            this.isInit = false;
            if (this.isInit) {
                //                egret.Logger.warning("不可以实例化"+this.CLASS_NAME+"类,请实例Lcp."+this.CLASS_NAME+".getInstance()开始");
            }
            if (this._dispatcher == null) {
                this._dispatcher = new egret.EventDispatcher();
                this.isInit = true;
            }
        }
        LListener.getInstance = function () {
            if (this._instance == null) {
                this._instance = new LListener();
            }
            return this._instance;
        };
        LListener.prototype.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            this._dispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
        };
        LListener.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this._dispatcher.removeEventListener(type, listener, thisObject, useCapture);
        };
        LListener.prototype.hasEventListener = function (type) {
            return this._dispatcher.hasEventListener(type);
        };
        LListener.prototype.willTrigger = function (type) {
            return this._dispatcher.willTrigger(type);
        };
        LListener.prototype.dispatchEvent = function (event) {
            return this._dispatcher.dispatchEvent(event);
        };
        LListener.prototype.dispatchEventWithType = function (type, bubbles, data, cancelable) {
            return this._dispatcher.dispatchEventWith(type, bubbles, data, cancelable);
        };
        LListener.prototype.toString = function () {
            return this._dispatcher.toString();
        };
        return LListener;
    }());
    lcp.LListener = LListener;
    __reflect(LListener.prototype, "lcp.LListener");
})(lcp || (lcp = {}));
/**
 * 缓动eui.label 的数字
 * @author
 *
 */
var LN = (function () {
    function LN() {
        this._hash = new HashMap();
    }
    LN.getInstance = function () {
        if (LN.instance == null) {
            LN.instance = new LN();
        }
        return LN.instance;
    };
    /** 缓动数字的变化
     * @param label 缓动的label
     * @param num   变化后的数字
     * @param time  缓动的时间，默认2秒
     */
    LN.prototype.playNum = function (label, num, time) {
        if (time === void 0) { time = 1000; }
        var m = this._hash.getValue(label);
        if (m == null) {
            m = new MoveNum();
            this._hash.put(label, m);
            m.play(label, num, time);
        }
        else {
            m.stop();
            m.play(label, num, time);
        }
    };
    LN.prototype.deleteMoveNum = function (m) {
        this._hash.remove(m._label);
        m = null;
    };
    /** 创建图形数字 */
    LN.prototype.addPicNum = function (g, num, gray) {
        if (gray === void 0) { gray = false; }
        var str = String(num);
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            var img = new eui.Image();
            var key = "font_num" + char + "_png";
            if (gray) {
                key = "font_numh" + char + "_png";
            }
            img.source = RES.getRes(key);
            img.x = i * 20;
            g.addChild(img);
        }
    };
    /** 根据name和num得到zmovie **/
    LN.prototype.getMovieClip = function (moveName, num) {
        var arr = new Array();
        for (var i = 0; i < num; i++) {
            var s = moveName + "_" + i + "_json";
            arr.push(s);
        }
        var res = moveName + "_json";
        var z = new zmovie.ZMovieClip(arr, RES.getRes(res));
        return z;
    };
    /** 博放技能状态的动画(循环播放，最后要调用stopZmove停止 )
    * @param key       动画名称
    * @param num       动画图片数量
    * @param x
    * @param y
    */
    LN.prototype.playZmoveLoop = function (key, num, x, y, scale) {
        if (scale === void 0) { scale = 1; }
        var z = this.getMovieClip(key, num);
        z.x = x;
        z.y = y;
        z.isLoop = true;
        z.scaleX = scale;
        z.scaleY = scale;
        GameLayerManager.gameLayer().effectLayer.addChild(z);
        z.gotoAndPlayLabel("1");
        return z;
    };
    /** 停止播放动画
    */
    LN.prototype.stopZmove = function (z) {
        if (GameLayerManager.gameLayer().effectLayer.contains(z)) {
            GameLayerManager.gameLayer().effectLayer.removeChild(z);
        }
        z.stop();
        z = null;
    };
    /** 博放技能状态的动画
     * @param key       动画名称
     * @param num       动画图片数量
     * @param x
     * @param y
     * @param hander    动画播放完后的回调函数
     */
    LN.prototype.playZmove = function (key, num, x, y, hander, scale, stopName) {
        if (hander === void 0) { hander = null; }
        if (scale === void 0) { scale = 1; }
        if (stopName === void 0) { stopName = "1"; }
        var z = this.getMovieClip(key, num);
        z.endHander = hander;
        z.x = x;
        z.y = y;
        z.isLoop = false;
        z.scaleX = scale;
        z.scaleY = scale;
        GameLayerManager.gameLayer().effectLayer.addChild(z);
        z.addEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.endZmove, this);
        z.gotoAndPlayLabel(stopName);
    };
    /** 飞文字的函数 可以有多排文字 用数组给进 可以是html */
    LN.prototype.flyText = function (str, cor, p) {
        // var g:eui.Group = new eui.Group();
        // g.width = 400;
        // var max = str.length;
        // for( var i=0; i<max; i++)
        // {
        //     var lab:FlyLab = new FlyLab();
        //     lab.y = i * 32;
        //     g.addChild(lab);
        //     if(cor != null )
        //        lab.init(str[i], cor[i]);
        //     else
        //        lab.init(str[i]);
        // }
        if (cor === void 0) { cor = null; }
        if (p === void 0) { p = null; }
        // g.x = GM.gamec.curWidth() / 2;
        // g.y = GM.gamec.curHeight() / 2;
        // g.height = max * 32;
        // if( p)
        //    g.name = String(p.x + "#" + p.y);
        // else
        //    g.name = "0"
        // g.addEventListener(egret.Event.RESIZE,this.hSize,this);
        // if(!GameLayerManager.gameLayer().effectLayer.contains(g))
        //     GameLayerManager.gameLayer().effectLayer.addChild(g);
    };
    /** 将妖侠增加的攻击 生命  物防 法防 生成字符串 并放入数组 */
    LN.prototype.getHeroAddInfoArray = function (arr, atk, hp, def, m) {
        var one = "<font color='#9bff37'> 攻击 + " + atk + "< /font>";
        if (atk < 0) {
            one = "<font color='#ca2600'> 攻击 - " + Math.abs(atk) + "< /font>";
        }
        var two = "<font color='#9bff37'> 生命 + " + hp + "< /font>";
        if (hp < 0) {
            two = "<font color='#ca2600'> 生命 - " + Math.abs(hp) + "< /font>";
        }
        var three = "<font color='#9bff37'> 物防 + " + def + "< /font>";
        if (def < 0) {
            three = "<font color='#ca2600'> 物防 - " + Math.abs(def) + "< /font>";
        }
        var four = "<font color='#9bff37'> 法防 + " + m + "< /font>";
        if (m < 0) {
            four = "<font color='#ca2600'> 法防 - " + Math.abs(m) + "< /font>";
        }
        if (atk != 0) {
            arr.push(one);
        }
        if (hp != 0) {
            arr.push(two);
        }
        if (def != 0) {
            arr.push(three);
        }
        if (m != 0) {
            arr.push(four);
        }
    };
    LN.prototype.endZmove = function (e) {
        var z = e.target;
        z.stop();
        z.removeEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.endZmove, this);
        if (GameLayerManager.gameLayer().effectLayer.contains(z)) {
            GameLayerManager.gameLayer().effectLayer.removeChild(z);
        }
        if (z.endHander) {
            z.endHander.execute();
        }
        z = null;
    };
    LN.prototype.hSize = function (e) {
        var g = e.target;
        g.removeEventListener(egret.Event.RESIZE, this.hSize, this);
        g.anchorOffsetX = g.width * 0.5;
        g.anchorOffsetY = g.height * 0.5;
        g.scaleX = 0;
        g.scaleY = 0;
        egret.Tween.get(g).to({ scaleX: 1.2, scaleY: 1.2 }, 500).call(this.flyOne, this, [g]);
    };
    LN.prototype.flyOne = function (g) {
        egret.Tween.get(g).to({ scaleX: 1, scaleY: 1 }, 200).call(this.flyTwo, this, [g]);
    };
    LN.prototype.flyTwo = function (g) {
        if (g.name == "0") {
            egret.Tween.get(g).wait(1000).to({ y: g.y - 200, alpha: 0 }, 1000).call(this.flyEnd, this, [g]);
        }
        else {
            var s = g.name;
            var arr = s.split("#");
            egret.Tween.get(g).wait(1000).to({ x: Number(arr[0]), y: Number(arr[1]), scaleX: 0, scaleY: 0 }, 500).call(this.flyEnd, this, [g]);
        }
    };
    LN.prototype.flyEnd = function (g) {
        if (GameLayerManager.gameLayer().effectLayer.contains(g)) {
            GameLayerManager.gameLayer().effectLayer.removeChild(g);
        }
    };
    return LN;
}());
__reflect(LN.prototype, "LN");
/**
 * Created by yangsong on 2014/11/22.
 */
var Log = (function () {
    function Log() {
    }
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    Log.trace = function (key) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (GM.debugKey.containsKey(key)) {
            return;
        }
        if (GM.isDebug) {
            optionalParams[0] = "[" + key + "]" + "[DebugLog]" + optionalParams[0];
            // tslint:disable-next-line: no-console
            console.log.apply(console, optionalParams);
        }
    };
    return Log;
}());
__reflect(Log.prototype, "Log");
var MoveNum = (function () {
    function MoveNum() {
        this._oldValue = 0;
        this._cValue = 0;
        this._bAdd = false;
        this._ctime = 0;
        this._endTime = 0;
        this._label = null;
        this._addVelue = 0;
    }
    MoveNum.prototype.play = function (label, num, time) {
        this._label = label;
        this._cValue = num;
        this._endTime = time;
        this._oldValue = Number(this._label.text);
        this._bAdd = true;
        if (this._cValue < this._oldValue) {
            this._bAdd = false;
            this._addVelue = this._oldValue - this._cValue;
        }
        else {
            this._addVelue = this._cValue - this._oldValue;
        }
        this._ctime = egret.getTimer();
        // egret.Ticker.getInstance().register(this.onEnterFrame, this);
    };
    MoveNum.prototype.stop = function () {
        // egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
        this._label.text = String(this._cValue);
    };
    MoveNum.prototype.onEnterFrame = function (advancedTime) {
        var t = egret.getTimer();
        t = t - this._ctime;
        if (t > this._endTime) {
            t = this._endTime;
        }
        var c = Math.ceil(t * this._addVelue / this._endTime);
        if (this._bAdd) {
            this._label.text = String(this._oldValue + c);
        }
        else {
            this._label.text = String(this._oldValue - c);
        }
        if (t == this._endTime) {
            // egret.Ticker.getInstance().unregister(this.onEnterFrame,this);
            LN.getInstance().deleteMoveNum(this);
        }
    };
    return MoveNum;
}());
__reflect(MoveNum.prototype, "MoveNum");
/**
 *   处理消息号的类
 */
var MsgType;
(function (MsgType) {
    var MSG;
    (function (MSG) {
        MSG[MSG["SV_LOGIN"] = 2000] = "SV_LOGIN";
        MSG[MSG["PLAYER_HEART_INFO"] = 2101] = "PLAYER_HEART_INFO";
        MSG[MSG["SV_ADD_BLOCK"] = 3001] = "SV_ADD_BLOCK";
        MSG[MSG["SV_CHAT"] = 3000] = "SV_CHAT";
        MSG[MSG["SV_DEL_ONECHAT"] = 3002] = "SV_DEL_ONECHAT";
        MSG[MSG["SV_DEL_BLOCK"] = 3003] = "SV_DEL_BLOCK";
        // 在这上面添加消息号，注意消息号以逗号结尾
        MSG[MSG["MSG_END"] = 3004] = "MSG_END";
    })(MSG = MsgType.MSG || (MsgType.MSG = {}));
})(MsgType || (MsgType = {}));
/** 划线，实现屏幕的划屏特效 */
var SlideLine = (function (_super) {
    __extends(SlideLine, _super);
    function SlideLine() {
        return _super.call(this) || this;
    }
    /** 画线
     * @param	p1		第一点坐标
     * @param 	p2		第2点坐标
     */
    SlideLine.prototype.drawPoint = function (p1, p2) {
        var _this = this;
        this.alpha = 1;
        var n = (p1.x + p2.x) * 0.5;
        var s = (p1.y + p2.y) * 0.5;
        this.graphics.clear();
        this.graphics.beginFill(0xFFFFFF, 1); // 白色填充
        this.graphics.moveTo(p1.x, p1.y);
        this.graphics.lineTo(n, s - 5);
        this.graphics.lineTo(p2.x, p2.y);
        this.graphics.lineTo(n, s + 5);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.endFill();
        // 加入到效果层
        GameLayerManager.gameLayer().effectLayer.addChild(this);
        // 渐隐后消息
        egret.Tween.get(this).to({ alpha: 0 }, 800).call(function () {
            SlideLineManager.getInstance().backLine(_this);
            if (GameLayerManager.gameLayer().effectLayer.contains(_this)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(_this);
            }
        }, this);
    };
    return SlideLine;
}(egret.Sprite));
__reflect(SlideLine.prototype, "SlideLine");
/** 管理屏幕划痕的管理类 */
var SlideLineManager = (function () {
    function SlideLineManager() {
        this._slideLines = [];
        this._recordPoint = null;
    }
    SlideLineManager.getInstance = function () {
        if (SlideLineManager.instance == null) {
            SlideLineManager.instance = new SlideLineManager();
        }
        return SlideLineManager.instance;
    };
    /** 画线 */
    SlideLineManager.prototype.drawPoint = function (x, y) {
        if (this._recordPoint == null) {
            this._recordPoint = new egret.Point(x, y);
        }
        else {
            // 得到距离
            var distance = App.MathUtils.getDistance(this._recordPoint.x, this._recordPoint.y, x, y);
            if (distance > 50) {
                if (this._slideLines.length > 0) {
                    this._slideLines.pop();
                }
                else {
                    var slide = new SlideLine();
                    var end = new egret.Point(x, y);
                    slide.drawPoint(this._recordPoint, end);
                    this._recordPoint = end;
                }
            }
        }
    };
    /** 画线完成的返回 */
    SlideLineManager.prototype.backLine = function (slide) {
        this._slideLines.push(slide);
    };
    /** 完成划线 */
    SlideLineManager.prototype.endDraw = function () {
        this._recordPoint = null;
    };
    return SlideLineManager;
}());
__reflect(SlideLineManager.prototype, "SlideLineManager");
/**
 *  处理JS字符的静态函数类
 *  主要功能
 *  处理字符串的一些静态函数
 */
var MyUtil;
(function (MyUtil) {
    var ST = (function () {
        function ST() {
        }
        /**
         *  字符串转Uint8的数组
         */
        ST.stringToUint = function (str) {
            var uint = new Uint8Array(str.length);
            for (var i = 0, j = str.length; i < j; ++i) {
                uint[i] = str.charCodeAt(i);
            }
            return uint;
        };
        /**
         *  将uint8数组转换成字符串
         */
        ST.uint8Tostring = function (unit) {
            var encodedString = String.fromCharCode.apply(null, unit);
            var decodedString = decodeURIComponent(encodedString);
            return decodedString;
        };
        ST.strToUTF8 = function (str) {
            if (typeof (str) !== "string") {
                throw new TypeError("toUTF8 function only accept a string as its parameter.");
            }
            var ret = [];
            var c1;
            var c2;
            var c3;
            var cc = 0;
            for (var i = 0, l = str.length; i < l; i++) {
                cc = str.charCodeAt(i);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        c1 = String.fromCharCode((cc >>> 6) | 0xC0);
                        c2 = String.fromCharCode((cc & 0x3F) | 0x80);
                        ret.push(c1, c2);
                    }
                    else {
                        c1 = String.fromCharCode((cc >>> 12) | 0xE0);
                        c2 = String.fromCharCode(((cc >>> 6) & 0x3F) | 0x80);
                        c3 = String.fromCharCode((cc & 0x3F) | 0x80);
                        ret.push(c1, c2, c3);
                    }
                }
                else {
                    ret.push(str[i]);
                }
            }
            return ret.join("");
        };
        return ST;
    }());
    MyUtil.ST = ST;
    __reflect(ST.prototype, "MyUtil.ST");
})(MyUtil || (MyUtil = {}));
/** 将大数(BigNum),表示为数+英文符号 */
var UnitUtil = (function () {
    function UnitUtil() {
        /** 用来表示单位的数字 */
        this._tag = ["K", "M", "B", "t", "q", "Q", "s", "S", "o", "n", "d", "U", "D", "T", "Qt", "Qd", "Sd", "St", "O", "N", "v", "c"];
        // _tag:Array<string> = ["千", "百万", "十亿", "兆", "千兆", "百京", "十垓", "秭", "千秭", "百穰", "十穰", "沟", "千沟", "百涧", "十正", "载", "千载", "百极", "O", "N", "v", "c"];
        this._low = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        this._cap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        this.unitKey = this._tag.slice(0);
        this.comArray(this._tag, this._low);
        this.comArray(this._tag, this._cap);
        this._r = [];
        var max = this.unitKey.length;
        for (var i = 0; i < max; i++) {
            this._r.push(3 * (i + 1));
        }
    }
    UnitUtil.getInstance = function () {
        if (UnitUtil.instance == null) {
            UnitUtil.instance = new UnitUtil();
        }
        return UnitUtil.instance;
    };
    /** 向上去整 */
    UnitUtil.prototype.easyNumberCeil = function (e) {
        if (!e && e != 0) {
            return "-";
        }
        var i = new BigNum(e);
        if (i._e < 3) {
            var n = i._n * Math.pow(10, i._e);
            return Math.ceil(n).toString();
        }
        var max = this.unitKey.length;
        for (var k = 0; k < max; k++) {
            var a = i._e - this._r[k];
            if (3 > a) {
                var n = i._n * Math.pow(10, a);
                if (0 == a) {
                    n = Math.floor(100 * n) / 100;
                    return n + this.unitKey[k];
                }
                else if (1 == a) {
                    n = Math.floor(10 * n) / 10;
                    return parseFloat(n.toFixed(1)) + this.unitKey[k];
                }
                else {
                    n = Math.floor(n);
                    return parseFloat(n.toFixed(0)) + this.unitKey[k];
                }
            }
        }
        return i.toString() + this.unitKey[this.unitKey.length - 1];
    };
    /** 数 */
    UnitUtil.prototype.easyNumber = function (e) {
        if (!e && e != 0) {
            return;
        }
        var i = new BigNum(e);
        if (i._e < 3) {
            var n = i._n * Math.pow(10, i._e);
            return Math.round(n).toString();
        }
        var max = this.unitKey.length;
        for (var k = 0; k < max; k++) {
            var a = i._e - this._r[k];
            if (3 > a) {
                var n = i._n * Math.pow(10, a);
                if (0 == a) {
                    n = Math.floor(100 * n) / 100;
                    return n + this.unitKey[k];
                }
                else if (1 == a) {
                    n = Math.floor(10 * n) / 10;
                    return parseFloat(n.toFixed(1)) + this.unitKey[k];
                }
                else {
                    n = Math.floor(n);
                    return parseFloat(n.toFixed(0)) + this.unitKey[k];
                }
            }
        }
    };
    /** 得到大数登机 */
    UnitUtil.prototype.getUnitLevel = function (e) {
        if (!e && e != 0) {
            return "-";
        }
        var i = new BigNum(e);
        if (i._e < 3) {
            return "";
        }
        for (var n = 0; n < this.unitKey.length; n++) {
            var s = i._e - this._r[n];
            if (3 > s) {
                return this.unitKey[n];
            }
        }
    };
    /** 组合数组,并把值放入unitkey */
    UnitUtil.prototype.comArray = function (res, des) {
        var max = res.length;
        for (var i = 0; i < max; i++) {
            var s = res[i];
            for (var _i = 0, des_1 = des; _i < des_1.length; _i++) {
                var iterator = des_1[_i];
                this.unitKey.push(s + iterator);
            }
        }
    };
    return UnitUtil;
}());
__reflect(UnitUtil.prototype, "UnitUtil");
/**
 * 闪烁特效类
 */
var Blink = (function (_super) {
    __extends(Blink, _super);
    /*** @param target 目标
    * @param time 闪啊闪的时间
    * @isAuto 是否立即执行，默认是ture，也可以设置false，外部调用start方法
    */
    function Blink(target, time, isAuto) {
        if (isAuto === void 0) { isAuto = true; }
        var _this = _super.call(this) || this;
        _this._target = target;
        _this._time = time;
        if (isAuto) {
            _this.start();
        }
        return _this;
    }
    Blink.prototype.start = function () {
        this._currTime = egret.getTimer();
        this._target.addEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
    };
    Blink.prototype.runDown = function (e) {
        this._target.alpha -= 0.045;
        if (this.checkOver()) {
            return;
        }
        if (this._target.alpha <= 0.6) {
            this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
            this._target.addEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
        }
    };
    Blink.prototype.runUp = function (e) {
        this._target.alpha += 0.045;
        if (this.checkOver()) {
            return;
        }
        if (this._target.alpha >= 1) {
            this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
            this._target.addEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
        }
    };
    Blink.prototype.checkOver = function () {
        var nowTime = egret.getTimer();
        if (nowTime - this._currTime >= this._time) {
            this.destroy();
            return true;
        }
        return false;
    };
    Blink.prototype.destroy = function () {
        this._target.alpha = 1;
        this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runDown, this);
        this._target.removeEventListener(egret.Event.ENTER_FRAME, this.runUp, this);
        this.dispatchEventWith(egret.Event.COMPLETE, false, this._target);
        this._target = null;
    };
    return Blink;
}(egret.EventDispatcher));
__reflect(Blink.prototype, "Blink");
/**
  * tips特效汇总
  * TipsUtils.showTipsDownToUp()
  */
var TipsUtils;
(function (TipsUtils) {
    // 从下到上弹出
    function showTipsDownToUp(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var dw = GM.gamec.curWidth();
        var dh = GM.gamec.curHeight();
        var effectTips = new egret.TextField();
        effectTips.size = 24;
        effectTips.y = dh * 0.4;
        if (isWarning) {
            effectTips.textColor = GM.gamec.TEXT_COLORS.red;
        }
        else {
            effectTips.textColor = GM.gamec.TEXT_COLORS.green;
        }
        effectTips.alpha = 0;
        // effectTips.text = str;
        effectTips.textFlow = (new egret.HtmlTextParser()).parser(str);
        effectTips.fontFamily = "黑体";
        effectTips.strokeColor = 0x000000;
        effectTips.x = dw / 2 - effectTips.width / 2;
        effectTips.stroke = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;
        if (!GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
            GameLayerManager.gameLayer().effectLayer.addChild(effectTips);
        }
        var onComplete2 = function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(effectTips);
                effectTips = null;
            }
        };
        var onComplete1 = function () {
            egret.Tween.get(effectTips).to({ alpha: 0 }, 2000).call(onComplete2, this);
        };
        effectTips.visible = true;
        egret.Tween.get(effectTips).to({ y: effectTips.y - 120, alpha: 1 }, 800, egret.Ease.backOut).call(onComplete1, this);
    }
    TipsUtils.showTipsDownToUp = showTipsDownToUp;
    // 从左至右 或者 从右至左
    function showTipsLeftOrRight(str, isWarning, isFromeLeft) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        if (isFromeLeft === void 0) { isFromeLeft = true; }
        var dw = GM.gamec.curHeight();
        var dh = GM.gamec.curWidth();
        var effectTips = new egret.TextField();
        effectTips.size = 24;
        effectTips.y = dh * 0.5;
        if (isWarning) {
            effectTips.textColor = GM.gamec.TEXT_COLORS.red;
        }
        else {
            effectTips.textColor = GM.gamec.TEXT_COLORS.green;
        }
        effectTips.alpha = 0;
        effectTips.textFlow = (new egret.HtmlTextParser()).parser(str);
        // effectTips.text = str;
        effectTips.fontFamily = "黑体";
        effectTips.strokeColor = 0x000000;
        if (isFromeLeft) {
            effectTips.x = -effectTips.width;
        }
        else {
            effectTips.x = dw;
        }
        effectTips.stroke = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;
        if (!GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
            GameLayerManager.gameLayer().effectLayer.addChild(effectTips);
        }
        if (isFromeLeft) {
            egret.Tween.get(effectTips).to({ x: dw / 2 - effectTips.width / 2 - 50, alpha: 1 }, 300, egret.Ease.sineInOut);
        }
        else {
            egret.Tween.get(effectTips).to({ x: dh / 2 - effectTips.width / 2 + 50, alpha: 1 }, 300, egret.Ease.sineInOut);
        }
        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(effectTips).to({ x: effectTips.x + 100 }, 500);
            }
            else {
                egret.Tween.get(effectTips).to({ x: effectTips.x - 100 }, 500);
            }
        }, this, 300);
        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(effectTips).to({ x: dw }, 300, egret.Ease.sineIn);
            }
            else {
                egret.Tween.get(effectTips).to({ x: -effectTips.width }, 300, egret.Ease.sineIn);
            }
        }, this, 800);
        egret.setTimeout(function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(effectTips);
                effectTips = null;
            }
        }, this, 1100);
    }
    TipsUtils.showTipsLeftOrRight = showTipsLeftOrRight;
    // 从里到外
    function showTipsFromCenter(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var dw = GM.gamec.curHeight();
        var dh = GM.gamec.curWidth();
        var effectTips = new egret.TextField();
        effectTips.size = 24;
        effectTips.y = dh / 2;
        if (isWarning) {
            effectTips.textColor = GM.gamec.TEXT_COLORS.red;
        }
        else {
            effectTips.textColor = GM.gamec.TEXT_COLORS.green;
        }
        effectTips.alpha = 0;
        // effectTips.text = str;
        effectTips.textFlow = (new egret.HtmlTextParser()).parser(str);
        effectTips.fontFamily = "黑体";
        effectTips.strokeColor = 0x000000;
        effectTips.x = dw / 2;
        effectTips.stroke = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;
        // effectTips.anchorX = 0.5;
        // effectTips.anchorY = 0.5;
        AnchorUtil.setAnchorX(effectTips, 0.5);
        AnchorUtil.setAnchorY(effectTips, 0.5);
        effectTips.scaleX = 0;
        effectTips.scaleY = 0;
        if (!GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
            GameLayerManager.gameLayer().effectLayer.addChild(effectTips);
        }
        var onComplete2 = function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(effectTips);
                effectTips = null;
            }
        };
        egret.Tween.get(effectTips).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        egret.setTimeout(function () {
            egret.Tween.get(effectTips).to({ alpha: 0 }, 500).call(onComplete2, this);
        }, this, 1000);
    }
    TipsUtils.showTipsFromCenter = showTipsFromCenter;
    // 从外到里
    function showTipsBigToSmall(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var effectTips = new egret.TextField();
        var dw = GM.gamec.curHeight();
        var dh = GM.gamec.curWidth();
        effectTips.size = 24;
        effectTips.y = dh / 2;
        if (isWarning) {
            effectTips.textColor = GM.gamec.TEXT_COLORS.red;
        }
        else {
            effectTips.textColor = GM.gamec.TEXT_COLORS.green;
        }
        effectTips.alpha = 0;
        // effectTips.text = str;
        effectTips.textFlow = (new egret.HtmlTextParser()).parser(str);
        effectTips.fontFamily = "黑体";
        effectTips.strokeColor = 0x000000;
        effectTips.x = dw / 2;
        effectTips.stroke = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;
        AnchorUtil.setAnchorX(effectTips, 0.5);
        AnchorUtil.setAnchorY(effectTips, 0.5);
        effectTips.scaleX = 4;
        effectTips.scaleY = 4;
        if (!GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
            GameLayerManager.gameLayer().effectLayer.addChild(effectTips);
        }
        var onComplete2 = function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
                GameLayerManager.gameLayer().effectLayer.removeChild(effectTips);
                effectTips = null;
            }
        };
        egret.Tween.get(effectTips).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        egret.setTimeout(function () {
            egret.Tween.get(effectTips).to({ alpha: 0 }, 500).call(onComplete2, this);
        }, this, 1000);
    }
    TipsUtils.showTipsBigToSmall = showTipsBigToSmall;
    // 从右至左 走马灯
    function showTipsNotice(str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var effsprite = new egret.Sprite();
        var effectTips = new egret.TextField();
        var dw = GM.gamec.curHeight();
        var dh = GM.gamec.curWidth();
        effectTips.size = 24;
        effectTips.y = dh * 0.2;
        if (isWarning) {
            effectTips.textColor = GM.gamec.TEXT_COLORS.red;
        }
        else {
            effectTips.textColor = GM.gamec.TEXT_COLORS.green;
        }
        // effectTips.alpha = 0;
        effectTips.textFlow = (new egret.HtmlTextParser()).parser(str);
        // effectTips.text = str;
        effectTips.fontFamily = "黑体";
        effectTips.strokeColor = 0x000000;
        effectTips.x = dw;
        effectTips.stroke = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;
        if (!GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
            effsprite.graphics.beginFill(0x000000, 0.4);
            effsprite.graphics.drawRect(0, (dh * 0.2) - 7, 960, 40);
            effsprite.graphics.endFill();
            GameLayerManager.gameLayer().effectLayer.addChild(effsprite);
            GameLayerManager.gameLayer().effectLayer.addChild(effectTips);
        }
        egret.Tween.get(effectTips).to({ x: -effectTips.width }, 10000);
        egret.setTimeout(function () {
            if (GameLayerManager.gameLayer().effectLayer.contains(effectTips)) {
                effsprite.graphics.clear();
                GameLayerManager.gameLayer().effectLayer.removeChild(effectTips);
                GameLayerManager.gameLayer().effectLayer.removeChild(effsprite);
                effectTips = null;
            }
        }, this, 10000);
    }
    TipsUtils.showTipsNotice = showTipsNotice;
})(TipsUtils || (TipsUtils = {}));
var one;
(function (one) {
    var DOMRoot = (function () {
        function DOMRoot() {
        }
        /**
         * 初始化 DOM root，调用一次即可
         */
        DOMRoot.initDOMRoot = function (stage) {
            var _this = this;
            var rootDiv = document.getElementById("egretDOMRoot");
            if (rootDiv == null) {
                var player = document.getElementsByClassName("egret-player")[0];
                rootDiv = document.createElement("div");
                initElementStyle(rootDiv);
                rootDiv.setAttribute("id", "egretDOMRoot");
                player.appendChild(rootDiv);
                DOMRoot.tempStage = stage;
                var onResize = function () {
                    // tslint:disable-next-line: no-shadowed-variable
                    var player = document.getElementsByClassName("egret-player")[0];
                    var canvas = player.getElementsByTagName("canvas")[0];
                    var playerRect = player.getBoundingClientRect();
                    var canvasRect = canvas.getBoundingClientRect();
                    var shouldRotate = false;
                    var orientation = _this.tempStage.orientation;
                    if (orientation != egret.OrientationMode.AUTO) {
                        shouldRotate = orientation != egret.OrientationMode.PORTRAIT && playerRect.height > playerRect.width
                            || orientation == egret.OrientationMode.PORTRAIT && playerRect.width > playerRect.height;
                    }
                    var domScaleX;
                    var domScaleY;
                    if (shouldRotate) {
                        domScaleX = canvasRect.width / canvas.height;
                        domScaleY = canvasRect.height / canvas.width;
                    }
                    else {
                        domScaleX = canvasRect.width / canvas.width;
                        domScaleY = canvasRect.height / canvas.height;
                    }
                    rootDiv.style.left = canvas.style.left;
                    rootDiv.style.top = canvas.style.top;
                    // rootDiv.style.width = DOMRoot.tempStage.stageWidth + "px";
                    // rootDiv.style.height = DOMRoot.tempStage.stageHeight + "px";
                    rootDiv.style.transformOrigin = "0% 0% 0px";
                    rootDiv.style.transform = canvas.style.transform + " scale(" + 1 + "," + 1 + ")";
                };
                this.tempStage.addEventListener(egret.Event.RESIZE, onResize, this);
                onResize();
            }
        };
        DOMRoot.getDOMRoot = function () {
            var rootDiv = document.getElementById("egretDOMRoot");
            if (true) {
                if (rootDiv == null) {
                    // tslint:disable-next-line: no-console
                    console.error("请先调用 initDOMRoot 初始化");
                }
            }
            return rootDiv;
        };
        return DOMRoot;
    }());
    __reflect(DOMRoot.prototype, "DOMRoot");
    function initElementStyle(element) {
        element.style.position = "absolute";
        element.style.border = "0";
        element.style.left = "0px";
        element.style.top = "0px";
    }
    /**
     * DOM 元件和 egret 显示对象的映射。 egret 显示对象属性的修改会同时改变 DOM 元件属性
     */
    // tslint:disable-next-line: max-classes-per-file
    var DOMNode = (function () {
        function DOMNode() {
            this.lastMatrix = new egret.Matrix();
            this.lastWidth = 0;
            this.lastHeight = 0;
            this.node = document.createElement("div");
            initElementStyle(this.node);
        }
        /**
         * 将 DOM 节点和 egret 对象映射
         */
        DOMNode.prototype.mapDisplayObject = function (displayObject) {
            this.dp = displayObject;
        };
        /**
         * 交换节点的位置
         */
        DOMNode.prototype.swapDom = function (dom1, dom2) {
            var tempDiv = document.createElement("tempDiv");
            dom1.parentNode.insertBefore(tempDiv, dom1);
            dom2.parentNode.insertBefore(dom1, dom2);
            tempDiv.parentNode.insertBefore(dom2, tempDiv);
            tempDiv.parentNode.removeChild(tempDiv);
        };
        /**
         * 显示 DOM 节点
         */
        DOMNode.prototype.show = function () {
            DOMRoot.initDOMRoot(this.dp.stage);
            var rootDiv = DOMRoot.getDOMRoot();
            rootDiv.appendChild(this.node);
        };
        /**
         * 隐藏 DOM 节点
         */
        DOMNode.prototype.hide = function () {
            var rootDiv = DOMRoot.getDOMRoot();
            if (rootDiv && rootDiv.parentNode) {
                rootDiv.parentNode.removeChild(rootDiv);
            }
        };
        /**
         * 绑定一个 DOM 元件
         * @element DOM 元件，不要修改此元件的 style 的位置、旋转、缩放、边框等属性
         */
        DOMNode.prototype.bind = function (element) {
            this.unbind();
            this.element = element;
            this.element.style.width = "100%";
            this.element.style.height = "100%";
            initElementStyle(this.element);
            this.node.appendChild(element);
        };
        /**
         * 解绑 DOM 元件
         */
        DOMNode.prototype.unbind = function () {
            if (this.element && this.element.parentNode == this.node) {
                this.node.removeChild(this.element);
            }
            this.element = null;
        };
        DOMNode.prototype.updatePosition = function () {
            var displayObject = this.dp;
            if (displayObject.stage == null) {
                return;
            }
            var isVisible = true;
            var p = displayObject;
            while (p && p != displayObject.stage) {
                if (!p.visible || p.alpha == 0) {
                    isVisible = false;
                    break;
                }
                p = p.parent;
            }
            if (!isVisible) {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                    return;
                }
            }
            else {
                if (this.element && this.element.parentNode == null) {
                    this.node.appendChild(this.element);
                }
            }
            var matrix = displayObject.$getConcatenatedMatrix();
            // let matrix = displayObject.$renderNode.renderMatrix;
            if (this.lastMatrix.a != matrix.a
                || this.lastMatrix.b != matrix.b
                || this.lastMatrix.c != matrix.c
                || this.lastMatrix.d != matrix.d
                || this.lastMatrix.tx != matrix.tx
                || this.lastMatrix.ty != matrix.ty) {
                var transformKey = egret["web"]["getPrefixStyleName"]("transform");
                this.node.style.transformOrigin = "0% 0% 0px";
                this.node.style[transformKey] = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.tx + "," + matrix.ty + ")";
                this.lastMatrix.a = matrix.a;
                this.lastMatrix.b = matrix.b;
                this.lastMatrix.c = matrix.c;
                this.lastMatrix.d = matrix.d;
                this.lastMatrix.tx = matrix.tx;
                this.lastMatrix.ty = matrix.ty;
            }
            var width = displayObject.width;
            if (this.lastWidth != width) {
                this.node.style.width = width + "px";
                this.lastWidth = width;
            }
            var height = displayObject.height;
            if (this.lastHeight != height) {
                this.node.style.height = height + "px";
                this.lastHeight = height;
            }
        };
        return DOMNode;
    }());
    one.DOMNode = DOMNode;
    __reflect(DOMNode.prototype, "one.DOMNode");
})(one || (one = {}));
/*
  * 游戏配置文件
  * All Rights Reserved.
  * 存放游戏的配置数据
  * 比如：游戏界面尺寸、分享随机百分比、获取系统数据
  */
var GameConfigManager = (function () {
    function GameConfigManager() {
        // 全局字体颜色表--可以扩展
        this.TEXT_COLORS = {
            black: 0x000000,
            blue: 0x1a94d7,
            green: 0x00e500,
            grayblue: 0x3fcbcc,
            golden: 0xFFD700,
            white: 0xFFFFFF,
            milkWhite: 0xfbf1af,
            grayWhite: 0x808080,
            yellow: 0xffff00,
            lightYellow: 0xffd375,
            orangeYellow: 0xf4a445,
            red: 0xd91d36,
            purple: 0xde3b40,
            pink: 0xFF3030,
            ligthRed: 0xD115A8,
        };
        // 全局字体大小表--可以扩展
        this.LABEL_FONT_SIZE = {
            bigSize: 36,
            littleSize: 12,
            middleSize: 18,
            normalSize: 24,
        };
    }
    // 获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook
    GameConfigManager.prototype.systemType = function () {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            return;
        }
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        }
        else if (("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        }
        else if (("" + ua.match(/android/i)) == "android") {
            return "android";
        }
        else if (("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        }
        else if (("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        }
        else if (("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        }
        else if (("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        }
        else {
            Log.trace("debug", "未知系统类型");
        }
    };
    GameConfigManager.prototype.init = function () {
        var _player = document.getElementsByClassName("egret-player")[0];
        this.originWidth = Number(_player.getAttribute("data-content-width"));
        this.originHeight = Number(_player.getAttribute("data-content-height"));
    };
    // 当前舞台
    GameConfigManager.prototype.curStage = function () {
        return egret.MainContext.instance.stage;
    };
    // 当前游戏宽度
    GameConfigManager.prototype.curWidth = function () {
        return egret.MainContext.instance.stage.stageWidth;
    };
    // 当前游戏宽度
    GameConfigManager.prototype.curHeight = function () {
        return egret.MainContext.instance.stage.stageHeight;
    };
    // 原始游戏宽度
    GameConfigManager.prototype.getOriginWidth = function () {
        return this.originWidth;
    };
    // 原始游戏高度
    GameConfigManager.prototype.getOriginHeight = function () {
        return this.originHeight;
    };
    return GameConfigManager;
}());
__reflect(GameConfigManager.prototype, "GameConfigManager");
var one;
(function (one) {
    var WebVideo = (function (_super) {
        __extends(WebVideo, _super);
        function WebVideo() {
            var _this = _super.call(this) || this;
            _this.video = document.createElement("video");
            _this.video.autoplay = true;
            _this.video.controls = true;
            _this.bind(_this.video);
            return _this;
        }
        Object.defineProperty(WebVideo.prototype, "src", {
            get: function () {
                return this._src;
            },
            set: function (v) {
                this._src = v;
                this.video.src = v;
            },
            enumerable: true,
            configurable: true
        });
        WebVideo.prototype.contentFullScreen = function () {
            var _cssText = "position: absolute; border: 0px; left: 0px; top: 0px; object-fit: contain;";
            var _player = document.getElementsByClassName("egret-player")[0];
            var _canvasNode = _player.getElementsByTagName("canvas")[0];
            this.video.width = _canvasNode.width;
            this.video.height = _canvasNode.height;
            this.video.style.cssText = _cssText;
        };
        WebVideo.prototype.enableAutoPlay = function (_b) {
            this.video.autoplay = _b;
        };
        WebVideo.prototype.enableControls = function (_b) {
            this.video.controls = _b;
        };
        WebVideo.prototype.swapHierarchy = function () {
            var _player = document.getElementsByClassName("egret-player")[0];
            var _canvasNode = _player.getElementsByTagName("canvas")[0];
            var _domNode = this.getDomNode();
            var _rootDiv = document.getElementById("egretDOMRoot");
            _domNode.swapDom(_rootDiv, _canvasNode);
        };
        return WebVideo;
    }(one.WebNode));
    one.WebVideo = WebVideo;
    __reflect(WebVideo.prototype, "one.WebVideo");
})(one || (one = {}));
// this.webNode = new one.WebView();
// this.webNode.src = "https://media.w3.org/2010/05/sintel/trailer.mp4?autoPlay=true";
// this.webNode.width = this.width;
// this.webNode.height = this.height;
// this.webNode.x = 0;
// this.webNode.y = 0;
// this.addChild(this.webNode);
var one;
(function (one) {
    var WebView = (function (_super) {
        __extends(WebView, _super);
        function WebView() {
            var _this = _super.call(this) || this;
            _this.iframe = document.createElement("iframe");
            _this.bind(_this.iframe);
            return _this;
        }
        Object.defineProperty(WebView.prototype, "src", {
            get: function () {
                return this._src;
            },
            set: function (v) {
                this._src = v;
                this.iframe.src = v;
            },
            enumerable: true,
            configurable: true
        });
        WebView.prototype.setAllowFullscreen = function (v) {
            this.iframe.allowFullscreen = v;
        };
        return WebView;
    }(one.WebNode));
    one.WebView = WebView;
    __reflect(WebView.prototype, "one.WebView");
})(one || (one = {}));
/**
 * Created by ASUS on 15-2-9.
 */
var zmovie;
(function (zmovie) {
    var LargeImage = (function (_super) {
        __extends(LargeImage, _super);
        function LargeImage(imgArr, libObj, libName) {
            var _this = _super.call(this) || this;
            _this.setObject(imgArr, libObj, libName);
            return _this;
        }
        LargeImage.prototype.setObject = function (imgArr, libObj, libName) {
            if (this.libObj == libObj && this.libName == libName) {
                return;
            }
            this.libName = libName;
            this.libObj = libObj;
            zmovie.Util.clearDisposeDisplay(this);
            var arr = zmovie.Util.getTextureArrByName(imgArr, libObj, libName);
            var len = arr.length;
            for (var i = len - 1; i >= 0; i--) {
                var o = arr[i];
                var img = new egret.Bitmap();
                img.touchEnabled = false;
                img.texture = o.t;
                img.x = o.x / libObj.scale;
                img.y = o.y / libObj.scale;
                this.addChild(img);
            }
        };
        return LargeImage;
    }(egret.DisplayObjectContainer));
    zmovie.LargeImage = LargeImage;
    __reflect(LargeImage.prototype, "zmovie.LargeImage");
})(zmovie || (zmovie = {}));
var zmovie;
(function (zmovie) {
    var Util = (function () {
        function Util() {
        }
        Util.clearDisposeDisplay = function (d) {
            try {
                var tmpD = void 0;
                for (var i = d.numChildren - 1; i >= 0; i--) {
                    tmpD = d.getChildAt(i);
                    d.removeChild(tmpD);
                }
            }
            catch (err) { }
        };
        Util.getTextureArrByName = function (imgArr, libObj, libName) {
            var ret = [];
            var t = Util.getTextureByName(imgArr, libName);
            if (null == t) {
                var arr = libObj.clipping[libName];
                if (null != arr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        t = Util.getTextureByName(imgArr, arr[i].name);
                        if (null != t) {
                            ret.push({ t: t, x: arr[i].x, y: arr[i].y });
                        }
                        else {
                            return ret;
                        }
                    }
                }
                return ret;
            }
            ret.push({ t: t, x: 0, y: 0 });
            return ret;
        };
        Util.getTextureByName = function (imgArr, libName) {
            var t = null;
            try {
                t = RES.getRes(imgArr + "." + libName);
            }
            catch (err) { }
            try {
                if (null == t) {
                    var arr = imgArr;
                    for (var i = arr.length - 1; i >= 0; i--) {
                        var t2 = RES.getRes(arr[i] + "." + libName);
                        if (null != t2) {
                            return t2;
                        }
                    }
                }
            }
            catch (err) { }
            return t;
        };
        return Util;
    }());
    zmovie.Util = Util;
    __reflect(Util.prototype, "zmovie.Util");
})(zmovie || (zmovie = {}));
/**
 * Created by zringhost on 14-12-14.
 */
var zmovie;
(function (zmovie) {
    var ZAssetManager = (function () {
        function ZAssetManager() {
        }
        return ZAssetManager;
    }());
    zmovie.ZAssetManager = ZAssetManager;
    __reflect(ZAssetManager.prototype, "zmovie.ZAssetManager");
})(zmovie || (zmovie = {}));
/**
 * Created by ASUS on 15-2-9.
 */
var zmovie;
(function (zmovie) {
    var ZImage = (function (_super) {
        __extends(ZImage, _super);
        function ZImage(t) {
            var _this = _super.call(this) || this;
            _this.img = new egret.Bitmap();
            _this.addChild(_this.img);
            _this.setTexture(t);
            return _this;
        }
        ZImage.prototype.setTexture = function (t) {
            this.img.texture = t;
        };
        ZImage.prototype.setScale = function (s) {
            this.img.scaleX = 1 / s;
            this.img.scaleY = 1 / s;
        };
        return ZImage;
    }(egret.DisplayObjectContainer));
    zmovie.ZImage = ZImage;
    __reflect(ZImage.prototype, "zmovie.ZImage");
})(zmovie || (zmovie = {}));
/**
 * Created by zringhost on 14-12-14.
 */
var zmovie;
(function (zmovie) {
    var ZMovieClip = (function (_super) {
        __extends(ZMovieClip, _super);
        function ZMovieClip(imgArr, libObj, mcName, scale_) {
            if (mcName === void 0) { mcName = null; }
            if (scale_ === void 0) { scale_ = 1; }
            var _this = _super.call(this) || this;
            _this.isPlay = false;
            _this.endHander = null;
            _this.setMovieObject(imgArr, libObj, mcName, scale_);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onDestory, _this);
            return _this;
        }
        ZMovieClip.getFrameMovieObject = function (o, frameI) {
            if (null == o.f_arr) {
                o.f_arr = [];
            }
            o.f_arr.unshift(o);
            return o;
        };
        ZMovieClip.prototype.onDestory = function () {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDestory, this);
            this.disposeLayerImg();
        };
        ZMovieClip.prototype.getTotalFrame = function () {
            return this.totalFrame;
        };
        ZMovieClip.prototype.getCurrPlayLabel = function () {
            return this.currPlaylabel;
        };
        ZMovieClip.prototype.getCurrFrame = function () {
            return this.currFrame;
        };
        ZMovieClip.prototype.getIsPlay = function () {
            return this.isPlay;
        };
        ZMovieClip.prototype.setTimeScale = function (num) {
            if (0 >= num) {
                num = 0.01;
            }
            this._timeScale = num;
            if (null != this.mcObj) {
                this.frameTime = this.mcObj.frameTime / num;
            }
            for (var i = this.numChildren - 1; i >= 0; i--) {
                var mc = null;
                if (this.getChildAt(i) instanceof ZMovieClip) {
                    mc = this.getChildAt(i);
                }
                if (null != mc) {
                    mc.setTimeScale(num);
                }
            }
        };
        ZMovieClip.prototype.getTimeScale = function () {
            return this._timeScale;
        };
        ZMovieClip.prototype.getLabels = function () {
            return this.mcObj.frameLabels;
        };
        ZMovieClip.prototype.getIsExistLabel = function (lName) {
            if (null != this.mcObj.frameLabels && null != this.mcObj.frameLabels[lName]) {
                return true;
            }
            return false;
        };
        ZMovieClip.prototype.getCurrLabelObj = function () {
            var labelObj = this.getLabels();
            if (null != labelObj) {
                for (var name_1 in labelObj) {
                    if (this.currFrame >= labelObj[name_1].begin) {
                        if (null != labelObj[name_1].end && this.currFrame >= labelObj[name_1].end) {
                            continue;
                        }
                        return labelObj[name_1];
                    }
                }
            }
            return null;
        };
        ZMovieClip.prototype.gotoAndPlayLabel = function (label, isPlayToEnd) {
            if (isPlayToEnd === void 0) { isPlayToEnd = false; }
            var labelObj;
            if (null != this.mcObj.frameLabels) {
                labelObj = this.mcObj.frameLabels[label];
                if (null != labelObj) {
                    this.currPlaylabel = label;
                    this.beginFrame = labelObj.begin;
                    if (null == labelObj.end || isPlayToEnd) {
                        this.endFrame = -1;
                    }
                    else {
                        this.endFrame = labelObj.end - 1;
                    }
                    this.gotoAndPlay(this.beginFrame);
                }
                else {
                    this.beginFrame = 0;
                    this.endFrame = -1;
                    this.currPlaylabel = null;
                    this.gotoAndPlay(this.beginFrame);
                }
                this.dispatchEventWith(ZMovieClip.EVENT_GOTOANDPLAYLABEL, false, label);
            }
            return labelObj;
        };
        ZMovieClip.prototype.disposeLayerImg = function () {
            if (null != this.layerArr) {
                for (var l = this.layerArr.length - 1; l >= 0; l--) {
                    var img = this.layerArr[l].img;
                    if (null != img) {
                        if (null != img.parent) {
                            img.parent.removeChild(img);
                        }
                    }
                    var mc = this.layerArr[l].mc;
                    if (null != mc) {
                        if (null != mc.parent) {
                            mc.parent.removeChild(mc);
                        }
                    }
                    var li = this.layerArr[l].li;
                    if (null != li) {
                        if (null != li.parent) {
                            li.parent.removeChild(li);
                        }
                    }
                }
            }
        };
        ZMovieClip.prototype.setMovieObject = function (imgArr, libObj, mcName, scale_) {
            if (scale_ === void 0) { scale_ = 1; }
            if (null == mcName) {
                mcName = "root";
            }
            this.imgArr = imgArr;
            this.libObj = libObj;
            this._mcName = mcName;
            this.mcObj = libObj.mcObjs[mcName];
            this.areaObj = this.mcObj.areaObject;
            this.libScale = 1;
            this._direction = 1;
            this.fmObj = this.mcObj.frameMoveObj;
            this.currFrame = -1;
            this.totalFrame = this.mcObj.totalFrame;
            this.frameTime = this.mcObj.frameTime;
            this.beginFrame = 0;
            this.endFrame = -1;
            this._timeScale = 1;
            this.isLoop = true;
            this.disposeLayerImg();
            this.parentCFOObj = {};
            this.layerArr = new Array();
            this.currArea = null;
            var arr = this.mcObj.layers;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                var frameArr = new Array();
                var fArr = arr[i];
                var fLen = fArr.length;
                var pcfo = null;
                var k = void 0;
                for (var j = 0; j < fLen; j++) {
                    var cfo = fArr[j];
                    var obj3d = null;
                    if (null == cfo.matrix) {
                        var frameNum = cfo.frameNum;
                        if (null == cfo.libName && null != pcfo) {
                            if (null != cfo.x) {
                                cfo.libName = pcfo.libName;
                            }
                        }
                        if (null == cfo.a) {
                            cfo.a = 1;
                        }
                        if (null == cfo.b) {
                            cfo.b = 0;
                        }
                        if (null == cfo.c) {
                            cfo.c = 0;
                        }
                        if (null == cfo.d) {
                            cfo.d = 1;
                        }
                        if (null == cfo.al) {
                            cfo.al = 1;
                        }
                        if (null == cfo.cx) {
                            cfo.cx = 0;
                        }
                        else {
                            cfo.cx *= -1;
                        }
                        if (null == cfo.cy) {
                            cfo.cy = 0;
                        }
                        else {
                            cfo.cy *= -1;
                        }
                        if (null == cfo.r) {
                            cfo.r = 0;
                        }
                        if (null == cfo.sx) {
                            cfo.sx = 1;
                        }
                        if (null == cfo.sy) {
                            cfo.sy = 1;
                        }
                        if (null != cfo.scaleX || null != cfo.scaleY || null != cfo.scaleZ || null != cfo.rotationX || null != cfo.rotationY || null != cfo.rotationZ) {
                            obj3d = {};
                            obj3d.scaleX = cfo.scaleX;
                            obj3d.scaleY = cfo.scaleY;
                            obj3d.scaleZ = cfo.scaleZ;
                            obj3d.x = cfo.x;
                            obj3d.y = cfo.y;
                            obj3d.cx = cfo.cx;
                            obj3d.cy = cfo.cy;
                            cfo.cx = 0;
                            cfo.cy = 0;
                            cfo.x = 0;
                            cfo.y = 0;
                            obj3d.rotationX = cfo.rotationX;
                            obj3d.rotationY = cfo.rotationY;
                            obj3d.rotationZ = cfo.rotationZ;
                            if (null == obj3d.scaleX) {
                                obj3d.scaleX = 1;
                            }
                            if (null == obj3d.scaleY) {
                                obj3d.scaleY = 1;
                            }
                            if (null == obj3d.scaleZ) {
                                obj3d.scaleZ = 1;
                            }
                            if (null == obj3d.rotationX) {
                                obj3d.rotationX = 0;
                            }
                            if (null == obj3d.rotationY) {
                                obj3d.rotationY = 0;
                            }
                            if (null == obj3d.rotationZ) {
                                obj3d.rotationZ = 0;
                            }
                        }
                        cfo.matrix = new egret.Matrix(cfo.a, cfo.b, cfo.c, cfo.d, cfo.x, cfo.y);
                        for (k = 0; k < frameNum; k++) {
                            ZMovieClip.getFrameMovieObject(cfo, k + 1);
                        }
                        for (var oName in cfo) {
                            if ("id" != oName && "maskID" != oName && "op" != oName
                                && "mcName" != oName && "matrix" != oName && "al" != oName
                                && "libName" != oName && "f_arr" != oName && "cx" != oName && "cy" != oName && "r" != oName && "sx" != oName && "sy" != oName) {
                                delete cfo[oName];
                            }
                        }
                        if (null != obj3d) {
                            cfo.obj3d = obj3d;
                        }
                    }
                    frameArr.push(cfo);
                    var inFrameArr = cfo.f_arr;
                    if (null != inFrameArr) {
                        for (k = inFrameArr.length - 1; k >= 0; k--) {
                            frameArr.push(inFrameArr[k]);
                        }
                    }
                    pcfo = cfo;
                }
                this.layerArr.push({ frames: frameArr });
            }
            this.parentPlayTime = 0;
            this.scale = scale_;
            this.advanceTime();
        };
        ZMovieClip.prototype.nextFrame = function () {
            this.stop();
            this.parentPlayTime = 0;
            this.isPlay = true;
            this.advanceTime();
            this.isPlay = false;
        };
        ZMovieClip.prototype.prevFrame = function () {
            this.stop();
            this.currFrame -= 2;
            if (-1 > this.currFrame) {
                this.currFrame = this.totalFrame - 2;
            }
            if (-1 > this.currFrame) {
                this.currFrame = -1;
            }
            this.parentPlayTime = 0;
            this.isPlay = true;
            this.advanceTime();
            this.isPlay = false;
        };
        ZMovieClip.prototype.stop = function () {
            if (this.isPlay) {
                this.isPlay = false;
                this.removeEventListener(egret.Event.ENTER_FRAME, this.advanceTime, this);
                for (var i = this.numChildren - 1; i >= 0; i--) {
                    if (this.getChildAt(i) instanceof ZMovieClip) {
                        var fmc = this.getChildAt(i);
                        fmc.stop();
                    }
                }
            }
        };
        ZMovieClip.prototype.play = function () {
            if (!this.isPlay) {
                this.isPlay = true;
                this.addEventListener(egret.Event.ENTER_FRAME, this.advanceTime, this);
                for (var i = this.numChildren - 1; i >= 0; i--) {
                    if (this.getChildAt(i) instanceof ZMovieClip) {
                        var fmc = this.getChildAt(i);
                        if (this.mcObj.frameTime != fmc.mcObj.frameTime) {
                            fmc.play();
                        }
                    }
                }
            }
        };
        ZMovieClip.prototype.gotoAndStop = function (frame) {
            this.stop();
            this.currFrame = frame - 1;
            this.parentPlayTime = 0;
            this.isPlay = true;
            this.advanceTime();
            this.isPlay = false;
        };
        ZMovieClip.prototype.gotoAndPlay = function (frame) {
            this.currFrame = frame - 1;
            this.parentPlayTime = 0;
            this.advanceTime();
            this.play();
        };
        ZMovieClip.prototype.advanceTime = function () {
            var now = new Date().getTime();
            if (this.frameTime < now - this.parentPlayTime) {
                this.parentPlayTime = now;
                this.currFrame++;
                if (this.currFrame >= this.totalFrame || (-1 != this.endFrame && this.currFrame > this.endFrame)) {
                    if (!this.isLoop) {
                        this.currFrame -= 1;
                        this.stop();
                        this.frameComplete();
                        return;
                    }
                    this.frameComplete();
                    if (!this.isPlay) {
                        return;
                    }
                    this.currFrame = this.beginFrame;
                }
                var maskObj = void 0;
                var len = this.layerArr.length;
                for (var i = 0; i < len; i++) {
                    try {
                        var lObj = this.layerArr[i];
                        var frames_1 = lObj.frames;
                        var cfo = void 0;
                        var img = null;
                        var mc = null;
                        var li = null;
                        if (lObj.img instanceof zmovie.ZImage) {
                            img = lObj.img;
                        }
                        if (lObj.mc instanceof ZMovieClip) {
                            mc = lObj.mc;
                        }
                        if (lObj.li instanceof zmovie.LargeImage) {
                            li = lObj.li;
                        }
                        try {
                            cfo = frames_1[this.currFrame];
                            if (this.parentCFOObj[i] == cfo || null == cfo) {
                                if (null != mc && null != mc.parent && this.mcObj.frameTime == mc.mcObj.frameTime) {
                                    mc.nextFrame();
                                }
                                continue;
                            }
                            this.parentCFOObj[i] = cfo;
                        }
                        catch (err) {
                            if (null != img && this == img.parent) {
                                this.removeChild(img);
                            }
                            if (null != mc && null != mc.parent) {
                                mc.stop();
                                mc.parent.removeChild(mc);
                            }
                            if (null != li && this == li.parent) {
                                this.removeChild(li);
                            }
                            continue;
                        }
                        if (null == cfo.libName) {
                            if (null != img && this == img.parent) {
                                this.removeChild(img);
                            }
                            if (null != mc && null != mc.parent) {
                                mc.stop();
                                mc.parent.removeChild(mc);
                            }
                            if (null != li && this == li.parent) {
                                this.removeChild(li);
                            }
                        }
                        else {
                            var t = zmovie.Util.getTextureByName(this.imgArr, cfo.libName);
                            if (null == t) {
                                var showDisplay = void 0;
                                if (null == this.libObj.mcObjs[cfo.libName]) {
                                    if (null == li) {
                                        li = new zmovie.LargeImage(this.imgArr, this.libObj, cfo.libName);
                                        li.touchEnabled = false;
                                        lObj.li = li;
                                        li.imgDepth = i;
                                    }
                                    else {
                                        li.setObject(this.imgArr, this.libObj, cfo.libName);
                                    }
                                    showDisplay = li;
                                    li.matrix = cfo.matrix;
                                    if (null == li.parent) {
                                        this.addChildToDepth(li);
                                    }
                                    if (null != mc && this == mc.parent) {
                                        this.removeChild(mc);
                                        mc.visible = false;
                                    }
                                }
                                else {
                                    if (null == mc) {
                                        mc = new ZMovieClip(this.imgArr, this.libObj, cfo.libName);
                                        mc.touchEnabled = false;
                                        lObj.mc = mc;
                                        mc.imgDepth = i;
                                    }
                                    else {
                                        if (cfo.libName != mc._mcName) {
                                            mc.setMovieObject(this.imgArr, this.libObj, cfo.libName);
                                        }
                                    }
                                    showDisplay = mc;
                                    if (null == mc.parent) {
                                        if (this.isPlay) {
                                            if (this.mcObj.frameTime == mc.mcObj.frameTime) {
                                                mc.gotoAndStop(0);
                                            }
                                            else {
                                                mc.gotoAndPlay(0);
                                            }
                                        }
                                        else {
                                            mc.gotoAndStop(0);
                                        }
                                        mc.setTimeScale(this._timeScale);
                                        this.addChildToDepth(mc);
                                    }
                                    else {
                                        if (this.mcObj.frameTime == mc.mcObj.frameTime) {
                                            mc.nextFrame();
                                        }
                                    }
                                    if (this == mc.parent) {
                                        mc.matrix = cfo.matrix;
                                    }
                                    if (null != li && this == li.parent) {
                                        this.removeChild(li);
                                    }
                                }
                                showDisplay.anchorOffsetX = cfo.cx;
                                showDisplay.anchorOffsetY = cfo.cy;
                                showDisplay.alpha = cfo.al;
                                if (null != img && this == img.parent) {
                                    this.removeChild(img);
                                }
                            }
                            else {
                                if (null == img) {
                                    img = new zmovie.ZImage(t);
                                    img.imgDepth = i;
                                    img.touchEnabled = false;
                                    lObj.img = img;
                                }
                                else {
                                    img.setTexture(t);
                                }
                                if (null != this.libObj.imgScale && null != this.libObj.imgScale[cfo.libName]) {
                                    img.setScale(this.libObj.scale * this.libObj.imgScale[cfo.libName]);
                                }
                                else {
                                    img.setScale(this.libObj.scale);
                                }
                                img.displayLibName = cfo.libName;
                                img.matrix = cfo.matrix;
                                img.anchorOffsetX = cfo.cx;
                                img.anchorOffsetY = cfo.cy;
                                img.alpha = cfo.al;
                                if (null == img.parent) {
                                    this.addChildToDepth(img);
                                }
                                if (null != mc && null != mc.parent) {
                                    mc.stop();
                                    mc.parent.removeChild(mc);
                                }
                                if (null != li && this == li.parent) {
                                    this.removeChild(li);
                                }
                            }
                        }
                        var d = null;
                        if (null != img && null != img.parent) {
                            d = img;
                        }
                        else if (null != mc && null != mc.parent) {
                            d = mc;
                        }
                        else if (null != li && null != li.parent) {
                            d = li;
                        }
                        if (null != d) {
                            /*var sp3d:ZSprite3D = l_obj.sp3d;
 
                             var obj3d:any = cfo.obj3d;
                             if(null != obj3d){
                                 if(d.parent != sp3d){
                                     if(null == sp3d){
                                         sp3d = new ZSprite3D();
                                         l_obj.sp3d = sp3d;
                                     }
                                     sp3d.addIDisplay(<IDisplay><any> d);
                                     this.addChildToDepth(sp3d);
                                 }
 
                                 sp3d.pivotX = obj3d.cx;
                                 sp3d.pivotY = obj3d.cy;
 
                                 sp3d.x = obj3d.x;
                                 sp3d.y = obj3d.y;
                                 sp3d.scaleX = obj3d.scaleX;
                                 sp3d.scaleY = obj3d.scaleY;
                                 sp3d.scaleZ = obj3d.scaleZ;
                                 sp3d.rotationX = obj3d.rotationX;
                                 sp3d.rotationY = obj3d.rotationY;
                                 sp3d.rotationZ = obj3d.rotationZ;
 
                             }else{
                                 if(d.parent == sp3d){
                                     if(null != sp3d.parent){
                                         sp3d.parent.removeChild(sp3d);
                                     }
                                     this.addChildToDepth(<IDisplay><any> d);
                                 }
                             }*/
                            if (null != cfo.maskID) {
                                if (null != maskObj && null != maskObj[cfo.maskID] && null == d.parent.mask) {
                                    var maskD = maskObj[cfo.maskID];
                                    var maskRect = new egret.Rectangle(maskD.x, maskD.y, maskD.width, maskD.height);
                                    // d.mask = maskRect;
                                    d.parent.mask = maskRect;
                                }
                            }
                            else if (null != cfo.id) {
                                if (null == maskObj) {
                                    maskObj = {};
                                }
                                maskObj[cfo.id] = d;
                                d.visible = false;
                            }
                            if (null != cfo.mcName) {
                                d.name = cfo.mcName;
                                this.dispatchEventWith(ZMovieClip.EVENT_MC_NAME, false, d);
                            }
                        }
                    }
                    catch (err) {
                    }
                }
                if (null != this.fmObj) {
                    var mo = this.fmObj[this.currFrame];
                    if (null != mo) {
                        if (null == mo[this._scale]) {
                            mo[this._scale] = {};
                            mo[this._scale].x = mo.x * this._scale;
                            mo[this._scale].y = mo.y * this._scale;
                            mo[this._scale].moveType = mo.moveType;
                        }
                        this.dispatchEventWith(ZMovieClip.EVENT_MOVE, false, mo[this._scale]);
                    }
                }
                this.framePlay();
            }
        };
        ZMovieClip.prototype.frameComplete = function () {
            this.dispatchEventWith(ZMovieClip.EVENT_FRAME_COMPLETE, false);
        };
        ZMovieClip.prototype.framePlay = function () {
            if (null != this.areaObj) {
                this.currArea = this.areaObj[this.currFrame];
                if (null != this.currArea) {
                    this.dispatchEventWith(ZMovieClip.EVENT_AREA, false, this.currArea);
                }
            }
            this.dispatchEventWith(ZMovieClip.EVENT_ENTER_FRAME);
        };
        ZMovieClip.prototype.addChildToDepth = function (id) {
            var children = this.numChildren - 1;
            if (0 == children) {
                this.addChild(id);
                return;
            }
            for (var i = children; i >= 0; i--) {
                try {
                    var tId = this.getChildAt(i);
                    if (null != tId) {
                        if (tId.imgDepth < id.imgDepth) {
                            if (children == i) {
                                this.addChild(id);
                            }
                            else {
                                this.addChildAt(id, i + 1);
                            }
                            return;
                        }
                    }
                }
                catch (err) { }
            }
            this.addChildAt(id, 0);
        };
        ZMovieClip.EVENT_FRAME_COMPLETE = "frameComplete";
        ZMovieClip.EVENT_MOVE = "move";
        ZMovieClip.EVENT_ENTER_FRAME = "enterFrame";
        ZMovieClip.EVENT_MC_NAME = "mcName";
        ZMovieClip.EVENT_AREA = "area";
        ZMovieClip.EVENT_GOTOANDPLAYLABEL = "gotoAndPlayLabel";
        return ZMovieClip;
    }(egret.DisplayObjectContainer));
    zmovie.ZMovieClip = ZMovieClip;
    __reflect(ZMovieClip.prototype, "zmovie.ZMovieClip");
    // tslint:disable-next-line: max-file-line-count
})(zmovie || (zmovie = {}));
