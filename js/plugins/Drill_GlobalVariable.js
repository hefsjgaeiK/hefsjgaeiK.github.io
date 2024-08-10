//=============================================================================
// Drill_GlobalVariable.js
//=============================================================================

/*:
 * @plugindesc [v1.0]        系统 - 跨存档的变量
 * @author Drill_up
 * 
 * @param 跨存档的开关
 * @type switch[]
 * @desc 设置指定的开关能够跨存档存储。
 * @default ["0"]
 * 
 * @param 跨存档的变量
 * @type variable[]
 * @desc 设置指定的变量能够跨存档存储。
 * @default ["22"]
 * 
 * @help  
 * =============================================================================
 * +++ Drill_GlobalVariable +++
 * 作者：Drill_up
 * 如果你有兴趣，也可以来看看我的mog中文全翻译插件哦ヽ(*。>Д<)o゜
 * https://rpg.blue/thread-409713-1-1.html
 * =============================================================================
 * 你可以设置某个变量完全跨存档，存档A触发的开关，在存档B以及
 * 所有存档都会生效。
 * 具体说明，去看看"全局存储"。
 * 
 * -----------------------------------------------------------------------------
 * ----使用方法
 * 1.你可以设置整个游戏中只有一次的奖励。
 * 2.你可以将游戏做成metagame，给玩家造成心理阴影。
 * 3.请一定要谨慎设置变量，逻辑整理清楚后设置，不然你的剧情线
 * 会被搅得一团糟。
 *
 * -----------------------------------------------------------------------------
 * ----更新日志
 * [v1.0]
 * 完成插件ヽ(*。>Д<)o゜
 */
 
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//插件记录：
//		【该插件将存储数据转为全局变量】
//
 
//=============================================================================
// ** 变量获取
//=============================================================================
　　var Imported = Imported || {};
　　Imported.Drill_GlobalVariable = true;
　　var DrillUp = DrillUp || {}; 

    DrillUp.parameters = PluginManager.parameters('Drill_GlobalVariable');
	if(DrillUp.parameters['跨存档的开关'] != "" ){
		DrillUp.global_var_switch_id = JSON.parse(DrillUp.parameters['跨存档的开关']);
	}else{
		DrillUp.global_var_switch_id = [];
	}
	if(DrillUp.parameters['跨存档的变量'] != "" ){
		DrillUp.global_var_variable_id = JSON.parse(DrillUp.parameters['跨存档的变量']);
	}else{
		DrillUp.global_var_variable_id = [];
	}
	
//=============================================================================
// ** 全局读取
//=============================================================================
	var _drill_global = DataManager.loadGlobalInfo();
	//alert(JSON.stringify(_drill_global));
	if( !DrillUp.global_var_switch ){	//游戏没关情况
		if( _drill_global && _drill_global[0] && _drill_global[0]["_global_var_switch"] ){		//游戏关闭后，重开读取global中的配置
			DrillUp.global_var_switch = _drill_global[0]["_global_var_switch"];
		}else{
			DrillUp.global_var_switch = [];
		}
	}
	if( !DrillUp.global_var_variable ){	
		if( _drill_global && _drill_global[0] && _drill_global[0]["_global_var_variable"] ){
			DrillUp.global_var_variable = _drill_global[0]["_global_var_variable"];
		}else{
			DrillUp.global_var_variable = [];
		}
	}
	
//=============================================================================
// ** 全局存储
//=============================================================================
var _drill_Game_Variables_saveGlobal = DataManager.saveGlobalInfo;
DataManager.saveGlobalInfo = function(info) {	//第0个存档为全局存档
	if(!info[0]){info[0] = []};
	info[0]["_global_var_switch"] = DrillUp.global_var_switch;
	info[0]["_global_var_variable"] = DrillUp.global_var_variable;
	_drill_Game_Variables_saveGlobal.call(this,info);
};
DataManager.forceSaveGlobalInfo = function() {		//强制存储（任何改变的全局变量的地方都需要调用该方法）
	var globalInfo = this.loadGlobalInfo() || [];
	globalInfo[0] = this.makeSavefileInfo();
	this.saveGlobalInfo(globalInfo);
};

//=============================================================================
// ** 读取地图赋值
//=============================================================================
var _drill_Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _drill_Game_Map_initialize.call(this);
	for(var i = 0; i< DrillUp.global_var_variable_id.length ;i++ ){
		var v_id = Number(DrillUp.global_var_variable_id[i]);
		$gameVariables._data[v_id] = DrillUp.global_var_variable[v_id];
	}
	for(var i = 0; i< DrillUp.global_var_switch_id.length ;i++ ){
		var v_id = Number(DrillUp.global_var_switch_id[i]);
		$gameSwitches._data[v_id] = DrillUp.global_var_switch[v_id];
	}
};
//=============================================================================
// ** 读取存档赋值
//=============================================================================
var _drill_Game_Variables_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	_drill_Game_Variables_extractSaveContents.call(this,contents);
	for(var i = 0; i< DrillUp.global_var_variable_id.length ;i++ ){
		var v_id = Number(DrillUp.global_var_variable_id[i]);
		$gameVariables._data[v_id] = DrillUp.global_var_variable[v_id];
	}
	for(var i = 0; i< DrillUp.global_var_switch_id.length ;i++ ){
		var v_id = Number(DrillUp.global_var_switch_id[i]);
		$gameSwitches._data[v_id] = DrillUp.global_var_switch[v_id];
	}
}
//=============================================================================
// ** 开关控制
//=============================================================================
var _drill_Game_Switches_setValue = Game_Switches.prototype.setValue;
Game_Switches.prototype.setValue = function(switchId, value) {
    _drill_Game_Switches_setValue.call(this,switchId, value);
	for(var i=0; i< DrillUp.global_var_switch_id.length ;i++ ){
		if( DrillUp.global_var_switch_id[i] == switchId ){
			DrillUp.global_var_switch[switchId] = value;
			
			DataManager.forceSaveGlobalInfo();	//值变化后，立即保存
			break;
		}
	}
};

//=============================================================================
// ** 变量控制
//=============================================================================
var _drill_Game_Variables_setValue = Game_Variables.prototype.setValue;
Game_Variables.prototype.setValue = function(switchId, value) {
    _drill_Game_Variables_setValue.call(this,switchId, value);
	for(var i=0; i< DrillUp.global_var_variable_id.length ;i++ ){
		if( DrillUp.global_var_variable_id[i] == switchId ){
			DrillUp.global_var_variable[switchId] = value;
			
			DataManager.forceSaveGlobalInfo();	//值变化后，立即保存
			break;
		}
	}
};

