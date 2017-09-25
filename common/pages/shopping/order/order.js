
define([ 'jquery', 'knockout', 'text!pages/shopping/order/order.html','dialogmin','bootstrap','uui','ajaxcommon'
], function($, ko, template,dialogmin,b,uui,ajaxcommon) {
    //接口
    var pageUrl = '/market/yonyoucloud/getOne?agreementNum='; //列表加载
    var approvalUrl = '/order/approvalOrderByPks'; //
    var modifyAmountUrl = '/yonyoucloud/modifyAmount'//改价
    var detailrooter = '/shopping/order/order/';
    addRouter(detailrooter);
    
    var viewModel = {
        data :  ko.observable({}),
        agreementNum:ko.observable(),
        commitTime:ko.observable(),
        buyerInfo : ko.observable({}),
        billDetail:ko.observable({}),
        someValue:ko.observable(),
        content : ko.observableArray([]),
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
    viewModel.billOk =function(){
    	$.ajax({
            type : 'POST',
            dataType : 'json',
            async : false,
            headers: {
                'Content-Type': 'application/json'
            },
            data:"",
            url :"/market/yonyoucloud/invoiceOperate/"+viewModel.id,
            success : function(res) {
                if(res.status==1){
                	$('.section-alert-operation').css({'display':'none'});
                	$('section-alert-title').html('发票信息');
                    $('.section-alert-items').html('开票成功！');
                    $('.section-alert-box').delay(3000).fadeOut();
                    addRouter("/shopping/order/order/:productId");
            		window.router.init();
                }
                if(res.status==0){
                	$('.section-alert-operation').css({'display':'none'});
                	$('section-alert-title').html('发票信息');
                    $('.section-alert-items').html('开票失败！请稍后重试。');
                    $(".section-alert-box").delay(5000).fadeOut();
                    addRouter("/shopping/order/order/:productId");
            		window.router.init();
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                //dialogmin("调用服务报错!!");
            }
        });
    }
    viewModel.alertBosHide = function() {
        $(".section-alert-con").removeClass("a_show");
        $(".section-alert-box").fadeOut();
    };
    viewModel.approval = function(num){
        //console.log(num);
        var qdata = {
            orderPks:[num]
        };
        $.ajax({
            type : 'POST',
            dataType : 'json',
            async : false,
            headers: {
                'Content-Type': 'application/json'
            },
            data:JSON.stringify(qdata),
            url :$ctx+ approvalUrl+"?orderStatus=2",
            success : function(res) {
                if(res.status==1){
                    dialogmin('审批成功!');
                    viewModel.load();

                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                //dialogmin("调用服务报错!!");
            }
        });
    };
    viewModel.toFixBox = function(){
        $('.pub_pop,.big_bg').show();
    }

    viewModel.exitBtn = function(){
        $('.pub_pop,.big_bg').hide();
    }
    viewModel.modifyAmount = function(){
    	var agreementNum = viewModel.id;
    	var newAmount = $('.newPrice').val();
        $.ajax({
            type : 'POST',
            dataType : 'json',
            async : false,
            headers: {
                'Content-Type': 'application/json'
            },
            data:'{"agreementNum":'+agreementNum+',"newAmount":'+newAmount+'}',
            url :$ctx+ modifyAmountUrl,
            success : function(res) {
                if(res.status==1){
                	$('.pub_pop,.big_bg').hide();
                	addRouter("/shopping/order/order/:productId");
            		window.router.init();
                }else{
                    alert(res.msg || "改价失败，请刷新页面!");
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                //dialogmin("调用服务报错!!");
            	alert('改价输入错误!');
            }
        });
    };
    
    viewModel.load = function() {
    	$(".newPrice").keyup(function(){    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));
            if($(this).val()>100000000){
            	alert('您输入的金额已超过最大数额。');
            	$(this).val("");
            	return false;
            }
            var reg = /^-?\d+\.?\d{0,2}$/;
            if(!reg.test($(this).val())){
            	alert("最多可以输入两位小数！");
            	$(this).val("");
            	return false;
            }
        }).bind("paste",function(){  //CTR+V事件处理    
            $(this).val($(this).val().replace(/[^0-9.]/g,''));
            if($(this).val()>100000000){
            	alert('您输入的金额已超过最大数额。');
            	$(this).val("");
            	return false;
            }
            var reg = /^-?\d+\.?\d{0,2}$/;
            if(!reg.test($(this).val())){
            	alert("最多可以输入两位小数！");
            	$(this).val("");
            	return false;
            }
        }).css("ime-mode", "disabled"); //CSS设置输入法不可用    
        var orderData = ''
        var jsObj = {};
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: false,
            url: pageUrl + viewModel.id,
            success: function(res) {
                if(res.status == 1) {
                    orderData = res;
                    jsObj = JSON.parse(res.data.billDetail);
                    viewModel.data(orderData.data);
                    
                    if(res.buyerInfo == null){
                    	var ob ={
                    			userName:"未知"
                    	}
                    	viewModel.buyerInfo(ob);
                    }else{
                    	viewModel.buyerInfo(res.buyerInfo);
                    }
                    if(jsObj == null||jsObj == ""){
                    }else{
                    	viewModel.billDetail(jsObj);
                    }
                    sqObj = res.data.openDatainfo;
                	if(sqObj == null||sqObj == ""||sqObj == undefined){
                    }else{
                    	sqObj = JSON.parse(sqObj);
                    	viewModel.openDatainfo(sqObj);
                    }
                    var openDatainfo = {
                        "frontEndUrl":"",
                        "activateUrl":null,
                        "adminUrl":null,
                        "username":null,
                        "password":null,
                        "message":""
                    }

                    if(orderData.data.openDatainfo != '' && orderData.data.openDatainfo != null){
                        openDatainfo = JSON.parse(orderData.data.openDatainfo);
                        viewModel.openDatainfo(openDatainfo);
                    }else{
                        viewModel.openDatainfo(openDatainfo);
                    }
                } else {
                    alert("订单查询失败!");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                dialogmin("订单查询失败!!");
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