function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24);
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            if(days == '0'){
                amount = parseFloat(price)
            }
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });

    house_id = location.href.split('=')[1]
    $.get('/order/booking_info/' + house_id + '/', function (data) {
       if(data.code == '200'){
           $('.house-info img').attr('src', '/static/media/' + data.house_info.image);
           $('.house-text h3').text(data.house_info.title);
           $('.house-text p span').text(data.house_info.price);
           $('.fl').attr('href', '/house/detail/?house_id=' + house_id);
       }
    });



    $('.submit-btn').click(function () {
        var start_date = $('#start-date').val();
        var end_date = $('#end-date').val();
        $.ajax({
            url: '/order/booking_process/',
            type: 'POST',
            data: {'house_id': house_id, 'start_date': start_date, 'end_date': end_date},
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                    location.href = "/order/order/"
                }
            },
            error: function (data) {
                alert('提交订单失败')
            }
        });
    });
})
