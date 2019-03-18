# express + passport + jwt + MongoDB 实现个人简历库接口 (类似于boss直聘)

> 目录结构

```
.
├── README.md                               --> 说明文档
├── config                                  --> 配置文件
│   ├── keys.js                             --> 配置jwt模式
│   └── possport.js                         --> passport 验证文件
├── models                                  --> 数据模型
│   ├── posts.js                            --> 用户评论和点赞模型
│   ├── profile.js                          --> 简历信息模型
│   └── user.js                             --> 用户模型
├── package-lock.json         
├── package.json
├── public              
│   └── msg.js                              --> 封装公共status
├── routes                                  --> 路由配置文件
│   └── api
│       ├── posted.js                       --> 用户点赞评论接口文件 
│       ├── profiles.js                     --> 用户填写个人简历接口文件
│       └── users.js                        --> 用户注册登录接口文件
├──server.js                                --> 服务器配置文件
└──interface.postman_collection.json        --> postman 导入文件
5 directories, 14 files

```

## 接口文档说明

> Users接口

#### 1、 注册接口 

```
* 注册用户信息
* Address: http://api.link97.com:8086/user/register
* 参数: name、email、password
* Type: String 
* required: true
* Methods: POST
* Header: {Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "注册成功！",
    "data": {
        "_id": "5bfa37f24a2c230e6949f06f",
        "name": "hello users",
        "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
        "email": "test@11.com",
        "password": "$2b$10$nWWzLFbGe4Od1n.wHUPmau9npV/8aCVZJayzPOfLBwBHfzegPPJHO",
        "date": "2018-11-25T05:49:38.059Z",
        "__v": 0
    },
    "status": 200
}
```
#### 2、登录接口

```
* 用户登录
* Address: http://api.link97.com:8086/user/login
* 参数: email、password
* Type: String 
* required: true
* Methods: POST
* Header: {Content-Type:application/json}
```

* 响应头
```
{
    "flag": 1,
    "msg": "登录成功!",
    "data": {
        "email": "test@11.com",
        "name": "hello users",
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZmEzN2YyNGEyYzIzMGU2OTQ5ZjA2ZiIsInRpbWUiOiIyMDE4LTExLTI1VDA1OjQ5OjM4LjA1OVoiLCJpYXQiOjE1NDMxMjUzMTUsImV4cCI6MTU0MzEyODkxNX0.W2wo30pFyhG8KFnRUf-coWJ-fxiEtH50jLmPa8IBDZY"
    },
    "status": 200
}
```

#### 3、token验证接口

```
* token验证
* Address: http://api.link97.com:8086/user/current
* 参数: null
* Type: null 
* required: false
* Methods: GET
* Header: {Authorization: token}
```

* 响应头
```
{
    "flag": 1,
    "msg": "token验证成功!",
    "data": {
        "id": "5bfa37f24a2c230e6949f06f",
        "name": "hello users",
        "email": "test@11.com"
    },
    "status": 200
}
```


> Profiles接口

#### 1、主体内容添加接口

```
* 添加个人信息
* Address: http://api.link97.com:8086/profile/add
* 参数: handle、company、website、location、status、bio、githubusername、skills、wechat、QQ、tengxunkt、wangyikt
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据添加成功!",
    "data": {
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": "5bfa37f24a2c230e6949f06f",
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "experience": [],
        "education": [],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 0
    },
    "status": 200
}
```

#### 2、工作经历添加接口

```
* 添加个人工作经历
* Address: http://api.link97.com:8086/profile/experience
* 参数: title、company、location、from、to、description
* Type:String
* 特殊参数: current 布尔值
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据添加成功！",
    "data": {
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": "5bfa37f24a2c230e6949f06f",
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "experience": [
            {
                "current": true,
                "_id": "5bfa3c814a2c230e6949f071",
                "title": "种地开发",
                "company": "web前端架构师",
                "location": "上海",
                "from": "2016-01-01",
                "to": "2018-01-01",
                "description": "工作消极"
            }
        ],
        "education": [],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 1
    },
    "status": 200
}

```


#### 3、教育经历添加接口

