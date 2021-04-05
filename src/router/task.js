const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../model/task')


router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)

    //adding owner to task
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

    //     task.save().then(()=>{
    //         res.send(task)
    //     }).catch((error)=>{
    //         res.status(400).send(error)
    //     })
})

//fetch all task
// GET /tasks?completed=true to fetch all completed tasks
//limit & skip
// GET /tasks?limit=10&skip=0
//sort
//GET /tasks?sortBy=createdAt_asc or desc
router.get('/tasks', auth, async (req, res) => {
    
   const match={}
   if(req.query.completed){
       match.completed = req.query.completed === 'true'
   }

   const sort ={}
   if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1]==='desc' ? -1 : 1
   }
    
    try {
        //const task = await Task.find({owner:req.user._id})

        //const user = await User.findById(req.user._id)
        await req.user.populate({
            path:'myTask',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
    
        const tasks = req.user.myTask
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }

    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
})

//by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id


    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

    // Task.findById(_id).then((tasks)=>{
    //     if(!tasks){
    //         return res.status(404).send()
    //     }
    //      res.send(tasks)

    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed = ['completed', 'task']
    const check = updates.every((update) => allowed.includes(update))
    if (!check) {
        return res.status(404).send()
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})

        // const task = await Task.findById(req.params.id)

        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
      

        updates.forEach((element) => {
            task[element] = req.body[element]
        })
        await task.save()

        if (!task) {
            return res.status(404).send()
        }
       
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth,async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user.id})
        if (!task) {
            req.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router