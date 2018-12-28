### 登录接口
#### 1.request请求
```
POST /user/login/
```
#### 2.params参数：
```
mobile str 电话号码

password str 密码
```
#### 3.response响应
##### 成功响应：
```
{
	'code': 200, 
	'msg': '请求成功'
}
```
##### 失败响应1：
```
{
	'code': 1005, 
	'msg': '请填写完整的登录信息'
}
```
##### 失败响应2：
```
{
	'code': 1006, 
	'msg': '用户名或密码不正确'
}
```

