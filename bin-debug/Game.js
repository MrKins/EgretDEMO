var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(stageW, stageH, stageGame) {
        var _this = _super.call(this) || this;
        _this.stageGame = stageGame;
        _this.stageW = stageW;
        _this.stageH = stageH;
        //Cloud
        _this.cloudHigher = _this.createBitmapByName("cloud_png");
        _this.cloudHigher.x = stageW;
        _this.cloudHigher.y = stageH / 20;
        _this.stageGame.addChild(_this.cloudHigher);
        _this.cloudLower = _this.createBitmapByName("cloud_png");
        _this.cloudLower.x = stageW;
        _this.cloudLower.y = stageH / 7;
        _this.stageGame.addChild(_this.cloudLower);
        //Bird
        _this.flappyBird = _this.createBitmapByName("smallBird_png");
        var birdYDefault = stageH / 2;
        _this.flappyBird.anchorOffsetY = _this.flappyBird.height / 2;
        _this.flappyBird.anchorOffsetX = _this.flappyBird.width / 2;
        _this.flappyBird.x = stageW / 3;
        _this.flappyBird.y = birdYDefault;
        _this.stageGame.addChild(_this.flappyBird);
        //Pig
        _this.pig = _this.createBitmapByName("PIG_png");
        _this.pig.x = stageW;
        _this.pig.y = _this.RandomPigY();
        _this.stageGame.addChild(_this.pig);
        var componentGame = fairygui.UIPackage.createObject("ForDemo3", "ComponentGame").asCom; //找到FairyGUI的ComponentMain组件
        fairygui.GRoot.inst.addChild(componentGame); //显示componentMain
        var buttonPause = componentGame.getChild("n0"); //获取componentMain里面叫n0的button
        buttonPause.text = "暂停";
        buttonPause.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            new Menu();
            _this.stageGame.removeEventListener(egret.Event.ENTER_FRAME, _this.AnimateMove, _this);
            _this.stageGame.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.BirdFly, _this);
        }, _this);
        //Touch Event
        _this.stageGame.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.BirdFly, _this);
        //Frame Event
        _this.stageGame.addEventListener(egret.Event.ENTER_FRAME, _this.AnimateMove, _this);
        return _this;
    }
    //根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    Game.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Game.prototype.AnimateMove = function () {
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
    };
    Game.prototype.BirdFly = function () {
        //flappyBird.y -= 200;
        //使用动画会自动补充中间帧，比直接设定y要流畅
        var tw = egret.Tween.get(this.flappyBird);
        if (this.flappyBird.y >= 0) {
            tw.to({ "y": this.flappyBird.y - 200, "rotation": -45 }, 200);
        }
    };
    //给敌人——猪的出现Y轴进行在0-1080随机
    Game.prototype.RandomPigY = function () {
        var randomMax = this.stageH - this.pig.height;
        return parseInt("" + (Math.random() * (randomMax - 0) + 0));
    };
    //两个DisplayObject碰撞检测
    Game.prototype.HitCheck = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    };
    return Game;
}(Main));
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map