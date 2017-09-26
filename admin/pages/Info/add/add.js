define([ 'jquery', 'knockout', 'text!pages/Info/add/add.html','dialogmin','jqueryzclip','ajaxCom'
        ],
    function($, ko, template,dialogmin,zclip,ajaxCom) {
        //window.ZeroClipboard = ZeroClipboard;
        var updataUrl = "/product/category";
        var infoUrl = "/isv/info";

        var getKeyUrl = "/isv/encryptionkey";

        var modifyUrl = "/Info/modify/modify";


        addRouter(modifyUrl);
        var viewModel = {
            data :  ko.observable({})

        };
        viewModel.modify = function(){
             window.router.setRoute(modifyUrl)
        };
        viewModel.load = function(){
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
            /*$.ajax({
                type : 'get',
                url : updataUrl,
                contentType:"application/json",
                dataType : 'json',
                success : function(res) {
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

                }
            });*/
            ajaxCom.Loadajax('get',infoUrl,{isAjax:1},function(res){
                if(res.status==1 && res.data!=null){
                    $(".isv_name").html(res.data.isvName)
                    $(".settled_img2").find("img").attr("src",res.data.isvLogo)
                    $(".sttled2_category").val(res.data.isvMarket)
                    $(".tenantName").val(res.data.legalPerson)
                    $(".sttled2_hangye").val(res.data.industry)
                    $(".settled2_address").val(res.data.location)
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



                    $(".tenant_Fullname").html(res.data.invoiceTitle)
                    $(".settled2_sw").val(res.data.registerNum)
                    $(".bank_username").val(res.data.registerName)
                    $(".bank_branchname").val(res.data.registerAccountBank)
                    $(".bank_name").val(res.data.registerAccount)
                    $(".register_phone").val(res.data.registerPhone)
                    $(".register_address").val(res.data.registerAddress)

                    $(".send_phone").val(res.data.receiverMobile)
                    $(".send_Name").val(res.data.receiverName)
                    $(".send_address").html(res.data.receiverAddress)

                    if(res.data.invoiceType==2){
                        $(".settled2_fapiao").val("普通发票")
                    }else if(res.data.invoiceType==3){
                        $(".settled2_fapiao").val("增值税专用发票")
                    }
                    if(res.data.status==0){
                        $(".app_bottom_shenhew span").html("已关闭")
                        $(".settled2_btn").hide()
                    }else{
                        if(res.data.approveStatus==3){
                            $(".cl-verify").css("color","#2cbd71")

                        }
                    }

                }
            })

        }
        viewModel.showkey = function(){
            $("#shokeyDiv").show();
        };
        viewModel.copykey = function(){
            $('.encryptionKey_copy').zclip({
                path: '/market/common/trd/jquery-zclip/ZeroClipboard.swf',
                copy: function(){//复制内容
                    return $('.encryptionKey').text();
                },
                afterCopy: function(){//复制成功
                    dialogmin('复制成功');
                }
            });

        };
        viewModel.closeDic = function(){
            $("#shokeyDiv").hide();
            $(".inputencryptionKey").removeClass("errorinput").val("");
            $(".errorencryptionKey").hide()
        };
        viewModel.getKeyInfo = function(){
            var data = {
                password:$(".inputencryptionKey").val(),
                isAjax:1

             };

            $.ajax({
                type : 'post',
                url :$ctx + getKeyUrl,
                cache : false,
                data : data,

                success : function(res) {
                    if (res && res.needrelogin) { //对请求结果进行特殊处理
                        location.reload(); //刷新页面
                    }
                    if(res.status==1){
                        $(".encryptionKey").html(res.encryptionKey)
                        $("#shokeyDiv,.encryptionKeyshow").hide();
                        $(".encryptionKey_copy").show();

                        viewModel.copykey()
                    }else{
                        $(".inputencryptionKey").addClass("errorinput").val("");
                        $(".errorencryptionKey").show()
                    }

                }
            });
            $(".inputencryptionKey").on('focus',function(){
                $(".inputencryptionKey").removeClass("errorinput").val("");
                $(".errorencryptionKey").hide()
            })
         };

        var init = function(parm){

            viewModel.load()



        };
        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });