//javascript document : import psd file
//图层总数
var countLevel = 999;
(function () {
    var PSD = require('psd');

    document.getElementById('module').addEventListener('dragover', onDragOver, true);
    document.getElementById('module').addEventListener('drop', onDrop, true);

    function onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.js_import_load').css({'display':'block'});
        PSD.fromEvent(e).then(function (psd){
            var data = JSON.stringify(psd.tree().export(), undefined, 2);
            //统计导入的图层数量
            // countLevel = 999;
            analyze.getData(psd.tree(),JSON.parse(data),document.getElementById('image'));
        });
    }
}());

 var analyze = function($){
 	function setImageView(image){
   		var $img = $(image).find('img');
  		var _param = {
  			width : $img.width()/200,
  			height : $img.height()/200
  		};
  		$img.css({'width':_param.width+'rem','height':_param.height+'rem'});
  		$img = null;
   	};

   	function traverData(treeNode,data){
   		var i = 0,len = data.length;
   		widgetLength = len;
   		for(; i < len; i++){
   			analyzeSingleData(i,treeNode[i],data[i]);
   		}
   	};
 	/*  
  | @author chenmeng 2016-04-25
 	| 图层解析，并将图片转化为Base64编码格式
 	| case : 'layer',非组合图层，获取图片数据，转Base64
 	| case : 'group',对组合图层继续进行遍历，直到type为'layer'
 	*/
 	function analyzeSingleData(index,childrenNode,data){
 		if(data.visible){
            countLevel--;
 			switch(data.type){
 				case 'layer':
 					if(childrenNode.layer.image.height() > 0){
 						var obj = {
		 					type : 'image',
		 					content : childrenNode.layer.image.toBase64()
		 				}
	 					widgetUI.importPSD(index,obj.content,data,countLevel);
 					}
	 				break;
 				case 'group':
 					traverData(childrenNode._children,data.children);
 					break;
 			}
 		}	
 		_target = null;
    $('.js_import_load').css({'display':'none'});
 	};
 	return{
 		getData : function(tree,data,image){
 			var treeNode = tree._children;
 			setImageView(image);
 			traverData(treeNode,data.children);
 			treeNode = null;
 		}
 	}
 }(jQuery);

