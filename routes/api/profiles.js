const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

// 引入 Message
const msg = require('../../public/msg')

// 实例化路由
const router = express.Router()

// 引入模型
require('../../models/profile');
const Profiles = mongoose.model('profile')
require('../../models/user')
const Users = mongoose.model('user')



/* ==========================================================================================================*
 * 主体内容接口 POST
 * 添加工作经历
 * Address: http://localhost:8083/profile/add
 * 参数: handle、company、website、location、status、bio、githubusername、skills、wechat、QQ、tengxunkt、wangyikt
 * Type:String
 *===========================================================================================================*/

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    const addDatas = {}
    // 添加数据
    addDatas.user = req.user._id
    if (req.body.handle) addDatas.handle = req.body.handle
    if (req.body.company) addDatas.company = req.body.company
    if (req.body.website) addDatas.website = req.body.website
    if (req.body.location) addDatas.location = req.body.location
    if (req.body.status) addDatas.status = req.body.status
    if (req.body.bio) addDatas.bio = req.body.bio
    if (req.body.githubusername) addDatas.githubusername = req.body.githubusername
    // 数组分割
    if (typeof req.body.skills !== 'undefined') addDatas.skills = req.body.skills.split(',')

    addDatas.social = {}
    if (req.body.wechat) addDatas.social.wechat = req.body.wechat
    if (req.body.QQ) addDatas.social.QQ = req.body.QQ
    if (req.body.tengxunkt) addDatas.social.tengxunkt = req.body.tengxunkt
    if (req.body.wangyikt) addDatas.social.wangyikt = req.body.wangyikt

    Profiles.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                Profiles.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: addDatas },
                    { new: true }
                )
                    .then(data => msg(res, 200, 1, '数据添加成功！', data))
                    .catch(err => console.log(err))
            } else {
                Profiles.findOne({ handle: addDatas.handle })
                    .then(handle => {
                        if (handle) {
                            return msg(res, 200, 0, '用户个人信息已存在，请勿重复添加!', {})
                        } else {

                        }
                        new Profiles(addDatas)
                            .save()
                            .then(datas => msg(res, 200, 1, '数据添加成功!', datas))
                    })
                    .catch(err => console.log(err))
            }
        })
})




/* =====================================================*
 * 工作经历新增接口 POST
 * 添加工作经历
 * Address: http://localhost:8083/profile/experience
 * 参数: title、company、location、from、to、description
 * Type:String
 * 特殊参数: current 布尔值
 *=====================================================*/

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                const experienceData = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    description: req.body.description,
                }
                profile.experience.unshift(experienceData)
                profile.save().then(saves => msg(res, 200, 1, '数据添加成功！', saves))
            } else {
                return msg(res, 200, 0, '请按照顺序添加，请先添加"/"接口！', {})
            }
        })
})



/* =====================================================*
 * 教育经历新增接口 POST
 * 添加教育经历
 * Address: http://localhost:8083/profile/education
 * 参数: school、degree、fieldofstudy、from、to、description
 * Type:String
 * 特殊参数: current 布尔值
 *=====================================================*/

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                const educationData = {
                    currrnt: req.body.current,
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    description: req.body.description,
                }
                profile.education.unshift(educationData)
                profile.save().then(saves => msg(res, 200, 1, '数据添加成功！', saves))
            } else {
                return msg(res, 200, 0, '请按照顺序添加，请先添加"/"接口！', {})
            }
        })
})



/* =====================================================*
 * 查询接口 POST
 * 根据用户id查询信息
 * Address: http://localhost:8083/profile/idget
 * 参数: {user_id:'5bf56a8f902331060d501cff'}
 * Type:String
 *=====================================================*/

router.post('/idget', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.user_id) {
        Profiles.findOne({ user: req.body.user_id })
            .populate('user', ['name', 'email', 'gravatar'])
            .then(data => {
                if (!data) {
                    return msg(res, 200, 0, '查询失败！', {})
                }

                return msg(res, 200, 1, '数据查询成功！', data)
            })
            .catch(err => console.log(err))
    } else {
        return msg(res, 200, 0, '参数输入错误或为空,查询失败!', {})
    }

})



