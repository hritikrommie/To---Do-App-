const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

//creating middle ware
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            let s = String(value)
            if(s.length<=6){
                throw new Error("Too short password")
            }
            if(s.toLowerCase().includes("password")){
                throw new Error("password is not allowed as "+s)
            }
        }
    },
    age:{
        type:Number
    },
    //adding tokens
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true
})


//adding tasks virtually
userSchema.virtual('myTask',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})

//method for checking email and password
//statics methods are used on model User
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email:email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}

//generate token
//these methods are used on an instance
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user.id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//hiding data
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}


//hashing plain text
userSchema.pre('save', async function(next){
    const user =  this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    //when process done call next()
    next()
})

//delete user task when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User