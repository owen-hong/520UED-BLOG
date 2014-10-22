$(function(){
    var win = window,
        doc = document;

    //菜单
	$("#submenu li.menu-read").hover(function() {
		$(this).addClass('sfHover');
		$(this).children('ul').show();
	}, function() {
		$(this).removeClass('sfHover');
		$(this).children('ul').hide();
	});
	
	
    $("#submenu li.menu-read").children('a').focus(function(){
        $(this).parent().addClass('sfHover');
        $(this).siblings().show();
    });

    //点赞
    $("body").on('click','a.addPraise',function(){
        var $that = $(this),
            $url = $that.attr('data-url');

        $.get($url).done(function(data){
            $that.children('span').html(data.site);
        }).fail(function(){
            alert("系统错误，请稍后重试!");
        })
    });

    //返回顶部
    $(win).scroll(function(){
        if ($(win).scrollTop()>400){
            $("#go-top").fadeIn(500);
        }else{
            $("#go-top").fadeOut(500);
        }
    });

    var _ajaxArt = function(data){
        var $str="";
        $.each(data.posts,function(i,value){
            //时间处理
            var $time = value.created.substring(0,10);
            //拼接字符串
            $str = $('<div class="one-third column"> '+
                        '<article class="post">'+
                            '<a href="/article/'+ value._id +'" tabindex="-1" class="img-wrap">'+
                                '<img width="385" height="220" src="'+ value.imgUrl +'" class="attachment-thumbnail wp-post-image" alt="'+ value.title +'">'+
                            '</a>'+
                            '<div class="post-detail ">'+
                                '<div class="btitle">'+
                                    '<span class="author">'+
                                        '<span class="comment-avatar-wrap" tabindex="-1">'+
                                            '<img src="'+ value.authorIcon +'" width="20" height="20" alt="author:'+ value.author +'">'+
                                        '</span>'+
                                        '<span>'+ $time +'</span>'+
                                    '</span>'+
                                    '<h2>'+
                                        '<a href="/article/'+ value._id +'" rel="bookmark">'+ value.title +'</a>'+
                                    '</h2>'+
                                '</div>'+
                                '<div class="post-data fonts">'+
                                    '<a href="javascript:;" class="addPraise" data-url="/addPraise?id='+ value._id +'">'+
                                        '<i class="iconfont" title="已有点赞数">&#xe644;</i>'+
                                        '<span>'+ value.addPraise +'</span>'+
                                    '</a>'+
                                    '<a href="/category/'+ value.classify +'">'+
                                        '<i class="iconfont" title="文章所属分类为">&#xe634;</i>'+
                                        '<span>'+ value.classify +'</span>'+
                                    '</a>'+
                                    '<a href="javascript::">'+
                                        '<i class="iconfont" title="此文章的总浏览量为">&#xe63e;</i>'+
                                        '<span>'+ value.clickCount +'</span>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</article>'+
                    '</div>').hide();
            
            $("#homecontent").append($str);
            //输出
            $str.fadeIn();
        });
    }

    var page_more = function(){
        var $page=2;
        var $loadding_flag = true;


        //加载分页内容
        var page_show = function(){

            var $url = "/ajaxArticle?page="+ $page;

            $("#infscr-loading").show();

            $loadding_flag = false;

            $.get($url).done(function(data){

                if(data.posts.length > 0){

                    _ajaxArt(data);

                    $('#infscr-loading').hide();

                    $page++;

                    $loadding_flag = true;

                }else{
                    $('#infscr-loading').html("暂无更多内容！").fadeOut(1000);
                }
            }).fail(function(err){
                alert('系统错误，请稍后重试！');
            });
        }

        //首页瀑布流加载
        $(win).scroll(function(){
            var $ScrollBottom = $(doc).height() - $(win).height() - $(win).scrollTop();

            if ($ScrollBottom < 50 && $loadding_flag === true){
                page_show();
            }
        });
    }

	
    //信息详情点赞
    $("a.isux-like-btn").click(function(){
        var $that = $("a.isux-like-btn"),
            $url = $that.attr('data-url');

        $.get($url).done(function(data){

            $that.children('span').html(data.site);

        }).fail(function(){
            alert("系统错误，请稍后重试!");
        })
    });

	//移动相应
	$("div.menu_control").click(function(){
        $(this).toggleClass('menu_control_h');
		$(".top-fix .header").slideToggle(400);
	});

    //search
    $("#search input").keydown(function(event) {
        if (event.keyCode == 13) {
            var $val = $(this).val(),
                $url = $(this).attr("data-url");
            window.location.href = $url + $val;
        }
    });

    //判断首页加载
    if(UE_CONFIG.page_type =="index_page"){
        page_more();
    }

    //判断文章详细页面
    if(UE_CONFIG.page_type =="article_page"){

        //启动高亮设置
        $("pre.lang-html").snippet("html",{style:"whitengrey"});
        $("pre.lang-css").snippet("css",{style:"acid"});
        $("pre.lang-js").snippet("JavaScript",{style:"berries-light"});
        //判断预加载
        if($.browser.mozilla){ 
            $("div.pre-article a").attr("rel","prefetch");
            $("div.next-article a").attr("rel","prefetch");
        } else{
            $("div.pre-article a").attr("rel","prerender");
            $("div.next-article a").attr("rel","prerender");
        }
    }

    //判断云标签页面
    if(UE_CONFIG.page_type =="cloudTags_page"){
        //设置云标签字体颜色
        var $color = hsl2color([radomFuc(360), 100, 70]);   
        //var $size = radomFuc(50);

        var $li = $("#cloud_tag li");

        for(var i=0;i<$li.length;i++){  
            $li.eq(i).children("a").css({color:$color});    
            //$size = radomFuc(50);     
            $color = hsl2color([radomFuc(360), 100, 70]);
        }
    }
});