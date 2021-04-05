const mongoose = require('mongoose')
// const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//model create


// const task = mongoose.model('task',{
//     task:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         trim:true,
//         default:false
//     }
// })

// const me = new user({
//     name:'Hritik',
//     age:90,
//     email:"hritik@gmail.com",
//     password:"hritik@123"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

// const mytask = new task({
//     task:'complete chapter two'
// })

// mytask.save().then(()=>{
//     console.log(mytask)
// }).catch((error)=>{
//     console.log(error)
// })