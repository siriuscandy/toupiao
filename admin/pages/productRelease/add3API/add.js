define([ 'jquery', 'knockout', 'text!pages/productRelease/add3API/add.html','dialogmin',"dialogminBack",'ajaxCom' ],
    function($, ko, template,dialogmin,dialogminBack,ajaxCom) {

        var submitUrl = "/product/publish/speci";

        var updataUrl = "/productSpeci/info/";

        var nextUrl = "/productRelease/add4/add/:productId";
        var prevUrl = "/productRelease/add2/add/:productId";
        var thisUrl = "/productRelease/add3/add/:productId";

        addRouter(nextUrl);
        addRouter(prevUrl);
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
            },
            OladDate :[]

        };
        viewModel.goback = function(){
            window.router.setRoute("/productRelease/add2/add/"+viewModel.productId);
        };
        viewModel.PushNewData = function(Aarray){
            $(".product_add_specification").each(function(e){
                var _this = $(this);
                var listLength = _this.find(".product3_com_b_b ul li").length;
                var leaseN = "";
                var IsTrialVersion = 0;

                if(_this.hasClass("product_add_basic")==false){
                    if(_this.find(".APIgeinput2").val()==""){
                        _this.find(".APIgeinput2").addClass("errorinput");
                        viewModel.maxminVal = false
                    }
                    if(_this.find(".APIgeinput1").val()==""){
                        _this.find(".APIgeinput1").addClass("errorinput");
                        viewModel.maxminVal = false
                    }
                     if(_this.find(".product3_com_m2_inputtestm").get(0).checked){
                        IsTrialVersion = 1
                    }
                    var neData = {
                        "productId":viewModel.productId,
                        "specificationName":_this.find(".prductName_input").val(),
                        "specificationId":_this.find(".prductName_input").attr("data-id") || "",
                        "saleMode":2,
                        "minAccount":"",
                        "multiAccount":"",
                        "maxAccount":"",
                        "price1Month": "",
                        "price3Month":"",
                        "price6Month":"",
                        "price1Year": "",
                        "price2Year": "",
                        "price3Year": "",
                        "isAjax": 1,
                        "lease":"",
                        "productVersion":1,
                        "price":_this.find(".APIgeinput2").val(),
                        "count":_this.find(".APIgeinput1").val(),
                         "isTrialVersion":IsTrialVersion,
                        "speciOrder":e

                    }
                    Aarray.push(neData)

                }
            })
        }
        viewModel.submitMo = function() {
            viewModel.Updata = [];
            viewModel.maxminVal = true;
            viewModel.PushNewData(viewModel.Updata)

            var speci = {
                speci:viewModel.Updata
            }
            if(viewModel.maxminVal==false){
                return
            }
            if(JSON.stringify(viewModel.Updata) == JSON.stringify(viewModel.OladDate)){
                 window.router.setRoute("/productRelease/add4/add/"+viewModel.productId)

            }else{
                ajaxCom.asyncajax('post',submitUrl,JSON.stringify(viewModel.Updata),function(res){
                    if (res.status==1){
                        // dialogmin('保存成功!');
                        window.router.setRoute("/productRelease/add4/add/"+viewModel.productId);
                    }else{
                        dialogmin(res.msg);
                    }
                },function(error){
                    var res = JSON.parse(error.responseText)
                    dialogmin(res.msg || "网络错误");
                })
            }

        }


        viewModel.load = function(){
            ajaxCom.asyncajax('get',updataUrl+viewModel.productId,{isAjax:1},function(res){
                    if (res.status==1 && res.data.length>0){
                        viewModel.setData(res);
                        
                    }else if(res.status==0){
                        dialogmin(res.msg || "网络错误");
                    }

            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            });
        };

        viewModel.productBlur = function(){
            viewModel.Dclone = $(".product_add_basic").eq(0).clone();

            $(".product_add_basic .APIgeinput").on('blur',function () {
                var _this = $(this);
                var a1 = _this.parents(".product_add_specification").find(".APIgeinput1")
                var a2 = _this.parents(".product_add_specification").find(".APIgeinput2")
                if($(".product_add_specification").length>6){
                    dialogmin("最多添加6个规格");
                    $(".product_add_basic").removeClass("product_add_blue")
                    return false
                }

                if( a1.val()==""){
                    return false
                }else{
                    a1.removeClass("errorinput");
                }
                if( a2.val()==""){
                    return false
                }else{
                    a2.removeClass("errorinput");
                }
                if(_this.parents(".product_add_specification").hasClass("product_add_basic")==false){
                    return false
                }
                if (_this.val()) {
                    _this.parents(".product_add_specification").removeClass("product_add_basic");
                    $(".product_add_gg").append(viewModel.Dclone);
                    $(".product_add_basic").show();
                    viewModel.productBlur();
                    viewModel.plusclick(_this.parents(".product_add_specification"));
                }else {
                    $(".product_add_basic").removeClass("product_add_blue")

                }
                var price = a2.val()+"元 / "+a1.val()+"次";
                _this.parents(".product_add_specification").find(".prductName_input").val(price)
            })
        };

        viewModel.plusclick =function(t){

            t.find(".cl-del").on('click',function(){
                var par = $(this).parents(".product_add_specification")
                if(par.hasClass("product_add_basic")==false){
                    dialogminBack('删除','是否确认删除？',function(isok){
                        if(isok) {
                            par.remove();

                        }
                    })

                }
                return false

            });
        }
        var init = function(parm){
            viewModel.productId = parm[0];
            viewModel.load();
            viewModel.productBlur();
             viewModel.PushNewData(viewModel.OladDate)
            $(".cl-del").on('click',function(){
                var par = $(this).parents(".product_add_specification")
                if(par.hasClass("product_add_basic")==false){
                    dialogminBack('删除','是否确认删除？',function(isok){
                        if(isok) {
                            par.remove();

                        }
                    })

                }
                return false

            });
            $(".APIgeinput").on('blur',function () {
                var _this=$(this);
                var a1 = _this.parents(".product_add_specification").find(".APIgeinput1")
                var a2 = _this.parents(".product_add_specification").find(".APIgeinput2")
                var price = a2.val()+"元 / "+a1.val()+"次";
                _this.parents(".product_add_specification").find(".prductName_input").val(price)
            })
             $(".product3_com_m2_inputtest").click(function(){
                var _this = $(this);
                if(_this.get(0).checked){
                    viewModel.IsTrialVersion = 1;
                }else{
                    viewModel.IsTrialVersion = 0
                }
            });

        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });