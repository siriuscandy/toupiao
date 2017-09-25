define(['jquery'], function() {
	
	var dialogmin = function(content,time){
            if(time==undefined){time = 2000;    }
			var dialogdiv = "<div class='dialogmin'><span>"+content+"</span></div>";
			$('body').append(dialogdiv);
			setTimeout(function(){
				$(".dialogmin").remove();
			},time)
	};

	return dialogmin;
});