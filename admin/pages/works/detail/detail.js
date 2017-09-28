
define([ 'jquery', 'knockout', 'text!pages/works/detail/detail.html','dialogmin','ajaxCom'
], function($, ko, template,dialogmin,ajaxCom) {
    //接口
    var pageUrl = '/vote/works/detail/'; //列表加载
    var viewModel = {
        data :  ko.observable({}),
       
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    
    
    viewModel.load = function() {
        ajaxCom.Loadajax('get',pageUrl+viewModel.id,"",function(res){
            if(res.status==1){ 
                viewModel.data(res.data)
            }else{}
                dialogmin('网络开小差~请刷新页面')
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