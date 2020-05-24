// 页面数据加载模块
function deepCopy(p, c) {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
};
var config = function($){
	var address = {
		'models':'data/models.json' //题型数据模板
		,'questionnaire_list':'data/questionnaire_list.json' //问卷列表
		,'questionnaire':'data/questionnaire.json' //问卷数据
	};
	return{
		protocol : address,
		ajaxGetData : function(type,url,success){
			$.ajax({
	            type : type, //GET || POST
	            url : url, //"data/list.json"
	            datatype :'json',
	            cache : false,
	            contentType : 'application/json',
	            success : function(res){
	            	var res = (typeof res == 'object') ? res :JSON.parse(res)
	               if(success){
	               		success(res);
	               }
	            },
	            error : function(res){
	            	console.log("数据格式异常")
	                console.log(res.responseText);
	            }
	        });
		}
	}
}(jQuery);
var _cover = {
    //显示弹窗
    showCover: function (callback) {
    	if(callback){
    		callback();
    	}
        var cover =  document.getElementById("covers");
        $(cover).addClass('show');
    },
    //关闭弹窗
    hideCover : function(){
        var e = event || window.event;
        $(e.target).parents('.covers').removeClass('show');
        $(e.target).parents('.covers').find('iframe').attr('src','');
    },
    //信息提示框展示
    showTips : function(message){
        var $tip = $('.tip_inner');
        $tip.find('.message').html(message);
        $tip.addClass('show');
        var clear = setTimeout(function(){
            $tip.removeClass('show');
            $tip = null;
            clearTimeout(clear);
        },1500);
    }
};
