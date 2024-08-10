//=============================================================================
// A XueYu Plugins - Video
// AXY_Video.js
// Version: 1.0
// License: MIT
//=============================================================================
/*:
 * @plugindesc v1.0 Allows to Change Video's staff.
 * @author A XueYu Plugins
 *
 * @param ForcePCVideoExt
 * @desc Force Video Ext. Leave blank to use this priority list: .webm, .mp4, .ogv. Default: .webm
 * @default .webm
 * 
 * @param ForceMobileVideoExt
 * @desc Force Video Ext. Leave blank to use this priority list: .webm, .mp4, .ogv. Default: .mp4
 * @default .mp4
 * 
 * @param SupportText
 * @desc Support Text. Default: Support
 * @default Support
 * 
 * @param NotSupportText
 * @desc Not Support Text. Default: Not Support
 * @default Not Support
 *
 * @help
 * Introduction
 * This plugin allows to Change Video's staff.
 * Example: 
 * 1.var support = AXY_Video.showSupport(); //then you got a variable named as support that is your client support videos;
 * 2.AXY_Video.play('test.mov') in script, test.mov in movies folder;
 * 3.known issus: must add event such as show text after AXY_Video.play('test.mov'), or the after one will covere before one;
 *
 * changelog
 * 1.0 2019.10.11
 * first release.
 */

// Imported
var Imported = Imported || {};
Imported.AXY_Video = true;

// Parameter Variables
var AXY = AXY || {};
AXY.Video = AXY.Video || {};

AXY.Video.Parameters = PluginManager.parameters('AXY_Video');
AXY.Video.Param = AXY.Video.Param || {};
AXY.Video.Alias = AXY.Video.Alias || {};

AXY.Video.Param.ForcePCVideoExt = String(AXY.Video.Parameters['ForcePCVideoExt']);
AXY.Video.Param.ForceMobileVideoExt = String(AXY.Video.Parameters['ForceMobileVideoExt']);
AXY.Video.Param.SupportText = String(AXY.Video.Parameters['SupportText']);
AXY.Video.Param.NotSupportText = String(AXY.Video.Parameters['NotSupportText']);

// Main
AXY.Video._detectCodecs = function () {
	var video = document.createElement('video');
	if (video.canPlayType) {
		this._canPlayWebmVP9 = video.canPlayType('video/webm; codecs="vp9, opus"');
		this._canPlayWebmVP8 = video.canPlayType('video/webm; codecs="vp8, vorbis"');
		this._canPlayMp4 = video.canPlayType('video/mp4');
		this._canPlayMp4H264 = video.canPlayType('video/mp4; codecs="avc1"');
		this._canPlayMp4AVC1MP4A = video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
		this._canPlayMp4H265 = video.canPlayType('video/mp4; codecs="hev1"') || video.canPlayType('video/mp4; codecs="hevc"') || video.canPlayType('video/mp4; codecs="h265"') || video.canPlayType('video/mp4; codecs="h.265"');
		this._canPlayOgg = video.canPlayType('video/ogg; codecs="theora, vorbis"');
	}
}
AXY.Video._detectCodecs()

Game_Interpreter.prototype.videoFileExt = function () {
	if (Utils.isMobileDevice()) {
		if (AXY.Video.Param.ForceMobileVideoExt) {
			return AXY.Video.Param.ForceMobileVideoExt;
		} else {
			if (AXY.Video._canPlayWebmVP9) {
				return '.webm';
			} else if (AXY.Video._canPlayWebmVP8) {
				return '.webm';
			} else if (AXY.Video._canPlayMp4) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4H264) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4AVC1MP4A) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4H265) {
				return '.mp4';
			} else if (AXY.Video._canPlayOgg) {
				return '.ogv';
			}
		}
	} else {
		if (AXY.Video.Param.ForcePCVideoExt) {
			return AXY.Video.Param.ForcePCVideoExt;
		} else {
			if (AXY.Video._canPlayWebmVP9) {
				return '.webm';
			} else if (AXY.Video._canPlayWebmVP8) {
				return '.webm';
			} else if (AXY.Video._canPlayMp4) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4H264) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4AVC1MP4A) {
				return '.mp4';
			} else if (AXY.Video._canPlayMp4H265) {
				return '.mp4';
			} else if (AXY.Video._canPlayOgg) {
				return '.ogv';
			}
		}
	}
};

AXY_Video = {
	showSupport: function () {
		var arr = new Array();
		arr.push('.webm(codecs="vp9, opus"): ' + (AXY.Video._canPlayWebmVP9 ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.webm(codecs="vp8, vorbis"): ' + (AXY.Video._canPlayWebmVP8 ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.mp4(codecs="avc/h264"): ' + (AXY.Video._canPlayMp4 ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.mp4(codecs="avc1"): ' + (AXY.Video._canPlayMp4H264 ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.mp4(codecs="avc1.42E01E, mp4a.40.2"): ' + (AXY.Video._canPlayMp4AVC1MP4A ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.mp4(codecs="hevc/h265"): ' + (AXY.Video._canPlayMp4H265 ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		arr.push('.ogv(codecs="theora, vorbis"): ' + (AXY.Video._canPlayOgg ? AXY.Video.Param.SupportText : AXY.Video.Param.NotSupportText))
		return arr.join('\n')
	},
	play: function (name) {
		Graphics.AXY_playVideo('movies/' + name)
		Graphics.isVideoPlaying();
		Game_Interpreter._waitMode = 'video'
		Game_Interpreter._index++;
	}
}

Graphics.AXY_playVideo = function (src) {
	this._video.src = src;
	this._video.onloadeddata = this._onVideoLoad.bind(this);
	this._video.onerror = this._videoLoader;
	this._video.onended = this._onVideoEnd.bind(this);
	this._videoLoading = true;
};