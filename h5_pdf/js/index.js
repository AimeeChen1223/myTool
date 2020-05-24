var matrix_arr = [1,0,0,1,0,0];
var mediaIndex = 0;
$(window).ready(function(){
    common.setPageScroll();
    common.selectModel();
    common.pageEvent();
    pageUI.initElement();
	widgetUI.widgetEvent();
	animate.setAnimate();
	editor.setEditorData();
	pageView.elementDisplay();
	// pageView.leftPageView();
	editor.addEvent();
	level.addEvent();
	
    var clear1 = setTimeout(function(){
		common.colorPicker();
		process_bar.sliderEvent();
		clearTimeout(clear1);
	},1000);
});

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
}

//数组原型 --> 深度复制
Array.prototype.clone = function() {
    var len = this.length;
    var arr = [];
    for(var i = 0;i < len;i++) {
        if(typeof this[i] == "object") {
            arr.push(this[i]);
        } else {
            arr.push(this[i].clone());
        }
    }
    return arr;
}

$(window).resize(function(){
    common.setPageScroll();
});

var common = function($){
	function pageLoad(){
		$('.js_insert').each(function(){
			var _this = $(this);
			var _url = _this.attr('data-page');
			_this.load(_url);
		});
	};
	function rightCheck(){
		$('.js_right_type').on('click','a',function(){
			var _this = $(this);
			var _parent = _this.parent();
			if(!_this.hasClass('active')){
				_parent.addClass('active').siblings().removeClass('active');
				var _index = _parent.index();
				$('.js_right_target>li').eq(_index).removeClass('hide').siblings().addClass('hide');
			}
			_parent = null;
			_this = null;
		});
	};
	return{
		pageEvent : function(){
			pageLoad();
			rightCheck();
		},
		selectModel : function(){
			$(document).on('click','.js_select_module>ul a',function(){
				var _this = $(this);
				var _value = _this.attr('data-value');
				var _text = _this.text();
				var _target = _this.parents('.js_select_module').find('a.clearfix').find('span');
				_target.text(_text).attr('data-value',_value).attr('title',_text);
			});
		},
		colorPicker : function(){
			$('.color_picker').paletteColorPicker({
			    colors: [
			      {"primary": "#E91E63"},
			      {"primary_dark": "#C2185B"},
			      {"primary_light": "#F8BBD0"},
			      {"accent": "#CDDC39"},
			      {"primary_text": "#212121"},
			      {"secondary_text": "#727272"},
			      {"divider": "#B6B6B6"}
			    ],
			    position: 'downside' // default -> 'upside'
			});
		},
		setPageScroll : function(){
		    global.winH = $(window).height();
		    $('.js_get_h').height(global.winH-70);
		    $('.js_scroll').slimScroll({
		        height: global.winH-70+'px'
		    });
		}
	}
}(jQuery);

// var app = function(a){var b = 1;b = a;return b;};

// app.prototype.add = function(){console.log(this);};

// app.prototype.delete = function(){};

// app.prototype.add();

var pageUI = function($){
	function pagelist(data,index){
		var i = 0,len = data.length;
		var _target = $('.js_left_page');
		_target.empty();
		for(; i < len; i++){
			createSinglePage(i,_target);
		}
		pageView.leftPageView();
		_target = null;
	};
	function createSinglePage(index,target){
		var _html = '<li class="clearfix edit">\
						<div class="pull-right align_r w50">\
							<span class="f24 color_3">'+(index+1)+'</span>\
							<ul class="edit_list">\
								<li>\
									<a href="javascript:;" class="js_edit_page" tag="add">\
										<img src="../img/icon_14.png" />\
									</a>\
								</li>\
								<li>\
									<a href="javascript:;" class="js_edit_page" tag="copy">\
										<img src="../img/icon_8.png" />\
									</a>\
								</li>\
								<li>\
									<a href="javascript:;" class="js_edit_page" tag="delete">\
										<img src="../img/icon_10.png" />\
									</a>\
								</li>\
							</ul>\
						</div>\
						<div class="add_page">\
							<a href="#"></a>\
						</div>\
					</li>';
		var $li = $(_html).appendTo(target);
		if(index == global.pageIndex){
			$li.addClass('active');
			widgetUI.initElement();
		}
		$li = null;
	};
	function pageEvent(){
		$(document).on('click','.js_left_page>li',function(){
			var _this = $(this);
			if(!_this.hasClass('active')){
				var _index = _this.index();
				global.pageIndex = _index;
				widgetUI.initElement();
				_this.addClass('active').siblings().removeClass('active');
				//console.log('current',global.pageIndex,global.initData[global.pageIndex]);
			}
		});
		$(document).on('click','.js_edit_page',function(){
			var _this = $(this);
			var _parent = _this.parents('li.edit');
			var _index = _parent.index();
			var tag = _this.attr('tag');
			switch(tag){
				case 'add':
					var widgetArr = new Array();
					global.initData.splice(_index,0,widgetArr);
					global.pageIndex = _index+1;
					break;
				case 'copy':
					var newArr = [];
					newArr = deepCopy(global.initData[_index],newArr);
					// var newArr = global.initData[_index].clone();
					global.initData.splice(_index,0,newArr);
					//console.log(global.pageIndex,global.initData[global.pageIndex]);
					global.pageIndex = _index+1;
					//console.log(global.pageIndex,global.initData[global.pageIndex]);
					break;
				case 'delete':
					global.pageIndex = 0;
					global.initData.splice(_index,1);
				break;
				default:
					var arr = new Array();
					global.initData.push(arr);
					global.pageIndex = global.initData.length-1;
				break;
			}
			if(global.initData.length == 0){
				$('#module').empty();
			}
			pagelist(global.initData,global.pageIndex);
			_parent = null;_this = null;
		});
	};
	return{
		initElement : function(){
			pagelist(global.initData,global.pageIndex);
			pageEvent();
		}
	}
}(jQuery);

