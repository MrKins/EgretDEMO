class Menu {
    public constructor() {
        let componentMenu: fairygui.GComponent = fairygui.UIPackage.createObject("ForDemo3", "ComponentMenu").asCom;//找到FairyGUI的ComponentMenu组件
        fairygui.GRoot.inst.addChild(componentMenu);//显示ComponentMenu

        let buttonRetry = componentMenu.getChild("n1");
        let buttonContinue = componentMenu.getChild("n0");

        buttonContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.RemoveComponent(componentMenu); }, this);
        buttonRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.RemoveComponent(componentMenu); }, this);
    }

    private RemoveComponent(component: fairygui.GComponent){
         fairygui.GRoot.inst.removeChild
    }
}