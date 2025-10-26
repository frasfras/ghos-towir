function CLeaderboardPanel(oSpriteBg) {
    var _oBg;
    var _oTitleTextStroke;
    var _oTitleText;
    var _oGroup;
    var _oButClose;
    var _aLeaderboardEntries = [];
    var _oLoadingText;

    this._init = function (oSpriteBg) {
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible = false;

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.7;
        _oGroup.addChild(oFade);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oGroup.addChild(_oBg);

        // Title
        _oTitleTextStroke = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, (CANVAS_HEIGHT/2)-250, 600, 80, 
                    80, "center", TEXT_COLOR_STROKE, FONT_GAME, 1,
                    0, 0,
                    "TODAY'S TOP 10",
                    true, true, false,
                    false );
        _oTitleTextStroke.setOutline(5);

        _oTitleText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, (CANVAS_HEIGHT/2)-250, 600, 80, 
                    80, "center", TEXT_COLOR, FONT_GAME, 1,
                    0, 0,
                    "TODAY'S TOP 10",
                    true, true, false,
                    false );

        // Loading text
        _oLoadingText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-200, CANVAS_HEIGHT_HALF - 50, 400, 40, 
                    40, "center", TEXT_COLOR, FONT_GAME, 1,
                    0, 0,
                    "Loading...",
                    true, true, false,
                    false );

        // Close button
        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_exit");
        _oButClose = new CGfxButton(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 200, oSpriteButHome, _oGroup);
        _oButClose.addEventListener(ON_MOUSE_DOWN, this._onClose, this);

        _oGroup.on("click", function () {});
        s_oStage.addChild(_oGroup);
    };

    this.unload = function () {
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        if (_oButClose) {
            _oButClose.unload();
            _oButClose = null;
        }
        this._clearLeaderboardEntries();
    };

    this._clearLeaderboardEntries = function() {
        for (var i = 0; i < _aLeaderboardEntries.length; i++) {
            _oGroup.removeChild(_aLeaderboardEntries[i]);
        }
        _aLeaderboardEntries = [];
    };

    this.show = function () {
        _oGroup.visible = true;
        _oLoadingText.getText().visible = true;
        
        createjs.Tween.get(_oGroup).to({alpha: 1}, 500, createjs.Ease.cubicOut);
        
        // Fetch leaderboard data
        this._fetchLeaderboard();
    };

    this._fetchLeaderboard = function() {
        var oThis = this;
        
        fetch('/api/leaderboard')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function(data) {
                oThis._displayLeaderboard(data.entries || []);
            })
            .catch(function(error) {
                console.error('Error fetching leaderboard:', error);
                oThis._displayError();
            });
    };

    this._displayLeaderboard = function(entries) {
        _oLoadingText.getText().visible = false;
        this._clearLeaderboardEntries();

        if (entries.length === 0) {
            var oNoDataText = new CTLText(_oGroup, 
                        CANVAS_WIDTH/2-200, CANVAS_HEIGHT_HALF - 50, 400, 40, 
                        40, "center", TEXT_COLOR, FONT_GAME, 1,
                        0, 0,
                        "No scores today yet!",
                        true, true, false,
                        false );
            _aLeaderboardEntries.push(oNoDataText.getText());
            return;
        }

        var startY = CANVAS_HEIGHT_HALF - 150;
        var entryHeight = 35;

        for (var i = 0; i < Math.min(entries.length, 10); i++) {
            var entry = entries[i];
            var rank = i + 1;
            var yPos = startY + (i * entryHeight);
            
            // Rank and username
            var rankText = rank + ". " + entry.username;
            var oRankText = new CTLText(_oGroup, 
                        CANVAS_WIDTH/2-280, yPos, 350, 30, 
                        30, "left", TEXT_COLOR, FONT_GAME, 1,
                        0, 0,
                        rankText,
                        true, true, false,
                        false );
            _aLeaderboardEntries.push(oRankText.getText());

            // Score
            var oScoreText = new CTLText(_oGroup, 
                        CANVAS_WIDTH/2+50, yPos, 200, 30, 
                        30, "right", TEXT_COLOR, FONT_GAME, 1,
                        0, 0,
                        entry.score.toString(),
                        true, true, false,
                        false );
            _aLeaderboardEntries.push(oScoreText.getText());
        }
    };

    this._displayError = function() {
        _oLoadingText.getText().visible = false;
        this._clearLeaderboardEntries();

        var oErrorText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-200, CANVAS_HEIGHT_HALF - 50, 400, 40, 
                    40, "center", TEXT_COLOR, FONT_GAME, 1,
                    0, 0,
                    "Failed to load leaderboard",
                    true, true, false,
                    false );
        _aLeaderboardEntries.push(oErrorText.getText());
    };

    this._onClose = function () {
        var oParent = this;
        createjs.Tween.get(_oGroup, {override: true}).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
            oParent.unload();
        });
    };

    this._init(oSpriteBg);
    return this;
}