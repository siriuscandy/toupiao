
define([ 'jquery', 'knockout', 'text!pages/rate/detaillist/detaillist.html','dialogmin','ajaxCom'
], function($, ko, template,dialogmin,ajaxCom) {
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
        worksname:ko.observable(),
       
    };
 
    viewModel.goback = function(){
        window.history.go(-1);
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
               
            }else{
                dialogmin(res.msg || "网络错误!!");
            }
        },function(error){
            
            dialogmin("网络错误");
        })

    }
    

    var init = function(parm) {
        var name = decodeURIComponent(parm[1]);
        viewModel.worksname(name)
        viewModel.id=parm[0];
        viewModel.load(0,"");
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };
});
