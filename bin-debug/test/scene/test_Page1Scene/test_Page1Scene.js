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
var test_Page1Scene = (function (_super) {
    __extends(test_Page1Scene, _super);
    function test_Page1Scene() {
        var _this = _super.call(this) || this;
        // 每个小球的重量
        _this.eachBallWeight = 3;
        // 最大旋转角度
        _this.maxRotation = 26;
        // 右边天平盘子的图片列表
        _this.rightBoxImgList = [];
        // 左边天平盘子球的图片列表
        _this.leftBoxImgList = [];
        // 托盘到中心的的距离
        _this.distance = 0;
        _this.skinName = "test_Page1Scene_Skin";
        return _this;
    }
    /** 每次进入 */
    test_Page1Scene.prototype.onAdd = function () {
        this.initSelf();
        for (var i = 0; i < 8; i++) {
            if (i < 7) {
                this.ImgList.push(this["b" + i]);
                this.countImgList.push(1);
            }
            else {
                this.ImgList.push(this["img0"]);
                this.countImgList.push(999);
            }
            this.rectCanSetList.push(this.rect0);
            this.rectCanSetList.push(this.rect1);
        }
        _super.prototype.onAdd.call(this);
    };
    test_Page1Scene.prototype.isCanSetToRect = function (indexForImgList, indexRect, obj, isNewItem) {
        return this.isCanSetToRectForReal(indexForImgList, indexRect, obj, isNewItem);
    };
    test_Page1Scene.prototype.isCanSetToRectForReal = function (indexForImgList, indexRect, obj, isNewItem) {
        // return true;
        return this.isCanSetToRectForRectMax(indexRect, obj, 9);
    };
    test_Page1Scene.prototype.initSelf = function () {
        this.balanceComponent1 = new BalanceComponent();
        this.balanceComponent1.initData();
        // 左侧
        this.balanceComponent1.imgListLeft.push(this.r0);
        this.balanceComponent1.imgListLeft.push(this.rect0);
        // 右侧
        this.balanceComponent1.imgListRight.push(this.r1);
        this.balanceComponent1.imgListRight.push(this.rect1);
        // 旋转天平
        this.balanceComponent1.imgListBalanceLine.push(this.base);
        // 左侧当前重量
        this.balanceComponent1.numWeightLeftInit = 0;
        this.balanceComponent1.rotMax = 12;
        this.balanceComponent1.numWeightRotMax = 0;
        this.balanceComponent1.pointCenter = new egret.Point(this.base.x, this.base.y);
        // 设置动画
        var self = this;
        this.balanceComponent1.setRightItemObjList = function (time, xTemp, yTemp) {
            if (time === void 0) { time = null; }
            if (xTemp === void 0) { xTemp = null; }
            if (yTemp === void 0) { yTemp = null; }
            self.setRightItemObjList1(time, xTemp, yTemp);
        };
        this.balanceComponent1.setLeftItemObjList = function (time, xTemp, yTemp) {
            if (time === void 0) { time = null; }
            if (xTemp === void 0) { xTemp = null; }
            if (yTemp === void 0) { yTemp = null; }
            self.setLeftItemObjList1(time, xTemp, yTemp);
        };
        this.balanceComponent1.onInit();
    };
    test_Page1Scene.prototype.setPosFunc = function (list, xTemp, yTemp) {
        if (list) {
            for (var i in list) {
                var tempIndex = parseInt(i);
                var data = list[tempIndex];
                egret.Tween.removeTweens(data.obj);
                data.obj.scaleX = 0.6;
                data.obj.scaleY = 0.6;
                if (tempIndex == 0) {
                    data.obj.x = xTemp;
                    data.obj.y = yTemp - 80;
                }
                else if (tempIndex == 1) {
                    data.obj.x = xTemp + 60;
                    data.obj.y = yTemp - 80;
                }
                else if (tempIndex == 2) {
                    data.obj.x = xTemp - 60;
                    data.obj.y = yTemp - 80;
                }
            }
        }
    };
    test_Page1Scene.prototype.setRightItemObjList1 = function (time, xTemp, yTemp) {
        if (time === void 0) { time = null; }
        if (xTemp === void 0) { xTemp = null; }
        if (yTemp === void 0) { yTemp = null; }
        if (time != null && xTemp != null && yTemp != null) {
            this.setPosFunc(this.targetDataMap[1], this.r1.x, this.r1.y);
            this.startTweenToPosFunc(this.targetDataMap[1], xTemp, yTemp, time);
        }
        else {
            this.setPosFunc(this.targetDataMap[1], this.r1.x, this.r1.y);
        }
    };
    test_Page1Scene.prototype.setLeftItemObjList1 = function (time, xTemp, yTemp) {
        if (time === void 0) { time = null; }
        if (xTemp === void 0) { xTemp = null; }
        if (yTemp === void 0) { yTemp = null; }
        if (time != null && xTemp != null && yTemp != null) {
            this.setPosFunc(this.targetDataMap[0], this.r0.x, this.r0.y);
            this.startTweenToPosFunc(this.targetDataMap[0], xTemp, yTemp, time);
        }
        else {
            this.setPosFunc(this.targetDataMap[0], this.r0.x, this.r0.y);
        }
    };
    // 执行右边天平上的砝码上的移动动画
    test_Page1Scene.prototype.startTweenToPosFunc = function (list, xTemp, yTemp, time) {
        if (list) {
            for (var i in list) {
                var tempIndex = parseInt(i);
                var data = list[tempIndex];
                egret.Tween.removeTweens(data.obj);
                if (tempIndex == 0) {
                    var posX = xTemp;
                    var posY = yTemp - 80;
                    egret.Tween.get(data.obj).to({ x: posX, y: posY }, time);
                }
                else if (tempIndex == 1) {
                    var posX = xTemp + 60;
                    var posY = yTemp - 80;
                    egret.Tween.get(data.obj).to({ x: posX, y: posY }, time);
                }
                else if (tempIndex == 2) {
                    var posX = xTemp - 60;
                    var posY = yTemp - 80;
                    egret.Tween.get(data.obj).to({ x: posX, y: posY }, time);
                }
            }
        }
    };
    test_Page1Scene.prototype.refreshForListTouchEnd = function () {
        _super.prototype.refreshForListTouchEnd.call(this);
        var functionNum = function (list) {
            var num = 0;
            if (list) {
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var data = list_1[_i];
                    // 遍历每张图片的索引加上对应的重量
                    // if(data.index == 0){
                    //     num += 3
                    // } else if(data.index == 1){
                    //     num += 6
                    // } else if(data.index == 2){
                    //     num += 8
                    // } else if(data.index == 3){
                    //     num += 10
                    // } else if(data.index == 4){
                    //     num += 12
                    // }
                    switch (data.obj.source) {
                        case "Moudle_big_page_scene14_json.10_10":
                            num += 3;
                            break;
                        case "Moudle_big_page_scene14_json.10_01":
                            num += 3;
                            break;
                    }
                }
            }
            return num;
        };
        var numRight1 = functionNum(this.targetDataMap[1]);
        if (this.targetDataMap && this.targetDataMap[0]) {
            // this.balanceComponent1.numWeightLeftInit = this.targetDataMap[0].length * this.eachBallWeight;
            this.balanceComponent1.numWeightLeftCur = this.targetDataMap[0].length * this.eachBallWeight;
        }
        this.balanceComponent1.startRotTween(this.balanceComponent1.numWeightLeftCur, numRight1, true);
    };
    /** 这里进行移出场景的处理 **/
    test_Page1Scene.prototype.onDestroy = function () {
        this.balanceComponent1.onDestroy();
        delete this.balanceComponent1;
        this.balanceComponent1 = null;
        _super.prototype.onDestroy.call(this);
    };
    test_Page1Scene.key = "test_Page1Scene";
    return test_Page1Scene;
}(DragAnyMakeRuleListCommonScene));
__reflect(test_Page1Scene.prototype, "test_Page1Scene");
//# sourceMappingURL=test_Page1Scene.js.map