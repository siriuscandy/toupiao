
define([ 'jquery', 'knockout', 'text!pages/works/list/list.html','dialogmin',
    'bootstrap','uui','ajaxCom'
], function($, ko, template,dialogmin,b,uui,ajaxCom) {
    //接口
    var pageUrl = '/vote/works/list'; //列表加载
    var changUrl = '/vote/works/changestatus'; //上下架 删除

    var viewModel = {
        data : {
            content : ko.observableArray([]),
            totalPages : ko.observable(),
            number : ko.observable(),
            totalElements : ko.observable()
        },
        searchText : ko.observable(),
        setData : function(res) {
            this.data.content(res.list);
            this.data.totalPages(res.totalPages);
            this.data.number(res.number + 1);
            this.data.totalElements(res.totalElements);
        },
        datamodify:ko.observable({}),
        searchDate:ko.observable(),
       
    };
   
    viewModel.goback = function(){
        window.history.go(-1);
    };
    viewModel.godetail = function(id){
        window.router.setRoute("/works/detail/detail/"+id);
        return false;
    };
    viewModel.goupstore = function(wid){
        var queryData = {
            id:wid,
            status:"2"
        }
        ajaxCom.Loadajax('get',changUrl,queryData,function(res){
            if(res.status==1){ 
                dialogmin("上架成功");
                viewModel.load(viewModel.data.number(),"")
            }
        })
            
    };
    viewModel.godownstore = function(wid){
       var queryData = {
            id:wid,
            status:"1"
        }
        ajaxCom.Loadajax('get',changUrl,queryData,function(res){
            if(res.status==1){ 
                dialogmin("下架成功");
                viewModel.load(viewModel.data.number(),"")
            }
        })
    };
    viewModel.delete = function(wid){
       var queryData = {
            id:wid,
            status:"3"
        }
        ajaxCom.Loadajax('get',changUrl,queryData,function(res){
            if(res.status==1){ 
                dialogmin("删除成功");
                viewModel.load(viewModel.data.number(),"")
            }
        })
    };
    //搜索
    viewModel.searchGo = function(){
        // $(".orderlist_nav span").removeClass("active");
        viewModel.load(0,"");//
        viewModel.firstload=false;
    };

    viewModel.load = function(pageIndex,orderStatus){

        var queryData = {
            size: viewModel.pagesize || 10,     //page size 每页显示条数
            page: pageIndex,    //page num 当前页数
            scoreclass:"0",
            workclass:"0",
            status:"0",
            searchKey:"",
            id:"",
        };
        queryData.scoreclass = $(".scoreclass").val();
        queryData.workclass = $(".workclass").val();
        queryData.status = $(".workstatus").val();
        queryData.searchKey = $(".searchKey").val();
        queryData.id = $(".searchKeyid").val();
       

        ajaxCom.Loadajax('get',pageUrl,queryData,function(res){
            if(res.status==1){
                viewModel.setData(res.data);
                var element = document.getElementById("pagination");
                var comp = new u.pagination({ el: element,showState:false,jumppage:true });
                comp.update({ totalPages: viewModel.data.totalPages(), pageSize:viewModel.pagesize || 10, currentPage:  viewModel.data.number(), totalCount: viewModel.data.totalElements() });
                comp.on('pageChange', function(pageIndex) {
                    if(viewModel.testNum(pageIndex) && pageIndex<viewModel.data.totalPages()){
                        viewModel.load(pageIndex);

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
        },function(error){
            
            dialogmin("网络错误");
        })

    }
    viewModel.testNum = function(s){
        var re = /^[0-9]+$/ ;
        return re.test(s)
    }
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

    var init = function(parm) {
        var pageNum = viewModel.data.number();
        viewModel.firstload = true;
        viewModel.load(0,"");
        $(document).keyup(function (e) {
            if (e.keyCode == 13) {
                viewModel.searchGo(0);
            }
        });
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };
});
