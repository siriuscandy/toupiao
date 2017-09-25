define([ 'jquery', 'knockout', 'text!pages/negotiable/list/list.html','dialogmin','bootstrap','uui','ajaxcommon'], function($, ko, template,dialogmin,b,uui,ajaxcommon) {
    var listUrl = '/market/customer/list'; //列表页加载
    
    // 添加修改页路由
    var detailrooter = '/negotiable/detail/detail/:resId';
    var downexport = '/market/customer/export'; //导出
    addRouter(detailrooter);
    var viewModel = {
        data : {
            content : ko.observableArray([]),
            totalPages : ko.observable(),
            number : ko.observable(),
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
        status:""
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    viewModel.reset = function(){
        viewModel.load(0,"");
        viewModel.firstload=false;
    };
    viewModel.searchGo = function(){
        $(".orderlist_nav span").removeClass("active");
        viewModel.load(0,"");
        viewModel.firstload=false;
    };
    viewModel.godetail = function(id){
        window.router.setRoute("/negotiable/detail/detail/"+id);
        return false;
    };

    viewModel.ordernopay =function(){
        viewModel.status = 0
       viewModel.load(0,viewModel.status)
    };
	viewModel.orderpay =function(){
        viewModel.status = 1
        viewModel.load(0,viewModel.status)
	};
    viewModel.allorderpay =function(){
        viewModel.status = ""
        viewModel.load(0,viewModel.status)
	};
	viewModel.testNum = function(s){
        var re = /^[0-9]+$/ ;
        return re.test(s)
    };
    viewModel.Dexport = function(){
        //window.open(downexport)
        viewModel.downloadxls(downexport)
    };
     viewModel.downloadxls = function(Url){
        var f = document.createElement("form");
        document.body.appendChild(f);
        var i = document.createElement("input");
        i.type = "hidden"; f.appendChild(i);
        i.value = viewModel.status;
        i.name = "status";
        f.action = Url;
        f.submit();
    };
    viewModel.load = function(pageIndex,status){
    	$.ajaxSetup({cache:false});
        var queryData = {
            size: viewModel.pagesize||10,     //page size 每页显示条数
            page: pageIndex,    //page num 当前页数
            isExecuted:status,
            isAjax:1
        };
        $.ajax({
            type : 'get',
            dataType : 'json',
            async : false,
            cache:false,
            data : queryData,
            url : listUrl,
            success : function(res) {
                if(res.status==1){
                    viewModel.setData(res.data);
                    var element = document.getElementById("pagination");
                    var comp = new u.pagination({ el: element,showState:false,jumppage:true });
                    comp.update({ totalPages: viewModel.data.totalPages(), pageSize: viewModel.pagesize || 10, currentPage:  viewModel.data.number(), totalCount: viewModel.data.totalElements() });
                    comp.on('pageChange', function(pageIndex) {
                        //viewModel.load(pageIndex,viewModel.status);
                        if(viewModel.testNum(pageIndex) && pageIndex<viewModel.data.totalPages()){
                            viewModel.load(pageIndex,viewModel.status);
                        }else {
                            dialogmin("请输入正确的页码")
                        }
                    });
                    comp.on('sizeChange', function(arg) {
                    	if(viewModel.testNum(arg[0])){
                            viewModel.pagesize = arg[0];
                            viewModel.load(0);

                        }else {
                            dialogmin("请输入正确的数")
                        }
                    });
                }else{
                    dialogmin(res.msg || "网络错误!!");
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                dialogmin("调用服务报错!!");
            }
        });
    }

    viewModel.stopEvent = function(){ //阻止冒泡事件
        function getEvent(){
            if(window.event)    {return window.event;}
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


    var init = function(parm) {
        var pageNum = viewModel.data.number();
        viewModel.firstload = true;
        viewModel.load(0,"");

        $(".orderlist_nav span").each(function(e){
            var _this = $(this);
            _this.click(function(){
                $(".orderlist_nav span").removeClass("active");
                _this.addClass("active");
            })
        });
        // $(document).keyup(function (e) {
        //     if (e.keyCode == 13) {
        //         viewModel.searchGo();
        //     }
        // });
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };
});