```
* 添加个人教育经历
* Address: http://api.link97.com:8086/profile/education
* 参数: school、degree、fieldofstudy、from、to、description
* Type:String
* 特殊参数: current 布尔值
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据添加成功！",
    "data": {
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": "5bfa37f24a2c230e6949f06f",
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "experience": [
            {
                "current": true,
                "_id": "5bfa3c814a2c230e6949f071",
                "title": "种地开发",
                "company": "web前端架构师",
                "location": "上海",
                "from": "2016-01-01",
                "to": "2018-01-01",
                "description": "工作消极"
            }
        ],
        "education": [
            {
                "current": true,
                "_id": "5bfa3d074a2c230e6949f072",
                "school": "\b家里蹲学院",
                "degree": "软件工程土木系",
                "fieldofstudy": "博士后",
                "from": "2010-09-06",
                "to": "2014-06-07",
                "description": "在校期间表现良好，成绩优异"
            }
        ],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 2
    },
    "status": 200
}
```

#### 4、查询所有简历接口

```
* 查看所有简历
* Address: http://api.link97.com:8086/profile/queryall
* 参数: {flag:'findAll'}  findAll  --> 固定死的必须传这个
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据查询成功！",
    "data": [
        {
            "social": {
                "wechat": "zzj_io",
                "QQ": "zzj",
                "tengxunkt": "test",
                "wangyikt": "test"
            },
            "skills": [
                "js",
                "vue",
                "html",
                "python"
            ],
            "_id": "5bfa3b914a2c230e6949f070",
            "user": {
                "_id": "5bfa37f24a2c230e6949f06f",
                "name": "hello users",
                "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm"
            },
            "handle": "hello name",
            "company": "test",
            "website": "http://www.zzj.com",
            "location": "上海",
            "status": "在职",
            "bio": "test",
            "githubusername": "zzj.github.io",
            "experience": [
                {
                    "current": true,
                    "_id": "5bfa3c814a2c230e6949f071",
                    "title": "种地开发",
                    "company": "web前端架构师",
                    "location": "上海",
                    "from": "2016-01-01",
                    "to": "2018-01-01",
                    "description": "工作消极"
                }
            ],
            "education": [
                {
                    "current": true,
                    "_id": "5bfa3d074a2c230e6949f072",
                    "school": "\b家里蹲学院",
                    "degree": "软件工程土木系",
                    "fieldofstudy": "博士后",
                    "from": "2010-09-06",
                    "to": "2014-06-07",
                    "description": "在校期间表现良好，成绩优异"
                }
            ],
            "date": "2018-11-25T06:05:05.052Z",
            "__v": 2
        }
    ],
    "status": 200
}

```

#### 4、根据用户id查询简历

```
* 查看单个简历
* Address: http://api.link97.com:8086/profile/idget
* 参数: {user_id:'5bf56a8f902331060d501cff'}
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据查询成功！",
    "data": {
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": {
            "_id": "5bfa37f24a2c230e6949f06f",
            "name": "hello users",
            "email": "test@11.com"
        },
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "experience": [
            {
                "current": true,
                "_id": "5bfa3c814a2c230e6949f071",
                "title": "种地开发",
                "company": "web前端架构师",
                "location": "上海",
                "from": "2016-01-01",
                "to": "2018-01-01",
                "description": "工作消极"
            }
        ],
        "education": [
            {
                "current": true,
                "_id": "5bfa3d074a2c230e6949f072",
                "school": "\b家里蹲学院",
                "degree": "软件工程土木系",
                "fieldofstudy": "博士后",
                "from": "2010-09-06",
                "to": "2014-06-07",
                "description": "在校期间表现良好，成绩优异"
            }
        ],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 2
    },
    "status": 200
}
```


#### 5、根据用户名(handle)查询信息

```
* 根据用户名(handle)查询
* Address: http://api.link97.com:8086/profile/handlequery
* 参数: {handle:'handle(用户名)'}
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据查询成功！",
    "data": {
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": {
            "_id": "5bfa37f24a2c230e6949f06f",
            "name": "hello users"
        },
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "experience": [
            {
                "current": true,
                "_id": "5bfa3c814a2c230e6949f071",
                "title": "种地开发",
                "company": "web前端架构师",
                "location": "上海",
                "from": "2016-01-01",
                "to": "2018-01-01",
                "description": "工作消极"
            }
        ],
        "education": [
            {
                "current": true,
                "_id": "5bfa3d074a2c230e6949f072",
                "school": "\b家里蹲学院",
                "degree": "软件工程土木系",
                "fieldofstudy": "博士后",
                "from": "2010-09-06",
                "to": "2014-06-07",
                "description": "在校期间表现良好，成绩优异"
            }
        ],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 2
    },
    "status": 200
}
```


#### 6、删除工作经历

