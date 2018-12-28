import random
import string

from PIL import Image, ImageDraw, ImageFont

from functools import wraps

from flask import session, redirect, url_for

from utils.settings import DATABASE


def get_sqlalchemy_uri(DATABASE):
    engine = DATABASE['ENGINE']
    driver = DATABASE['DRIVER']
    name = DATABASE['NAME']
    user = DATABASE['USER']
    password = DATABASE['PASSWORD']
    host = DATABASE['HOST']
    port = DATABASE['PORT']
    return '%s+%s://%s:%s@%s:%s/%s' % (engine, driver, user, password, host, port, name)


"""
Image: 画布
ImageDraw: 画笔
ImageFont: 字体
"""
class Captcha(object):
   # 生成的验证码的个数
   number = 4
   # 图片的宽度和高度
   size = (80, 30)
   # 字体大小
   fontsize = 25
   # 干扰线条数
   line_number = 2

   SOURCE = list(string.ascii_letters)
   SOURCE.extend(map(str, list(range(0, 10))))

   @classmethod
   def __gen_line(cls, draw, width, height):
      """
      绘制干扰线
      """
      begin = (random.randint(0, width), random.randint(0, height))
      end = (random.randint(0, width), random.randint(0, height))
      draw.line([begin, end], fill=cls.__gen_random_color(), width=2)

   @classmethod
   def __gen_random_color(cls, start=0, end=255):
      """
      产生随机颜色
      颜色的取值范围是0~255
      """
      random.seed()
      return (
         random.randint(start, end),
         random.randint(start, end),
         random.randint(start, end),
      )

   @classmethod
   def __gen_points(cls, draw, point_chance, width, height):
      """
      绘制干扰点
      """
      chance = min(100, max(0, int(point_chance)))
      for w in range(width):
         for h in range(height):
            temp = random.randint(0, 100)
            if temp > 100 - chance:
               draw.point((w, h), fill=cls.__gen_random_color())

   @classmethod
   def __gen_random_font(cls):
      """
      采用随机字体
      :return:
      """
      fonts = ["consola.ttf", "consolab.ttf", "consolai.ttf"]
      font = random.choice(fonts)
      return "utils/captcha/" + font

   @classmethod
   def gen_text(cls, number):
      """
      随机生成一个字符串
      :param number: 字符串数量
      """
      return "".join(random.sample(cls.SOURCE, number))

   @classmethod
   def gen_graph_captcha(cls):
      width, height = cls.size
      # A表示透明度
      image = Image.new("RGBA", (width, height), cls.__gen_random_color(0, 100))
      # 字体
      font = ImageFont.truetype(cls.__gen_random_font(), cls.fontsize)
      # 创建画笔
      draw = ImageDraw.Draw(image)
      # 生成随机字符串
      text = cls.gen_text(cls.number)
      # 字体大小
      font_width, font_height = font.getsize(text)
      # 填充字符串
      draw.text(
         ((width - font_width) / 2, (height - font_height) / 2),
         text,
         font=font,
         fill=cls.__gen_random_color(150, 255),
      )
      # 绘制干扰线
      for x in range(0, cls.line_number):
         cls.__gen_line(draw, width, height)
      # 绘制噪点
      cls.__gen_points(draw, 10, width, height)

      return text, image


def is_login(func):
    @wraps(func)
    def inner(*args, **kwargs):
        if session.get('user_id'):
            return func(*args, **kwargs)
        else:
            return redirect(url_for('user.login'))

    return inner

