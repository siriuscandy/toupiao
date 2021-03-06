
define([ 'jquery', 'knockout', 'text!pages/rate/detail/detail.html','dialogmin','ajaxCom'
], function($, ko, template,dialogmin,ajaxCom) {
    //接口
    var pageUrl = '/vote/rate/detail/'; //列表加载
    var viewModel = {
        data :  ko.observable({}),
       
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    viewModel.godetail = function(id,name){
        name = encodeURIComponent(name);
        window.router.setRoute("/rate/detaillist/detaillist/"+id+"/"+name);
        return false;
    };
    
    viewModel.load = function() {
        ajaxCom.Loadajax('get',pageUrl+viewModel.id ,"",function(res){
            if(res.status==1){ 
                viewModel.data(res.data)
            }
        })  
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