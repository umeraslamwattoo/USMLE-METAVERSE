const mongoose = require('mongoose');

const FreevidioSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    Freevidiovideo: {
        type: String,
        required: true,
    },  
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Freevidio', FreevidioSchema);