var widgetUI = function($){
	var target = {};
	var _pos = {};
	function createSingleWidget(index,obj,_target){
		var $handle = $('<div class="widget_content ui-draggable ui-draggable-handle" z-index='+index+' key='+obj.widget_name+'></div>').appendTo(_target);
		var $type = $('<div class="animated">'+obj.htmlStr+'</div>').appendTo($handle);
		var _scope = '<div class="widget_scope ui-draggable js_widget_scope" iscurrent="true">\
							<div class="handle ui-draggable-handle nw" resize-dir="nw"></div>\
							<div class="handle ui-draggable-handle n" resize-dir="n"></div>\
							<div class="handle ui-draggable-handle ne" resize-dir="ne"></div>\
							<div class="handle ui-draggable-handle e" resize-dir="e"></div>\
							<div class="handle ui-draggable-handle se" resize-dir="se"></div>\
							<div class="handle ui-draggable-handle s" resize-dir="s"></div>\
							<div class="handle ui-draggable-handle sw" resize-dir="sw"></div>\
							<div class="handle ui-draggable-handle w" resize-dir="w"></div>\
						</div>'; 
		var $scope = $(_scope).appendTo($handle);
		if(obj.widget_name == 'image'){
			$handle.find('.animated').find('img').attr('src',obj.src);
		}
		obj.viewer.width = (obj.viewer.width != undefined) ? obj.viewer.width : $handle.width();
		obj.viewer.height = (obj.viewer.height != undefined) ? obj.viewer.height : $handle.height();
		$handle.css({
			'width':obj.viewer.width,
			'height':obj.viewer.height,
			'left':obj.viewer.left,
			'top':obj.viewer.top,
			'z-index':obj.editor.zIndex
		});
		if(index == global.initData[global.pageIndex].length-1){
			$handle.addClass('active').siblings().removeClass('active');
			animate.setWidgetAnimate($handle);
		}
		//获取新增控件的动画数据并生成列表
		animate.createList(index); 
		singleEvent($handle);
		$scope = null;$type = null;$handle = null;
	};

	function widgetDisplace(t,str){
		var _index = t.helper.index();
		if(str == 'move'){
			$('.js_pos_x').val(t.position.left+'px');
			$('.js_pos_y').val(t.position.top+'px');
		}else if(str == 'stop'){
			global.initData[global.pageIndex][_index].viewer.left = t.position.left;
			global.initData[global.pageIndex][_index].viewer.top = t.position.top;
		}
	};

	function widgetResize(t,str){
		var _type = t.helper.attr('resize-dir');
		var _target = t.helper.parents('.widget_content');
		var _index = _target.index();
		switch(_type){
			case 'nw':
				switch(str){
					case 'start':
						target.left = global.initData[global.pageIndex][_index].viewer.left;
						target.top = global.initData[global.pageIndex][_index].viewer.top;
						target.width = global.initData[global.pageIndex][_index].viewer.width;
						target.height = global.initData[global.pageIndex][_index].viewer.height;
					break;
					case 'move':
						var width = target.width - t.position.left;
						var height = target.height - t.position.top;
						var left = target.left + t.position.left;
						var top = target.top + t.position.top;
						setParameter(_target,width,height,left,top);
						break;
					case 'stop':
						t.helper.css({'left':'0','top':'0'});
						target = {};
					break;
				}
				break;
			case 'n':
				switch(str){
					case 'start':
						_pos.left = t.position.left;
						target.top = global.initData[global.pageIndex][_index].viewer.top;
						target.height = global.initData[global.pageIndex][_index].viewer.height;
						break;
					case 'move':
						t.position.left = _pos.left;
						var height = target.height - t.position.top;
						var top = target.top + t.position.top;
						setParameter(_target,'',height,'',top);
						break;
					case 'stop':
						t.helper.css({'left':'50%','top':'0'});
						_pos = {};
						target = {};
					break;
				}
				break;
			case 'ne':
				switch(str){
					case 'start':
						target.top = global.initData[global.pageIndex][_index].viewer.top;
						target.height = global.initData[global.pageIndex][_index].viewer.height;
					break;
					case 'move':
						var top = target.top + t.position.top;
						var width = t.position.left;
						var height = target.height - t.position.top;
						setParameter(_target,width,height,'',top);
						break;
					case 'stop':
						t.helper.css({'left':'100%','top':'0'});
						target = {};
						break;
				}
				break;
			case 'e':
				switch(str){
					case 'start':
						_pos.top = t.position.top;
						break;
					case 'move':
						t.position.top = _pos.top;
						setParameter(_target,t.position.left,'','','');
						break;
					case 'stop':
						t.helper.css({'left':'100%','top':'50%'});
						_pos = {};
					break;
				}
				break;
			case 'se':
				switch(str){
					case 'start':
					break;
					case 'move':
						setParameter(_target,t.position.left,t.position.top,'','');
						break;
					case 'stop':
						t.helper.css({'left':'100%','top':'100%'});
					break;
				}
				break;
			case 's':
				switch(str){
					case 'start':
						_pos.left = t.position.left;
					break;
					case 'move':
						t.position.left = _pos.left;
						setParameter(_target,'',t.position.top,'','');
						break;
					case 'stop':
						t.helper.css({'left':'50%','top':'100%'});
						_pos = {};
					break;
				}
				break;
			case 'sw':
				switch(str){
					case 'start':
						target.left = global.initData[global.pageIndex][_index].viewer.left;
						target.width = global.initData[global.pageIndex][_index].viewer.width;
						target.height = global.initData[global.pageIndex][_index].viewer.height;
					break;
					case 'move':
						var width = target.width - t.position.left;
						var height = t.position.top;
						var left = target.left + t.position.left;
						setParameter(_target,width,height,left,'');
						break;
					case 'stop':
						t.helper.css({'left':'0','top':'100%'});
						target = {};
					break;
				}
				break;
			case 'w':
				switch(str){
					case 'start':
						_pos.top = t.position.top;
						target.left = global.initData[global.pageIndex][_index].viewer.left;
						target.width = global.initData[global.pageIndex][_index].viewer.width;
					break;
					case 'move':
						t.position.top = _pos.top;
						var width = target.width - t.position.left;
						var left = target.left + t.position.left;
						setParameter(_target,width,'',left,'');
						break;
					case 'stop':
						t.helper.css({'left':'0','top':'50%'});
						_pos = {};
						target = {};
					break;
				}
				break;
		}
	};

	function setParameter(_target,width,height,left,top){
		var _index = _target.index();
		if(left != ''){
			_target.css({'left':left+'px'});
			global.initData[global.pageIndex][_index].viewer.left = left;
			$('.js_pos_x').val(left+'px');
		}
		if(top != ''){
			_target.css({'top':top+'px'});
			global.initData[global.pageIndex][_index].viewer.top = top;
			$('.js_pos_y').val(top+'px');
		}
		if(width != ''){
			_target.width(width);
			global.initData[global.pageIndex][_index].viewer.width = width;
			$('.js_element_w').val(width+'px');
		}
		if(height != ''){
			_target.height(height);
			global.initData[global.pageIndex][_index].viewer.height = height;
			$('.js_element_h').val(height+'px');
		}
	};

	function singleEvent($obj){
		$obj.on('click',function(){
		 	var _this = $(this);
		 	if(!_this.hasClass('active')){
		 		var _index = _this.index();
		 		global.widgetIndex = _index;
		 		_this.addClass('active').siblings().removeClass('active');
		 		var _target = $('.js_widget_level');
		 		_target.find('li').eq(_index).addClass('active').siblings().removeClass('active');
		 		animate.createList(global.widgetIndex);
		 		editor.setEditorData();
		 	}
		 });

		$obj.draggable({ 
			drag:function(e,t){
				widgetDisplace(t,'move');
			},
			stop:function(e,t){
				widgetDisplace(t,'stop');
				pageView.createPageWidget(global.initData[global.pageIndex],$('.js_left_page>li.active'));
			}
		});

		$obj.find('.handle').draggable({
			start:function(e,t){
				widgetResize(t,'start');
			},
			drag:function(e,t){
				widgetResize(t,'move');
			},
			stop:function(e,t){
				widgetResize(t,'stop');
				pageView.createPageWidget(global.initData[global.pageIndex],$('.js_left_page>li.active'));
			}
		});
	};
	return{
		initElement : function(){ 
			widgetUI.widgetList(global.initData,global.pageIndex);
			level.createLevel(global.initData,global.pageIndex);
		},

		widgetList : function (data,index){
			// console.log('widgetList',data,index);
			var _target = $('#module').empty();
			var i = 0,len = data[index].length;
			for(; i < len; i++){
				createSingleWidget(i,data[index][i],_target);
			}
			// pageView.leftPageView();
			_target = null;
		},
		widgetEvent : function(){
			$(document).on('click','.js_add_widget',function(){
				var _this = $(this);
				var _type = _this.attr('data-type');
				var _target = $('#module');
				var obj = {
				 	'widget_name' : _type,
				 	'viewer' : global.typeData[_type].viewer,
				 	'htmlStr' : global.typeData[_type].htmlStr,
				 	'animate' : [],
				 	'editor' : ''
				};
				if(_type == 'image'){
				 	obj.src = _this.find('img').attr('src');
				}
			 	global.initData[global.pageIndex].push(obj);
			 	global.widgetIndex = global.initData[global.pageIndex].length-1;
				createSingleWidget(global.widgetIndex,obj,_target);
				level.createSingleLevel(global.widgetIndex,$('.js_widget_level'));
				pageView.createPageWidget(global.initData[global.pageIndex],$('.js_left_page>li.active'));
				matrix_arr = [1,0,0,1,0,0]; //控件变形数据初始化
			});

			$(document).on('click','.js_bg_music',function(){
				//console.log(mediaIndex);
				var _this = $(this);
				if(_this.hasClass('active')){
					_this.removeClass('active');
					var _target = $('.module').find('.widget_content').eq(mediaIndex);
					global.initData[global.pageIndex].splice(mediaIndex,1);
					var $level = $('.js_widget_level>li').eq(mediaIndex);
					$level.remove();
					_target.remove();
				}else{
					_this.addClass('active');
					var _this = $(this);
					var _type = _this.attr('data-type');
					var _target = $('#module');
					var obj = {
					 	'widget_name' : _type,
					 	'viewer' : global.typeData[_type].viewer,
					 	'htmlStr' : global.typeData[_type].htmlStr,
					 	'animate' : [],
					 	'editor' : global.typeData[_type].editor
					};
				 	global.initData[global.pageIndex].push(obj);
				 	global.widgetIndex = global.initData[global.pageIndex].length-1;
				 	mediaIndex = global.widgetIndex;
					createSingleWidget(global.widgetIndex,obj,_target);
					level.createSingleLevel(global.widgetIndex,$('.js_widget_level'));
					pageView.createPageWidget(global.initData[global.pageIndex],$('.js_left_page>li.active'));
				}
				_this = null;
			});

			$(document).on('keyup',function(e){
				//delete 键,删除控件
				if(e.keyCode == 46){
					var _target = $('.widget_content.active');
					var _index = _target.index();
					global.initData[global.pageIndex].splice(_index,1);
					var $level = $('.js_widget_level>li.active');
					$level.remove();
					_target.remove();
				}
			});
		},
		importPSD : function(index,src,data,zindex){
			var _target = $('#module');
	 		var $handle = $('<div class="widget_content ui-draggable ui-draggable-handle" key="image" style="left:'+data.left+'px;top:'+data.top+'px;width:'+data.width+'px;height:'+data.height+'px;opacity:'+data.opacity+';z-index:'+zindex+'"></div>').appendTo(_target);
			var $type = $('<div class="animated"><img src='+src+' /></div>').appendTo($handle);
			var _scope = '<div class="widget_scope ui-draggable js_widget_scope" iscurrent="true">\
							<div class="handle ui-draggable-handle nw" resize-dir="nw"></div>\
							<div class="handle ui-draggable-handle n" resize-dir="n"></div>\
							<div class="handle ui-draggable-handle ne" resize-dir="ne"></div>\
							<div class="handle ui-draggable-handle e" resize-dir="e"></div>\
							<div class="handle ui-draggable-handle se" resize-dir="se"></div>\
							<div class="handle ui-draggable-handle s" resize-dir="s"></div>\
							<div class="handle ui-draggable-handle sw" resize-dir="sw"></div>\
							<div class="handle ui-draggable-handle w" resize-dir="w"></div>\
						</div>'; 
			var $scope = $(_scope).appendTo($handle);
			var obj = {
				'widget_name' : 'image',
			 	'viewer' : {
			 		'left' : data.left,
			 		'top' : data.top,
			 		'width' : data.width,
			 		'height' : data.height
			 	},
			 	'htmlStr' : global.typeData['image'].htmlStr,
			 	'animate' : [],
			 	'editor' : {
			 		'opacity':data.opacity*100,
			 		'zIndex':zindex
			 	},
			 	'src' : src
			};
			global.initData[global.pageIndex].push(obj);
			global.widgetIndex = global.initData[global.pageIndex].length-1;
			singleEvent($handle);
			var _target = $('.js_widget_level');
			level.createSingleLevel(index,_target);
			pageView.createPageWidget(global.initData[global.pageIndex],$('.js_left_page>li.active'));
			_target = null;$scope = null;$type = null;$handle = null;
		}
	}
}(jQuery);

