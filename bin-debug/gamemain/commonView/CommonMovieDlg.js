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
 *
 * 播放动画和音效
 */
var CommonMovieDlg = (function (_super) {
    __extends(CommonMovieDlg, _super);
    function CommonMovieDlg() {
        var _this = _super.call(this) || this;
        _this.skinName = "Dlg_CommonMovie_Skin";
        return _this;
    }
    CommonMovieDlg.prototype.onAdd = function () {
        if (this.data != null) {
            this._movieName = this.data["movie"];
            this._movieCount = this.data["movieCount"];
            this._soundName = this.data["sound"];
            this._soundType = Number(this.data["soundType"]);
            this._playCount = Number(this.data["playCount"]);
            if (this._playCount <= 0 || this._playCount === NaN) {
                this.playAction();
            }
            else {
                this._playIndex = 0;
                this.playActionByCount();
            }
        }
    };
    /** 这里进行移出场景的处理 **/
    CommonMovieDlg.prototype.onDestroy = function () {
    };
    CommonMovieDlg.prototype.playAction = function () {
        this.act = LN.getInstance().getMovieClip(this._movieName, this._movieCount);
        this.act.isLoop = true;
        this.act.gotoAndPlay(0);
        this.act.x = 1562 / 2 - this.act.width / 2;
        this.act.y = 1348 / 2 - this.act.height / 2;
        this.addChild(this.act);
        egret.Tween.get(this.act).to({ alpha: 1 }, 1000);
        if (!this._soundName) {
            this.randomSoundEffect(this._soundType);
        }
        else {
            GM.sound.playEffect(this._soundName);
        }
    };
    CommonMovieDlg.prototype.playActionByCount = function () {
        var rand = App.RandomUtils.limitInteger(1, 3);
        var soundName = "";
        switch (rand) {
            case 1:
                soundName = "effect_bingo_1_mp3";
                break;
            case 2:
                soundName = "effect_bingo_2_mp3";
                break;
            case 3:
                soundName = "effect_bingo_3_mp3";
                break;
        }
        GM.sound.playEffect(soundName);
        this.act = LN.getInstance().getMovieClip(this._movieName, this._movieCount);
        this.act.gotoAndPlay(0);
        this._playIndex++;
        this.act.x = 1562 / 2 - this.act.width / 2;
        this.act.y = 1348 / 2 - this.act.height / 2;
        this.addChild(this.act);
        this.act.addEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.oveZmovieActCount, this);
    };
    CommonMovieDlg.prototype.oveZmovieActCount = function () {
        if (this._playIndex >= this._playCount) {
            this.act.stop();
            if (this.act.hasEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE)) {
                this.act.removeEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.overZmovieAct, this);
            }
            if (this.contains(this.act)) {
                this.removeChild(this.act);
            }
            this.closeFunc();
        }
        else {
            this.act.gotoAndPlay(0);
            this._playIndex++;
        }
    };
    CommonMovieDlg.prototype.completeZmovieAct = function () {
        this.act.stop();
        if (this.act.hasEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE)) {
            this.act.removeEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.overZmovieAct, this);
        }
        if (this.contains(this.act)) {
            this.removeChild(this.act);
        }
    };
    /** 关闭音效和动画 */
    CommonMovieDlg.prototype.overZmovieAct = function (e) {
        var sound = e.currentTarget;
        if (this.act) {
            sound.stop();
            if (sound.hasEventListener(egret.Event.SOUND_COMPLETE)) {
                sound.removeEventListener(egret.Event.SOUND_COMPLETE, this.overZmovieAct, this);
            }
        }
        egret.Tween.get(this.act).to({ alpha: 0 }, 1000).call(this.completeZmovieAct, this).call(this.closeFunc, this);
    };
    /** 关闭动画 */
    CommonMovieDlg.prototype.overAct = function () {
        egret.Tween.get(this.act).to({ alpha: 0 }, 1000).call(this.completeZmovieAct, this).call(this.closeFunc, this);
    };
    /** 随机一个正确或错误音效 */
    CommonMovieDlg.prototype.randomSoundEffect = function (soundType) {
        var rand = soundType == 1 ? App.RandomUtils.limitInteger(1, 3) : App.RandomUtils.limitInteger(1, 2);
        var soundName = "";
        if (soundType == 1) {
            switch (rand) {
                case 1:
                    soundName = "effect_bingo_1_mp3";
                    break;
                case 2:
                    soundName = "effect_bingo_2_mp3";
                    break;
                case 3:
                    soundName = "effect_bingo_3_mp3";
                    break;
            }
        }
        else if (soundType == 2) {
            switch (rand) {
                case 1:
                    soundName = "effect_error_1_mp3";
                    break;
                case 2:
                    soundName = "effect_error_2_mp3";
                    break;
            }
        }
        if (soundName == "") {
            // 如果获取的音效名字错误
            this.overAct();
            return;
        }
        var sound = RES.getRes(soundName);
        // 如果获取的资源出错了
        if (!sound) {
            this.overAct();
            return;
        }
        var channel = sound.play(0, 1);
        channel.addEventListener(egret.Event.SOUND_COMPLETE, this.overZmovieAct, this);
    };
    CommonMovieDlg.prototype.closeFunc = function () {
        this.onDlgClose(CommonMovieDlg.key);
    };
    CommonMovieDlg.key = "CommonMovieDlg";
    return CommonMovieDlg;
}(UIObject));
__reflect(CommonMovieDlg.prototype, "CommonMovieDlg");
//# sourceMappingURL=CommonMovieDlg.js.map