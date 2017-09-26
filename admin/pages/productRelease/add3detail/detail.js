define([ 'jquery', 'knockout', 'text!pages/productRelease/add3detail/detail.html','dialogmin',"dialogminBack",'ajaxCom' ],
    function($, ko, template,dialogmin,dialogminBack,ajaxCom) {

        var submitUrl = "/product/publish/speci";

        var updataUrl = "/productSpeci/info/";
        var productUrl = "/product/info/";
        var nextUrl = "/productRelease/add4/add/:productId";
        var prevUrl = "/productRelease/add2/add/:productId";
        var thisUrl = "/productRelease/add3/add/:productId";
        var ListUrl = "/productRelease/man/List";

        addRouter(nextUrl);
        addRouter(ListUrl);
        addRouter(thisUrl);
        var viewModel = {
            data : ko.observable({}),
            data1 : {
                content : ko.observableArray([]),
                totalPages : ko.observable(0),
                number : ko.observable(0),
                totalElements : ko.observable(0)
            },
            Updata :[],
            productId:"",
            multiAccount:0,
            productVersion:1,
            lease:"",
            setData : function(data) {
                this.data1.content(data.data);
            }

        };
        viewModel.goback = function(){
            window.router.setRoute(ListUrl);
        };


        viewModel.leaseCheckout = function(lea,v){//租期勾选
            if(a==""|| a==null){
                return false
            }
            var a = lea.split("/");
            var b =$.inArray(String(v),a);
            if(b>-1){
                return true
            }else{
                return false
            }

        };

        viewModel.load = function(){
            ajaxCom.asyncajax('get',updataUrl+viewModel.productId,{isAjax:1},function(res){
                if(res.data[0].saleMode==3){
                    $(".app3detail_saleMode3").show();
                    if(res.data[0].productVersion==1){
                        $(".productVersion2").hide();
                    }else{
                        $(".productVersion1").hide();
                    }
                     return
                }
                if (res.status==1 && res.data.length>0){
                    viewModel.setData(res);
                    viewModel.data(res.data[0]);
                   

                }else if(res.status==0){
                    dialogmin(res.msg || "网络错误");
                }

            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            });
            ajaxCom.asyncajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){
                var categoryId = res.data.productMarket;
                viewModel.PKcategoryId = categoryId;
                viewModel.apilinkPK = res.data.apilinkPK;
                if(viewModel.apilinkPK !=''){
                    $(".product3_com_b_normal").hide();
                    $(".product3_com_b_API").show();
                }else{


                }
            })

        };



        var init = function(parm){

            viewModel.productId = parm[0];

            viewModel.load();
            $(".product3_com_t2 .cl-tips-c-o").mouseenter(function(){
                $(this).parents(".product3_com_t2").find(".code_text").show();
            }).mouseleave(function(){
                $(".code_text").hide();
            })
             $(".product3_com_b_t .cl-tips-c-o").mouseenter(function(){
                        $(this).parents(".fwmy_li").find(".fwmy").show();
                    }).mouseleave(function(){
                        $(".fwmy").hide();
                    })

        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });