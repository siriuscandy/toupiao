
define([ 'jquery', 'knockout', 'text!pages/works/detail/detail.html','dialogmin','ajaxCom'
], function($, ko, template,dialogmin,ajaxCom) {
    //接口
    var pageUrl = '/vote/works/detail'; //列表加载
    var submitUrl = '/vote/marking/add'; //

    
    var viewModel = {
        data :  ko.observable({}),
       
    };
    viewModel.goback = function(){
        window.history.go(-1);
    };
    
    viewModel.submit = function() {
        var Wscore = $(".works_score span.W_active").attr("data-id");
        var pingyu =$(".works_pingyu .text").val();
        if(Wscore == "" || Wscore== undefined){
            dialogmin("请选择分数");
            return false
        }
        if(pingyu== "填写评语"){
            pingyu="";
        }
        var qdata= {
                workId:viewModel.id ,
                score:Wscore,
                userId:viewModel.userId,
                detail:pingyu
            }
        ajaxCom.Loadajax('get',submitUrl,qdata,function(res){
            if(res.status==1){ 
                dialogmin("评价成功");
                window.history.go(-1)
            }else{
                 dialogmin('网络开小差~请重新提交');
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
        ajaxCom.Loadajax('get',pageUrl+"/"+viewModel.id,"",function(res){
            if(res.status==1){ 
                viewModel.data(res.data);
                setTimeout(function(){
                    $(".woksimg_min").click(function(){
                        var url = $(this).attr("src");
                        $(".bigpicDiv .b_pic").css({
                            "background":"url("+url+") center no-repeat",
                            "background-size":"contain",
                        })
                        $(".bigpicDiv").show();
                    })
                },500)
            }else {
                dialogmin('网络开小差~请刷新页面')
            }
        });
        viewModel.btnclick(); 
        $(".works_pingyu .text").val("填写评语")
    }
    var init = function(parm){
        viewModel.id = parm[0];
        viewModel.userId = window.sessionStorage.userId;
        viewModel.load();
        $(".bigpicDiv").click(function(){
            $(".bigpicDiv").hide();
            $(".bigpicDiv .b_pic").css("background",'');
        })
    };

    return {
        'model' : viewModel,
        'template' : template,
        'init' : init
    };


});