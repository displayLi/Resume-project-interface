// login && register
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()
const keys = require('../../config/keys')
require('../../models/user');
const Users = mongoose.model('user')

// 引入 Message
const msg = require('../../public/msg')



/* =====================================================*
 * 注册接口 POST
 * 查询所有用户信息
 * Address: http://localhost:8083/user/register
 * 参数: name、email、password
 * Type:String
 *=====================================================*/

router.post('/register', (req, res) => {
    if (req.body.email !== '' && req.body.password !== '') {
        let emailTest = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (emailTest.test(req.body.email)) {
            Users.findOne({ email: req.body.email })
                .then(user => {
                    if (!user) {

                        // 头像库 gravatar
                        const portrait = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                        const newUser = new Users({
                            name: req.body.name,
                            portrait: 'http:' + portrait,
                            email: req.body.email,
                            password: req.body.password
                        })

                        // 密码加密
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                req.body.password = hash;
                                // 存储数据
                                newUser
                                    .save()
                                    .then(flag => {
                                        return msg(res, 200, 1, '注册成功！', newUser)
                                    })
                            });
                        });

                    } else {
                        return msg(res, 200, 0, '邮箱已存在，请更换邮箱！', {})
                    }
                })
        } else {
            return msg(res, 200, 0, '邮箱格式不正确！', {})
        }
    } else {
        return msg(res, 200, 0, '邮箱或密码不能为空！', {})
    }
})



/* =====================================================*
 * 登录接口 POST
 * 查询所有用户信息
 * Address: http://localhost:8083/user/login
 * 参数:email、password
 * Type:String
 *=====================================================*/

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email !== '' && password !== '') {
        Users.findOne({ email })
            .then(result => {
                if (!result) {
                    return msg(res, 200, 0, '该用户不存在请去注册!', {})
                } else {
                    bcrypt.compare(password, result.password)
                        .then(success => {
                            if (success) {
                                let role = { id: result.id, time: result.date }
                                jwt.sign(role, keys.secretOrToken, { expiresIn: 3600 }, (err, token) => {
                                    if (err) throw err;
                                    return msg(res, 200, 1, '登录成功!', { email, name: result.name, token: 'Bearer ' + token })
                                })
                            } else {
                                return msg(res, 200, 0, '密码输入错误，请重新输入！', {})
                            }
                        })
                        .catch(err => console.log(err))
                }
            })
    } else {
        return msg(res, 200, 0, '邮箱或登录密码不能为空!', {})
    }
})



/* =====================================================*
 * 验证token接口 GET
 * 查询所有用户信息
 * Address: http://localhost:8083/user/current
 * 参数: *
 * Type: *
 *=====================================================*/
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    return msg(res, 200, 1, "token验证成功!", {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    })
})

module.exports = router