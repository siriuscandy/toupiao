define([ 'jquery', 'knockout', 'text!pages/productRelease/add3/add.html','dialogmin',"dialogminBack",'ajaxCom' ],
    function($, ko, template,dialogmin,dialogminBack,ajaxCom) {

        var submitUrl = "/product/publish/speci";

        var updataUrl = "/productSpeci/info/";
        var productUrl = "/product/info/"; // 商品信息
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
            OladDate:[]

        };
        viewModel.goback = function(){
            window.router.setRoute("/productRelease/add2/add/"+viewModel.productId);
        };
        viewModel.getProductInfo= function(){
            ajaxCom.asyncajax('get',productUrl+viewModel.productId,"",function(res){
                    if (res.status==1){
                        viewModel.openMode = res.data.openMode;
                    }else{
                        dialogmin(res.msg);
                    }
                },function(error){
                    var res = JSON.parse(error.responseText)
                    dialogmin(res.msg || "网络错误");
                })
        }
        viewModel.PushNewData = function(Aarray){
            $(".product_add_specification").each(function(e){
                var _this = $(this);
                var listLength = _this.find(".product3_com_b_b ul li").length;
                var price1Month,price3Month,price6Month,price1Year,price2Year,price3Year;
                var leaseN = "";
                var AutoNegotiable = 0;
                var IsTrialVersion = 0;
                if(_this.hasClass("product_add_basic")==false && $(".product3_com_m3").css("display") != "block"){
                     for(var i =0 ; i < listLength  ; i++){
                        var inputLi = _this.find(".product3_com_b_b ul li").eq(i).find(".product3_com_b_b_check");


                        if(inputLi.get(0).checked){
                            var inputV =  _this.find(".product3_com_b_b ul li").eq(i).find(".priceinput");
                            inputV.attr("data-id",inputV.val())
                            if(leaseN=="" && inputV.val() !=""){
                                leaseN = inputLi.val();
                            }else if(leaseN!="" && inputV.val() !=""){
                                leaseN = leaseN+ "/"+inputLi.val();
                            }
                        }


                     }
                    if(viewModel.data().saleMode == 1 && _this.find(".fwmy_li").find(".product3_com_b_b_check").get(0).checked){
                        AutoNegotiable = 1
                    }
                     if(_this.find(".product3_com_m2_inputtestm").get(0).checked){
                        IsTrialVersion = 1
                    }
                    if(viewModel.data().saleMode == 1 && leaseN==""){
                        dialogmin("租期不能为空");
                        viewModel.maxminVal = false
                        return false
                    } if(_this.find(".prductName_input").val()==""){
                        dialogmin("版本名称不能为空");
                        viewModel.maxminVal = false
                        return false
                    }
                    if(viewModel.data().saleMode == 2 && _this.find(".product3_com_price").val()==""){
                        dialogmin("定价不能为空");
                        viewModel.maxminVal = false
                        return false
                    }
                    if(viewModel.multiAccount == 0){
                        _this.find(".product3_com_minAccount").val("1")
                        _this.find(".product3_com_maxAccount").val("2")
                    }else{

                    }
                    if(parseInt(_this.find(".product3_com_minAccount").val() || 1)>parseInt(_this.find(".product3_com_maxAccount").val() || 0)){
                        dialogmin("最大值请大于最小值")
                        _this.find(".product3_com_maxAccount").addClass("errorinput")
                        viewModel.maxminVal = false
                        return false
                    }else{
                        _this.find(".product3_com_maxAccount").removeClass("errorinput")
                    }

                    var neData = {
                        "productId":viewModel.productId,
                        "specificationName":_this.find(".prductName_input").val(),
                        "saleMode":viewModel.data().saleMode,
                        "minAccount":_this.find(".product3_com_minAccount").val() || 1,
                        "multiAccount":viewModel.multiAccount,
                        "maxAccount":_this.find(".product3_com_maxAccount").val() || 99999,
                        "price1Month":_this.find(".price1Month").attr("data-id") || "",
                        "price3Month":_this.find(".price3Month").attr("data-id") || "",
                        "price6Month":_this.find(".price6Month").attr("data-id") || "",
                        "price1Year":_this.find(".price1Year").attr("data-id") || "",
                        "price2Year":_this.find(".price2Year").attr("data-id") || "",
                        "price3Year":_this.find(".price3Year").attr("data-id") || "",
                        "lease":leaseN,
                        /*"price":_this.find(".product3_com_price").val() || "",*/
                        "productVersion":viewModel.productVersion,
                        "autoNegotiable":AutoNegotiable,
                        "isTrialVersion":IsTrialVersion,
                        "price":_this.find(".product3_com_price").val() || "",
                        "speciOrder":e,
                        "specificationId":_this.find(".prductName_input").attr("data-id") || "",
                        "isAjax":1

                    }
                    Aarray.push(neData)

                }
            })
            if($(".product3_com_m3").css("display") == "block"){
                
                var neData = {
                    "productId":viewModel.productId,
                    "specificationName": "",
                    "saleMode":viewModel.data().saleMode,
                    "minAccount":  "1",
                    "multiAccount":viewModel.multiAccount,
                    "maxAccount":  "99999",
                    "price1Month": "",
                    "price3Month": "",
                    "price6Month": "",
                    "price1Year": "",
                    "price2Year": "",
                    "price3Year": "",
                    "autoNegotiable":0,
                    "isTrialVersion":viewModel.IsTrialVersion,
                    "price":"",
                    "isAjax":1,
                    "productVersion":viewModel.productVersion

                }
                Aarray.push(neData)
            }
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
            if(viewModel.Updata.length<1){
                dialogmin("规格不能为空");
                return false
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
        viewModel.setTimes = function(){//周期单选
            $('.sell_times input[type=checkbox]').click(function(){
                $(this).attr('checked','checked').parent().siblings().find("input").removeAttr('checked');
                viewModel.sell_time = $(this).val()
            });
        };
         viewModel.leaseCheckout = function(lea,v){//租期勾选

              var a = lea.split("/");
              var b =$.inArray(String(v),a);

              if(b>-1){
                  return true

              }else{
                  return false
              }

        };

        viewModel.leaseCheckout2 = function(lea,v){//租期勾选

              var a = lea.split("/");
              var b =$.inArray(String(v),a);

              if(b>-1){

                  return false

              }else{
                  return true
              }

        };

        viewModel.load = function(){
            ajaxCom.asyncajax('get',updataUrl+viewModel.productId,{isAjax:1},function(res){
                   
                    if (res.status==1 && res.data.length>0){
                        viewModel.isfirstsettihs = false;
                        viewModel.getProductInfo();
                        viewModel.saleModeNow =res.data[0].saleMode;
                        if(res.data[0].saleMode==1){
                            viewModel.setData(res);

                            $(".product3_com_b_b").show();
                            $(".product_add_specification").show();

                        }else if(res.data[0].saleMode==2){
                            viewModel.setData(res);

                            $(".product3_com_b_b,.fwmy_li").hide();
                            $(".product_add_specification,.product3_com_b_d").show();

                        }else{
                            $(".product_add_specification,.product3_com_m2").hide();
                            $(".product3_com_m3").show();
                            if(res.data[0].productVersion==2){
                                $(".product3_com_m3list p").eq(0).removeClass("active");
                                $(".product3_com_m3list p").eq(1).addClass("active");
                                viewModel.productVersion = 2
                            }
                        }
                        viewModel.data(res.data[0]);
                        if(res.data[0].multiAccount == 1){
                            $(".product3_com_b_t,.li_3_last").show();
                            $(".product3_com_m2_input").attr("checked",'checked');
                            viewModel.multiAccount = 1
                        }else{
                            $(".product3_com_b_t,.li_3_last").hide();
                            viewModel.multiAccount = 0

                        }
                        if(res.data[0].isTrialVersion == 1){
                            $(".product3_com_m2_inputtest").attr("checked",'checked');
                            viewModel.IsTrialVersion = 1
                        }else{
                            viewModel.IsTrialVersion = 0

                        }
                    }else if(res.data.length<1){
                        viewModel.isfirstsettihs = true;
                    }
                    // if($(".appdetail").height()<500){
                    //     $(".product_add3_nextbtn").addClass("min500");
                    // }

            },function(error){
                var res = JSON.parse(error.responseText)
                dialogmin(res.msg || "网络错误");
            });
        };

        viewModel.productBlur = function(){
            viewModel.Dclone = $(".product_add_basic").eq(0).clone();
            $(".product_add_basic").on('click',function(){
                var inputbanben = $(this).find(".prductName_input");
                if(inputbanben.val()==""){
                    inputbanben.focus();
                    $(".product_add_basic").addClass("product_add_blue")
                }else{
                    $(this).off();
                }
            })
            $(".product_add_basic .prductName_input").on('blur',function () {
                var _this = $(this);
                if($(".product_add_specification").length>6){
                    dialogmin("最多添加6个规格");
                    $(".product_add_basic").removeClass("product_add_blue")
                    return false
                } /* else if($(".product_add_specification").length==7){

                  _this.parents(".product_add_specification").removeClass("product_add_basic");
                    _this.off('blur');
                    _this.parents(".product_add_specification").find(".product3_com_minAccount").removeAttr("disabled");
                    _this.parents(".product_add_specification").find(".product3_com_maxAccount").removeAttr("disabled");
                    _this.parents(".product_add_specification").find(".product3_com_price").removeAttr("disabled");
                    viewModel.plusclick(_this.parents(".product_add_specification"));
                    return false
                }*/

                if (_this.val()) {
                    _this.parents(".product_add_specification").removeClass("product_add_basic");
                    _this.off('blur');
                    _this.parents(".product_add_specification").find(".product3_com_minAccount").removeAttr("disabled");
                    _this.parents(".product_add_specification").find(".product3_com_maxAccount").removeAttr("disabled");
                    _this.parents(".product_add_specification").find(".product3_com_b_b_check").removeAttr("disabled");
                    _this.parents(".product_add_specification").find(".product3_com_m2_inputtestm").removeAttr("disabled");

                    _this.parents(".product_add_specification").find(".product3_com_price").removeAttr("disabled").focus();
                    $(".product_add_gg").append(viewModel.Dclone);
                    $(".product_add_basic").show();
                        if(viewModel.multiAccount == 1){
                            $(".product3_com_b_t,.li_3_last").show();
                        }else{
                            $(".product3_com_b_t,.li_3_last").hide();
                        }
                        if(viewModel.data().saleMode==2){
                            $(".product3_com_b_b,.fwmy_li").hide();
                            $(".product3_com_b_d").show();
                        }else{
                            $(".product3_com_b_b,.fwmy_li").show();
                            $(".product3_com_b_d").hide();
                        };
                        viewModel.productBlur();
                        viewModel.minValue();
                        viewModel.plusclick(_this.parents(".product_add_specification"));

                }else {
                    $(".product_add_basic").removeClass("product_add_blue")

                }
            })
        };
        viewModel.minValue = function(){
            var min = $(".product3_com_minAccount");
            min.on('blur',function(){
                var obj = parseInt($(this).val())
                if(typeof obj === 'number' && obj%1 === 0 && obj>0){
                }else{
                    $(this).val('');

                }
            })
        };
        viewModel.maxValue = function(){
            var max = $(".product3_com_maxAccount");
            max.on('blur',function(){
                var obj = parseInt($(this).val());
                var minv = $(this).parents("ul").find(".product3_com_minAccount").val();
                if(typeof obj === 'number' && obj%1 === 0 && obj>minv && obj<100000){
                    $(".product3_com_maxAccount").removeClass("errorinput")
                }else{
                    $(this).val('');
                    dialogmin("最大值请大于最小值")


                }
            })
        };
        viewModel.plusclick =function(t){
            t.find(".product3_com_b_b_check").on('click',function(){
                var inp = $(this).parent().next().next().find(".priceinput");
                if($(this).get(0).checked){
                    inp.removeAttr("disabled")

                }else{
                    inp.attr("disabled",true)
                }
            })
            t.find(".cl-del").off('click').on('click',function(){
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
            viewModel.setTimes();
            viewModel.load();
            viewModel.productBlur();
            viewModel.PushNewData(viewModel.OladDate)
            viewModel.minValue()
            viewModel.maxValue()
            $(".product_add_has .product3_com_b_b_check").on('click',function(){
                var inp = $(this).parent().next().next().find(".priceinput");
                if($(this).get(0).checked){
                    inp.removeAttr("disabled")

                }else{
                    inp.attr("disabled",true)
                }
            });
            function keyPress() {
                var keyCode = event.keyCode;
                if ((keyCode >= 48 && keyCode <= 57))
                {
                    event.returnValue = true;
                } else {
                    event.returnValue = false;
                }
            }
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
            $(".product3_com_m2_input").click(function(){
                var _this = $(this);

                if(_this.get(0).checked){
                    $(".product3_com_b_t,.li_3_last").show();
                    viewModel.multiAccount = 1;

                }else{
                    $(".product3_com_b_t,.li_3_last").hide();
                    viewModel.multiAccount = 0

                }
            });
            $(".product3_com_m2_inputtest").click(function(){
                var _this = $(this);
                if(_this.get(0).checked){
                    viewModel.IsTrialVersion = 1;
                }else{
                    viewModel.IsTrialVersion = 0
                }
            });

            $(".product3_com_m3list p").eq(0).click(function(){
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    viewModel.productVersion = 1
            });
            $(".product3_com_m3list p").eq(1).click(function(){
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    viewModel.productVersion = 2
            });

            $(".product3_com_m").find("select").change(function(){
                var _this = $(this);
               
                if(viewModel.openMode==1 && viewModel.isfirstsettihs == false){
                     dialogminBack('订购方式','修改后自动开通开发需重新进行，是否继续？',function(isok){
                        if(isok) {
                             if(_this.val()==1){
                                $(".product3_com_b_b,.product3_com_m2,.fwmy_li").show();
                                $(".product_add_specification").show();
                                $(".product3_com_m3,.product3_com_b_d").hide();

                            }else if(_this.val()==2){
                                $(".product3_com_b_b,.product3_com_m3,.fwmy_li").hide()
                                $(".product_add_specification,.product3_com_m2,.product3_com_b_d").show();

                            }else{
                                $(".product_add_specification,.product3_com_m2,.fwmy_li").hide();
                                $(".product3_com_m3").show();
                            }
                        }else{
                            _this.val(viewModel.saleModeNow)
                           
                        }
                    })
                }else{
                    if(_this.val()==1){
                                $(".product3_com_b_b,.product3_com_m2,.fwmy_li").show();
                                $(".product_add_specification").show();
                                $(".product3_com_m3,.product3_com_b_d").hide();

                            }else if(_this.val()==2){
                                $(".product3_com_b_b,.product3_com_m3,.fwmy_li").hide()
                                $(".product_add_specification,.product3_com_m2,.product3_com_b_d").show();

                            }else{
                                $(".product_add_specification,.product3_com_m2,.fwmy_li").hide();
                                $(".product3_com_m3").show();
                            }
                }
                
               
            })
            $(".cl-tips-c-o").mouseenter(function(){
                $(this).parents("li").find(".fwmy").show();
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