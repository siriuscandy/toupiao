define([ 'jquery', 'knockout', 'text!pages/shopedit/detail/add.html','dialogmin',
         ],
    function($, ko, template,dialogmin) {
        
        var savedataUrl = "/store/getOne";
        var goverifyUrl = "/store/postCert";
        var nextUrl = "/shopedit/edit/add";
        var nowUrl = "/shopedit/detail/add";
        addRouter(nextUrl);//跳转编辑状态
        addRouter(nowUrl);;//变更审核状态
        var viewModel = {
        	data :  ko.observable({}),
            codedata :  ko.observable(),
            appdata :  ko.observable(),
            detailimg:"",
            qualification:"",
            clientCase:"",
            savedataUrl : savedataUrl,
            //goverifyUrl : goverifyUrl,
            detailsEnabled: ko.observable(false),
            enableDetails:function() {
                this.detailsEnabled(true);
            },
            disableDetails:function () {
                this.detailsEnabled(false);
            }
        };
        viewModel.goedit = function(){
        	window.router.setRoute(nextUrl);
        	return false;
        }
        viewModel.goverify = function(){
        	$.ajax({
                type : 'get',
                url : $ctx + goverifyUrl,
                data : "",
                cache:false,
                dataType : 'json',
                success : function(res) {
                    if(res.status==1){
                        //viewModel.data(res.data);
                    	//window.router.setRoute(nowUrl);
                    	window.location.reload();
                    	return false;
                    }else{
                        dialogmin("网络错误!!");
                    }
                }
            });
        	return false;
        }
        viewModel.load = function(){
        	setTimeout(function(){
                var widthImg = $(".shoplogo img").width();
                var heightImg = $(".shoplogo img").height();
                if(widthImg<=heightImg){
                    $(".shoplogo img").addClass("ImgHeights")
                    $(".shoplogo img").removeClass("ImgWidths")
                }else {
                    $(".shoplogo img").addClass("ImgWidths")
                    $(".shoplogo img").removeClass("ImgHeights")

                }
                $(".shoplogo img").css("visibility","visible");
            },500);
        	setTimeout(function(){
            	var boxWidth = $(".shop_banner").width();
            	var areaNum = parseInt("280")/parseInt("860");
                var widthImg = $(".shop_banner img").width();
                var heightImg = $(".shop_banner img").height();
                //var imgAreaNum = parseInt(heightImg/widthImg);
                var boxHeight = boxWidth*areaNum;
            	$(".shop_banner").height(boxHeight);
                if(heightImg > boxHeight){
                	$('.tooHeight').show();
                }else{
                	//$(".shop_banner img").height(widthImg*areaNum);
                	$('.shop_banner').css({"line-height":boxHeight+"px"});
                	$('.tooHeight').hide();
                }
                $(".shop_banner img").css("visibility","visible");
            },500);
            $.ajax({
                type : 'get',
                url : $ctx + savedataUrl,
                data : "",
                cache:false,
                dataType : 'json',
                success : function(res) {
                    if(res.status==1){
                        viewModel.data(res.data);
                        $('.dpsm').html(res.data.introduction);
                        if(res.data.snapshot){
                        	var src = '';
                        	var url= res.data.snapshot.split(",")
                        	for(var i in url){
                        		if(url[i] != ''){
                        			src += '<div class="bg"><img src="'+url[i]+'"/></div>';
                        		}
                        	}
                        	$('.shop_drawings .size').before(src);
                        }
                        if(res.data.customerService){
	                        var arr= JSON.parse(res.data.customerService);
	                        var html='';
	                        for(var o in arr){
//	                        	for(var d in arr[o]){
//	                        		if (d == 'onlineMenu') {
//	                        			var html1='';
//	                        			for(var b in arr[o][d]){
//	                        				var num = 1+ parseInt(b);
//	                        				html1 += '<div class=list><label data-bind="">联系电话<span>'+num+'</span>：</label><div >'+arr[o][d][b].telvalue+'</div></div>';
//	                        			}
//	                        		}
//	                        	}
	                        	if(arr[o].thisValue != ""){
	                        		//var cfNum =$('.left_box').length;
	                        		html += '<div class=left_box><label data-bind="">在线客服<span class="cfNum"></span>：</label><div>'+arr[o].thisValue+'</div></div>'; 
	                        	}
	                        }
	                        $('.online_box .size').before(html);
	                        $('.online_box .left_box').each(function(index){
	                        	//var cfNum = $(this).index;
	                        	$(this).find('.cfNum').text(index);
	                        });
                        };
                    }else{
                        dialogmin("网络错误!!");
                    }
                }
            });
        }
        
        var init = function(parm){
        	viewModel.load();
        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });