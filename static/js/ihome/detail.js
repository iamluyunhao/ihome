function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();

    var param = location.search;
    house_id = param.split('=')[1];
    $.get('/house/detail/' + house_id + '/', function (data) {
        if(data.code == '200'){
            for(var i=0; i< data.house_detail.images.length; i++){
                image_str = '<li class="swiper-slide"><img src="/static/media/' + data.house_detail.images[i] + '"></li>'
                $('.swiper-wrapper').append(image_str);
            }
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            });
            $('.house-price span').text(data.house_detail.price)
            $('.house-title').text(data.house_detail.title)
            $('.landlord-pic img').attr('src', '/static/media/'+ data.house_detail.user_avatar)
            $('.landlord-name span').text(data.house_detail.user_name)
            $('.house-info-list li:eq(0)').text(data.house_detail.address)
            $('.icon-text h3:eq(0)').text('出租' + data.house_detail.room_count + '间')
            $('.icon-text p:eq(0)').text('房屋面积：' + data.house_detail.acreage + '平米')
            $('.icon-text p:eq(1)').text('房屋户型：' + data.house_detail.unit)
            $('.icon-text h3:eq(1)').text('宜住' + data.house_detail.capacity + '人')
            $('.icon-text p:eq(2)').text(data.house_detail.beds)
            $('.house-info-list li span:eq(0)').text(data.house_detail.deposit)
            $('.house-info-list li span:eq(1)').text(data.house_detail.min_days)
            if(data.house_detail.max_days == '0'){
                $('.house-info-list li span:eq(2)').text('无限制')
            }else{
                $('.house-info-list li span:eq(2)').text(data.house_detail.max_days)
            }
            for(var i=0; i<data.house_detail.facilities.length; i++){
                facility = '<li><span class="' + data.house_detail.facilities[i].css + '"></span>' +
                    data.house_detail.facilities[i].name + '</li>'
                $('.house-facility-list').append(facility)
            }
            if(data.booking){
                $('.book-house').show();
                $('.book-house').attr('href', '/order/booking/?house_id=' + house_id)
            }else{
                 $('.book-house').hide();
            }
        }
    });
})