```
* 删除单个工作经历
* Address: http://api.link97.com:8086/profile/del_experience
* 参数: {delId:_id }
* Type:String
* required: true
* Methods: DELETE
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据删除成功！",
    "data": [
        {
            "current": true,
            "_id": "5bfa3c814a2c230e6949f071",
            "title": "种地开发",
            "company": "web前端架构师",
            "location": "上海",
            "from": "2016-01-01",
            "to": "2018-01-01",
            "description": "工作消极"
        }
    ],
    "status": 200
}
```

#### 7、删除教育经历

```
* 删除单个教育经历
* Address: http://api.link97.com:8086/profile/del_education
* 参数: {delId:_id }
* Type:String
* required: true
* Methods: DELETE
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据删除成功！",
    "data": [
        {
            "current": true,
            "_id": "5bfa3d074a2c230e6949f072",
            "school": "\b家里蹲学院",
            "degree": "软件工程土木系",
            "fieldofstudy": "博士后",
            "from": "2010-09-06",
            "to": "2014-06-07",
            "description": "在校期间表现良好，成绩优异"
        }
    ],
    "status": 200
}
```


#### 8、删除当前用户所有信息

```
* 删除当前用户所有信息
* Address: http://api.link97.com:8086/profile/del_all
* 参数: {delAllId:_id }
* Type:String
* required: true
* Methods: DELETE
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "数据删除成功!",
    "data": {
        "social": {
            "wechat": "zzj_io",
            "QQ": "zzj",
            "tengxunkt": "test",
            "wangyikt": "test"
        },
        "skills": [
            "js",
            "vue",
            "html",
            "python"
        ],
        "_id": "5bfa3b914a2c230e6949f070",
        "user": "5bfa37f24a2c230e6949f06f",
        "handle": "hello name",
        "company": "test",
        "website": "http://www.zzj.com",
        "location": "上海",
        "status": "在职",
        "bio": "test",
        "githubusername": "zzj.github.io",
        "experience": [
            {
                "current": true,
                "_id": "5bfa41674a2c230e6949f073",
                "title": "种地开发",
                "company": "web前端架构师",
                "location": "上海",
                "from": "2016-01-01",
                "to": "2018-01-01",
                "description": "工作消极"
            }
        ],
        "education": [],
        "date": "2018-11-25T06:05:05.052Z",
        "__v": 5
    },
    "status": 200
}

```

> Posted接口

#### 1、用户评论接口

```
* 用户评论接口 
* Address: http://api.link97.com:8086/posts/comment
* 参数: text
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "评论添加成功！",
    "data": {
        "_id": "5bfa422c4a2c230e6949f074",
        "text": "hello world ",
        "name": "hello users",
        "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
        "user": "5bfa37f24a2c230e6949f06f",
        "likes": [],
        "comments": [],
        "date": "2018-11-25T06:33:16.055Z",
        "__v": 0
    },
    "status": 200
}

```

#### 2、查询所有评论接口

```
* 用户评论接口 
* Address: http://api.link97.com:8086/posts/all_getComment
* 参数: {allComment:'getAll'} 
* Type:String
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "获取成功!",
    "data": [
        {
            "_id": "5bfa422c4a2c230e6949f074",
            "text": "hello world ",
            "name": "hello users",
            "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
            "user": "5bfa37f24a2c230e6949f06f",
            "likes": [],
            "comments": [],
            "date": "2018-11-25T06:33:16.055Z",
            "__v": 0
        }
    ],
    "status": 200
}
```

#### 3、查询当前用户所有评论的接口

```
* 查询当前用户所有评论的接口 
* Address: http://api.link97.com:8086/posts/getUserComment
* 参数: null
* Type: null  
* required: false
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "查询成功!",
    "data": [
        {
            "_id": "5bfa422c4a2c230e6949f074",
            "text": "hello world ",
            "name": "hello users",
            "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
            "user": "5bfa37f24a2c230e6949f06f",
            "likes": [],
            "comments": [],
            "date": "2018-11-25T06:33:16.055Z",
            "__v": 0
        }
    ],
    "status": 200
}
```

#### 4、根据id查询当前评论的接口

```
* 根据id查询当前评论的接口 
* Address: http://api.link97.com:8086/posts/commentId
* 参数: {commentId:'id'}
* Type: String  
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "查询成功!",
    "data": {
        "_id": "5bfa422c4a2c230e6949f074",
        "text": "hello world ",
        "name": "hello users",
        "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
        "user": "5bfa37f24a2c230e6949f06f",
        "likes": [],
        "comments": [],
        "date": "2018-11-25T06:33:16.055Z",
        "__v": 0
    },
    "status": 200
}
```

#### 5、根据评论id删除当前评论接口

