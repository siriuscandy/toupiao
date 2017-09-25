define([ 'jquery', 'knockout', 'text!pages/productRelease/ext/add.html','dialogmin','ajaxCom'
    ],
    function($, ko, template,dialogmin,ajaxCom) {

        var updataUrl = "/product/category";
        var APIdataUrl = "/product/apilink";
        var productUrl = "/product/info/";
        var submitUrl = "/product/publish?step=1";
        var nextUrl = "/productRelease/add2/add/:productId";
        var step4Url = "/productRelease/add4/add/:productId";
        var step6Url = "/productRelease/add6/add/:productId";


        addRouter(nextUrl);
        addRouter(step4Url);
        addRouter(step6Url);
        var viewModel = {
            data :  ko.observable({}),
            codedata :  ko.observable({}),
            APIdata :  ko.observable({}),
            categoryId:"",
            productId:"",
            emailAuthorize:false,
            mobileAuthorize:false,
            ismodify:0,
            appId:"",
            pro_status:0,
            isLoadApi:false


        };
        viewModel.goback = function(){
            window.history.go(-1);
        }
        viewModel.submitMo = function() {
            /* window.router.setRoute(nextUrl);
             return*/
            var apilinkPKData = "";
            if(viewModel.categoryId=='ebe649e0-5bcd-8638-3242-e17e773490c2'){
                apilinkPKData = viewModel.codedata().apilinkPK
            }
            var neData = {
                "productId":viewModel.productId,
                "productMarket":viewModel.categoryId,
                "productName":viewModel.codedata().productName,
                "openMode":$(".select_this").val(),
                "interfaceAddress":viewModel.codedata().interfaceAddress || "",
                "mobileAuthorize":viewModel.mobileAuthorize,
                "emailAuthorize":viewModel.emailAuthorize,
                // "customerGroup":viewModel.codedata().customerGroup,
                //"relativeProduct":viewModel.codedata().relativeProduct,
                "apilinkPK":apilinkPKData,
                "appId":viewModel.appId,
                "isAjax":1,
                "step":"1"


            }
            if(neData.productName==undefined||neData.productName==""){
                dialogmin('请填写商品名称~');
                return false
            }if($(".app_t1_list ul li").eq(0).hasClass("active")==true && neData.openMode!=3 && neData.interfaceAddress=="" && $(".app_com_list_bo_2").css("display") == 'block'){
                dialogmin('请填写生产系统接口地址~');
                return false
            }
            if($(".app_t1_list ul li").eq(8).hasClass("active")==false){

            }else{
                if(neData.apilinkPK==undefined||neData.apilinkPK==""){
                    dialogmin('当前用户没有api商品~');
                    return false
                }
            }
            if(JSON.stringify(neData) == JSON.stringify(viewModel.LoadHasData)){
                 window.router.setRoute("/productRelease/add2/add/"+viewModel.LoadHasData.productId)

            }else{
                    ajaxCom.Loadajax('post',submitUrl,JSON.stringify(neData),function(res){
                        if (res.status==1){
                            //dialogmin("保存成功");
                            window.router.setRoute("/productRelease/add2/add/"+res.data.productId)

                        }else{
                            dialogmin(res.msg);
                        }
                    },function(error){
                        var res = JSON.parse(error.responseText)
                        dialogmin(res.msg || "网络错误");
                    })
            }
            

        }
        viewModel.setTimes = function(){//周期单选
            $('.sell_times input[type=checkbox]').click(function(){
                $(this).attr('checked','checked').parent().siblings().find("input").removeAttr('checked');
                viewModel.sell_time = $(this).val()
            });
        };
        viewModel.placeholder = function(obj) {//IE placeholder 兼容
            var $input = obj;
            var val = obj.attr("placeholder");

            if($input.val()==""){
                $input.val(val);
            }
            $input.focus(function() {
                if ($input.val() == val) {
                    $(this).val("");
                }
            }).blur(function() {
                if ($input.val() == "") {
                    $(this).val(val);
                }
            });
        }
        viewModel.getInfo = function(){
            if(viewModel.productId != ""){
                ajaxCom.asyncajax('get',productUrl+viewModel.productId,{isAjax:1},function(res){
                    var returnDateapilinkPK = res.data.apilinkPK;
                    if (res.status==1) {
                        viewModel.codedata(res.data);
                        viewModel.LoadHasData = {
                                    "productId":res.data.productId,
                                    "productMarket":res.data.productMarket,
                                    "productName":res.data.productName,
                                    "openMode":res.data.openMode,
                                    "interfaceAddress":res.data.interfaceAddress,
                                    "mobileAuthorize":res.data.mobileAuthorize,
                                    "emailAuthorize":res.data.emailAuthorize,
                                    "apilinkPK":res.data.apilinkPK || "",
                                    "step":"1",
                                    "isAjax":"1"
                            }
                        $(".app_t1_list ul li").each(function (e) {
                            var _this = $(this);
                            if (_this.attr("data-id") == res.data.productMarket) {
                                $(".app_t1_list ul li").eq(e).addClass("active");
                                viewModel.categoryId = res.data.productMarket
                            }
                        });
                        if (res.data.mobileAuthorize == true) {
                            $(".checkbox_name").eq(0).attr("checked", true);
                            viewModel.mobileAuthorize = true
                        }
                        if (res.data.emailAuthorize == true) {
                            $(".checkbox_name").eq(1).attr("checked", true);
                            viewModel.emailAuthorize = true

                        }

                        if (res.data.openMode == 3) {
                            $(".app_com_list_bo_2").hide();
                        }

                        if ($(".app_t1_list ul li").eq(0).hasClass("active")) {
                            if (res.data.openMode != 3) {
                                $(".app_com_list_bo_2").show();
                            }
                        } else {
                            if($(".app_t1_list ul li").eq(8).hasClass("active")==true){
                                viewModel.APIAjax(returnDateapilinkPK);
                                $(".APIdata_li").show();
                                $(".select_this").val("1").attr("disabled","disable").addClass("gred");
                                $(".cl-menu").hide();
                                $(".app_com_list_bo_2").hide();
                                $(".APIdata_li .cl-menu").show();
                            }else{
                                $(".APIdata_li").hide();
                                $(".select_this").val("3").attr("disabled","disable").addClass("gred");
                                $(".cl-menu").hide();
                            }
                        }
                        if (res.data.status == 3) {
                            $(".productName_In").attr("disabled", 'disabled').addClass("gred");
                            $("#APIdata").attr("disabled", 'disabled').addClass("gred");
                            $(".app_t1_list").addClass("app_t1_list_dis");
                            viewModel.pro_status = 3;
                        } else {
                            viewModel.appSelect();
                        }




                    }else{
                        dialogmin(res.msg);
                    }
                },function(error){
                    var res = JSON.parse(error.responseText)
                    dialogmin(res.msg || "网络错误");
                });

            }
        }
        viewModel.APIAjax = function(PK){
            if(viewModel.isLoadApi){
                return false
            }
            ajaxCom.Loadajax('get',APIdataUrl,{isAjax:1},function(res){//请求api服务
                var Rdata = JSON.parse(res.msg);
                if(Rdata==null){
                    return false
                }
                if (Rdata.status==true){
                    if(Rdata.result.length<1){
                        var data = [{
                            pk:"",
                            name:"空",
                        }]
                        viewModel.APIdata(data)
                    }else{
                        viewModel.APIdata(Rdata.result);
                        viewModel.isLoadApi = true;
                        if(PK){
                            $("#APIdata").val(PK)

                        }
                    }
                }else{
                    dialogmin(Rdata.errmsg);
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })
        }
        viewModel.load =function(){
            ajaxCom.asyncajax('get',updataUrl,{isAjax:1},function(res){
                if (res.status==1){
                    viewModel.data(res.data)
                }else{
                    dialogmin(res.msg);
                }
            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            })



            if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.")
            {
                viewModel.placeholder($(".productName_In"))

            }


        }
        viewModel.appSelect = function(){
            $(".app_t1_list ul li").each(function(e){
                var _this = $(this);

                _this.on('click',function(){
                    $(".app_t1_list ul li").removeClass("active")
                    _this.addClass("active");
                    viewModel.categoryId = $(this).attr("data-id");
                    if(e!=0 && e!=8 && e!=9 && e!=2 && e!=3){
                        $(".select_this").val("3").attr("disabled","disable").addClass("gred");
                        $(".cl-menu").hide();
                        $(".APIdata_li").hide();

                    }else if(e==8 || e==9){
                        viewModel.APIAjax();
                        $(".APIdata_li").show();
                        $(".select_this").val("1").attr("disabled","disable").addClass("gred");
                        $(".cl-menu").hide();
                        $(".app_com_list_bo_2").hide();
                        $(".APIdata_li .cl-menu").show();
                    }
                    else{
                        $(".select_this").removeAttr("disabled").removeClass("gred");
                        $(".cl-menu").show();
                        $(".APIdata_li").hide();
                    }

                    if($(".select_this").val()==3){
                        $(".app_com_list_bo_2").hide();
                    }else{
                        if(e==0){
                            $(".app_com_list_bo_2").show();

                        }
                    }
                })
            })
        }
        var init = function(parm){
            var StringP = parm[0];

            viewModel.load();

            viewModel.categoryId =$(".app_t1_list ul li").eq(0).attr("data-id");
            $(".app_t1_list ul li").eq(0).addClass("active");
            viewModel.appId = StringP;
            viewModel.productId = "";
            viewModel.appSelect();


            $(".select_this").change(function(){

                if($(this).val()==3){
                    $(".app_com_list_bo_2").hide();
                }else{
                    $(".app_com_list_bo_2").show();
                }
            })
            $(".checkbox_name").eq(0).click(function(){
                if($(this).get(0).checked){
                    viewModel.mobileAuthorize = true
                }else{
                    viewModel.mobileAuthorize = false
                }

            })
            $(".checkbox_name").eq(1).click(function(){
                //$(".checkbox_name").eq(0).attr("checked",false);
                if($(this).get(0).checked){
                    viewModel.emailAuthorize = true
                }else{
                    viewModel.emailAuthorize = false
                }
            });





        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });