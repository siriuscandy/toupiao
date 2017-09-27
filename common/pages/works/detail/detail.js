
define([ 'jquery', 'knockout', 'text!pages/works/detail/detail.html','dialogmin','ajaxCom'
], function($, ko, template,dialogmin,ajaxCom) {
    //接口
    var pageUrl = '/vote/works/detail'; //列表加载
    var submitUrl = '/vote/marking'; //

    
    var viewModel = {
        data :  ko.observable({}),
       
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    
    viewModel.submit = function() {
        var Wscore = $(".works_score span.W_active").attr("data-id");
        var pingyu =$(".works_pingyu .text").val();
        if(score == "" || score== undefined){
            dialogmin("请选择分数");
            return false
        }
        if(pingyu == "" || pingyu== "填写评语"){
            dialogmin("请填写评语");
            return false
        }
        var qdata= {
                id:viewModel.id ,
                score:Wscore,
                detail:pingyu
            }
        ajaxCom.Loadajax('post',submitUrl,qdata,function(res){
            if(res.status==1){ 
                dialogmin("评价成功");
                window.history.go(-1)
            }
        })  
    };
    viewModel.btnclick = function(){
        $(".works_score span").click(function(){
            $(".works_score span").removeClass("W_active");
            $(this).addClass("W_active");
        })
    }
    viewModel.load = function() {
        ajaxCom.Loadajax('get',pageUrl,"",function(res){
            if(res.status==1){ 
                viewModel.data(res.data)
            }
        });
        viewModel.btnclick(); 
        $(".works_pingyu .text").val("填写评语")
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