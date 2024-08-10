/*:
 * ChineseNameEditor.js
 * @plugindesc 中文名输入插件
 * @author 魏玉龙
 * @since 2018.09.15
 * @version 1.0
 *
 * @param windowWidth
 * @desc 设置窗口的宽度
 * @default 580
 *
 * @param windowCenter
 * @desc 设置为屏幕居中 true/false
 * @default true
 *
 * @param windowOpacity
 * @desc 设置窗口透明度 (0 ~ 255)
 * @default 225
 *
 * @param askingText
 * @desc 设置询问框文本
 * @default 请输入一个角色名！
 *
 * @param fontColor
 * @desc 设置字体颜色
 * @default white
 *
 * @param fontSize
 * @desc 设置字体大小
 * @default 28
 *
 * @param showDefaultName
 * @desc 显示默认角色名 true/false
 * @default true
 * 
 * @help
 *
 * 这个插件提供了一个输入框，可以让你在修改名称时输入中文文字
 * 
 */
(function () {
  var parameters = PluginManager.parameters('ChineseNameEditor');
  var windowWidth = Number(parameters['windowWidth'] || 580);
  var windowCenter = JSON.parse(parameters['windowCenter'] || true);
  var windowOpacity = Number(parameters['windowOpacity'] || 225);
  var askText = String(parameters['askingText'] || '请输入一个角色名！');
  var fontSize = Number(parameters['fontSize'] || 28);
  var fontColor = String(parameters['fontColor'] || 'white');
  var showDefaultName = JSON.parse(parameters['showDefaultName'] || true);
 
  function TextBox() {
    this.initialize.apply(this, arguments);
  };
  TextBox.prototype.initialize = function (_editWindow) {
    this._editWindow = _editWindow;
    this.createTextBox();
    this.getFocus();
  };
  TextBox.prototype.createTextBox = function () {
    this._textBox = document.createElement('input');
    this._textBox.type = 'text';
    this._textBox.value = showDefaultName ? this._editWindow._name : '';
    this._textBox.autofocus = false;
    this._textBox.width = 1;
    this._textBox.height = 1;
    this._textBox.style.opacity = 0;
    this._textBox.style.zIndex = 1000;
    this._textBox.style.imeMode = 'active';
    this._textBox.style.position = 'absolute';
    this._textBox.style.top = 0;
    this._textBox.style.left = 0;
    this._textBox.style.right = 0;
    this._textBox.style.bottom = 0;
    this._textBox.onkeydown = this.onKeyDown.bind(this);
    document.body.appendChild(this._textBox);
  };
  TextBox.prototype.setEvent = function (func) {
    this._textBox.onchange = func;
  };
  TextBox.prototype.terminateTextBox = function () {
    document.body.removeChild(this._textBox);
  };
  TextBox.prototype.onKeyDown = function (e) {
    var keyCode = e.which;
    this.getFocus();
    if (keyCode < 32) {
      if (keyCode === 8) {
        this.backSpace();
      } else if (keyCode === 13) {
        if (this.getTextLength() <= 0) {
          e.preventDefault();
        }
      }
    }
  };
  TextBox.prototype.getTextLength = function () {
    return this._textBox.value.length;
  };
  TextBox.prototype.getMaxLength = function () {
    return this._editWindow._maxLength;
  };
  TextBox.prototype.backSpace = function () {
    this._editWindow._name = this._editWindow._name.slice(0, this._textBox.value.length - 1);
    this._editWindow._index = this._textBox.value.length;
    this._textBox.value = this._editWindow._name;
    this._editWindow.refresh();
  };
  TextBox.prototype.refreshNameEdit = function () {
    this._editWindow._name = this._textBox.value.toString();
    this._editWindow._index = this._textBox.value.length || 0;
    this._editWindow.refresh();
  };
  TextBox.prototype.update = function () {
    if (this.getTextLength() <= this._editWindow._maxLength) {
      this.refreshNameEdit();
    }
  };
  TextBox.prototype.getFocus = function () {
    this._textBox.focus();
  };
  TextBox.prototype.terminate = function () {
    this.terminateTextBox();
  };
 
  Window_NameEdit.prototype.charWidth = function () {
    var text = '\uAC00';
    return this.textWidth(text)
  };
  Window_NameEdit.prototype.drawActorFace = function (actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    this.changeTextColor(this.hpColor(actor));
    this.drawText(askText, this.left(), y + this.fittingHeight(1) / 2, this.width);
  };
  Window_NameEdit.prototype.itemRect = function (index) {
    return {
      x: this.left() + index * this.charWidth(),
      y: this.fittingHeight(1),
      width: this.charWidth(),
      height: this.lineHeight()
    };
  };
  Window_NameEdit.prototype.windowWidth = function () {
    return windowWidth;
  };
  Window_NameEdit.prototype.drawChar = function (index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.contents.outlineWidth = 1;
    this.contents.outlineColor = 'black';
    this.contents.fontColor = fontColor;
    this.drawText(this._name[index] || '', rect.x, rect.y)
  };
  Window_NameEdit.prototype.standardFontSize = function () {
    return fontSize;
  };
 
  Scene_Name.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createTextBox();
    this._textBox.setEvent(this.onInputOk.bind(this));
  };
  Scene_Name.prototype.createTextBox = function () {
    this._textBox = new TextBox(this._editWindow);
    if (windowCenter) {
      this._editWindow.y = Graphics.boxHeight / 2 - this._editWindow.height / 2;
    }
    this._editWindow.opacity = windowOpacity;
  };
  Scene_Name.prototype.update = function () {
    this._textBox.getFocus();
    this._textBox.update();
    Scene_MenuBase.prototype.update.call(this);
    if(Input.isRepeated('ok')){
      this.onInputOk();
    }
  };
  Scene_Name.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);
    this._textBox.terminate();
  };
})();
