from datetime import datetime

from flask import Blueprint, request, render_template, jsonify, session

from app.models import House, Order, User
from utils import status_code
from utils.functions import is_login

order_blueprint = Blueprint('order', __name__)


@order_blueprint.route('/order/', methods=['GET'])
@is_login
def order():
    return render_template('orders.html')


@order_blueprint.route('/order_info/', methods=['GET'])
@is_login
def order_info():
    user_id = session.get('user_id')
    orders = Order.query.filter(Order.user_id == user_id)
    orders_info = [order.to_dict() for order in orders]

    return jsonify(code=status_code.OK, orders_info=orders_info)


@order_blueprint.route('/booking/', methods=['GET'])
@is_login
def booking():
    return render_template('booking.html')


@order_blueprint.route('/booking_info/<int:id>/', methods=['GET'])
@is_login
def booking_info(id):
   house = House.query.get(id)
   house_info = house.to_dict()

   return jsonify(code=status_code.OK, house_info=house_info)


@order_blueprint.route('/booking_process/', methods=['POST'])
@is_login
def booking_process():
    user_id = session.get('user_id')
    house_id = request.form.get('house_id')
    begin_date = datetime.strptime(request.form.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.form.get('end_date'), '%Y-%m-%d')
    days = (end_date - begin_date).days
    if days == 0:
        days = 1
    house_price = House.query.get(house_id).price
    amount = days * house_price
    order = Order()
    order.user_id = user_id
    order.house_id = house_id
    order.begin_date = begin_date
    order.end_date = end_date
    order.days = days
    order.house_price = house_price
    order.amount = amount
    try:
        order.add_update()
        return jsonify(status_code.SUCCESS)
    except:
        return jsonify(status_code.DATABASE_ERROR)


@order_blueprint.route('/lorder/', methods=['GET'])
@is_login
def lorder():
    return render_template('lorders.html')


@order_blueprint.route('/lorder_info/', methods=['GET'])
@is_login
def lorder_info():
    user_id = session.get('user_id')
    houses = House.query.filter(House.user_id == user_id)
    houses_id = [house.id for house in houses]
    orders = Order.query.filter(Order.house_id.in_(houses_id))
    orders_info = [order.to_dict() for order in orders]

    return jsonify(code=status_code.OK, orders_info=orders_info)


@order_blueprint.route('/order_comment/', methods=['PATCH'])
@is_login
def order_comment():
    order_id = request.form.get('order_id')
    comment = request.form.get('comment')
    order = Order.query.get(order_id)
    order.comment = comment
    order.status = 'COMPLETE'
    try:
        order.add_update()
        return jsonify(status_code.SUCCESS)
    except:
        return jsonify(status_code.DATABASE_ERROR)


@order_blueprint.route('/order_status/', methods=['PATCH'])
@is_login
def order_status():
    order_id = request.form.get('order_id')
    status = request.form.get('status')
    order = Order.query.get(order_id)
    if status == 'true':
        order.status = 'WAIT_PAYMENT'
    else:
        reason = request.form.get('reason')
        order.status = 'REJECTED'
        order.reason = reason
    try:
        order.add_update()
        return jsonify(status_code.SUCCESS)
    except:
        return jsonify(status_code.DATABASE_ERROR)

