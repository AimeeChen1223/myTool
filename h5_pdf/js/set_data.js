var global = {
	cases : ['','rollOut','rotateOut','flip','hinge','flipOutX','flipOutY','bounceIn','bounceOut','flash','pulse','rubberBand','shake','headShake','swing','tada','wobble','jello','bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp','bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp','fadeIn','fadeInDown','fadeInDownBig','fadeInLeft','fadeInLeftBig','fadeInRight','fadeInUp','fadeInUpBig','fadeOut','fadeOutDown','fadeOutLeft','fadeOutLeftBig','fadeOutRight','fadeOutRightBig','fadeOutUp','fadeOutUpBig','flipInX','flipOutX','flipOutY','lightSpeedIn','lightSpeedOut','rotateIn','rotateInDownLeft','rotateInDownRight'],
	repeats : ['1','2','3','4','5','6','7','8','infinite'],
	pageIndex : 0,
	widgetIndex : 0,
	typeData : {
		'text' : {
			'viewer' :{left:50,top:20},
			'htmlStr' : '<div>编辑文字内容</div>'
		},
		'input_text' :{
			'viewer' :{left:50,top:20},
			'htmlStr' : '<input type="text" class="widget_input" value="" />'
		},
		'textarea' : {
			'viewer' :{left:50,top:20},
			'htmlStr' : '<textarea class="widget_input" style="height: 115px;"></textarea>'
		},
		'image' : {
			'viewer' :{left:0,top:100},
			'htmlStr' : '<img src="" />'
		},
		'select' : {
			'viewer' :{left:50,top:20},
			'htmlStr' : '<select class="widget_input"><option>下拉框</option></select>'
		},
		'button_1' :{
			'viewer' :{left:50,top:20},
			'htmlStr' : '<bttton class="btn btn-blue">文本按钮</bttton>'
		},
		'button_2' :{
			'viewer' :{left:50,top:20},
			'htmlStr' : '<bttton class="btn btn-orange">文本按钮</bttton>'
		},
		'media' :{
			'viewer':{left:680,top:50,width:40,height:40},
			'htmlStr' : '<a href="javascript:;" class="music_bg"></a>',
			'editor':{zIndex:999}
		}
	},
	initData : [[]
		// [{
		// 	'widget_name':'text',
		// 	'htmlStr' : '<div>编辑文字内容</div>',
		// 	'viewer':{width:100,height:20,left:50,top:20},
		// 	'animate':[
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3},
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3}
		// 	],
		// 	'editor':{
		// 		'font_family' :'微软雅黑',
		// 		'font_size':'40px',
		// 		'line_height' :1.5,
		// 		'letter_spacing' :'0.8px',
		// 		'font_weight':'bold',
		// 		'text_dectaction':'undeline-line',
		// 		'text_align':'left',
		// 		'skew_x': 45,
		// 		'skew_y' : 45,
		// 		'opacity':100,
		// 		'border_radius':20,
		// 		'border_color':'#adadad',
		// 		'border_style':'dashed',
		// 		'border_width':'2px',
		// 		'color':'#000',
		// 		'background_color':'#428BCA'
		// 	}
		//  },
		//  {
		// 	'widget_name':'textarea',
		// 	'htmlStr' : '<textarea class="widget_input" style="height: 115px;"></textarea>',
		// 	'viewer':{width:100,height:110,left:80,top:0},
		// 	'animate':[
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3},
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3},
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3}
		// 	],
		// 	'editor':{
		// 		'font_family' :'Arial',
		// 		'font_size':'30px',
		// 		'line_height' :(30*1.5),
		// 		'letter_spacing' :'0.8px',
		// 		'font_weight':'normal',
		// 		'text_dectaction':'none',
		// 		'text_align':'center',
		// 		'color':'#000',
		// 		'background_color':'#C70975'
		// 	}
		//  },
		//  {
		// 	'widget_name':'image',
		// 	'htmlStr' : '<img src="" />',
		// 	'viewer':{width:120,height:120,left:100,top:100},
		// 	'animate':[
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3}
		// 	],
		// 	'editor':{
		// 		'font_family' :'微软雅黑',
		// 		'font_size':'40px',
		// 		'line_height' :1.5,
		// 		'letter_spacing' :'0.8px',
		// 		'font_weight':'bold',
		// 		'text_dectaction':'undeline-line',
		// 		'text_align':'left',
		// 		'skew_x': 45,
		// 		'skew_y' : 45,
		// 		'opacity':100,
		// 		'border_radius':20,
		// 		'border_color':'#adadad',
		// 		'border_style':'dashed',
		// 		'border_width':'2px',
		// 		'color':'#000',
		// 		'background_color':'#468847'
		// 	}
		//  }],//page 1
		// [{
		// 	'widget_name':'select',
		// 	'htmlStr' : '<select class="widget_input"><option>下拉框</option></select>',
		// 	'viewer':{width:100,height:100,left:0,top:0},
		// 	'animate':[
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3}
		// 	],
		// 	'editor':{
		// 		'font_family' :'Arial',
		// 		'font_size':'30px',
		// 		'line_height' :(30*1.5),
		// 		'letter_spacing' :'0.8px',
		// 		'font_weight':'normal',
		// 		'text_dectaction':'none',
		// 		'text_align':'center'
		// 	}
		//  },
		//  {
		// 	'widget_name':'button',
		// 	'viewer':{width:100,height:100,left:0,top:0},
		// 	'htmlStr' : '<bttton class="btn btn-blue">文本按钮</bttton>',
		// 	'animate':[
		// 		{class:'fadeOut',repeat:3,delay:0,duration:3}
		// 	],
		// 	'editor':{
		// 		'font_family' :'Arial',
		// 		'font_size':'30px',
		// 		'line_height' :(30*1.5),
		// 		'letter_spacing' :'0.8px',
		// 		'font_weight':'normal',
		// 		'text_dectaction':'none',
		// 		'text_align':'center'
		// 	}
		//  }]//page 2
	]
};

