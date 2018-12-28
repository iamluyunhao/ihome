var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }
}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
    var aid = $(".filter-area>li.active").attr("area-id");
    var aname = $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).text()
    var sd = $("#start-date").val();
    var ed = $("#end-date").val();
    var sk = $(".filter-sort>li.active").attr("sort-key");
    url = '?aid=' + aid + '&aname=' + aname + '&sd=' + sd + '&ed=' + ed + '&sk=' + sk
    $.ajax({
        url: '/house/my_search/' + url,
        type: 'GET',
        dataType: 'JSON',
        success: function (data) {
            $('.house-list').empty();
             for(var i=0; i<data.houses_info.length; i++){
                var house_info = '<li class="house-item"><a href="/house/detail/?id=' + data.houses_info[i].id + '"><img src="/static/media/' +
                    data.houses_info[i].image + '"></a><div class="house-desc"><div class="landlord-pic"><img src="/static/media/' +
                    data.houses_info[i].image + '"></div> <div class="house-price">￥<span>' + data.houses_info[i].price + '</span>/晚</div>' +
                    '<div class="house-intro"><span class="house-title">' +  data.houses_info[i].title + '</span><em>出租' + data.houses_info[i].room +
                    '间 - ' + data.houses_info[i].order_count + '次入住 - ' + data.houses_info[i].address + '</em></div></div></li>';
                $('.house-list').append(house_info)
                }
        },
        error: function (data) {
            alert('搜索失败')
        }
    });
}

 function get(url){
    $.get('/house/my_search' + url, function (data) {
        if(data.code == '200'){
           for(var i=0; i<data.houses_info.length; i++){
                var house_info = '<li class="house-item"><a href="/house/detail/?id=' + data.houses_info[i].id + '"><img src="/static/media/' +
                    data.houses_info[i].image + '"></a><div class="house-desc"><div class="landlord-pic"><img src="/static/media/' +
                    data.houses_info[i].image + '"></div> <div class="house-price">￥<span>' + data.houses_info[i].price + '</span>/晚</div>' +
                    '<div class="house-intro"><span class="house-title">' +  data.houses_info[i].title + '</span><em>出租' + data.houses_info[i].room +
                    '间 - ' + data.houses_info[i].order_count + '次入住 - ' + data.houses_info[i].address + '</em></div></div></li>';
                $('.house-list').append(house_info)
           }
        }
    });
}

$(document).ready(function(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);


    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();

        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
            var aid = $(".filter-area>li.active").attr("area-id");
            var aname = $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).text()
            var sd = $("#start-date").val();
            var ed = $("#end-date").val();
            var sk = $(".filter-sort>li.active").attr("sort-key");
            url = '?aid=' + aid + '&aname=' + aname + '&sd=' + sd + '&ed=' + ed + '&sk=' + sk
            $.ajax({
                url: '/house/my_search/' + url,
                type: 'GET',
                dataType: 'JSON',
                success: function (data) {
                    $('.house-list').empty();
                     for(var i=0; i<data.houses_info.length; i++){
                        var house_info = '<li class="house-item"><a href="/house/detail/?id=' + data.houses_info[i].id + '"><img src="/static/media/' +
                            data.houses_info[i].image + '"></a><div class="house-desc"><div class="landlord-pic"><img src="/static/media/' +
                            data.houses_info[i].image + '"></div> <div class="house-price">￥<span>' + data.houses_info[i].price + '</span>/晚</div>' +
                            '<div class="house-intro"><span class="house-title">' +  data.houses_info[i].title + '</span><em>出租' + data.houses_info[i].room +
                            '间 - ' + data.houses_info[i].order_count + '次入住 - ' + data.houses_info[i].address + '</em></div></div></li>';
                        $('.house-list').append(house_info)
                        }
                },
                error: function (data) {
                    alert('搜索失败')
                }
            });
        }
    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");
    });
    $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {

            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
        } else {
            $(this).removeClass("active");
            $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
        }
    });
    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {

            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }
    })

    $.get('/house/areas/', function (data) {
       if (data.code == '200'){
           for(var i=0; i<data.areas.length; i++){
               var area_info = '<li area-id="' + data.areas[i].id + '">' + data.areas[i].name + '</li>'
               $('.filter-area').append(area_info)
           }
       }
    });

    url = location.href.split('ch')[1]
    get(url)
})