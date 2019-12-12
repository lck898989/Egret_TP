var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*
  * 版本配置文件
  */
var Version = (function () {
    function Version() {
    }
    Version.courseware_name = "courseware_测试";
    Version.VERSION = "0.0.1";
    return Version;
}());
__reflect(Version.prototype, "Version");
//# sourceMappingURL=Version.js.map