function CInstruct() {
  var msgBox;
  var logo;
  var exitButton;
  var developerText;
  var developerTextStroke;
  var secretCounter = 0;
  var container;
  var clickCounter = 0;

  this._init = function() {
    container = new createjs.Container();
    s_oStage.addChild(container);

    // Black background overlay
    var background = new createjs.Shape();
    background.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    background.alpha = 0.6;
    container.addChild(background);

    // Message box sprite
    var msgBoxSprite = s_oSpriteLibrary.getSprite("msg_box");
    msgBox = createBitmap(msgBoxSprite);
    msgBox.x = CANVAS_WIDTH_HALF;
    msgBox.y = CANVAS_HEIGHT_HALF;
    msgBox.regX = msgBoxSprite.width * 0.5;
    msgBox.regY = msgBoxSprite.height * 0.5;
    container.addChild(msgBox);

    // Invisible clickable overlay
    var clickLayer = new createjs.Shape();
    clickLayer.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    clickLayer.alpha = 0.01;
    clickLayer.on("click", this._onLogoButRelease);
    clickLayer.cursor = "pointer";
    container.addChild(clickLayer);

    // Exit button (top right)
    var exitButtonSprite = new createjs.Shape();
    exitButtonSprite.graphics.beginFill("#0f0f0f").drawRect(CANVAS_WIDTH - EDGEBOARD_X * 2, CANVAS_HEIGHT - EDGEBOARD_Y * 2, EDGEBOARD_X * 2, EDGEBOARD_Y * 2);
    exitButtonSprite.alpha = 0.01;
    exitButtonSprite.on("click", this.secret);
    exitButtonSprite.cursor = "pointer";
    container.addChild(exitButtonSprite);

    // Exit button graphic
    var exitButtonGraphic = s_oSpriteLibrary.getSprite("but_exit");
    var exitButtonPos = { x: CANVAS_WIDTH * 0.5 + 330, y: 510 };
    exitButton = new CGfxButton(exitButtonPos.x, exitButtonPos.y, exitButtonGraphic, container);
    exitButton.addEventListener(ON_MOUSE_UP, this.unload, this);

    // Developer text (stroke)
    developerTextStroke = new createjs.Text("click play button to start", "40px " + FONT_GAME, TEXT_COLOR_STROKE);
    developerTextStroke.textAlign = "center";
    developerTextStroke.textBaseline = "alphabetic";
    developerTextStroke.x = CANVAS_WIDTH / 2;
    developerTextStroke.y = 560;
    developerTextStroke.outline = 1;
    container.addChild(developerTextStroke);

    // Developer text (main)
    developerText = new createjs.Text("click play button to start", "40px " + FONT_GAME, TEXT_COLOR);
    developerText.textAlign = "center";
    developerText.textBaseline = "alphabetic";
    developerText.x = developerTextStroke.x;
    developerText.y = developerTextStroke.y;
    container.addChild(developerText);

    // Logo
    // var logoSprite = s_oSpriteLibrary.getSprite("logo_ctl");
    // logo = createBitmap(logoSprite);
    // logo.regX = logoSprite.width / 2;
    // logo.regY = logoSprite.height / 2;
    // logo.x = CANVAS_WIDTH / 2;
    // logo.y = developerTextStroke.y + 100;
    // container.addChild(logo);
  };

  this.secret = function() {
    if (secretCounter === 5) {
    //   var secretTextStroke = new createjs.Text("WWW.CODETHISLAB.COM", "40px " + FONT_GAME, TEXT_COLOR_STROKE);
    //   secretTextStroke.textAlign = "center";
    //   secretTextStroke.textBaseline = "alphabetic";
    //   secretTextStroke.outline = 500;

    //   var secretText = new createjs.Text("WWW.CODETHISLAB.COM", "40px " + FONT_GAME, TEXT_COLOR);
    //   secretText.textAlign = "center";
    //   secretText.textBaseline = "alphabetic";
    //   secretText.outline = 500;
    //   secretText.outline = 1;

    //   var secretContainer = new createjs.Container();
    //   secretContainer.addChild(secretTextStroke);
    //   secretContainer.addChild(secretText);
    //   secretContainer.x = CANVAS_WIDTH_HALF;
    //   secretContainer.y = -secretTextStroke.getBounds().height;
    //   container.addChild(secretContainer);

    //   createjs.Tween.get(secretContainer)
    //     .to({ y: CANVAS_HEIGHT_HALF + 300 }, 1000, createjs.Ease.bounceOut)
    //     .wait(3000)
    //     .to({ alpha: 0 }, 1000, createjs.Ease.cubicOut)
    //     .call(function() {
    //       container.removeChild(secretTextStroke);
    //       secretCounter = 0;
    //     });
    }
    secretCounter++;
  };

  this.unload = function() {
    clickLayer.off("click", this._onLogoButRelease);
    exitButton.unload();
    exitButton = null;
    s_oStage.removeChild(container);
  };

  this._onLogoButRelease = function() {
   
  };

  this._init();
}