var animate = function($){
	var animateArr = new Array(); //单个控件动画设置，类型:array

	function createSingleAnimate(index,target){
		var _html = '<li>\
						<div class="editor_animate">\
							<div class="title">动画'+(index+1)+'</div>\
							<div class="form-group clearfix">\
								<div class="pull-left line_h30 w40">方案</div>\
								<div class="margin_l40">\
									<div class="select_box js_select_module">\
										<a href="javascript:;" class="block clearfix">\
											<i class="pull-right arrow_icon"></i>\
											<span class="ellipsis cur_select" data-value='+animateArr[index].class+' title='+animateArr[index].class+'>'+animateArr[index].class+'</span>\
										</a>\
										<ul class="lists js_animate_class"></ul>\
										<input type="hidden" name="font_style" value='+animateArr[index].class+' />\
									</div>\
								</div>\
							</div>\
							<div class="form-group clearfix">\
								<div class="pull-left line_h30 w64">时长(秒)</div>\
								<div class="margin_l64">\
									<input type="number" class="input_style js_duration" value='+animateArr[index].duration+' />\
								</div>\
							</div>\
							<div class="form-group clearfix">\
								<div class="pull-left line_h30 w64">延时(秒)</div>\
								<div class="margin_l64">\
									<input type="number" class="input_style js_delay" value='+animateArr[index].delay+' />\
								</div>\
							</div>\
							<div class="form-group clearfix">\
								<div class="pull-left line_h30 w64">重复(次)</div>\
								<div class="margin_l64">\
									<div class="select_box js_select_module">\
										<a href="javascript:;" class="block clearfix">\
											<i class="pull-right arrow_icon"></i>\
											<span data-value='+animateArr[index].repeat+' class="ellipsis cur_select" title="'+animateArr[index].repeat+'">'+animateArr[index].repeat+'</span>\
										</a>\
										<ul class="lists js_animate_repeat"></ul>\
										<input type="hidden" name="font_style" value='+animateArr[index].repeat+' />\
									</div>\
								</div>\
							</div>\
							<div class="align_r control">\
								<a href="javascript:;" class="inline js_start_animate">\
									<img src="../img/icon_21.png" />\
								</a>\
								<a href="javascript:;" class="inline js_remove_animate">\
									<img src="../img/icon_22.png" />\
								</a>\
							</div>\
						</div>\
					</li>';
		var $li = $(_html).appendTo(target);
		classList($li);
		repeatList($li);
		setAttrStatus($li,animateArr[index].class,index);
		$li = null;
	};

	function classList(obj){
		var i = 0,len = global.cases.length;
		var _target = obj.find('.js_animate_class');
		for(; i < len; i++){
			if(i == 0){
				$('<li><a href="javascript:;" data-value="">--请选择动画方案--</a></li>').appendTo(_target);
			}else{
				$('<li><a href="javascript:;" data-value='+global.cases[i]+'>'+global.cases[i]+'</a></li>').appendTo(_target);
			}
		}
		_target = null;
	};

	function repeatList(obj){
		var i = 0,len = global.repeats.length;
		var _target = obj.find('.js_animate_repeat');
		for(; i < len; i++){
			$('<li><a href="javascript:;" data-value='+global.repeats[i]+'>'+global.repeats[i]+'</a></li>').appendTo(_target);
		}
		_target = null;
	};

	function setAttrStatus(_parent,_class,order){
		if(_class == ''){
			_parent.find('.js_animate_class').parent().find('.cur_select').text('--请选择动画方案--');
			_parent.find('.select_box').addClass('disabled');
			_parent.find('input').attr('disabled','disabled');
			_parent.find('.js_start_animate').addClass('disabled');
			$('.js_start_all').addClass('disabled');
		}else{
			animateArr[order].class = _class;
			_parent.find('.select_box').removeClass('disabled');
			_parent.find('input').removeAttr('disabled');
			_parent.find('.js_start_animate').removeClass('disabled');
			var flag = true;
			$('.js_animate_list>li').each(function(){
				if($(this).find('.select_box').hasClass('disabled')){
					flag = false;
				}
			});
			if(flag){
				$('.js_start_all').removeClass('disabled');
			}
		}
	};

	function animateEvent(){
		//选择动画方案
		$(document).on('click','.js_animate_class>li>a',function(){
			var _this = $(this);
			var _parent = _this.parents('.editor_animate').parent();
			var _class = _this.attr('data-value');
			var order = _parent.index();
			setAttrStatus(_parent,_class,order);
			// var newArr = [];
			// newArr = deepCopy(global.pageIndex][global.widgetIndex].animate,animateArr);
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
		});

		//选择动画时长
		$(document).on('focusout','.js_duration',function(){
			var _this = $(this);
			var _duration = _this.val();
			var order = _this.parents('.editor_animate').parent().index();
			animateArr[order].duration = _duration;
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
		});

		//选择动画延时
		$(document).on('focusout','.js_delay',function(){
			var _this = $(this);
			var _delay = _this.val();
			var order = _this.parents('.editor_animate').parent().index();
			animateArr[order].delay = _delay;
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
		});

		//选择动画重复次数
		$(document).on('click','.js_animate_repeat>li>a',function(){
			var _this = $(this);
			var _repeat = _this.attr('data-value');
			var order = _this.parents('.editor_animate').parent().index();
			animateArr[order].repeat = _repeat;
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
		});

		//播放单个动画
		$(document).on('click','.js_start_animate',function(){
			var _this = $(this);
			if(_this.hasClass('disabled')){
				return false;
			}
			var order = _this.parents('.editor_animate').parent().index();
			var _obj = $('.widget_content.active').find('.animated');
			startAnimate(_obj,animateArr[order]);
			_obj = null;
		});

		//顺序播放动画（动画拼接）
		$(document).on('click','.js_start_all',function(){
			var _this = $(this);
			if(_this.hasClass('.disabled')){
				return false;
			}
			var order = _this.parents('.editor_animate').parent().index();
			animateProcess(animateArr);
		});

		//添加动画
		$(document).on('click','.js_add_animate',function(e){
			var _target = $('.js_animate_list');
			var _obj = {
				'class' : '',
				'duration' : 1,
				'delay' : 0,
				'repeat': 1
			};
			animateArr.push(_obj);
			// console.log(animateArr,animateArr);
			// console.log(global.initData[global.pageIndex]);
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
			createSingleAnimate(animateArr.length-1,_target);

			//console.log(global.initData);
			_target = null;
		});

		//删除动画
		$(document).on('click','.js_remove_animate',function(){
			var _this = $(this);
			var order = _this.parents('.editor_animate').parent().index();
			animateArr.splice(order,1);
			global.initData[global.pageIndex][global.widgetIndex].animate = animateArr.clone();
			animate.createList(global.widgetIndex);
		});
	};

	//播放单个动画
	function startAnimate(_obj,animate){
		var time = Number(animate.duration*animate.repeat)+Number(animate.delay);
		setAnimateStyle(_obj,animate);
		if(animate.repeat != 'infinite'){
			var clear = setTimeout(function(){
				_obj.removeAttr('class style').addClass('animated');
				clearTimeout(clear);
			},time*1000);
		}
	};

	function setAnimateStyle(_obj,animate){
		_obj.removeAttr('class style').addClass(animate.class+' animated').css({
			'-webkit-animation-duration':animate.duration+'s',
			'animation-duration':animate.duration +'s',
			'-webkit-animation-iteration-count':animate.repeat,
			'animation-iteration-count':animate.repeat,
			'animation-delay':animate.delay+'s',
			'-webkit-animation-delay':animate.delay+'s'		
		});
	};

	//顺序播放动画
	function animateProcess(arr){
		var _target = $('.widget_content.active').find('div:first');
		var i = 1,len = arr.length;
		var time = 0;
		setStartProcess(_target,arr[0],0);
		for(; i < len; i++){
			time += Number(arr[i-1].duration*arr[i-1].repeat)+Number(arr[i-1].delay);
			setStartProcess(_target,arr[i],time);
		}
		if(len <= 1){
			time = Number(arr[0].duration*arr[0].repeat)+Number(arr[0].delay);
		}else{
			time+= Number(arr[len-1].duration*arr[len-1].repeat)+Number(arr[len-1].delay);
		}
		if(arr[0].repeat == 'infinite' || arr[len-1].repeat == 'infinite'){

		}else{
			var cleartime = setTimeout(function(){
				_target.removeAttr('class style').addClass('animated');
				clearTimeout(cleartime);
			},time*1000);
		}
	};

	function setStartProcess(_target,animateArr,time){
		if(animateArr.repeat == 'infinite'){
			setAnimateStyle(_target,animateArr);
		}else{
			var clear = setTimeout(function(){
				setAnimateStyle(_target,animateArr);
				clearTimeout(clear);
			},time*1000);
		}
	};

	return{
		createList : function(index){
			if(global.initData[global.pageIndex][index] == undefined){
				return false;
			}
			if(global.initData[global.pageIndex][index].animate == undefined){
				global.initData[global.pageIndex][index].animate = new Array();
			}
			animateArr = global.initData[global.pageIndex][index].animate;
			var i = 0,len = animateArr.length;
			if(len <= 0){
				$('.js_start_all').addClass('disabled');
			}
			var _target = $('.js_animate_list').empty();
			for(; i < len; i++){
				createSingleAnimate(i,_target);
			}
			_target = null;
		},

		setAnimate : function(){
			animateEvent();
		},

		setWidgetAnimate : function(obj){
			var _animates = {
				'class':'bounceIn',
				'duration' :1,
				'delay':0,
				'repeat':1
			}
			startAnimate(obj.find('.animated'),_animates);
		}
	}
}(jQuery);

