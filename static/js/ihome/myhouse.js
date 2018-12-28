$(document).ready(function(){
    $.get('/house/house_info/', function (data) {
        if(data.code == '200'){
            $(".auth-warn").hide();
            for(var i=0; i<data.my_houses.length; i++){
                var house_info = '<li><a href="/house/detail/?house_id=' + data.my_houses[i].id + '"><div class="house-title">' +
                    '<h3>房屋ID:' + data.my_houses[i].id + ' —— ' + data.my_houses[i].title + '</h3></div>' +
                    '<div class="house-content">' + '<img src="/static/media/' + data.my_houses[i].image + '">' +
                    '<div class="house-text"> <ul> <li>位于：' + data.my_houses[i].area + '</li> <li>价格：￥' +
                    data.my_houses[i].price + '/晚</li><li>发布时间：' + data.my_houses[i].create_time + '</li></ul></div></div></a></li>';
                $('#houses-list').append(house_info);
            }
        }
        else{
            $(".auth-warn").show();
            $("#houses-list").hide();
        }
    })
})