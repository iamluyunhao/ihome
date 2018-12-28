import os
import re

from flask import Blueprint, request, render_template, session, jsonify

from app.models import User, Area, Facility, House, HouseImage, Order
from utils.functions import is_login
from utils import status_code
from utils.settings import UPLOAD_PATH

house_blueprint = Blueprint('house', __name__)


@house_blueprint.route('/index/', methods=['GET'])
def index():
    return render_template('index.html')


@house_blueprint.route('/index_info/', methods=['GET'])
def index_info():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        username = user.name
    else:
        username = ''
    houses = House.query.filter(House.index_image_url != '')[:3]
    houses_info = [house.to_dict() for house in houses]
    return jsonify(code=status_code.OK, username=username, houses_info=houses_info)


@house_blueprint.route('/my_house/', methods=['GET'])
@is_login
def my_house():
    return render_template('myhouse.html')


@house_blueprint.route('/house_info/', methods=['GET'])
@is_login
def info():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    if not all([user.id_name, user.id_card]):
        return jsonify(status_code.USER_HOUSE_AUTH_INVALID)
    houses = user.houses
    my_houses = [house.to_dict() for house in houses]

    return jsonify(code=status_code.OK, my_houses=my_houses)


@house_blueprint.route('/new_house/', methods=['GET'])
@is_login
def new_house():
    return render_template('newhouse.html')


@house_blueprint.route('/area_facility/', methods=['GET'])
@is_login
def area_facility():
    areas = Area.query.all()
    facilitys = Facility.query.all()
    areas_json = [area.to_dict() for area in areas]
    facilitys_json = [facility.to_dict() for facility in facilitys]

    return jsonify(code=status_code.OK, areas=areas_json, facilitys=facilitys_json)


@house_blueprint.route('/new_house/', methods=['POST'])
@is_login
def my_new_house():
    house = House()
    house.user_id = session.get('user_id')
    house.title = request.form.get('title')
    house.price = request.form.get('price')
    house.area_id = request.form.get('area_id')
    house.address = request.form.get('address')
    house.room_count = request.form.get('room_count')
    house.acreage = request.form.get('acreage')
    house.unit = request.form.get('unit')
    house.capacity = request.form.get('capacity')
    house.beds = request.form.get('beds')
    house.deposit = request.form.get('deposit')
    house.min_days = request.form.get('min_days')
    house.max_days = request.form.get('max_days')
    facilities = request.form.getlist('facility')
    for facility_id in facilities:
        facility = Facility.query.get(facility_id)
        house.facilities.append(facility)
    try:
        house.add_update()
        return jsonify(code=status_code.OK, house_id=house.id)
    except:
        return jsonify(status_code.DATABASE_ERROR)


@house_blueprint.route('/house_images/', methods=['POST'])
@is_login
def house_images():
    house_id = request.form.get('house_id')
    image = request.files.get('house_image')
    if image:
        if not re.match(r'image/*', image.mimetype):
            return jsonify(status_code.HOUSE_NEW_IMAGE_INVALID)
        path = os.path.join(UPLOAD_PATH, image.filename)
        image.save(path)
        house_image = HouseImage()
        house_image.house_id = house_id
        image_url = os.path.join('upload', image.filename)
        house_image.url = image_url
        try:
            house_image.add_update()
        except:
            return jsonify(status_code.DATABASE_ERROR)
        house = House.query.get(house_id)
        if not house.index_image_url:
            house.index_image_url = image_url
            try:
                house.add_update()
            except:
                return jsonify(status_code.DATABASE_ERROR)

        return jsonify(code=status_code.OK, image_url=image_url)


@house_blueprint.route('/detail/', methods=['GET'])
def detail():
    return render_template('detail.html')


@house_blueprint.route('/detail/<int:id>/', methods=['GET'])
def house_detail(id):
    house = House.query.get(id)
    house_detail = house.to_full_dict()
    booking = True
    user_id = session.get('user_id')
    if user_id == house.user_id:
        booking = False

    return jsonify(code=status_code.OK, house_detail=house_detail, booking=booking)


@house_blueprint.route('/areas/', methods=['GET'])
def areas():
    areas = Area.query.all()
    areas_json = [area.to_dict() for area in areas]

    return jsonify(code=status_code.OK, areas=areas_json)


@house_blueprint.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@house_blueprint.route('/my_search/', methods=['GET'])
def my_search():
    area_id = request.args.get('aid')
    area_name = request.args.get('aname')
    begin_date = request.args.get('sd')
    end_date = request.args.get('ed')
    sk = request.args.get('sk')
    houses = House.query.filter(House.area_id == area_id)
    houses_ids = [house.id for house in houses]
    not_show_orders = Order.query.filter(Order.status.in_(['WAIT_ACCEPT', 'WAIT_PAYMENT', 'PAID']))
    not_show_order_ids = [order.house_id for order in not_show_orders]
    orders1 = Order.query.filter(Order.begin_date <= begin_date, Order.end_date >= begin_date)
    orders2 = Order.query.filter(Order.begin_date <= end_date, Order.end_date >= end_date)
    orders3 = Order.query.filter(Order.begin_date <= begin_date, Order.end_date >= end_date)
    orders4 = Order.query.filter(Order.begin_date <= begin_date, Order.end_date >= end_date)
    house1_ids = [order.house_id for order in orders1]
    house2_ids = [order.house_id for order in orders2]
    house3_ids = [order.house_id for order in orders3]
    house4_ids = [order.house_id for order in orders4]
    user_id = session.get('user_id')
    if user_id:
        user_houses = House.query.filter(House.area_id == area_id, House.user_id == user_id)
        user_houses_ids = [house.id for house in user_houses]
        not_show_house_ids = list(set(house1_ids + house2_ids + house3_ids + house4_ids + not_show_order_ids + user_houses_ids))
        show_houses = House.query.filter(House.id.notin_(not_show_house_ids), House.area_id.in_(area_id))
        if sk == 'booking':
            show_houses = show_houses.order_by('-order_count')
        elif sk == 'price-inc':
            show_houses = show_houses.order_by('price')
        elif sk == 'price-des':
            show_houses = show_houses.order_by('-price')
        else:
            show_houses = show_houses.order_by('-id')
        houses_info = [house.to_dict() for house in show_houses]

        return jsonify(code=status_code.OK, houses_info=houses_info)

    not_show_house_ids = list(set(house1_ids + house2_ids + house3_ids + house4_ids + not_show_order_ids))
    show_houses = House.query.filter(House.id.notin_(not_show_house_ids), House.area_id.in_(area_id))
    if sk == 'booking':
        show_houses = show_houses.order_by('-order_count')
    elif sk == 'price-inc':
        show_houses = show_houses.order_by('price')
    elif sk == 'price-des':
        show_houses = show_houses.order_by('-price')
    else:
        show_houses = show_houses.order_by('-id')
    houses_info = [house.to_dict() for house in show_houses]

    return jsonify(code=status_code.OK, houses_info=houses_info)





