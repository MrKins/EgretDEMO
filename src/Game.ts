class Game extends Main {
    private stageGame: egret.Stage;

    private stageW: number;
    private stageH: number;

    private cloudHigher: egret.Bitmap;
    private cloudLower: egret.Bitmap;
    private flappyBird: egret.Bitmap;
    private pig: egret.Bitmap;

    public constructor(stageW: number, stageH: number, stageGame: egret.Stage) {
        super();

        this.stageGame = stageGame;
        this.stageW = stageW;
        this.stageH = stageH;

        //Cloud
        this.cloudHigher = this.createBitmapByName("cloud_png");
        this.cloudHigher.x = stageW;
        this.cloudHigher.y = stageH / 20;
        this.stageGame.addChild(this.cloudHigher);

        this.cloudLower = this.createBitmapByName("cloud_png");
        this.cloudLower.x = stageW;
        this.cloudLower.y = stageH / 7;
        this.stageGame.addChild(this.cloudLower);

        //Bird
        this.flappyBird = this.createBitmapByName("smallBird_png");
        let birdYDefault = stageH / 2;
        this.flappyBird.anchorOffsetY = this.flappyBird.height / 2;
        this.flappyBird.anchorOffsetX = this.flappyBird.width / 2;
        this.flappyBird.x = stageW / 3;
        this.flappyBird.y = birdYDefault;
        this.stageGame.addChild(this.flappyBird);

        //Pig
        this.pig = this.createBitmapByName("PIG_png");
        this.pig.x = stageW;
        this.pig.y = this.RandomPigY();
        this.stageGame.addChild(this.pig);

        let componentGame: fairygui.GComponent = fairygui.UIPackage.createObject("ForDemo3", "ComponentGame").asCom;//找到FairyGUI的ComponentMain组件
        fairygui.GRoot.inst.addChild(componentGame);//显示componentMain
        let buttonPause = componentGame.getChild("n0");//获取componentMain里面叫n0的button
        buttonPause.text = "暂停";
        buttonPause.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            new Menu();
            this.stageGame.removeEventListener(egret.Event.ENTER_FRAME, this.AnimateMove, this);
            this.stageGame.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.BirdFly, this);
        }, this);

        //Touch Event
        this.stageGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.BirdFly, this);
        //Frame Event
        this.stageGame.addEventListener(egret.Event.ENTER_FRAME, this.AnimateMove, this);
    }

    //根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private AnimateMove() {
        //Cloud Move
        this.cloudHigher.x -= 3;
        this.cloudLower.x -= 5;
        //Bird Drop
        if (this.flappyBird.y <= this.stageH) {
            this.flappyBird.y += 30;
        }
        //Pig Move
        this.pig.x -= 30;

        //Cloud, Bird and Pig reset
        if (this.cloudLower.x <= -297) {
            this.cloudLower.x = this.stageW;
        }
        if (this.cloudHigher.x <= -297) {
            this.cloudHigher.x = this.stageW;
        }
        if (this.pig.x <= -(this.pig.width / 2)) {
            this.pig.x = this.stageW;
            this.pig.y = this.RandomPigY();
        }
        if (this.flappyBird.rotation <= 70) {
            this.flappyBird.rotation += 3;
        }

        //Crash or Out
        if (this.HitCheck(this.flappyBird, this.pig) || this.flappyBird.y >= this.stageH || this.flappyBird.y <= 0) {
            //Stop Animate
            this.stageGame.removeEventListener(egret.Event.ENTER_FRAME, this.AnimateMove, this);
            this.stageGame.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.BirdFly, this);
        }
    }

    private BirdFly() {
        //flappyBird.y -= 200;
        //使用动画会自动补充中间帧，比直接设定y要流畅
        let tw = egret.Tween.get(this.flappyBird);
        if (this.flappyBird.y >= 0) {
            tw.to({ "y": this.flappyBird.y - 200, "rotation": -45 }, 200);
        }
    }

    //给敌人——猪的出现Y轴进行在0-1080随机
    private RandomPigY() {
        let randomMax = this.stageH - this.pig.height;

        return parseInt(`${Math.random() * (randomMax - 0) + 0}`);
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