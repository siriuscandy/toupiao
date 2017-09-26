define(['jquery'], function() {

	var dialogminBack = function(title,content,fun){
			var dialogdiv =
                "<div class='Upview_con' id='dialogminBack'>"+
                     "<div class='Upview_mid re_con dialogminBack'>"+
                        "<div class='mianbaoxie'>"+title+"<i style='margin-right: 20px; width: 10px; height: 10px; float: right' class='fa fa-close' id='diacancel1'></i></div>"+
                        "<div class='main_conc re_con'>"+content+"</div>"+
                        "<div class='dBbtn'><div class='nextbtn userInfo_btn' id='diaok'>确认</div>"+
                        "<div class='nextbtn userInfo_Cbtn' id='diacancel'>取消</div></div>" +
                "</div></div>";
			$('body').append(dialogdiv);
            $("#diaok").click(function(){
                fun(true)
                $("#dialogminBack").remove();
            });
            $("#diacancel,#diacancel1").click(function(){
                fun(false)
                $("#dialogminBack").remove();
            });

	};

	return dialogminBack;
});