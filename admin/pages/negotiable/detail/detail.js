
define([ 'jquery', 'knockout', 'text!pages/negotiable/detail/detail.html','dialogmin','bootstrap','uui','ajaxcommon'
], function($, ko, template,dialogmin,b,uui,ajaxcommon) {
    //接口
    var pageUrl = '/market/customer/one/'; //面议申请详情页
    var marksUrl ='/market/customer/execute';//备注信息
//    var approvalUrl = '/order/approvalOrderByPks'; //
//    var modifyAmountUrl = '/yonyoucloud/modifyAmount'//改价
    var detailrooter = '/negotiable/list/list';
    addRouter(detailrooter);

    //浏览器不支持 placeholder 时才执行
    if (!('placeholder' in document.createElement('input'))) {
        $('[placeholder]').each(function () {
            var $tag = $(this); //当前 input
            var $copy = $tag.clone();   //当前 input 的复制
            if ($copy.val() == "") {
                $copy.css("color", "#999");
                $copy.val($copy.attr('placeholder'));
            }
            $copy.focus(function () {
                if (this.value == $copy.attr('placeholder')) {
                    this.value = '';
                    this.style.color = '#000';
                }
            });
            $copy.blur(function () {
                if (this.value=="") {
                    this.value = $copy.attr('placeholder');
                    $tag.val("");
                    this.style.color = '#999';
                } else {
                    $tag.val(this.value);
                }
            });
            $tag.hide().after($copy.show());    //当前 input 隐藏 ，具有 placeholder 功能js的input显示
        });
    }
    var viewModel = {
        data :  ko.observable({}),
        agreementNum:ko.observable(),
        commitTime:ko.observable(),
        buyerInfo : ko.observable({}),
        billDetail:ko.observable({}),
        someValue:ko.observable(),
        openDatainfo: ko.observable({})
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    
    viewModel.alertBosShow = function() {
        //居中
        function centerH(box) {
            box.css({
                left: ($(window).width() - box.outerWidth()) / 2,
                top: ($(window).height() - box.outerHeight()) / 2 + $(document).scrollTop()
            });
        }
        var maskHeight = $("body").outerHeight() > $(window).height() ? $("body").outerHeight() : $(window).height();
        $(".section-alert-box").show();
        $(".section-alert-bg").height(maskHeight+50);
        centerH($(".section-alert-con"));
        $(".section-alert-con").addClass("a_show");
    };
    viewModel.toRemarks =function(){
    	var note = encodeURI($(".remarks_ct").val());
    	$.ajax({
            type : 'POST',
            //dataType : 'json',
            async : false,
            headers: {
                'Content-Type': 'application/json'
            },
            data:'{"note":'+note+'}',
            url :marksUrl+'?id='+viewModel.id+'&note='+note,
            success : function(res) {
                if(res.status==1){
                	$('.section-alert-operation').css({'display':'none'});
                	//$('section-alert-title').html('备注信息');
                    $('.section-alert-items').html('提交成功！');
                    window.location.reload();
                }
                if(res.status==0){
                	$('.section-alert-operation').css({'display':'none'});
                	//$('section-alert-title').html('备注信息');
                    $('.section-alert-items').html('提交失败！请稍后重试。');
//                    $(".section-alert-box").delay(8000).fadeOut();
                    window.location.reload();
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                //dialogmin("调用服务报错!!");
            }
        });
    }
//    viewModel.alertBosHide = function() {
//        $(".section-alert-con").removeClass("a_show");
//        $(".section-alert-box").fadeOut();
//    };
//    viewModel.approval = function(num){
//        //console.log(num);
//        var qdata = {
//            orderPks:[num]
//        };
//        $.ajax({
//            type : 'POST',
//            dataType : 'json',
//            async : false,
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            data:JSON.stringify(qdata),
//            url :$ctx+ approvalUrl+"?orderStatus=2",
//            success : function(res) {
//                if(res.status==1){
//                    dialogmin('审批成功!');
//                    viewModel.load();
//
//                }
//            },
//            error : function(XMLHttpRequest, textStatus, errorThrown) {
//                //dialogmin("调用服务报错!!");
//            }
//        });
//    };
//    viewModel.toFixBox = function(){
//        $('.pub_pop,.big_bg').show();
//    }
//
//    viewModel.exitBtn = function(){
//        $('.pub_pop,.big_bg').hide();
//    }
//    viewModel.modifyAmount = function(){
//    	var agreementNum = viewModel.id;
//    	var newAmount = $('.newPrice').val();
//        $.ajax({
//            type : 'POST',
//            dataType : 'json',
//            async : false,
//            headers: {
//                'Content-Type': 'application/json'
//            },
//            data:'{"agreementNum":'+agreementNum+',"newAmount":'+newAmount+'}',
//            url :$ctx+ modifyAmountUrl,
//            success : function(res) {
//                if(res.status==1){
//                	$('.pub_pop,.big_bg').hide();
//                	addRouter("/shopping/order/order/:productId");
//            		window.router.init();
//                }
//            },
//            error : function(XMLHttpRequest, textStatus, errorThrown) {
//                //dialogmin("调用服务报错!!");
//            	alert('改价输入错误!');
//            }
//        });
//    };
//    
    viewModel.load = function(){
        var orderData = ''
//        var jsObj = {};
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: pageUrl + viewModel.id,
            success: function(res) {
                if(res.status == 1) {
                    orderData = res;
//                    jsObj = JSON.parse(res.data.billDetail);
                    viewModel.data(orderData.data);
//                    if(res.buyerInfo == null){
//                    	var ob ={
//                    			userName:"未知"
//                    	}
//                    	viewModel.buyerInfo(ob);
//                    }else{
//                    	viewModel.buyerInfo(res.buyerInfo);
//                    }
//                    if(jsObj == null||jsObj == ""){
//
//                    	//viewModel.billDetail(jsObj);
//                    }else{
//                    	viewModel.billDetail(jsObj);
//                    }
//                    var openDatainfo = '';
//                    if(orderData.data.openDatainfo != ''){
//                        openDatainfo = JSON.parse(orderData.data.openDatainfo);
//                        viewModel.openDatainfo(openDatainfo);
//                    }
                } else {
                    dialogmin("面议申请详情查询失败!");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                dialogmin("调用服务报错!!");
            }
        });
    }
    var init = function(parm){
        viewModel.id = parm[0];
        viewModel.load();
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };


});