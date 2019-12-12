class test_Page1Scene extends DragAnyMakeRuleListCommonScene {

    static key:string = "test_Page1Scene";

    public constructor() {
        super();
        this.skinName = "test_Page1Scene_Skin";
    }
    // 每个小球的重量
    private eachBallWeight: number = 3;
    // 天平基座
    private base: eui.Image;
    // 天平右侧盘子
    private r0: eui.Image;
    // 天平左侧盘子
    private r1: eui.Image;
    // 中心点
    private centerPoint: egret.Point;
    // 最大旋转角度
    private maxRotation: number = 26;

    // 右边天平盘子的图片列表
    private rightBoxImgList: eui.Image[] = [];
    // 左边天平盘子球的图片列表
    private leftBoxImgList: eui.Image[] = [];

    // 托盘到中心的的距离
    private distance: number = 0;

    private leftSourcePointArr: egret.Point[];
    private rightSourcePointArr: egret.Point[];

    private balanceComponent1: BalanceComponent;

    private rect0: eui.Rect;
    private rect1: eui.Rect;

    /** 每次进入 */
    public onAdd(): void {
        this.initSelf();

        for(let i = 0; i < 8; i++) {
            if(i < 7) {
                this.ImgList.push(this["b" + i]);
                this.countImgList.push(1);
            } else {
                this.ImgList.push(this["img0"]);
                this.countImgList.push(999);
            }
            this.rectCanSetList.push(this.rect0);
            this.rectCanSetList.push(this.rect1);
        }
        super.onAdd();
    }
    protected isCanSetToRect(indexForImgList: number, indexRect: number, obj: eui.Image, isNewItem: boolean): boolean {
        return this.isCanSetToRectForReal(indexForImgList,indexRect,obj,isNewItem);
    }
    protected isCanSetToRectForReal(indexForImgList: number, indexRect: number, obj: eui.Image, isNewItem: boolean): boolean {
        // return true;
        return this.isCanSetToRectForRectMax(indexRect,obj,9);
    }
    private initSelf(){

        this.balanceComponent1 = new BalanceComponent()
        this.balanceComponent1.initData()
        // 左侧
        this.balanceComponent1.imgListLeft.push(this.r0)
        this.balanceComponent1.imgListLeft.push(this.rect0);
        // 右侧
        this.balanceComponent1.imgListRight.push(this.r1)
        this.balanceComponent1.imgListRight.push(this.rect1);
        // 旋转天平
        this.balanceComponent1.imgListBalanceLine.push(this.base);
        // 左侧当前重量
        this.balanceComponent1.numWeightLeftInit = 0
        this.balanceComponent1.rotMax = 12
        this.balanceComponent1.numWeightRotMax = 0
        this.balanceComponent1.pointCenter = new egret.Point(this.base.x, this.base.y)
        // 设置动画
        let self = this
        this.balanceComponent1.setRightItemObjList = function(time:number = null, xTemp:number = null, yTemp:number = null){
            self.setRightItemObjList1(time, xTemp, yTemp)
        }
        this.balanceComponent1.setLeftItemObjList = function(time: number = null,xTemp: number = null, yTemp: number = null) {
            self.setLeftItemObjList1(time,xTemp,yTemp)
        }
        this.balanceComponent1.onInit()

    }
    private setPosFunc(list:Array<{obj, index}>, xTemp:number, yTemp:number){
        if(list){
            for(let i in list){
                let tempIndex = parseInt(i)
                let data = list[tempIndex]
                egret.Tween.removeTweens(data.obj)
                data.obj.scaleX = 0.6
                data.obj.scaleY = 0.6
                if(tempIndex == 0){
                    data.obj.x = xTemp 
                    data.obj.y = yTemp - 80
                } else if(tempIndex == 1){
                    data.obj.x = xTemp + 60
                    data.obj.y = yTemp - 80
                } else if(tempIndex == 2){
                    data.obj.x = xTemp - 60
                    data.obj.y = yTemp - 80
                } 
            }
        }
    }
    private setRightItemObjList1(time:number = null, xTemp:number = null, yTemp:number = null){
        if(time != null && xTemp != null && yTemp != null){
            this.setPosFunc(this.targetDataMap[1], this.r1.x, this.r1.y)
            this.startTweenToPosFunc(this.targetDataMap[1], xTemp, yTemp, time)
        } else {
            this.setPosFunc(this.targetDataMap[1], this.r1.x, this.r1.y)
        }
    }
    private setLeftItemObjList1(time:number = null, xTemp:number = null, yTemp:number = null){
        if(time != null && xTemp != null && yTemp != null){
            this.setPosFunc(this.targetDataMap[0], this.r0.x, this.r0.y);
            this.startTweenToPosFunc(this.targetDataMap[0], xTemp, yTemp, time);
        } else {
            this.setPosFunc(this.targetDataMap[0], this.r0.x, this.r0.y);
        }
    }
    // 执行右边天平上的砝码上的移动动画
    private startTweenToPosFunc(list:Array<{obj, index}>, xTemp:number, yTemp:number, time:number){
        if(list){
            for(let i in list){
                let tempIndex = parseInt(i)
                let data = list[tempIndex]
                egret.Tween.removeTweens(data.obj)
                if(tempIndex == 0){
                    let posX = xTemp 
                    let posY = yTemp - 80
                    egret.Tween.get(data.obj).to({x : posX, y : posY}, time);
                } else if(tempIndex == 1){
                    let posX = xTemp + 60
                    let posY = yTemp - 80
                    egret.Tween.get(data.obj).to({x : posX, y : posY}, time);
                } else if(tempIndex == 2){
                    let posX = xTemp - 60
                    let posY = yTemp - 80
                    egret.Tween.get(data.obj).to({x : posX, y : posY}, time);
                } 
            }
        }
    }
    protected refreshForListTouchEnd(){

        super.refreshForListTouchEnd()
        
        let functionNum = function(list:Array<{obj: eui.Image, index: number}>):number{
            let num = 0
            if(list){
                for(let data of list){
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
                    switch(data.obj.source) {
                        case "Moudle_big_page_scene14_json.10_10":
                            num += 3;
                            break;
                        case "Moudle_big_page_scene14_json.10_01":
                            num += 3;
                            break;    
                    }
                }
            }
            return num
        }
        let numRight1 = functionNum(this.targetDataMap[1]);
        if(this.targetDataMap && this.targetDataMap[0]) {
            // this.balanceComponent1.numWeightLeftInit = this.targetDataMap[0].length * this.eachBallWeight;
            this.balanceComponent1.numWeightLeftCur = this.targetDataMap[0].length * this.eachBallWeight;
        }
        this.balanceComponent1.startRotTween(this.balanceComponent1.numWeightLeftCur, numRight1,true);
    }
    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {

        this.balanceComponent1.onDestroy()
        delete this.balanceComponent1
        this.balanceComponent1 = null

        super.onDestroy();
    }
}
