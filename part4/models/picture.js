const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    likes: Number,
    dislikes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to GridFS
    description: String,
    likers: [
        {
            type: String
        }
    ],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            likes: Number,
            dislikes: Number,
            likers: [
                {
                    type: String
                }
            ],
        }
    ]
})

module.exports = mongoose.model('Picture', pictureSchema);