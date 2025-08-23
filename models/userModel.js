const mongoose = require('mongoose')

// schema

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true, 'User name is required']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    },
    address:{
        type:Array,
    },
    phone:{
        type:String,
        required:[true, 'Phone is requried']
    },
    usertype:{
        type:String,
        required:[true, 'User type is requried'],
        default:'client',
        enum:['client', 'admin', 'vendor', 'driver']
    },
    profile:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png'
    }
},{timestamps:true})

//export

module.exports = mongoose.model('User', userSchema);