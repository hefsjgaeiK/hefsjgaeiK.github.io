//=================================================================================================
// Transition Effects.js
//=================================================================================================
/*:
* @plugindesc 转场特效。
* @author 芯☆淡茹水
* @help
* 
* @param duration
* @desc 特效转场持续时间（帧）<最小限制：10>。
* @default 20
* 
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.te = XdRsData.te || {};
XdRsData.te.parameters = PluginManager.parameters('XdRs_TransitionEffects');
//=================================================================================================
Sprite.prototype.startXRtransition = function(duration, bitmap2, bitmap1, bgColor) {
    bitmap1 = bitmap1 || this.bitmap;
    if (!bitmap1 || !bitmap1.isReady() || !bitmap2 || !bitmap2.isReady()) return false;
    var maxWidth  = Math.max(bitmap1.width, bitmap2.width);
    var maxHeight = Math.max(bitmap1.height, bitmap2.height);
    this._transitionXR = {};
    this._transitionXR.duration = Math.max(10, duration);
    this._transitionXR.bitmap1 = bitmap1;
    this._transitionXR.bitmap2 = bitmap2;
    this._transitionXR.scale = 2 / duration;
    this._transitionXR.styleCount = duration / 2;
    this._transitionXR.maxHeight = maxHeight;
    this._transitionXR.mx = maxWidth / duration;
    this._transitionXR.mh = maxHeight / duration * 2;
    this.bitmap = new Bitmap(maxWidth, maxHeight);
    this._tfSprite = new Sprite(new Bitmap(maxWidth, maxHeight));
    bgColor && this.bitmap.fillAll(bgColor);
    this.addChild(this._tfSprite);
    return true;
};
Sprite.prototype.isTransferring = function() {
    return this._transitionXR && this._transitionXR.duration > 0;
};
Sprite.prototype.setEndTransitionMethod = function(method) {
    this._endTransitionMethod = method;
};
Sprite.prototype.onEndOfTransition = function() {
    this.bitmap = this._transitionXR.bitmap2;
    this._tfSprite = null;
    this._transitionXR = null;
    this._endTransitionMethod && this._endTransitionMethod();
};
XdRsData.te.Spriteupdate = Sprite.prototype.update;
Sprite.prototype.update = function() {
    XdRsData.te.Spriteupdate.call(this);
    this.updateTransitionEffect();
};
Sprite.prototype.updateTransitionEffect = function() {
    if (!this.isTransferring()) return;
    this.refreshTransitionStyle();
    this._transitionXR.duration--;
    !this.isTransferring() && this.onEndOfTransition();
};
Sprite.prototype.refreshTransitionStyle = function() {
    this._tfSprite.bitmap.clear();
    var data = this._transitionXR;
    var result = data.duration > data.styleCount;
    var bitmap = result ? data.bitmap1 : data.bitmap2;
    var bh = bitmap.height;
    var sh = data.mh * Math.abs(data.duration - data.styleCount);
    var fy = Math.abs(data.maxHeight - bh) / 2;
    var nh = (bh - sh) / bitmap.width;
    for (var i=0;i<bitmap.width;++i) {
        var rx = result ? i : bitmap.width - i;
        var rh = bh - nh * (result ? i : bitmap.width - i);
        var ry = (bh - rh) / 2 + fy;
        this._tfSprite.bitmap.blt(bitmap, i, 0, 1, bh, rx, ry, 1, rh);
    }
    this._tfSprite.scale.x -= data.scale;
    this._tfSprite.x += data.mx;
};
//=================================================================================================
SceneManager.prepareToTransition = function() {
    return [this.snap(), this._transitionBitmap];
};
SceneManager.snapForTransition = function() {
    this._transitionBitmap = this.snap();
};
SceneManager.isTransferring = function() {
    return this._scene && this._scene.isTransferring();
};
XdRsData.te.SceneManagerupdateInputData = SceneManager.updateInputData;
SceneManager.updateInputData = function() {
    !this.isTransferring() && XdRsData.te.SceneManagerupdateInputData.call(this);
};
//=================================================================================================
XdRsData.te.SBBterminate = Scene_Base.prototype.terminate;
Scene_Base.prototype.terminate = function() {
    XdRsData.te.SBBterminate.call(this);
    SceneManager.snapForTransition();
};
Scene_Base.prototype.isTransferring = function() {
    return !!this._transitionSprite;
};
XdRsData.te.SBBisBusy = Scene_Base.prototype.isBusy;
Scene_Base.prototype.isBusy = function() {
    return this.isTransferring() || XdRsData.te.SBBisBusy.call(this);
};
Scene_Base.prototype.needTransition = function() {
    return true;
};
XdRsData.te.SBBstart = Scene_Base.prototype.start;
Scene_Base.prototype.start = function() {
    if (this.needTransition()) return this.startTransition();
    XdRsData.te.SBBstart.call(this);
};
Scene_Base.prototype.startTransition = function() {
    this._transitionSprite = new Sprite();
    var data = SceneManager.prepareToTransition();
    var duration = +(XdRsData.te.parameters['duration'] || 20);
    var result = this._transitionSprite.startXRtransition(duration, data[0], data[1], 'black');
    if (result) {
        this._transitionSprite.setEndTransitionMethod(this.onAfterTransition.bind(this));
        this.addChild(this._transitionSprite);
    }else {
        this._transitionSprite = null;
        XdRsData.te.SBBstart.call(this);
    }
};
Scene_Base.prototype.onAfterTransition = function() {
    this.removeChild(this._transitionSprite);
    this._transitionSprite = null;
    XdRsData.te.SBBstart.call(this);
};
//=================================================================================================
// end
//=================================================================================================