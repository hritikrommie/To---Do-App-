const express = require('express')
const user = require('./model/user.js')
//to connect database
require('./db/mongoose.js')
// const User = require('./model/user')
// const Task = require('./model/task')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')


const app = express()
const port = process.env.PORT


// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize:1000000
//     }
// })
// app.post('/upload', upload.single('upload'), (req,res)=>{
//     res.send()
// })


//register middleware
//app.use(auth)

//AUTOMATICALLY PARSE JSON
app.use(express.json())
//setting router
app.use(userRouter)
app.use(taskRouter)




// app.post('/users',async (req,res)=>{
//     const user = new User(req.body)
//     try{
//         await user.save()
//         res.status(201).send(user)
//     }catch(e){
//         res.status(404).send(e)
//     }

//     // user.save().then(()=>{
//     //     res.status(201) .send(user)
//     // }).catch((error)=>{
//     //     // res.status(400)
//     //     // res.send(error)
//     //     res.status(400).send(error)
//     // })
// })

// //fetching all user
// app.get('/users',async (req,res)=>{
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }catch(e){
//         res.status(500).send()
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users)
//     // }).catch((error)=>{
//     //     res.status(500).send()
//     // })
// })

// //fetching single user
// app.get('/users/:id',async (req,res)=>{
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
//     // User.findById(_id).then((user)=>{
//     //     //user not found
//     //     if(!user){
//     //         return res.status(404).send("user not found")
//     //     }
//     //     res.status(200).send(user)
//     // }).catch((error)=>{
//     //     res.status(500).send()
//     // })
// })

// //update
// app.patch('/users/:id', async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowed = ['name','email','password','age']
//     const check = updates.every((update)=>{
//         return allowed.includes(update)
//     })

//     if(!check){
//         return res.status(404).send()
//     }

//     try{
//         const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(404).send(e)
//     }
// })

// //delete
// app.delete('/users/:id', async(req,res)=>{
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
// })


// //tasks
// app.post('/tasks',async (req,res)=>{
//     const task = new Task(req.body)

//     try{
//         await task.save()
//         res.send(task)
//     }catch(e){
//         res.status(400).send(e)
//     }

// //     task.save().then(()=>{
// //         res.send(task)
// //     }).catch((error)=>{
// //         res.status(400).send(error)
// //     })
//  })

// app.get('/tasks',async (req,res)=>{
//     try{
//         const tasks =await Task.find({})
//         res.send(tasks)
//     }catch(e){
//         res.status(500).send()
//     }

//     // Task.find({}).then((tasks)=>{
//     //     res.send(tasks)
//     // }).catch((error)=>{
//     //     res.status(500).send()
//     // })
// })

// app.get('/tasks/:id',async (req,res)=>{
//     const _id = req.params.id
//     try{
//         const task = await Task.findById(_id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch(e){
//         res.status(500).send()
//     }

//     // Task.findById(_id).then((tasks)=>{
//     //     if(!tasks){
//     //         return res.status(404).send()
//     //     }
//     //      res.send(tasks)
    
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })

// app.patch('/tasks/:id', async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowed = ['completed','task']
//     const check = updates.every((update)=> allowed.includes(update))
//     if(!check){
//         return res.status(404).send()
//     }

//     try{
//         const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }catch(e){
//         res.status(500).send()
//     }
// })

// app.delete('/tasks/:id', async (req,res)=>{
//     try{
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if(!task){
//             req.status(404).send()
//         }
//         res.send(task)
//     }catch(e){
//         res.status(500).send()
//     }
// })



app.listen(port,()=>{
    console.log("server is up on port",port)
})


// const Task = require('./model/task')
// const User = require('./model/user')
// const main = async function(){
// //     const task = await Task.findById('605e1ea0ff87fb29a0faa148')
// //    await task.populate('owner').execPopulate()
// //     console.log(task.owner)

//     const user= await User.findById('605e148fe3d95aeb7c61ca3e')
//     await user.populate('myTask').execPopulate()
//     console.log(user.myTask)
// }
// main()