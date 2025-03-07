---
date: 2023-11-05
tags:
  - phaser
  - h5游戏
---

# 基于 phaser tutorial 改造的一个 h5 小游戏

### 最终效果

<a href="https://iamtmoe.github.io/phaser-tutorial-example" target='_blank'>https://iamtmoe.github.io/phaser-tutorial-example</a>

### 项目地址

<a href="https://github.com/iamtmoe/phaser-tutorial-example" target='_blank'>https://github.com/iamtmoe/phaser-tutorial-example</a>

一直有做 h5 游戏的想法。上周刷到一篇对比 h5 游戏框架的文章，其中提到 phaser 的优点是文档良好和适合独立开发者，瞬时很有兴趣。
当我看到它的 README 的这段话，ok，就是它了。

> Because Phaser is an open source project, we cannot charge for it in the same way as traditional retail software. What's more, we don't ever want to. After all, it's built on, and was born from, open web standards. It's part of our manifesto that the core framework will always be free, even if you use it commercially, as many of you do.

然后 follow 它的官方教程，跑了第一个<a href="https://phaser.io/tutorials/making-your-first-phaser-3-game/part1" target="_blank">小例子</a>。
并基于它作了以下改造

### 页面居中

主要就是配了 game config 的 scale

```js
var config = {
  // ...
  scale: {
    parent: document.body,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
```

### 天空背景替换成超越组图

推荐一个创建精灵图的<a href='https://www.codeandweb.com/free-sprite-sheet-packer' target='_blank'>网站</a>,
把导出的 png 和 json 引入，创建一个 gameobject sprite `beauty`并创建一个动画`attack`, 然后 beauty play attack

```js
function preload() {
  // ...
  this.load.atlas("spritesheet", spritesheet, spriteJson);
}
function create() {
  beauty = this.add.sprite(400, 300, "spritesheet");
  // ...
  this.anims.create({
    key: "attack",
    frames: [
      { key: "spritesheet", frame: "cy0.png" },
      { key: "spritesheet", frame: "cy1.png" },
      { key: "spritesheet", frame: "cy2.png" },
      { key: "spritesheet", frame: "cy3.png" },
      { key: "spritesheet", frame: "cy4.png" },
      { key: "spritesheet", frame: "cy5.png" },
      { key: "spritesheet", frame: "cy6.png" },
      { key: "spritesheet", frame: "cy7.png" },
      { key: "spritesheet", frame: "cy8.png" },
      { key: "spritesheet", frame: "cy9.png" },
    ],
    frameRate: 0.3,
    repeat: -1,
  });
  // ...
  beauty.anims.play("attack", true);
}
```

### 添加确认开始按钮和结束后再玩一次按钮

这里采用了 dom 实现

```js
function create() {
    // ...
    const {screenCenterX, screenCenterY} = getScreenCenter.call(this)
    const button = this.add.dom(screenCenterX, screenCenterY, 'button', 'width: 100px; height: 50px; border-radius: 20px;cursor: pointer; border-color: yellow', 'start').setOrigin(0.5);
    button.addListener('click')
    button.on('click', () => {
        // ...
        gameStart = true;
    }
}
function hitBomb() {
    // ...
    const {screenCenterX, screenCenterY} = getScreenCenter.call(this)
    const button = this.add.dom(screenCenterX, screenCenterY, 'button', 'width: 100px; height: 50px; border-radius: 20px;cursor: pointer; border-color: yellow', 'play again').setOrigin(0.5);
    button.addListener('click')
    button.on('click', () => { this.scene.restart() })
}
```

### 移动端摇杆

用了<a href='https://rexrainbow.github.io/phaser3-rex-notes/docs/site/virtualjoystick/' target='_blank'>插件</a>

```js
function create() {
  // ...
  isMobile() &&
    (joyStick = this.plugins.get("rexVirtualJoystick").add(this, {
      x: 140,
      y: 480,
      radius: 100,
    }));
  // ...
}
```

### 全屏展示

使用 phaser 的 fullscreen API, 浏览器限制全屏和音频播放一样都需要用户动作触发

```js
function create() {
    // ...
    if(this.sys.game.device.fullscreen.available) {
        // ...
        button.on('click', () => {
            document.body[this.sys.game.device.fullscreen.request]();
        }
    }
}
```

### 添加背景音乐和碰撞音效

scene restart 前需要 music.stop，不然音乐会一直播放下去。推荐一个<a href="https://pixabay.com/sound-effects/search/game/?pagi=3" target='_blank'>免费音效网站</a>

```js
function create() {
  // ...
  music = this.sound.add("music", { loop: true });
}
function collectStar(player, star) {
  this.sound.play("collect");
  // ...
}
```

### 资源加载 loading

因为超越精灵图和背景音乐比较大，加载会造成长时间黑屏，对用户不友好，所以加了进度条，<a href="https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13" target='_blank'>参考</a>
这里有个很奇怪的点是，scene.restart 后，percentText.setText 会报错，我暂时 try catch 忽略了

```js
function preload() {
  // ...
  this.load.on("progress", function(value) {
    // ...
    try {
      percentText.setText(parseInt(value * 100) + "%");
    } catch (e) {}
  });
}
```