var upload_img = function($){
	var global = {
		count : 0
	}
	function editImageData($img,_key,src){
		$img.addClass('js_add_widget').attr('data-type','image');
		$img.attr('key','img_order_'+global.count);
		$img.find('img').attr('src',src);
		$img.find('input').remove();
	};

	function createUpload(){
		var str = '<li class="pull-left">\
						<a href="javascript:;" class="imgbox js_upload_img">\
							<img src="" style="max-width: 100%;" />\
							<input type="file" name="download" id="file_btn_0"  multiple="false" onchange="upload_img.fileSelect(this)"  />\
							<i class="remove js_remove"></i>\
						</a>\
					</li>';
		$ul = $('.upload_img_box');
		var obj = $(str).prependTo($ul);
		// obj.find('img').attr('src','');
		obj.find('input').attr('id','file_btn_'+global.count);
		obj = null;$ul = null;
	};

	function createWidgetId($img,src){
		var str = '<div class="widget_content ui-draggable" style="left:0;top:0;"><div class="animated"></div></div>';
		$target = $('.js_img_content');
		var _key = 'img_order_'+ global.count;
		$(str).appendTo($target).attr('id','img_order_'+global.count);
		var _order = $img.attr('key').split('_')[2];
		var obj = $('#img_order_'+_order).find('.animated'); 
		$('<img src='+src+' />').appendTo(obj);
		$target = null;
	};

	function imgView(file,$img){
		//读取图片文件内容
    	var reader  = new FileReader();
    	reader.readAsDataURL(file);
    	reader.addEventListener("load", function (){
    		var _key = 'img_order_'+ global.count;
    		editImageData($img,_key,reader.result);
    		global.count++;
    		createUpload();
    		createWidgetId($img,reader.result);
		 }, false);
	};
	return{
		fileSelect : function(e){
			var _idname = $(e).attr('id');
		    //HTML5文件API操作
		    var file = document.getElementById(_idname).files[0];

		    //判断上传文件大小
		    if (file) {
		        var fileSize = 0;
		        if (file.size > 1024 * 1024){
		          fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		        }else{
		          fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		        }
		        if(Math.round(file.size * 100 / (1024 * 1024)) / 100 > 2){
		            modeltips("文件图片太大,上传失败",1500);
		            return false;
		        }
		        //图片本地预览
		        var $img = $(e).parents('.js_upload_img');
		        imgView(file,$img);
		    }
		},

		deleteImg : function(){
			$('.upload_img_box').on('click','.js_remove',function(){
				var _this = $(this);
				var _key = _this.parent().attr('key').split('_')[2];
				$('#img_order_'+_key).remove();
				_this.parent().parent().remove();
			});
		}
	}
}(jQuery);

