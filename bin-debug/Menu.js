var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Menu = (function () {
    function Menu() {
        var _this = this;
        var componentMenu = fairygui.UIPackage.createObject("ForDemo3", "ComponentMenu").asCom; //找到FairyGUI的ComponentMenu组件
        fairygui.GRoot.inst.addChild(componentMenu); //显示ComponentMenu
        var buttonRetry = componentMenu.getChild("n1");
        var buttonContinue = componentMenu.getChild("n0");
        buttonContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.RemoveComponent(componentMenu); }, this);
        buttonRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.RemoveComponent(componentMenu); }, this);
    }
    Menu.prototype.RemoveComponent = function (component) {
        fairygui.GRoot.inst.removeChild;
    };
    return Menu;
}());
__reflect(Menu.prototype, "Menu");
//# sourceMappingURL=Menu.js.map