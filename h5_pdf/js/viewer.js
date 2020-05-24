//javascript document
var pages = function($){
	var currentIndex = 0;

	function createSingleSection(data,target){
		var $section = $('<div class="section section_'+(currentIndex+1)+'"></div>').appendTo(target);
		var i = 0,len = data.length;
		for(; i < len; i++){
			var $widget = $('<div class="widget_'+(i+1)+'"></div>').appendTo($section);
			setWidgetHtml(data[i],$widget);
			$widget = null;
		}
		$section = null;
	};
	function setWidgetHtml(data,obj){
		$('<div class="animated">'+data.htmlStr+'</div>').appendTo(obj);
		obj.css({
			'left' :data.viewer.left+'px',
			'top' :data.viewer.top+'px',
			'width' :data.viewer.width+'px',
			'height' :data.viewer.height+'px',
			'background-color':data.editor.background_color,
			'border-color':data.editor.border_color,
			'border-radius':data.editor.border_radius,
			'border-style' :data.editor.border_style,
			'border-width':data.editor.border_width+'px',
			'color':data.editor.color,
			'font-family':data.editor.font_family,
			'font-size':data.editor.font_size/200+'rem',
			'font-weight':data.editor.font_weight,
			'letter-spacing':data.editor.letter_spacing,
			'line_height':data.editor.line_height,
			'opacity':data.editor.opacity/100,
			'text-align':data.editor.text_align,
			'text_dectaction':data.editor.text_dectaction,
			'z-index':data.editor.zIndex
		});
		if(data.src != undefined){
			obj.find('img').attr('src',data.src);
		}
		setMatrix(obj,data.editor.skew_x,'skew_x');
		setMatrix(obj,data.editor.skew_y,'skew_y');
	};

	function setMatrix(obj,_value,type){
		var matrix_arr = [1,0,0,1,0,0];
		switch(type){
			case 'skew_x':
				matrix_arr.splice(2,1,-Math.tan(_value*Math.PI/180));
				break;
			case 'skew_y':
				matrix_arr.splice(1,1,-Math.tan(_value*Math.PI/180));
				break;
		}
		obj.css({'transform':'matrix('+matrix_arr.toString()+')'});
	};

	function setPageTranslate(){
		var $page = $('.page_viewer');
		$page.css({
			'transform':'translateY(-'+1334*currentIndex+'px)'
		});
		$page = null;
	};

	function setWidgetAnimate(){
		var _data = global.initData[currentIndex];
		var i = 0,len = _data.length;
		var _page = $('.section_'+(currentIndex+1));
		for(; i < len; i++){
			var obj = _page.find('.widget_'+(i+1)).find('.animated');
			animateProcess(_data[i].animate,obj);
			obj = null;
		}
		_page = null;
	};

	function animateProcess(arr,_target){
		// var _target = $('.widget_content.active').find('div:first');
		var i = 1,len = arr.length;
		if(len == 0){
			return false;
		}
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
		if(animateArr == undefined){
			return false;
		}
		if(animateArr.repeat == 'infinite'){
			setAnimateStyle(_target,animateArr);
		}else{
			var clear = setTimeout(function(){
				setAnimateStyle(_target,animateArr);
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

	return{
		currentSection : function(){
			// console.log(global.initData);
			var _target = $('.page_viewer');
			createSingleSection(global.initData[currentIndex],_target);
			_target = null;
		},

		pageChecked : function(){
			var _target = $('.page_viewer');
			setWidgetAnimate();

			$(document).on('click','.js_prev',function(){
				if(currentIndex <= 0){
					$('.js_prev').css({'display':'none'});
					$('.js_next').css({'display':'block'});
				}
				currentIndex = (currentIndex <= 0) ? 0 : currentIndex-1;
				if($('.section_'+(currentIndex+1)).length == 0){
					createSingleSection(global.initData[currentIndex],_target);
				}
				setPageTranslate();
				setWidgetAnimate();
			});

			$(document).on('click','.js_next',function(){
				if(currentIndex >= global.initData.length-1){
					$('.js_prev').css({'display':'block'});
					$('.js_next').css({'display':'none'});
				}
				currentIndex = (currentIndex >= global.initData.length-1) ? currentIndex : currentIndex+1;
				if($('.section_'+(currentIndex+1)).length == 0){
					createSingleSection(global.initData[currentIndex],_target);
				}
				setPageTranslate();
				setWidgetAnimate();
			});
		}
	}
}(jQuery);

$(function(){
	pages.currentSection();
	pages.pageChecked();
});