var process_bar = function($){
	var handle_top; 
	var line_w;//可滑动的最大宽度
	var type; //需要修改的属性值

	function setDragView(e,t){
		t.position.top = handle_top;
		t.position.left = (t.position.left <= 0) ? 0 : t.position.left;
		t.position.left = (t.position.left >= line_w) ? line_w : t.position.left;
		var _percent = parseInt(t.position.left/line_w*100);
		t.helper.parent().find('.line').css({'width':_percent+'%'});
		setCallback(t,type,t.position.left/line_w*100);
	};

	function setCallback(t,type,param){
		var _value;
		var _target = $('.widget_content.active').find('.animated');
		switch(type){
			case 'skew_x':
			case 'skew_y':
				_value = parseInt((param-50)*180/50);
				editor.setMatrix(_target,_value,type);
				break;
			case 'opacity':
				_value = parseInt(param);
				editor.setOpacity(_target,param);
				break;
			case 'radius':
				_value = parseInt(param);
				editor.setRadius(_target,param);
				break;
		}
		t.helper.parents('.slider_box').find('.js_end_price').text(_value);
		_target = null;
	};
	
	return{
		sliderEvent : function(){
			$(".lyrow").draggable({
				handle:".drag",
				start : function(e,t){
					handle_top = t.position.top;
					line_w = Number(t.helper.parent().width());
					type = t.helper.parent().attr('data-type');
				},
				drag:function(e,t){
					setDragView(e,t);
				},
				stop:function(e,t){
					// setStopData();
				}  
			});
		}
	}
}(jQuery);

