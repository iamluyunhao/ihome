//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });

    $.get('/order/lorder_info/', function (data) {
       if(data.code == '200'){
            for(var i=0; i<data.orders_info.length; i++){
                if (data.orders_info[i].status == 'WAIT_ACCEPT'){
                    var order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' + data.orders_info[i].order_id +
                        '</h3><div class="fr order-operate"> <button type="button" class="btn btn-success order-accept" + ' +
                        'data-toggle="modal" data-target="#accept-modal">接单</button> <button type="button" + ' +
                        'class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>' +
                        ' </div> </div> <div class="order-content"><img src="/static/media/' + data.orders_info[i].image + '"><div class="order-text"><h3>' +
                        data.orders_info[i].house_title + '</h3><ul><li>创建时间：' + data.orders_info[i].create_date +
                        '</li><li>入住日期：' + data.orders_info[i].begin_date + '</li><li>离开日期：' + data.orders_info[i].end_date +
                        '</li><li>合计金额：￥' + data.orders_info[i].amount + '(共' + data.orders_info[i].days +
                        '晚)</li> <li>订单状态：<span>' + data.orders_info[i].status + '</span></li></ul> </div> </div> </li>';
                }else{
                    if (data.orders_info[i].status == 'COMPLETE'){
                        var order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' + data.orders_info[i].order_id +
                        '</h3></div> <div class="order-content"><img src="/static/media/' + data.orders_info[i].image + '"><div class="order-text"><h3>' +
                        data.orders_info[i].house_title + '</h3><ul><li>创建时间：' + data.orders_info[i].create_date +
                        '</li><li>入住日期：' + data.orders_info[i].begin_date + '</li><li>离开日期：' + data.orders_info[i].end_date +
                        '</li><li>合计金额：￥' + data.orders_info[i].amount + '(共' + data.orders_info[i].days +
                        '晚)</li> <li>订单状态：<span>' + data.orders_info[i].status + '</span></li><li>客户评价：' +
                        data.orders_info[i].comment + '</li> </ul> </div> </div> </li>';
                    }else if(data.orders_info[i].status == 'REJECTED'){
                        var order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' + data.orders_info[i].order_id +
                        '</h3></div> <div class="order-content"><img src="/static/media/' + data.orders_info[i].image + '"><div class="order-text"><h3>' +
                        data.orders_info[i].house_title + '</h3><ul><li>创建时间：' + data.orders_info[i].create_date +
                        '</li><li>入住日期：' + data.orders_info[i].begin_date + '</li><li>离开日期：' + data.orders_info[i].end_date +
                        '</li><li>合计金额：￥' + data.orders_info[i].amount + '(共' + data.orders_info[i].days +
                        '晚)</li> <li>订单状态：<span>' + data.orders_info[i].status + '</span></li><li>拒单原因：' +
                        data.orders_info[i].reason + '</li></ul> </div> </div> </li>';
                    }else{
                        var order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' + data.orders_info[i].order_id +
                        '</h3></div> <div class="order-content"><img src="/static/media/' + data.orders_info[i].image + '"><div class="order-text"><h3>' +
                        data.orders_info[i].house_title + '</h3><ul><li>创建时间：' + data.orders_info[i].create_date +
                        '</li><li>入住日期：' + data.orders_info[i].begin_date + '</li><li>离开日期：' + data.orders_info[i].end_date +
                        '</li><li>合计金额：￥' + data.orders_info[i].amount + '(共' + data.orders_info[i].days +
                        '晚)</li> <li>订单状态：<span>' + data.orders_info[i].status + '</span></li></ul> </div> </div> </li>';
                    }
                }
                $('.orders-list').append(order_info);
                $(".order-accept").on("click", function(){
                    var orderId = $(this).parents("li").attr("order-id");
                    $(".modal-accept").attr("order-id", orderId);
                });
                $(".order-reject").on("click", function(){
                    var orderId = $(this).parents("li").attr("order-id");
                    $(".modal-reject").attr("order-id", orderId);
                });
            }
       }
    });

    $('.modal-accept').click(function () {
        var order_id = $(".modal-accept").attr("order-id");
        $.ajax({
            url: '/order/order_status/',
            type: 'PATCH',
            data: {'order_id': order_id, 'status': true},
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                   location.href = "/order/lorder/"
                }
            },
            error: function (data) {
                alert('处理失败')
            }
        });
    });

    $('.modal-reject').click(function () {
        var order_id = $(".modal-reject").attr("order-id");
        var reason = $("#reject-reason").val();
        $.ajax({
            url: '/order/order_status/',
            type: 'PATCH',
            data: {'order_id': order_id, 'status': false, 'reason': reason},
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                   location.href = "/order/lorder/"
                }
            },
            error: function (data) {
                alert('处理失败')
            }
        });
    });
});