/* =====================================================*
 * 查询接口 POST
 * 根据用户名(handle)查询信息
 * Address: http://localhost:8083/profile/handlequery
 * 参数: {handle:'handle(用户名)'}
 * Type:String
 *=====================================================*/

router.post('/handlequery', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.handle) {
        Profiles.findOne({ handle: req.body.handle })
            .populate('user', ['name', 'gravatar'])
            .then(handle => {
                if (!handle) {
                    return msg(res, 200, 0, '查询失败！', {})
                }
                return msg(res, 200, 1, '数据查询成功！', handle)
            })
            .catch(err => console.log(err))
    } else {
        return msg(res, 200, 0, '参数输入错误或为空,查询失败!', {})
    }

})



/* =====================================================*
 * 查询接口 POST
 * 查询所有用户信息
 * Address: http://localhost:8083/profile/queryall
 * 参数: {flag:'findAll'}  findAll --> 固定死的必须传这个
 * Type:String
 *=====================================================*/

router.post('/queryall', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.flag == "findAll") {
        Profiles.find()
            .populate('user', ['name', 'portrait'])
            .then(data => {
                if (!data) {
                    return msg(res, 200, 0, '未查询到用户信息！', {})
                }

                return msg(res, 200, 1, '数据查询成功！', data)
            })
            .catch(err => console.log(err))
    } else {
        return msg(res, 200, 0, '参数输入错误或为空,查询失败!', {})
    }
})


/* =====================================================*
 * 删除接口 DELETE
 * 删除工作经历
 * Address: http://localhost:8083/profile/del_experience
 * 参数: {id:_id }  _id就是delId 必须要传的
 * Type:String
 *=====================================================*/

router.delete('/del_experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ user: req.user._id })
        .then(datas => {
            if (datas) {
                if (datas.experience.length > 0) {
                    let getIds = datas.experience.findIndex(item => item._id == req.body.delId)
                    if (getIds !== -1) {
                        const delDatas = datas.experience.splice(getIds, 1)
                        datas.save().then(flag => msg(res, 200, 1, '数据删除成功！', delDatas))
                    } else {
                        return msg(res, 200, 0, '参数delId错误！', {})
                    }
                } else if (datas.experience.length == 0) {
                    return msg(res, 200, 0, '空空如也，没有要删除的数据了~', {})
                }
            } else {
                return msg(res, 200, 0, '数据删除失败!', {})
            }
        })
        .catch(err => console.log(err))
})




/* =====================================================*
 * 删除接口 DELETE
 * 删除教育经历
 * Address: http://localhost:8083/profile/del_education
 * 参数: {id:_id }  _id就是delId 必须要传的
 * Type:String
 *=====================================================*/

router.delete('/del_education', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ user: req.user._id })
        .then(datas => {
            if (datas) {
                if (datas.education.length > 0) {
                    let getIds = datas.education.findIndex(item => item._id == req.body.delId)
                    if (getIds !== -1) {
                        const delDatas = datas.education.splice(getIds, 1)
                        datas.save().then(flag => msg(res, 200, 1, '数据删除成功！', delDatas))
                    } else {
                        return msg(res, 200, 0, '参数delId错误！', {})
                    }
                } else if (datas.education.length == 0) {
                    return msg(res, 200, 0, '空空如也，没有要删除的数据了~', {})
                }
            } else {
                return msg(res, 200, 0, '数据删除失败!', {})
            }
        })
        .catch(err => console.log(err))
})



/* =====================================================*
 * 删除接口 DELETE
 * 删除当前用户所有信息
 * Address: http://localhost:8083/profile/del_all
 * 参数: {id:_id }  _id就是delAllId 必须要传的
 * Type:String
 *=====================================================*/

router.delete('/del_all', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profiles.findOne({ user: req.user._id })
        .then(datas => {
            if (datas) {
                Profiles.findOneAndRemove({ _id: req.body.delAllId })
                    .then(flag => msg(res, 200, 1, '数据删除成功!', flag))
                    .catch(err => console.log(err))
            } else {
                return msg(res, 200, 0, '数据删除失败!', {})
            }
        })
        .catch(err => console.log(err))
})


module.exports = router