var editor = function($){
	function setWidgetColor(type,value){
		var $widget = $('.widget_content.active');
		switch(type){
			case 'size':
			$widget.find('.animated').find('*').css({'color':value});
			break;
			case 'bg':
			$widget.css({'background-color':value});
			break;
			case 'border':
			$widget.css({'border-color':value});
			break;
		}
		setColorData(value,type);
		$widget = null;
	};
	function setSelectParam(data,_target){
		if(data != undefined){
			_target.find('.cur_select').attr('data-value',data).attr('title',data).text(data);
		}else{
			_target.find('.cur_select').attr('data-value','').attr('title','默认').text('默认');
		}
	};
	function setFontFamilyData(data){
		var _target = $('.js_font_family');
		setSelectParam(data,_target);
		global.initData[global.pageIndex][global.widgetIndex].editor.font_family = data;
		_target = null;
	};
	function setFontSizeData(data){
		var _target = $('.js_font_size');
		setSelectParam(data,_target);
		global.initData[global.pageIndex][global.widgetIndex].editor.font_size = data;
		_target = null;
	};
	function setFontWeightData(data){
		var _target = $('.js_font_weight');
		if(data != undefined){
			if(data == 'bold'){
				_target.addClass('active');
			}else{
				_target.removeClass('active');
			}
		}
		global.initData[global.pageIndex][global.widgetIndex].editor.font_weight = data;
	};

	function setFontLineHeightData(data){
		var _target = $('.js_line_height');
		if(data != undefined){
			_target.find('.cur_select').attr('data-value',data).attr('title',data+'倍').text(data+'倍');
		}else{
			_target.find('.cur_select').attr('data-value','').attr('title','默认').text('默认');
		}
		global.initData[global.pageIndex][global.widgetIndex].editor.line_height = data;
		_target = null;
	};

	function setFontStyleData(data){
		var _target = $('.js_font_style');
		if(data != 'normal'){
			_target.addClass('active');
		}else{
			_target.removeClass('active');
		}
		global.initData[global.pageIndex][global.widgetIndex].editor.font_style = data;
		_target = null;
	};

	function setLetterData(data){
		var _target = $('.js_letter_space');
		setSelectParam(data,_target);
		_target = null;
	};

	function setTextAlignData(data){
		if(data == undefined){
			return false;
		}
		var _target = $('.js_text_align>li');
		switch(data){
			case 'left':
				_target.eq(0).find('a').addClass('active');
				_target.eq(0).siblings().find('a').removeClass('active');
				break;
			case 'center':
				_target.eq(1).find('a').addClass('active');
				_target.eq(1).siblings().find('a').removeClass('active');
				break;
			case 'right':
				_target.eq(2).find('a').addClass('active');
				_target.eq(2).siblings().find('a').removeClass('active');
				break;
		}
		_target = null;
	};
	function setDecorationData(data){
		var _target = $('.js_undeline');
		if(data != undefined){
			if(data == 'underline'){
				_target.addClass('active');
			}else{
				_target.removeClass('active');
			}
		}
		global.initData[global.pageIndex][global.widgetIndex].editor.text_dectaction = data;
		_target = null;
	};

	function setSliderData(data,type){
		var _target;
		var _param = data;
		switch(type){
			case 'skew_x':
				_target = $('.js_skew_x');
				_param = data*50/180+50;
				break;
			case 'skew_y':
				_target = $('.js_skew_y');
				_param = data*50/180+50;
				break;
			case 'opacity':
				_target = $('.js_opacity');
				break;
			case 'radius':
				_target = $('.js_border_radius');
				break;
		}
		_target.find('.line').css({'width':_param+'%'});
		_target.find('.end').css({'left':_param+'%'});
		_target.find('.js_end_price').text(_param);
		_target = null;
	};

	function setColorData(data,type){
		var _target;
		switch(type){
			case 'size':
			_target = $('.js_size_color');
			break;
			case 'bg':
			_target = $('.js_bg_color');
			break;
			case 'border':
			_target = $('.js_border_color');
			break;
		}
		_target.find('.palette-color-picker-button').css({'background':data});
		_target = null;
	};

	function setBorderStyleData(data){
		var _target = $('.js_border_style');
		setSelectParam(data,_target);
		_target = null;
	};

	function setBorderWidthData(data){
		var _target = $('.js_border_width');
		if(data != undefined){
			_target.val(data);
		}else{
			_target.val('0');
		}
		_target = null;
	};

	return{
		setFontFamily : function(obj,param){
			obj.css({'font-family':param});
			setFontFamilyData(param);
		},
		setFontSize : function(obj,param){
			obj.find('.animated').find('*').css({'font-size':param});
			setFontSizeData(param);
		},
		setFontWeight : function(obj,param){
			obj.find('.animated').find('*').css({'font-weight':param});
			setFontWeightData(param);
		},
		setFontLineHeight : function(obj,mult){
			obj.css({'line-height':mult});
			setFontLineHeightData(mult);
		},
		setFontStyle : function(obj,param){
			obj.find('.animated').find('*').css({'font-style':param});
			setFontStyleData(param);
		},
		setLetter : function(obj,param){
			obj.css({'letter-spacing':param});
			setLetterData(param);
		},
		setTextAlign : function(obj,param){
			obj.find('.animated').find('*').css({'text-align':param});
			setTextAlignData(param);
		},
		setDecoration : function(obj,param){
			obj.find('.animated').find('*').css({'text-decoration':param});
			setDecorationData(param);
		},
		setOpacity : function(obj,param){
			obj.css({'opacity':param/100});
			setSliderData(param,'opacity');
		},
		setRadius : function(obj,param){
			obj.css({'border-radius':param+'px'});
			setSliderData(param,'radius');
		},
		setBorderStyle : function(obj,param){
			obj.css({'border-style':param});
			setBorderStyleData(param);
		},
		setBorderWidth : function(obj,param){
			obj.css({'border-width':param});
			setBorderWidthData(param);
		},
		setColor : function(_this){
			var _input = _this.parents('.color_box').find('input.color_picker');
			var _type = _input.attr('data-editor');
			var _value = _input.val();
			setWidgetColor(_type,_value);
		},
		setMatrix : function(obj,_value,type){
			switch(type){
				case 'skew_x':
					matrix_arr.splice(2,1,-Math.tan(_value*Math.PI/180));
					break;
				case 'skew_y':
					matrix_arr.splice(1,1,-Math.tan(_value*Math.PI/180));
					break;
			}
			obj.css({'transform':'matrix('+matrix_arr.toString()+')'});
			setSliderData(_value,type);
		},
		setZIndex : function(obj,param){
			obj.css({'z-index':param});
			// setZIndexData(param);
		},
		setEditorData : function(){
			var _target = $('.widget_content.active');
			if(global.initData.length == 0){return false;}
			if(global.initData[global.pageIndex].length == 0){return false;}
			var _editor = global.initData[global.pageIndex][global.widgetIndex].editor;
			editor.setFontFamily(_target,_editor.font_family);
			editor.setFontSize(_target,_editor.font_size);
			editor.setFontWeight(_target,_editor.font_weight);
			editor.setFontLineHeight(_target,_editor.line_height);
			editor.setFontStyle(_target,_editor.font_style);
			editor.setLetter(_target,_editor.letter_spacing);
			editor.setOpacity(_target,_editor.opacity);
			editor.setRadius(_target,_editor.border_radius);
			editor.setBorderStyle(_target,_editor.border_style);
			editor.setBorderWidth(_target,_editor.border_width);
			setWidgetColor('size',_editor.color);
			setWidgetColor('bg',_editor.background_color);
			setWidgetColor('border',_editor.border_color);
			editor.setMatrix(_target,_editor.skew_x,'skew_x');
			editor.setMatrix(_target,_editor.skew_y,'skew_y');
			editor.setTextAlign(_target,_editor.text_align);
			editor.setDecoration(_target,_editor.text_dectaction);
			editor.setZIndex(_target,_editor.zIndex);
			_target = null;
		},
		
		addEvent : function(){
			$(document).on('click','.js_font_family>ul>li>a',function(){
				var _this = $(this);
				var _value = _this.attr('data-value');
				var _target = $('.widget_content.active');
				editor.setFontFamily(_target,_value);
				_target = null;_this = null;
			});

			$(document).on('click','.js_border_style>ul>li>a',function(){
				var _this = $(this);
				var _value = _this.attr('data-value');
				var _target = $('.widget_content.active');
				editor.setBorderStyle(_target,_value);
				_target = null;_this = null;
			});

			$(document).on('focusout','.js_border_width',function(){
				var _this = $(this);
				var _value = parseInt(_this.val())+'px';
				_this.val(_value);
				var _target = $('.widget_content.active');
				editor.setBorderWidth(_target,_value);
				_target = null;_this = null;
			});

			$(document).on('click','.js_font_edit',function(){
				var _this = $(this);
				var _tag = _this.attr('tag');
				var _size = parseInt($('.js_font_size').find('.cur_select').attr('data-value'));
				var _target = $('.widget_content.active');
				switch(_tag){
					case 'add':
					editor.setFontSize(_target,(_size+1)+'px');
					break;
					case 'declare':
					editor.setFontSize(_target,(_size-1)+'px');
					break;
				};
				_this = null;_target = null;
			});

			$(document).on('click','.js_font_weight',function(){
				var _this = $(this);
				var _target = $('.widget_content.active');
				if(_this.hasClass('active')){
					_this.removeClass('active');
					editor.setFontWeight(_target,'normal');
				}else{
					_this.addClass('active');
					editor.setFontWeight(_target,'bold');
				}
				_target = null;_this = null;
			});

			$(document).on('click','.js_font_style',function(){
				var _this = $(this);
				var _target = $('.widget_content.active');
				if(_this.hasClass('active')){
					_this.removeClass('active');
					editor.setFontStyle(_target,'normal');
				}else{
					_this.addClass('active');
					editor.setFontStyle(_target,'italic');
				}
				_target = null;_this =null;
			});

			$(document).on('click','.js_undeline',function(){
				var _this = $(this);
				var _target = $('.widget_content.active');
				if(_this.hasClass('active')){
					_this.removeClass('active');
					editor.setDecoration(_target,'initial');
				}else{
					_this.addClass('active');
					editor.setDecoration(_target,'underline');
				}
				_target = null;_this = null;
			});

			$(document).on('click','.js_text_align>li',function(){
				var _this = $(this);
				var _target = $('.widget_content.active');
				var _type = _this.attr('align');
				editor.setTextAlign(_target,_type);
				_this.addClass('active').siblings().removeClass('active');
				_target = null;_this = null;
			});

			$(document).on('click','.js_font_size>ul>li>a',function(){
				var _this = $(this);
				var _value = _this.attr('data-value');
				var _target = $('.widget_content.active');
				editor.setFontSize(_target,_value);
				_target = null;_this = null;
			});

			$(document).on('click','.js_line_height>ul>li>a',function(){
				var _this = $(this);
				var _value = _this.attr('data-value');
				var _target = $('.widget_content.active');
				editor.setFontLineHeight(_target,_value);
				_target = null;_this = null;
			});
		}
	}
}(jQuery);

