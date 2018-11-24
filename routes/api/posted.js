const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()


// 引入 Message
const msg = require('../../public/msg')
require('../../models/posts')
const Posts = mongoose.model('posts')
require('../../models/profile')
const Profiles = mongoose.model('profile')


router.get('/test', (req, res) => {
    return msg(res, 200, 1, '接口链接成功！', {})
})



/* =====================================================*
 * 用户评论接口 POST
 * Address: http://localhost:8083/posts/comment
 * 参数: text
 * Type:String
 *=====================================================*/

router.post('/comment', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.text !== '' && req.body.text.length < 300) {
        const newComment = new Posts({
            text: req.body.text,
            name: req.user.name,
            portrait: req.user.portrait,
            user: req.user.id
        })
        newComment.save()
            .then(data => msg(res, 200, 1, '评论添加成功！', data))
            .catch(err => msg(res, 200, 0, '评论添加失败！', {}))
    } else {
        return msg(res, 200, 1, '评论字段不能为空且长度不能超过300个字符!', {})
    }
})



/* =====================================================*
 * 查询所有评论接口 POST
 * Address: http://localhost:8083/posts/all_getComment
 * 参数: {allComment:'getAll'} 
 * Type:String
 *=====================================================*/

router.post('/all_getComment', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.allComment == 'getAll') {
        Posts.find()
            .then(data => msg(res, 200, 1, '获取成功!', data))
            .catch(err => msg(res, 200, 0, '获取失败!', {}))
    } else {
        return msg(res, 200, 0, '获取失败，参数错误!', {})
    }
})



/* =====================================================*
 * 查询当前用户所有评论的接口 POST
 * Address: http://localhost:8083/posts/getUserComment
 * 参数: null
 * Type: null
 *=====================================================*/

router.post('/getUserComment', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.find({ user: req.user.id })
        .then(data => msg(res, 200, 1, '查询成功!', data))
        .catch(err => msg(res, 200, 0, '查询失败!', {}))
})


/* =====================================================*
 * 根据id查询当前评论的接口 POST
 * Address: http://localhost:8083/posts/commentId
 * 参数: {commentId:'id'}
 * Type:String
 *=====================================================*/

router.post('/commentId', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.commentId) {
        Posts.findById(req.body.commentId)
            .then(data => {
                if (data) {
                    return msg(res, 200, 1, '查询成功!', data)
                } else {
                    return msg(res, 200, 0, '未查询到结果!', {})
                }
            })
            .catch(err => msg(res, 200, 0, '查询失败!', {}))
    } else {
        return msg(res, 200, 0, '查询失败，参数错误!', {})
    }
})


/* =====================================================*
 * 根据评论id删除当前评论接口 DELETE
 * Address: http://localhost:8083/posts/del_comment
 * 参数: {del_id:'id'}
 * Type:String
 *=====================================================*/

router.delete('/del_comment', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.del_id) {
        Profiles.findOne({ user: req.user.id })
            .then(profile => {
                Posts.findById(req.body.del_id)
                    .then(data => {
                        if (data.user.toString() !== req.user.id) {
                            return msg(res, 200, 0, '不是当前用户非法操作!', {})
                        } else {
                            data.remove()
                                .then(flag => msg(res, 200, 1, '删除成功!', flag))
                        }
                    })
                    .catch(err => msg(res, 200, 0, '该评论不存在，无法删除!', {}))
            })
    } else {
        return msg(res, 200, 0, '查询失败，参数错误!', {})
    }
})


/* =====================================================*
 * 当前用户点赞接口 POST
 * Address: http://localhost:8083/posts/likes
 * 参数: {likeIds:'id'}
 * Type: String
 *=====================================================*/

router.post('/likes', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.likeIds) {
        Profiles.findOne({ user: req.user.id })
            .then(user => {
                Posts.findById(req.body.likeIds)
                    .then(datas => {
                        if (datas.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                            return msg(res, 200, 0, '当前用户已点赞,禁止重复点赞!', {})
                        } else {
                            datas.likes.unshift({ user: req.user.id })
                            datas.save()
                                .then(isok => msg(res, 200, 1, '点赞成功!', isok))
                        }
                    })
                    .catch(err => msg(res, 200, 1, '不是当前用户无法点赞!', null))
            })
    } else {
        return msg(res, 200, 0, '参数错误!', {})
    }
})



/* =====================================================*
 * 取消当前用户点赞接口 POST
 * Address: http://localhost:8083/posts/unlikes
 * 参数: {unlikeId:'id'}
 * Type: String
 *=====================================================*/

router.post('/unlikes', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.unlikeId) {
        Profiles.findOne({ user: req.user.id })
            .then(user => {
                Posts.findById(req.body.unlikeId)
                    .then(datas => {
                        const unlike = datas.likes.findIndex(like => like.user.toString() === req.user.id)
                        if (unlike == -1) {
                            return msg(res, 200, 0, '取消失败,该用户没有点过赞!', {})
                        } else {
                            datas.likes.splice(unlike, 1)
                            datas.save()
                                .then(isok => msg(res, 200, 1, '取消点赞成功!', isok))
                        }
                    })
                    .catch(err => msg(res, 200, 1, '不是当前用户无法取消点赞!', null))
            })
    } else {
        return msg(res, 200, 0, '参数错误!', {})
    }
})


/* =====================================================*
 * 当前用户回复其他用户的评论 POST
 * Address: http://localhost:8083/posts/commentChild
 * 参数: {commentIds:'id', text:'字符串'}
 * Type: String
 *=====================================================*/

router.post('/commentChild', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.commentIds && req.body.text) {
        Profiles.findOne({ user: req.user.id })
            .then(user => {
                Posts.findById(req.body.commentIds)
                    .then(datas => {
                        if (req.body.text !== '') {
                            datas.comments.unshift({
                                user: req.user.id,
                                name: req.user.name,
                                portrait: req.user.portrait,
                                text: req.body.text,
                            })
                            datas.save()
                                .then(isok => msg(res, 200, 1, '评论成功!', isok))
                                .catch(err => msg(res, 200, 0, '评论失败!', {}))
                        } else {
                            return msg(res, 200, 0, 'text不能为空!', null)
                        }
                    })
                    .catch(err => msg(res, 200, 0, '不是当前用户无法评论!', null))
            })
    } else {
        return msg(res, 200, 0, '参数错误!', {})
    }
})



/* =====================================================*
 * 当前用户删除回复其他用户的评论 POST
 * Address: http://localhost:8083/posts/commentRemoveChild
 * 参数: {commentIds:'id', childId:'要删除的id'}
 * Type: String
 *=====================================================*/

router.post('/commentRemoveChild', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.body.commentIds !== '' && req.body.childId !== '') {
        Profiles.findOne({ user: req.user.id })
            .then(user => {
                Posts.findById(req.body.commentIds)
                    .then(datas => {
                        const flags = datas.comments.filter(data => data.user.toString() == req.user.id)
                        if (flags.length > 0) {
                            const uncomments = datas.comments.findIndex(comment => comment._id.toString() === req.body.childId)
                            if (uncomments == -1) {
                                return msg(res, 200, 0, '删除失败,该用户没有评论过!', {})
                            } else {
                                datas.comments.splice(uncomments, 1)
                                datas.save()
                                    .then(isok => msg(res, 200, 1, '删除评论成功!', isok))
                            }
                        } else {
                            return msg(res, 200, 0, '不是当前用户，无法删除该评论!', {})
                        }
                    })
                    .catch(err => msg(res, 200, 0, '无法删除评论!', null))
            })
    } else {
        return msg(res, 200, 0, '参数错误!', {})
    }
})

module.exports = router