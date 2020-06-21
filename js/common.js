//根据相对路径获取绝对路径
function getPath(relativePath, absolutePath) {
	var reg = new RegExp("\\.\\./", "g");
	var uplayCount = 0; // 相对路径中返回上层的次数。
	var m = relativePath.match(reg);
	if(m) uplayCount = m.length;

	var lastIndex = absolutePath.length-1; 
    for(var i=0;i<=uplayCount;i++){
        lastIndex = absolutePath.lastIndexOf("/",lastIndex-1);
    }
    return absolutePath.substr(0,lastIndex+1) + relativePath.replace(reg,"");
}

$.getSelfSrc = function() {
	return $('script')[$('script').length - 1].src;
}

$.getSelfName = function() {
	var scriptSrc = $.getSelfSrc();
	return scriptSrc.split('/')[scriptSrc.split('/').length - 1];
}

$.getPath = function(url){
	return url.substr(0, url.lastIndexOf("/")+1);
}

$.include = function(jsSrc) {
	var baseSrc = $.getSelfSrc();
	var basePath;
	// common.js使用相对路径,先替换成绝对路径
	if(baseSrc.indexOf("http://") != 0 && baseSrc.indexOf("/") != 0) {
		var url = location.href;
		var index = url.indexOf("?");
		if(index != -1) {
			url = url.substring(0, index - 1);
		}
		baseSrc = getPath(baseSrc, url);
	}
	basePath=$.getPath(baseSrc);
	var srcArr = jsSrc.split("|"); // 可以include多个js，用|隔开
	for(var i = 0; i < srcArr.length; i++) {
		//console.log(srcArr[i])
		// 使用juqery的同步ajax加载js.
		// 使用document.write 动态添加的js会在当前js的后面，可能会有js引用问题
		// 动态创建script脚本，是非阻塞下载，也会出现引用问题
		$.ajax({
			type: 'GET',
			url: getPath(srcArr[i], baseSrc),
			async: false,
			dataType: 'script'
		});
		/*$.getScript(getPath(srcArr[i], baseSrc), function(data, textStatus, jqxhr) {
		   //console.log(data); //data returned
		   console.log(textStatus); //success
		   console.log(jqxhr.status); //200
		   console.log('Load was performed.');
		});*/
		/*if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
                var script = document.createElement("script")
                script.src=basePath+srcArr[i];
                //script.src = "http://localhost:8008/plugins/af.desktopBrowsers.js";
                var tag = $("head").append(script);
				//$.os.desktop=true;
		}*/
		
	}
}
$.include('lang.en_US.js|js.cookie.min.js|jquery.validate.min.js|jquery.easing.min.js|jquery.bsModal.js|jquery.vticker.js|jquery.form.js');

$(function() {
	//Use in Page: bind button class .modalBtn src block-target='signin'
	//Use in Modal: bind button class .modalPopBtn src block-target='signin'
	$.fn.bsModal();
});
var autoDirect = function(s, url) {
	setTimeout(function() {
		s--;
		if(s > 0) {
			$('.directLink').attr('href', url);
			$('.directTime').html('[' + s + '秒]');
			autoDirect(s, url);
		} else {
			window.location.href = url;
		}
	}, 1000);
}