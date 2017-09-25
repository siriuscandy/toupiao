define([ 'jquery', 'knockout', 'text!pages/productRelease/modify/modify.html','dialogmin',
        'uploader','ueditor','ZeroClipboard','webuploaderdemo' ],
    function($, ko, template,dialogmin,WebUploader,UE,ZeroClipboard) {
        window.ZeroClipboard = ZeroClipboard;
        var modifyUrl = "/product/modify";
        var getUrl = "/product/getOne";
        var APPUrl = "/product/getTypes";
        var edtime = new Date();
        var viewModel = {
            data :  ko.observable({}),
            id:"",
            codedata :  ko.observable(),
            appdata :  ko.observable(),
            detailimg:""
        };
        viewModel.goback = function(){
            window.history.go(-1);

        }
        viewModel.submitMo = function() {
            $(".imgWrap").each(function(e){
                var _this = $(this);
                var s =  _this.find("img").attr("src");

                if(s.split(".").length==2){
                    if(viewModel.detailimg!=""){
                        viewModel.detailimg+=","+s
                    }else{
                        viewModel.detailimg+=s
                    }

                }


            })
            var queryData = {
                resCode: viewModel.data().resCode,
                resName: viewModel.data().resName,
                typeId: viewModel.data().typeId,
                brief: UE.getEditor("myEditor"+edtime+"").getContentTxt(),
                description: viewModel.data().description,
                icon: viewModel.data().userAvator,
                detail: viewModel.detailimg,
                resId: viewModel.id
            };

            if(viewModel.data().resCode==undefined||viewModel.data().resCode==""){
                dialogmin('您的编码还没填呢~');
                return false
            }

            if(viewModel.data().resName==undefined||viewModel.data().resName==""){
                dialogmin('您的名称还没填呢~');
                return false
            }

            $.ajax({
                type : 'post',
                dataType : 'json',
                async : false,
                data : JSON.stringify(queryData),
                url : $ctx + modifyUrl,
                contentType:"application/json",
                success : function(data) {
                    if (data.status==1){
                        dialogmin('修改成功!');
                        window.history.go(-1);
                    }else{
                        dialogmin(data.msg);
                    }
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    dialogmin("调用服务报错!!");
                }
            });

        };
        viewModel.load = function(id){

            $.ajax({
                type : 'get',
                url : $ctx + getUrl+"?resId="+id,
                cache:false,
                dataType : 'json',
                success : function(res) {
                    if(res.status==1){
                        viewModel.data(res.data);
                        if(res.data.icon!="" && res.data.icon!=null)
                        {
                            var d = viewModel.data();
                            d.userAvator = res.data.icon ;
                            viewModel.data(d);

                        };
                        if(res.data.detail!="" && res.data.detail!=null){

                            viewModel.moreimgupload(res.data.detail)
                        }
                        $("#myEditorpar").append("<div id='myEditor"+edtime+"'></div>")
                        var ue = UE.getEditor("myEditor"+edtime+"");
                        if(res.data.brief!=null && res.data.brief !=""){
                               ue.ready(function() {
                                   ue.setContent(res.data.brief)
                               });

                        }




                    }else{
                        dialogmin("网络错误!!");
                    }
                }
            });

        };
        viewModel.moreimgupload =function(img){
            var //$ = jQuery,    // just in case. Make sure it's not an other libaray.

                $wrap = $('#uploader'),

            // 图片容器
                $queue = $('<ul class="filelist"></ul>')
                    .appendTo( $wrap.find('.queueList') ),

            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),

            // 文件总体选择信息。
                $info = $statusBar.find('.info'),

            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),

            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),

            // 总体进度条
                $progress = $statusBar.find('.progress').hide(),

            // 添加的文件数量
                fileCount = 0,

            // 添加的文件总大小
                fileSize = 0,

            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,

            // 缩略图大小
                thumbnailWidth = 110 * ratio,
                thumbnailHeight = 110 * ratio,

            // 可能有pedding, ready, uploading, confirm, done.
                state = 'pedding',

            // 所有文件的进度信息，key为file id
                percentages = {},

                supportTransition = (function(){
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),

            // WebUploader实例
                uploader;

            if ( !WebUploader.Uploader.support() ) {
                alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
                throw new Error( 'WebUploader does not support the browser you are using.' );
            }

            // 实例化
            uploader = WebUploader.create({
                pick: {
                    id: '#filePicker',
                    label: '点击选择图片'
                },
                dnd: '#uploader .queueList',
                paste: document.body,

                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },

                // swf文件路径
                swf: '../swf/Uploader.swf',

                disableGlobalDnd: true,
                server: $ctx+'/file/upload/img',
                chunked: true,

                fileNumLimit: 300,
                fileSizeLimit: 5 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
            });

            // 添加“添加文件”的按钮，
            uploader.addButton({
                id: '#filePicker2',
                label: '继续添加'
            });

            // 当有文件添加进来时执行，负责view的创建
            function addFile( file ) {
                var $li = $( '<li id="' + file.id + '">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>'+
                        '<p class="progress"><span></span></p>' +
                        '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '<span class="rotateRight">向右旋转</span>' +
                        '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find( 'p.imgWrap' ),
                    $info = $('<p class="error"></p>'),

                    showError = function( code ) {
                        switch( code ) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '上传失败，请重试';
                                break;
                        }

                        $info.text( text ).appendTo( $li );
                    };

                if ( file.getStatus() === 'invalid' ) {
                    showError( file.statusText );
                } else {
                    // @todo lazyload
                    $wrap.text( '预览中' );

                    if(file.loaded){

                        var img = $('<img src="'+file.filename+'">');
                        $wrap.empty().append( img );
                    }else{
                        uploader.makeThumb( file, function( error, src ) {

                            if ( error ) {
                                $wrap.text( '不能预览' );
                                return;
                            }

                            var img = $('<img src="'+src+'">');
                            $wrap.empty().append( img );
                        }, thumbnailWidth, thumbnailHeight );
                    }


                    percentages[ file.id ] = [ file.size, 0 ];
                    file.rotation = 0;
                }

                file.on('statuschange', function( cur, prev ) {
                    if ( prev === 'progress' ) {
                        $prgress.hide().width(0);
                    } else if ( prev === 'queued' ) {
                        $li.off( 'mouseenter mouseleave' );
                        $btns.remove();
                    }

                    // 成功
                    if ( cur === 'error' || cur === 'invalid' ) {

                        showError( file.statusText );
                        percentages[ file.id ][ 1 ] = 1;
                    } else if ( cur === 'interrupt' ) {
                        showError( 'interrupt' );
                    } else if ( cur === 'queued' ) {
                        percentages[ file.id ][ 1 ] = 0;
                    } else if ( cur === 'progress' ) {
                        $info.remove();
                        $prgress.css('display', 'block');
                    } else if ( cur === 'complete' ) {
                        $li.append( '<span class="success"></span>' );
                    }

                    $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
                });

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;

                    switch ( index ) {
                        case 0:
                            uploader.removeFile( file );
                            return;

                        case 1:
                            file.rotation += 90;
                            break;

                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if ( supportTransition ) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                        // use jquery animate to rotation
                        // $({
                        //     rotation: rotation
                        // }).animate({
                        //     rotation: file.rotation
                        // }, {
                        //     easing: 'linear',
                        //     step: function( now ) {
                        //         now = now * Math.PI / 180;

                        //         var cos = Math.cos( now ),
                        //             sin = Math.sin( now );

                        //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                        //     }
                        // });
                    }


                });

                $li.appendTo( $queue );
            }

            // 负责view的销毁
            function removeFile( file ) {
                var $li = $('#'+file.id);

                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;

                $.each( percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );

                percent = total ? loaded / total : 0;

                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
                updateStatus();
            }

            function updateStatus() {
                var text = '', stats;

                if ( state === 'ready' ) {
                    text = '选中' + fileCount + '张图片' /*+
                        WebUploader.formatSize( fileSize ) */+ '。';
                } else if ( state === 'confirm' ) {
                    stats = uploader.getStats();
                    if ( stats.uploadFailNum ) {
                        text = '已成功上传' + stats.successNum+ '张照片至相册，'+
                            stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                    }

                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount + '张（' +
                        WebUploader.formatSize( fileSize )  +
                        '），已上传' + stats.successNum + '张';

                    if ( stats.uploadFailNum ) {
                        text += '，失败' + stats.uploadFailNum + '张';
                    }
                }

                $info.html( text );
            }

            function setState( val ) {
                var file, stats;

                if ( val === state ) {
                    return;
                }

                $upload.removeClass( 'state-' + state );
                $upload.addClass( 'state-' + val );
                state = val;

                switch ( state ) {
                    case 'pedding':
                        $placeHolder.removeClass( 'element-invisible' );
                        $queue.parent().removeClass('filled');
                        $queue.hide();
                        $statusBar.addClass( 'element-invisible' );
                        uploader.refresh();
                        break;

                    case 'ready':
                        $placeHolder.addClass( 'element-invisible' );
                        $( '#filePicker2' ).removeClass( 'element-invisible');
                        $queue.parent().addClass('filled');
                        $queue.show();
                        $statusBar.removeClass('element-invisible');
                        uploader.refresh();
                        break;

                    case 'uploading':
                        $( '#filePicker2' ).addClass( 'element-invisible' );
                        $progress.show();
                        $upload.text( '暂停上传' );
                        break;

                    case 'paused':
                        $progress.show();
                        $upload.text( '继续上传' );
                        break;

                    case 'confirm':
                        $progress.hide();
                        $upload.text( '开始上传' ).addClass( 'disabled' );

                        stats = uploader.getStats();
                        if ( stats.successNum && !stats.uploadFailNum ) {
                            setState( 'finish' );
                            return;
                        }
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if ( stats.successNum ) {
                            console.log( '上传成功' );
                        } else {
                            // 没有成功的图片，重设
                            state = 'done';
                            location.reload();
                        }
                        break;
                }

                updateStatus();
            }
            uploader.on('ready', function() {
            window.uploader = uploader;

            //if(fileid){
            //获取数据

            var json = viewModel.data();

            var arrayj = json.detail.split(",")
            var jsonLen=arrayj.length;
            if(jsonLen!=0){
                fileCount=jsonLen;
                $placeHolder.addClass( 'element-invisible' );
                $statusBar.show();
                //显示在页面上
                $.each(arrayj,function(i,n){

                    fileSize += n.filelen;
                    var obj={},statusMap={}
                        ,file_id='WU_FILE_' + i;
                    obj.id=file_id ;
                    obj.name=""+i;
                    obj.filename=n;
                    obj.getStatus=function() {
                        return '';
                    };
                    obj.setStatus=function() {
                        return '';
                    };
                    obj.statusText='';
                    obj.size=100;
                    obj.version=WebUploader.Base.version;
                    obj.type="image/"+n.split(".")[1];
                    obj.filetype=n.split(".")[1];
                    obj.source=this;
                    obj.loaded=true;
                    obj.on=function( status, text ) {

                        var prevStatus = statusMap[ this.id ];

                        typeof text !== 'undefined' && (this.statusText = text);

                        if ( status !== prevStatus ) {
                            statusMap[ this.id ] = status;
                            uploader.trigger( 'statuschange', status, prevStatus );
                        }

                    };

                    addFile(obj);

                });

                WebUploader.Base.idSuffix=jsonLen;

                setState( 'ready' );
                updateTotalProgress();
            }

        //}
            });

            uploader.onUploadProgress = function( file, percentage ) {
                var $li = $('#'+file.id),
                    $percent = $li.find('.progress span');

                $percent.css( 'width', percentage * 100 + '%' );
                percentages[ file.id ][ 1 ] = percentage;
                updateTotalProgress();
            };

            uploader.onFileQueued = function( file ) {
                fileCount++;
                fileSize += file.size;

                if ( fileCount === 1 ) {
                    $placeHolder.addClass( 'element-invisible' );
                    $statusBar.show();
                }

                addFile( file );
                setState( 'ready' );
                updateTotalProgress();
            };

            uploader.onFileDequeued = function( file ) {
                fileCount--;
                fileSize -= file.size;

                if ( !fileCount ) {
                    setState( 'pedding' );
                }

                removeFile( file );
                updateTotalProgress();

            };

            uploader.on( 'all', function( type ) {
                var stats;
                switch( type ) {
                    case 'uploadFinished':
                        setState( 'confirm' );
                        break;

                    case 'startUpload':
                        setState( 'uploading' );
                        break;

                    case 'stopUpload':
                        setState( 'paused' );
                        break;

                }
            });
            uploader.on( 'uploadSuccess', function( file, res ) {
                var downurl = '/market/file/down/img';

                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传

                    if(viewModel.detailimg!=""){
                        viewModel.detailimg+=","+downurl + "?id="+ res.fileName
                    }else{
                        viewModel.detailimg+=downurl + "?id="+ res.fileName
                    }

                }
            });
            uploader.onError = function( code ) {
                alert( 'Eroor: ' + code );
            };

            $upload.on('click', function() {
                if ( $(this).hasClass( 'disabled' ) ) {
                    return false;
                }

                if ( state === 'ready' ) {
                    uploader.upload();
                } else if ( state === 'paused' ) {
                    uploader.upload();
                } else if ( state === 'uploading' ) {
                    uploader.stop();
                }
            });

            $info.on( 'click', '.retry', function() {
                uploader.retry();
            } );

            $info.on( 'click', '.ignore', function() {
                alert( 'todo' );
            } );

            $upload.addClass( 'state-' + state );
            updateTotalProgress();

        }
        var init = function(parm){
            viewModel.load(parm[0]);
            viewModel.id = parm[0]
            $.ajax({
                type : 'get',
                dataType : 'json',
                url : $ctx + APPUrl,
                success : function(data) {

                    viewModel.appdata(data.types);
                    viewModel.codedata(parm[0]);

                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    dialogmin("调用服务报错!!");
                }
            });



            //如果没有头像，加载默认的头像
            if( viewModel.data().userAvator == '' ){
                var d = viewModel.data();
                d.userAvator = $ctx+ '/images/default.jpg'  ;
                viewModel.data(d);
            }

//		webuploader上传控件
            var downurl = '/market/file/down/img';
            var up = WebUploader.create({
                server: $ctx+'/file/upload/img',
                swf: 'trd/uploader/swf/Uploader.swf?v=' + Math.random(),
                pick: '.up',
                // 是否开启自动上传
//		    fileSingleSizeLimit: 1024 * 1024,
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
//		    resize: false,
                // 是否要分片处理大文件上传
//		    chunked: false,
                accept: [ //可以接受的文件类型，数组
                    {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png,ico',
                        mimeTypes: 'image/*'
                    }

                ],

                auto: true,
                compress: false

            });

            up.on( 'uploadSuccess', function( file, res ) {
                //console.log(' 成功把你的资料传上服务器');
                if(res.fileName != '-1'){  // -1  表示文件太大，没有上传
//				var d = viewModel.data();
//				d.href = downurl + "?id="+ res.fileName ;
//				viewModel.data(d);

                    var d = viewModel.data();
                    d.userAvator = downurl + "?id="+ res.fileName ;
                    viewModel.data(d);
                }
            });

            up.on( 'uploadError', function( file ) {
                dialogmin('上传失败');
            });

            up.on( 'fileQueued', function( file ) {

                if( file.size > 1024*200) {
                    dialogmin("文件大小不能超过200K");
                    return false;
                }

            });


        };

        return {
            'model' : viewModel,
            'template' : template,
            'init':init

        };

    });