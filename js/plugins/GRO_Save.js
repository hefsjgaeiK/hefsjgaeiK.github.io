//=============================================================================
// GRO_Save.js v1.0
// by Grothendieck
// Last Updated: 2020.11.7
//=============================================================================
//====================================================================================================================
/*:
 * @plugindesc 
 * GRO存档插件
 * @author Grothendieck
 * @help
 *---------------------------------------------------------------------------------------------------------
 *  插件帮助
 *---------------------------------------------------------------------------------------------------------
 * 插件命令：gro_save_set 
 * 要使存档数目限制为2 就使用插件指令 gro_save_set 2
 *---------------------------------------------------------------------------------------------------------
 */
//====================================================================================================================
var Grothendieck = Grothendieck || {};
Grothendieck.save = Grothendieck.save || {};
Grothendieck.save_amount = null;

Grothendieck.save.DataManager_maxSavefiles = DataManager.maxSavefiles;
DataManager.maxSavefiles = function() {
       return Grothendieck.save_amount || Grothendieck.save.DataManager_maxSavefiles();
};

Grothendieck.save.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Grothendieck.save.Game_Interpreter_pluginCommand.call(this, command, args);
	switch ( command ) {
	case 'save_limit':
		Grothendieck.save_amount = eval(args[0]);
		return false;
	}
}