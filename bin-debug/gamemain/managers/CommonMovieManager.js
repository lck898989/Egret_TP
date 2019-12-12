/*
  * 等待界面
  */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CommonMovieManager = (function () {
    function CommonMovieManager() {
    }
    CommonMovieManager.getInstance = function () {
        if (!CommonMovieManager.instance) {
            CommonMovieManager.instance = new CommonMovieManager();
        }
        return CommonMovieManager.instance;
    };
    CommonMovieManager.prototype.init = function () {
        lcp.LListener.getInstance().addEventListener("show_commonmovie", this.showCommonMovie, this);
    };
    CommonMovieManager.prototype.showCommonMovie = function (e) {
        if (e && e.param) {
            GM.dlg.popDlg(CommonMovieDlg, "", null, e.param);
        }
    };
    CommonMovieManager.prototype.showSuccess = function () {
        GM.dlg.popDlg(CommonMovieDlg, "successCaiDai", null, { movie: "caidai", movieCount: 7, playCount: 2 });
    };
    return CommonMovieManager;
}());
__reflect(CommonMovieManager.prototype, "CommonMovieManager");
//# sourceMappingURL=CommonMovieManager.js.map