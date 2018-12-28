OK = 200

# 请求成功
SUCCESS = {'code': 200, 'msg': '请求成功'}

# 数据库错误
DATABASE_ERROR = {'code': 500, 'msg': '数据库错误'}

# 验证码不匹配
USER_REGISTER_CODE_INVALID = {'code': 1000, 'msg': '验证码不正确'}

# 注册信息不完整
USER_REGISTER_PARAMS_INVALID = {'code': 1001, 'msg': '请填写完整的注册信息'}

# 手机号格式不正确
USER_REGISTER_MOBILE_INVALID = {'code': 1002, 'msg': '手机号格式不正确'}

# 密码和确认密码不一致
USER_REGISTER_PASSWORD_ERROR = {'code': 1003, 'msg': '密码和确认密码不一致'}

# 手机号已存在
USER_REGISTER_MOBILE_EXISTS = {'code': 1004, 'msg': '该手机号已存在'}

# 登录信息不完整
USER_LOGIN_PARAMS_INVALID = {'code': 1005, 'msg': '请填写完整的登录信息'}

# 用户名或密码错误
USER_LOGIN_PARAMS_ERROR = {'code': 1006, 'msg': '用户名或密码不正确'}

# 图片格式不正确
USER_PROFILE_AVATAR_INVALID = {'code': 1007, 'msg': '请上传正确的图片格式'}

# 用户名已存在
USER_PROFILE_NAME_EXISTS = {'code': 1008, 'msg': '用户名已存在'}

# 实名认证信息不完整
USER_AUTH_PARAMS_INVALID = {'code': 1009, 'msg': '请填写完整的实名认证信息'}

# 真实姓名错误
USER_AUTH_REAL_NAME_INVALID = {'code': 1010, 'msg': '请填写正确的真实姓名'}

# 身份证错误
USER_AUTH_ID_CARD_INVALID = {'code': 1011, 'msg': '请填写正确的身份证信息'}

# 用户尚未实名认证
USER_HOUSE_AUTH_INVALID = {'code': 1012, 'msg': '用户尚未实名认证'}

# 房屋图片格式不正确
HOUSE_NEW_IMAGE_INVALID = {'code': 1013, 'msg': '请上传正确的图片格式'}
