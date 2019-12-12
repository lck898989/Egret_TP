/**
 *
 * 播放动画和音效
 */
class CommonMovieDlg extends UIObject {
    public static key: string = "CommonMovieDlg";

    public _movieName: string;
    public _soundName: string;
    public _soundType: number;
    public _movieCount: number;
    private _playCount: number;
    private _playIndex: number;

    public act: zmovie.ZMovieClip;      // 动画

    public constructor() {
        super();
        this.skinName = "Dlg_CommonMovie_Skin";
    }

    public onAdd(): void {
        if (this.data != null) {
            this._movieName = this.data["movie"];
            this._movieCount = this.data["movieCount"];
            this._soundName = this.data["sound"];
            this._soundType = Number(this.data["soundType"]);
            this._playCount = Number(this.data["playCount"]);
            if (this._playCount <= 0 || this._playCount === NaN) {
                this.playAction();
            } else {
                this._playIndex = 0;
                this.playActionByCount();
            }
        }
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {
    }

    private playAction(): void {
        this.act = LN.getInstance().getMovieClip(this._movieName, this._movieCount);
        this.act.isLoop = true;
        this.act.gotoAndPlay(0);
        this.act.x = 1562 / 2 - this.act.width / 2;
        this.act.y = 1348 / 2 - this.act.height / 2;
        this.addChild(this.act);
        egret.Tween.get(this.act).to({alpha: 1}, 1000);
        if (!this._soundName) {
            this.randomSoundEffect(this._soundType);
        } else {
            GM.sound.playEffect(this._soundName);
        }
    }

    private playActionByCount() : void {
        const rand: number = App.RandomUtils.limitInteger(1, 3);
        let soundName: string = "";
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
    }

    private oveZmovieActCount() : void {
        if (this._playIndex >= this._playCount) {
                this.act.stop();
            if (this.act.hasEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE)) {
                this.act.removeEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.overZmovieAct, this);
            }
            if (this.contains(this.act)) {
                this.removeChild(this.act);
            }
            this.closeFunc();
        } else {
            this.act.gotoAndPlay(0);
            this._playIndex++;
        }
    }

    private completeZmovieAct(): void {
        this.act.stop();
        if (this.act.hasEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE)) {
            this.act.removeEventListener(zmovie.ZMovieClip.EVENT_FRAME_COMPLETE, this.overZmovieAct, this);
        }
        if (this.contains(this.act)) {
            this.removeChild(this.act);
        }
    }

    /** 关闭音效和动画 */
    private overZmovieAct(e: egret.Event): void {
        const sound: egret.SoundChannel = e.currentTarget;

        if (this.act) {
            sound.stop();
            if (sound.hasEventListener(egret.Event.SOUND_COMPLETE)) {
                sound.removeEventListener(egret.Event.SOUND_COMPLETE, this.overZmovieAct, this);
            }
        }

        egret.Tween.get(this.act).to({alpha: 0}, 1000).call(this.completeZmovieAct, this).call(this.closeFunc, this);
    }

    /** 关闭动画 */
    private overAct(): void {
        egret.Tween.get(this.act).to({alpha: 0}, 1000).call(this.completeZmovieAct, this).call(this.closeFunc, this);
    }

    /** 随机一个正确或错误音效 */
    private randomSoundEffect(soundType: number): void {
        const rand: number = soundType == 1 ? App.RandomUtils.limitInteger(1, 3) : App.RandomUtils.limitInteger(1, 2);
        let soundName: string = "";
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
        } else if (soundType == 2) {
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

        const sound: egret.Sound = RES.getRes(soundName);
        // 如果获取的资源出错了
        if (!sound) {
            this.overAct();
            return;
        }

        const channel: egret.SoundChannel = sound.play(0, 1);
        channel.addEventListener(egret.Event.SOUND_COMPLETE, this.overZmovieAct, this);
    }

    private closeFunc(): void {
        this.onDlgClose(CommonMovieDlg.key);
    }
}