var pageView = function($){
	function pageEvent(){
		$('.js_mobile_view').on('click',function(){
			var _this = $(this);
			var $dialog = $('.js_mobile_dialog');
			$dialog.find('.viewer').load('../page/viewer.html');
			$dialog.fadeIn(300).find('.content').addClass('bounceIn');
		});
		$('.js_mobile_dialog').on('click','.bg_shadow',function(){
			$('.js_mobile_dialog').fadeOut(300);
		});
	};
	return{
		elementDisplay : function(){
			pageEvent();
		},

		createPageWidget : function(data,obj){
			obj.find('.add_page>a').empty();
			var _target = $('<div class="scale_25"></div>').appendTo(obj.find('.add_page>a'));
			var i = 0,len = data.length;
			for(; i < len; i++){
				var $handle = $('<div class="widget_content ui-draggable ui-draggable-handle" key='+data[i].widget_name+'></div>').appendTo(_target);
				var $type = $('<div class="animated">'+data[i].htmlStr+'</div>').appendTo($handle);
				if(data[i].widget_name == 'image'){
					$handle.find('.animated').find('img').attr('src',data[i].src);
				}
				$handle.css({
					'width':data[i].viewer.width,
					'height':data[i].viewer.height,
					'left':data[i].viewer.left,
					'top':data[i].viewer.top,
					'z-index':data[i].editor.zIndex
				});
				$type = null;$handle = null;
			}
			_target = null;
		},

		leftPageView : function(){
			var i = 0,len = global.initData.length;
			for(; i < len; i++){
				var _target = $('.js_left_page>li').eq(i);
				pageView.createPageWidget(global.initData[i],_target);
				_target = null;
			}
		}
	}
}(jQuery);

