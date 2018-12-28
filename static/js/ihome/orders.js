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
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });

    $.get('/order/order_info/', function (data) {
       if(data.code == '200'){
           for(var i=0; i<data.orders_info.length; i++){
               if(data.orders_info[i].status == 'WAIT_COMMENT'){
                    order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' +
                    data.orders_info[i].order_id + '</h3><div class="fr order-operate"><button type="button" class="btn btn-success order-comment" ' +
                    'data-toggle="modal" data-target="#comment-modal">发表评价</button></div> </div><div class="order-content"> <img src="/static/media/' + data.orders_info[i].image +
                    '"><div class="order-text"><h3>订单</h3><ul><li>创建时间：' + data.orders_info[i].create_date + '</li>' +
                    '<li>入住日期：' + data.orders_info[i].begin_date + '</li> <li>离开日期：' + data.orders_info[i].end_date +
                    '</li><li>合计金额：' + data.orders_info[i].amount + '元(共' + data.orders_info[i].days +'晚)</li><li>订单状态：<span>' +
                    data.orders_info[i].status + '</span></li></ul></div></div></li>'

               }else{
                   if(data.orders_info[i].status == 'REJECTED'){
                       order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' +
                        data.orders_info[i].order_id + '</h3></div> <div class="order-content"> <img src="/static/media/' + data.orders_info[i].image +
                        '"><div class="order-text"><h3>订单</h3><ul><li>创建时间：' + data.orders_info[i].create_date + '</li>' +
                        '<li>入住日期：' + data.orders_info[i].begin_date + '</li> <li>离开日期：' + data.orders_info[i].end_date +
                        '</li><li>合计金额：' + data.orders_info[i].amount + '元(共' + data.orders_info[i].days +'晚)</li><li>订单状态：<span>' +
                        data.orders_info[i].status + '</span></li><li>拒单原因：' + data.orders_info[i].reason + '</li></ul></div></div></li>'
                   }else if(data.orders_info[i].comment){
                       order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' +
                            data.orders_info[i].order_id + '</h3></div> <div class="order-content"> <img src="/static/media/' + data.orders_info[i].image +
                            '"><div class="order-text"><h3>订单</h3><ul><li>创建时间：' + data.orders_info[i].create_date + '</li>' +
                            '<li>入住日期：' + data.orders_info[i].begin_date + '</li> <li>离开日期：' + data.orders_info[i].end_date +
                            '</li><li>合计金额：' + data.orders_info[i].amount + '元(共' + data.orders_info[i].days +'晚)</li><li>订单状态：<span>' +
                            data.orders_info[i].status + '</span></li><li>我的评价：' + data.orders_info[i].comment + '</li></ul></div></div></li>'
                   }else{
                         order_info = '<li order-id="' + data.orders_info[i].order_id + '"><div class="order-title"><h3>订单编号：' +
                            data.orders_info[i].order_id + '</h3></div> <div class="order-content"> <img src="/static/media/' + data.orders_info[i].image +
                            '"><div class="order-text"><h3>订单</h3><ul><li>创建时间：' + data.orders_info[i].create_date + '</li>' +
                            '<li>入住日期：' + data.orders_info[i].begin_date + '</li> <li>离开日期：' + data.orders_info[i].end_date +
                            '</li><li>合计金额：' + data.orders_info[i].amount + '元(共' + data.orders_info[i].days +'晚)</li><li>订单状态：<span>' +
                            data.orders_info[i].status + '</span></li></ul></div></div></li>'
                   }
               }
               $('.orders-list').append(order_info)
               $(".order-comment").on("click", function(){
                   var orderId = $(this).parents("li").attr("order-id");
                   $(".modal-comment").attr("order-id", orderId);
               });
           }
       }
    });

    $('.modal-comment').click(function () {
        var comment = $('#comment').val();
        var order_id = $('.modal-comment').attr('order-id')
        $.ajax({
            url: '/order/order_comment/',
            type: 'PATCH',
            data: {'order_id': order_id, 'comment': comment},
            dataType: 'JSON',
            success: function (data) {
                if(data.code == '200'){
                   location.href = "/order/order/"
                }
            },
            error: function (data) {
                alert('发表失败')
            }
        });
    })
});