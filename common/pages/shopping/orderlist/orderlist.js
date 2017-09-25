
define([ 'jquery', 'knockout', 'text!pages/shopping/orderlist/orderlist.html','dialogmin',
    'bootstrap','uui','ajaxCom','daterangpicker'
], function($, ko, template,dialogmin,b,uui,ajaxCom) {
    //接口
    var pageUrl = '/yonyoucloud/isvOrders'; //列表加载
    var openorderUrl = '/yonyoucloud/openorder'; //列表加载
    var modifyAmountUrl = '/yonyoucloud/modifyAmount'//改价
    var pageOneUrl = '/yonyoucloud/getOne?agreementNum='; //单条订单加载

    // 添加修改页路由
    var detailrooter = '/shopping/order/order/:resId';
    addRouter(detailrooter);
    var viewModel = {
        data : {
            content : ko.observableArray([]),
            totalPages : ko.observable(),
            number : ko.observable(),
            openDatainfo:ko.observable({}),
            totalElements : ko.observable()
        },
        searchText : ko.observable(),
        setData : function(res) {
            this.data.content(res.content);
            this.data.totalPages(res.totalPages);
            this.data.number(res.number + 1);
            this.data.totalElements(res.totalElements);
        },
        datamodify:ko.observable({}),
        searchDate:ko.observable(),
        someValue:ko.observable(),
        orderStatus:"",
        billStatus:"",
        openStatus:""
    };
    //返回上一页
    viewModel.goback = function(){
        window.history.go(-1);
    };
    //重置
    viewModel.reset = function(){
        viewModel.load(0,"");
        viewModel.firstload=false;
    };
    //搜索
    viewModel.searchGo = function(){
        //$(".orderlist_nav span").removeClass("active");
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus);
        viewModel.firstload=false;
    };
    //取消
    viewModel.searchCancel = function(){
        viewModel.load(0,"","");//
        viewModel.firstload=false;
    };
    //页面进入
    viewModel.load = function(pageIndex,orderStatus,billStatus){
    	$.ajaxSetup({cache:false});
        var queryData = {
            size: viewModel.pageSize||10,     //page size 每页显示条数
            page: pageIndex,    //page num 当前页数
            //searchKey:"",
            isAjax:1,
            orderStatus:orderStatus,
            billStatus: billStatus,
            agreementNum: "",
            operatorName:"",
            productName:"",
            startTime: "",
            endTime: ""
        };
        queryData.agreementNum = encodeURIComponent($("#agreementNum").val());
        queryData.operatorName = encodeURIComponent($("#operatorName").val());
        queryData.productName = encodeURIComponent($("#productName").val());

        var searchTime = $.trim($("#downloadTime").val());
        var searchStartTime =searchTime.substring(0, 10);
        var searchEndTime =searchTime.substring(13, 23);
        //console.log(searchTime,searchStartTime,searchEndTime);

        queryData.startTime = searchStartTime;
        queryData.endTime = searchEndTime;
//        $(".form-search").find(".input_search").each(function(){
//            queryData.searchKey = this.value;
//        });
        ajaxCom.Loadajax('get',pageUrl,queryData,function(res){
            if(res.status==1){
            	jsObj = res.data.content.openDatainfo;
            	if(jsObj == null||jsObj == "" ||jsObj== undefined){
                }else{
                	jsObj = JSON.parse(jsObj);
                	viewModel.openDatainfo(jsObj);
                }
                viewModel.setData(res.data);
                var element = document.getElementById("pagination");
                var comp = new u.pagination({ el: element,showState:false,jumppage:true });
                comp.update({ totalPages: viewModel.data.totalPages(), pageSize: viewModel.pageSize || 10, currentPage:  viewModel.data.number(), totalCount: viewModel.data.totalElements() });
                comp.on('pageChange', function(pageIndex) {
                    if(viewModel.testNum(pageIndex) && pageIndex<viewModel.data.totalPages()){
                        viewModel.load(pageIndex,viewModel.orderStatus,viewModel.billStatus);
                    }else {
                        dialogmin("请输入正确的页码")
                    }
                });
                comp.on('sizeChange', function(arg) {
                    if(viewModel.testNum(arg[0])){
                        viewModel.pageSize = arg[0];
                        viewModel.load(0);

                    }else {
                        dialogmin("请输入正确的数")
                    }

                });
            }else{
                dialogmin(res.msg || "网络错误!!");
            }
        },function(error){
            var res = JSON.parse(error.responseText)
            dialogmin(res.msg || "网络错误");
        })

    }
    //去详情页
    viewModel.godetail = function(id){
        window.router.setRoute("/shopping/order/order/"+id);
        return false;
    };
    //
//    viewModel.openStatus = function(id){
//        ajaxCom.Loadajax('get',openorderUrl+"?agreementNum="+id+"&isAjax=1","",function(res){
//            if(res.status==1){
//                dialogmin("开通成功!");
//                viewModel.load(0,1)
//            }else{
//                dialogmin(res.msg);
//            }
//        },function(error){
//            var res = JSON.parse(error.responseText)
//            dialogmin(res.msg || "网络错误");
//        })
//
//        return false;
//    };
    //未支付
    viewModel.ordernopay =function(){
       viewModel.orderStatus = 2,
       viewModel.load(0,viewModel.orderStatus,viewModel.billStatus);
    };
    viewModel.billnopay =function(){
        viewModel.billStatus = 0
       viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
    };
	viewModel.orderpay =function(){
        viewModel.orderStatus = 1
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
	};
	viewModel.billpay =function(){
        viewModel.billStatus = 1
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
	};
	viewModel.billnopaying =function(){
        viewModel.billStatus = 2
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
	};
    viewModel.allorderpay =function(){
        viewModel.orderStatus = ""
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
	};
	viewModel.allBillStatus =function(){
        viewModel.billStatus = ""
        viewModel.load(0,viewModel.orderStatus,viewModel.billStatus)
	};
    
    viewModel.testNum = function(s){
        var re = /^[0-9]+$/ ;
        return re.test(s)
    }
    viewModel.toFixBox = function(agreementNum){
        viewModel.stopEvent();
        $('.pub_pop,.big_bg').show();
        viewModel.getOneagreement(agreementNum);
    }
    viewModel.exitBtn = function(){
    	$('.newPrice').val("");
    	$('.totle_p').text("");
        $('.pub_pop,.big_bg').hide();
    };
    viewModel.stopEvent = function(){ //阻止冒泡事件
        function getEvent(){
            if(window.event){return window.event;}
            func=getEvent.caller;
            while(func!=null){
                var arg0=func.arguments[0];
                if(arg0){
                    if((arg0.constructor==Event || arg0.constructor ==MouseEvent
                        || arg0.constructor==KeyboardEvent)
                        ||(typeof(arg0)=="object" && arg0.preventDefault
                            && arg0.stopPropagation)){
                        return arg0;
                    }
                }
                func=func.caller;
            }
            return null;
        }
        var e=getEvent();
        if(window.event){
            //e.returnValue=false;//阻止自身行为
            e.cancelBubble=true;//阻止冒泡
        }else if(e.preventDefault){
            //e.preventDefault();//阻止自身行为
            e.stopPropagation();//阻止冒泡
        }
    };
    viewModel.getOneagreement = function(agreementNum){
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
        ajaxCom.Loadajax('get',pageOneUrl+agreementNum,{isAjax:1},function(res){
            if(res.status==1){
                viewModel.datamodify(res.data)
            }else{
                dialogmin(res.msg || "网络错误!!");
            }
        },function(error){
            var res = JSON.parse(error.responseText)
            dialogmin(res.msg || "网络错误");
        })

    };
    viewModel.modifyAmount = function(agreementNum){
        var newAmount = $('.newPrice').val();
        var data = {
            "agreementNum":agreementNum,
            "newAmount":newAmount,
            "isAjax":1,
        }
        ajaxCom.asyncajax('post',modifyAmountUrl,JSON.stringify(data),function(res){
            if(res.status==1){
                $('.newPrice').val("");
                $('.totle_p').text("");
                $('.pub_pop,.big_bg').hide();
                if($(".orderlist_nav span").eq(0).hasClass("active")){
                	viewModel.load(0,"","");
                }else if($(".orderlist_nav span").eq(1).hasClass("active")){
                	viewModel.load(0,1,"");
                }else{
                	viewModel.load(0,2,"");
                }
                if($(".billlist_nav span").eq(0).hasClass("active")){
                	viewModel.load(0,"","");
                }else if($(".billlist_nav span").eq(1).hasClass("active")){
                	viewModel.load(0,"",0);
                }else{
                	viewModel.load(0,"",1);
                }
                dialogmin('修改成功!');
                /* addRouter("/shopping/orderlist/orderlist");
                 window.router.init();*/
            }else{
                alert(res.msg || "改价失败，请刷新页面!");
                $('.pub_pop,.big_bg').hide();
            }
        },function(error){
            var res = JSON.parse(error.responseText)
            dialogmin(res.msg || "改价输入错误");
        })

    };

    var init = function(parm) {
        var pageNum = viewModel.data.number();
        viewModel.firstload = true;
        viewModel.load(0,"");
//        if(pageNum > 0){
//            viewModel.load(pageNum,"");
//        } else {
//            viewModel.load(0,"");
//        };
        $("#downloadTime").daterangepicker();
        $(".orderlist_nav span").each(function(e){
            var _this = $(this);
            _this.click(function(){
                $(".orderlist_nav span").removeClass("active");
                _this.addClass("active");
            })
        });
        $(".billlist_nav span").each(function(e){
            var _this = $(this);
            _this.click(function(){
                $(".billlist_nav span").removeClass("active");
                _this.addClass("active");
            })
        });
        $(document).keyup(function (e) {
            if (e.keyCode == 13) {
                viewModel.searchGo();
            }
        });
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };
});