```
* 根据评论id删除当前评论接口
* Address: http://api.link97.com:8086/posts/del_comment
* 参数: {del_id:'id'}
* Type: String  
* required: true
* Methods: DELETE
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "删除成功!",
    "data": {
        "_id": "5bfa422c4a2c230e6949f074",
        "text": "hello world ",
        "name": "hello users",
        "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
        "user": "5bfa37f24a2c230e6949f06f",
        "likes": [],
        "comments": [],
        "date": "2018-11-25T06:33:16.055Z",
        "__v": 0
    },
    "status": 200
}
```

#### 6、当前用户点赞接口

```
* 当前用户点赞接口
* Address: http://api.link97.com:8086/posts/likes
* 参数: {likeIds:'id'}
* Type: String  
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "点赞成功!",
    "data": {
        "_id": "5bf9624e4c91651bca4a2725",
        "text": "hello world display li",
        "name": "displayli",
        "portrait": "http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=200&r=pg&d=mm",
        "user": "5bf41689740be4059185a6a8",
        "likes": [
            {
                "_id": "5bfa44604a2c230e6949f075",
                "user": "5bfa37f24a2c230e6949f06f"
            },
            {
                "_id": "5bf9682b34b2441d6fa2562d",
                "user": "5bf6cd66bb2b7110841044bd"
            }
        ],
        "comments": [],
        "date": "2018-11-24T14:38:06.088Z",
        "__v": 14
    },
    "status": 200
}
```

#### 7、当前用户取消点赞

```
* 当前用户取消点赞接口
* Address: http://api.link97.com:8086/posts/unlikes
* 参数: {unlikeId:'id'}
* Type: String  
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "取消点赞成功!",
    "data": {
        "_id": "5bf9624e4c91651bca4a2725",
        "text": "hello world display li",
        "name": "displayli",
        "portrait": "http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=200&r=pg&d=mm",
        "user": "5bf41689740be4059185a6a8",
        "likes": [
            {
                "_id": "5bf9682b34b2441d6fa2562d",
                "user": "5bf6cd66bb2b7110841044bd"
            }
        ],
        "comments": [],
        "date": "2018-11-24T14:38:06.088Z",
        "__v": 15
    },
    "status": 200
}
```

#### 8、当前用户回复其他用户的评论

```
* 当前用户回复其他用户的评论
* Address: http://api.link97.com:8086/posts/commentChild
* 参数: {commentIds:'id', text:'字符串'}
* Type: String  
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "评论成功!",
    "data": {
        "_id": "5bf9624e4c91651bca4a2725",
        "text": "hello world display li",
        "name": "displayli",
        "portrait": "http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=200&r=pg&d=mm",
        "user": "5bf41689740be4059185a6a8",
        "likes": [
            {
                "_id": "5bf9682b34b2441d6fa2562d",
                "user": "5bf6cd66bb2b7110841044bd"
            }
        ],
        "comments": [
            {
                "_id": "5bfa45374a2c230e6949f076",
                "user": "5bfa37f24a2c230e6949f06f",
                "name": "hello users",
                "portrait": "http://www.gravatar.com/avatar/c5304538a70e676922cfe1d4b5c0ef12?s=200&r=pg&d=mm",
                "text": "hello world zhangzijie",
                "date": "2018-11-25T06:46:15.368Z"
            }
        ],
        "date": "2018-11-24T14:38:06.088Z",
        "__v": 16
    },
    "status": 200
}
```
#### 9、当前用户回复其他用户的评论

```
* 当前用户回复其他用户的评论
* Address: http://api.link97.com:8086/posts/commentRemoveChild
* 参数: {commentIds:'id', childId:'要删除的id'}
* Type: String  
* required: true
* Methods: POST
* Header: {Authorization: token,Content-Type:application/json}
```

* 响应头

```
{
    "flag": 1,
    "msg": "删除评论成功!",
    "data": {
        "_id": "5bf9624e4c91651bca4a2725",
        "text": "hello world display li",
        "name": "displayli",
        "portrait": "http://www.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=200&r=pg&d=mm",
        "user": "5bf41689740be4059185a6a8",
        "likes": [
            {
                "_id": "5bf9682b34b2441d6fa2562d",
                "user": "5bf6cd66bb2b7110841044bd"
            }
        ],
        "comments": [],
        "date": "2018-11-24T14:38:06.088Z",
        "__v": 17
    },
    "status": 200
}

```

Copyright @LINK Creative Studio \
Email: 463961434@qq.com \
Website: http://www.link97.com 
