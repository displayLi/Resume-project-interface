
// 封装send Message
module.exports = (res, status, flag, msg, requistBody) => {
    return res.status(status).json({ flag, msg, data: requistBody, status })
}