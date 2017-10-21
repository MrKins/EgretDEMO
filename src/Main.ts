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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
                //console.log('hello,world')
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        fairygui.UIPackage.addPackage("ForDemo3");//找到FairyGUI的ForDemo3包

        this.stage.addChild(fairygui.GRoot.inst.displayObject);//向舞台添加FairyGUI定义的DisplayObject

        let componentMain: fairygui.GComponent = fairygui.UIPackage.createObject("ForDemo3", "ComponentMain").asCom;//找到FairyGUI的ComponentMain组件
        fairygui.GRoot.inst.addChild(componentMain);//显示componentMain
        let buttonPause = componentMain.getChild("n0");//获取componentMain里面叫n0的button

        let componentMenu: fairygui.GComponent = fairygui.UIPackage.createObject("ForDemo3", "ComponentMenu").asCom;//找到FairyGUI的ComponentMenu组件
        let buttonRetry = componentMenu.getChild("n1");
        let buttonContinue = componentMenu.getChild("n0");

        buttonPause.text = "暂停";
        buttonContinue.text = "继续";
        buttonRetry.text = "重试";
        buttonPause.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            fairygui.GRoot.inst.addChild(componentMenu);//显示ComponentMenu
            this.stage.removeEventListener(egret.Event.ENTER_FRAME, AnimateMove, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, BirdFly, this);
        }, this);
        buttonContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            fairygui.GRoot.inst.removeChild(componentMenu);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, BirdFly, this);
            this.stage.addEventListener(egret.Event.ENTER_FRAME, AnimateMove, this);
        }, this);
        buttonRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            fairygui.GRoot.inst.removeChild(componentMenu);
            cloudHigher.x = stageW;
            cloudLower.x = stageW;
            flappyBird.y = birdYDefault;
            pig.x = stageW;
            pig.y = RandomPigY();
            this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, BirdFly, this);
            this.stage.addEventListener(egret.Event.ENTER_FRAME, AnimateMove, this);
        }, this);

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        //Cloud
        let cloudHigher = this.createBitmapByName("cloud_png");
        cloudHigher.x = stageW;
        cloudHigher.y = stageH / 20;
        this.addChild(cloudHigher);

        let cloudLower = this.createBitmapByName("cloud_png");
        cloudLower.x = stageW;
        cloudLower.y = stageH / 7;
        this.addChild(cloudLower);

        //Bird
        let flappyBird = this.createBitmapByName("smallBird_png");
        let birdYDefault = stageH / 2;
        flappyBird.anchorOffsetY = flappyBird.height / 2;
        flappyBird.anchorOffsetX = flappyBird.width / 2;
        flappyBird.x = stageW / 3;
        flappyBird.y = birdYDefault;
        this.addChild(flappyBird);

        //Pig
        let pig = this.createBitmapByName("PIG_png");
        pig.x = stageW;
        pig.y = RandomPigY();
        this.addChild(pig);

        //Touch Event
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, BirdFly, this);
        //Frame Event
        this.stage.addEventListener(egret.Event.ENTER_FRAME, AnimateMove, this);

        function AnimateMove(): void {
            //Cloud Move
            cloudHigher.x -= 3;
            cloudLower.x -= 5;
            //Bird Drop
            if (flappyBird.y <= stageH) {
                flappyBird.y += 30;
            }
            //Pig Move
            pig.x -= 30;

            if (cloudLower.x <= -297) {
                cloudLower.x = stageW;
            }
            if (cloudHigher.x <= -297) {
                cloudHigher.x = stageW;
            }
            if (pig.x <= -(pig.width / 2)) {
                pig.x = stageW;
                pig.y = RandomPigY();
            }
            if (flappyBird.rotation <= 70) {
                flappyBird.rotation += 3;
            }

            //Crash & Out
            if (this.HitCheck(flappyBird, pig) || flappyBird.y >= stageH || flappyBird.y <= 0) {
                //Dead
                fairygui.GRoot.inst.addChild(componentMenu);//显示ComponentMenu

                this.stage.removeEventListener(egret.Event.ENTER_FRAME, AnimateMove, this);
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, BirdFly, this);
            }
        }

        function BirdFly(): void {
            //flappyBird.y -= 200;
            //使用动画会自动补充中间帧，比直接设定y要流畅
            let tw = egret.Tween.get(flappyBird);
            if (flappyBird.y >= 0) {
                tw.to({ "y": flappyBird.y - 200, "rotation": -45 }, 200);
            }
        }

        function RandomPigY(): number {
            let randomMax = stageH - pig.height;
            return parseInt(`${Math.random() * (randomMax - 0) + 0}`);
        }
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    //两个DisplayObject碰撞检测
    private HitCheck(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
        let rect1: egret.Rectangle = obj1.getBounds();
        let rect2: egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }
}