var level = function($){
	function dragEvent(){
		$('.js_level_box').draggable({ 
			handle :'.title'
		});
	};

	function sortLevel(obj){
		var buffer = global.initData[global.pageIndex];
		var newObj;
		obj.sortable({
			opacity:0.35,
			handle:".drag",
			start : function(e,t){
				var _index = t.helper.index();
				newObj = global.initData[global.pageIndex][_index];
				buffer.splice(_index,1);
			},
			stop:function(e,t){
				var _newIndex = $(t.item.context).index();
				buffer.splice(_newIndex,0,newObj);
				global.initData[global.pageIndex] = buffer.clone();
				widgetUI.widgetList(global.initData,global.pageIndex);
			}   
		});
	};

	return{
		addEvent : function(){
			dragEvent();
			$('.js_widget_level').on('click','.level_con',function(){
				var _this = $(this).parents('li');
				var _index = _this.index();
				_this.addClass('active').siblings().removeClass('active');
				$('#module').find('.widget_content').eq(_index).addClass('active').siblings().removeClass('active');
				_this = null;
			});

			$('.js_widget_level').on('click','i',function(){
				var _this = $(this).parents('li');
				var _index = _this.index();
				if(_this.hasClass('disabled')){
					_this.removeClass('disabled');
					$('#module').find('.widget_content').eq(_index).removeClass('hide');
				}else{
					_this.addClass('disabled');
					$('#module').find('.widget_content').eq(_index).addClass('hide');
				}
				_this = null;
			});
		},

		createSingleLevel : function(index,_target){
			var _html = '<li class="ui-draggable">\
							<a href="javascript:;" class="clearfix">\
								<i class="pull-left"><img src="../img/icon_24.png" /></i>\
								<div class="ellipsis level_con drag ui-draggable-handle" title="">图层'+(index+1)+'</div>\
							</a>\
						</li>';
			var $li = $(_html).appendTo(_target);
			sortLevel(_target);
			$li.addClass('active').siblings().removeClass('active');
			$li = null;
		},

		createLevel : function(data,index){
			var _target = $('.js_widget_level').empty();
			var i = 0,len = data[index].length;
			for(; i < len; i++){
				level.createSingleLevel(i,_target);
			}
			_target = null;
		}
	}
}(jQuery);
