define([ 'jquery', 'knockout', 'text!pages/Info/modify/modify.html','dialogmin','PCASClass','ajaxCom'
    ],
    function($, ko, template,dialogmin,PCASClass,ajaxCom) {
        var updataUrl = "/product/category";
        var infoUrl = "/isv/info";
        var saveUrl = "/isv/update";
        var submmitUrl = "/isv/commit";
        var modifyUrl = "/Info/add/add";
        addRouter(modifyUrl);
        var viewModel = {
            data :  ko.observable({})

        };
        viewModel.Infoadd = function(){
            window.router.setRoute(modifyUrl)
        }

        var init = function(parm){
            // $(".settled2_fapiao").change(function(){
            //     if($(this).val()==2){
            //         $(".must").hide();
            //     }else{
            //         $(".must").show();
            //     }
            // })
            new PCAS("P1" ,"C1");

            var EmailReg = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/; //邮件正则
            var TelReg =  /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;//手机号正则
            ajaxCom.Loadajax('get',updataUrl,{isAjax:1},function(res){
                if(res.status==1){
                    for(var i =0; i < res.data.length;i++){
                        var categoryId =  res.data[i].categoryId;
                        var categoryName =  res.data[i].categoryName;
                        var html = '<option value='+categoryId+'>'+categoryName+'</option>'
                        $(".sttled2_category").append(html)
                    }

                }else{
                    dialogmin(res.msg || "网络错误!!");
                }
            })
            ajaxCom.Loadajax('get',infoUrl,{isAjax:1},function(res){
                if(res.status==1 && res.data!=null){
                    if(res.data.location!=null&&res.data.location.indexOf("/")>0){
                        viewModel.tenantArea1 = res.data.location.split("/")[0];
                        viewModel.tenantArea2 = res.data.location.split("/")[1];
                        new PCAS("P1" ,"C1",viewModel.tenantArea1,viewModel.tenantArea2 );
                    }
                    $(".isv_name").html(res.data.isvName)
                    $(".settled_img2").find("img").attr("src",res.data.isvLogo)
                    $(".sttled2_category").val(res.data.isvMarket)
                    $(".tenantName").val(res.data.legalPerson)
                    $(".sttled2_hangye option:selected").text(res.data.industry)
                    //$(".settled2_address").val(res.data.location)
                    $(".companySite").val(res.data.officialSite)
                    $(".settled_email").val(res.data.officialEmail)
                    $(".tenant_contactname").val(res.data.linkmanName)
                    $(".settled_phone").val(res.data.linkmanMobile)
                    $(".tenant_email").val(res.data.linkmanEmail)
                    $(".chanpayAccount").val(res.data.chanpayAccount)

                    $(".settleds_Number").val(res.data.licenceNumber)
                    $(".settleds_ZzNumber").val(res.data.orgNumber)
                    $(".up1").append('<img src='+res.data.licencePic+'>');
                    $(".up2").append('<img src='+res.data.officialSeal+'>');
                    $(".up3").append('<img src='+res.data.authLetter+'>');
                    $(".up4").append('<img src='+res.data.legalPersonIDPic+'>');


                    $(".settled2_fapiao").val(res.data.invoiceType)
                    $(".tenant_Fullname").val(res.data.invoiceTitle)
                    $(".settled2_sw").val(res.data.registerNum)
                    $(".bank_username").val(res.data.registerName)
                    $(".bank_branchname").val(res.data.registerAccountBank)
                    $(".bank_name").val(res.data.registerAccount)
                    $(".register_phone").val(res.data.registerPhone)
                    $(".register_address").val(res.data.registerAddress)

                    $(".send_phone").val(res.data.receiverMobile)
                    $(".send_Name").val(res.data.receiverName)
                    $(".send_address").val(res.data.receiverAddress)
                    // if(res.data.invoiceType==2){
                    //     $(".must").hide();
                    // }else{
                    //     $(".must").show();
                    // }
                    if(res.data.approveStatus==4){
                        $(".app_bottom_shenhew").css("visibility","visible");
                        $(".app_bottom_shenhew .app_approveReason").html(res.data.approveComment);
                    }else if(res.data.approveStatus==2){
                        $(".app_bottom_shenhew").css("visibility","visible").find("span").html(res.data.approveComment);
                        $(".settled2_btnbc,.settled2_btntj").hide();
                    }else if(res.data.approveStatus==3){
                        $(".cl-verify").css("color","#2cbd71")

                    }
                }
            })

            $(".settled_email,.tenant_email").bind("blur",function(){
                if(!EmailReg.test($(this).val())){
                    $(this).addClass("errorinput");
                }
            }).bind("focus",function(){
                $(this).removeClass("errorinput");
            });
            $(".settled_phone").bind("blur",function(){
                if(!TelReg.test($(this).val())){
                    $(this).addClass("errorinput");

                }else{

                }
            }).bind("focus",function(){
                $(this).removeClass("errorinput");

            });
            $(".settled2_btnbc").click(function(){
                setledUpajax(saveUrl,"保存成功");
                return
            })
            $(".settled2_btntj").click(function(){
                setledUpajax(submmitUrl,"提交成功");

                return
            });
            function setledUpajax(Url,msg){

                var data = {
                    isvLogo:$(".settled_img2").find("img").attr("src") || "",
                    //isvMarket:$(".sttled2_category").val(),
                    legalPerson:$(".tenantName").val(),
                    industry:$(".sttled2_hangye option:selected").text(),
                    //location:$(".settled2_address").val(),
                    officialSite:$(".companySite").val(),
                    officialEmail:$(".settled_email").val(),
                    linkmanName:$(".tenant_contactname").val(),
                    linkmanMobile:$(".settled_phone").val(),
                    linkmanEmail:$(".tenant_email").val(),

                    licenceNumber:$(".settleds_Number").val(),
                    orgNumber:$(".settleds_ZzNumber").val(),
                    licencePic:$(".up1").find("img").attr("src") || "",
                    officialSeal:$(".up2").find("img").attr("src") || "",
                    authLetter:$(".up3").find("img").attr("src") || "",
                    legalPersonIDPic:$(".up4").find("img").attr("src") || "",

                    invoiceType:$(".settled2_fapiao").val(),
                    invoiceTitle:$(".tenant_Fullname").val(),
                    chanpayAccount:$(".chanpayAccount").val(),

                   /* registerNum:$(".settled2_sw").val(),
                     registerName:$(".bank_username").val(),
                    registerAccount:$(".bank_name").val(),
                    registerAccountBank:$(".bank_branchname").val(),*/
                    registerPhone:$(".register_phone").val(),
                    registerAddress:$(".register_address").val(),

                    receiverMobile :$(".send_phone").val(),
                    receiverName:$(".send_Name").val(),
                    receiverAddress:$(".send_address").val(),
                    userId:window.sessionStorage.$userId,
                    isAjax:1

                };
                //if(data.invoiceType==3){
                    // if(data.invoiceTitle=="" || data.invoiceTitle==null){
                    //     dialogmin("请填写公司抬头")
                    //     return false
                    // }
                    if(data.receiverName=="" || data.receiverName==null){
                        dialogmin("请填写联系人姓名")
                        return false
                    }
                    if(data.receiverMobile=="" || data.receiverMobile==null){
                        dialogmin("请填写手机")
                        return false
                    }
                    if(data.receiverAddress=="" || data.receiverAddress==null){
                        dialogmin("请填写邮寄地址")
                        return false
                    }
                    if(data.registerPhone=="" || data.registerPhone==null){
                        dialogmin("请填写公司注册电话")
                        return false
                    }
               // }
                ajaxCom.Loadajax('post',Url,JSON.stringify(data),function(res){
                    if(res.status==1){
                        dialogmin("保存成功")
                        window.router.setRoute(modifyUrl)
                    }else{
                        dialogmin(res.msg || "网络错误!!");
                    }
                },function(error){
                    var res = JSON.parse(error.responseText)
                    dialogmin(res.msg || "网络错误");
                })
                /*$.ajax({
                    type : 'post',
                    url : Url,
                    data : JSON.stringify(data),
                    contentType:"application/json",
                    dataType : 'json',
                    success : function(res) {
                        //console.log(res) ;
                        if(res.status==1){
                            dialogmin("保存成功")
                            window.router.setRoute(modifyUrl)
                        }else{
                            dialogmin(res.msg || "网络错误!!");
                        }

                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {
                        var res = JSON.parse(XMLHttpRequest.responseText)
                        dialogmin(res.msg || "网络错误");
                    }
                });*/
            }



        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });