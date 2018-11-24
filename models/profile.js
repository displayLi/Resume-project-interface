const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfilesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    handle: {
        type: String,
        required: true,
        max: 30
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
    },
    githubusername: {
        type: String,
    },

    experience: [
        {
            current: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
            },
            location: {
                type: String,
            },
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            }
        }
    ],

    education: [
        {
            current: {
                type: Boolean,
                default: true
            },
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            }
        }
    ],
    social: {
        wechat: {
            type: String,
        },
        QQ: {
            type: String,
        },
        tengxunkt: {
            type: String,
        },
        wangyikt: {
            type: String,
        }
    },
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('profile', ProfilesSchema)