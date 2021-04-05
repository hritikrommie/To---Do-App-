const express = require('express')
const router = new express.Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')


//testing
// router.get('/test',(req,res)=>{
//     res.send("from new file")
// })


//log in
router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        //generating token
        const token = await user.generateToken()

        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

// logout
router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        req.status(500).send()
    }
})

//logout all
router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

//signup
router.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        account.welcomeMail(user.email, user.name)
        const token = await user.generateToken()
        
        res.status(201).send({user,token})
    }catch(e){
        res.status(404).send(e)
    }

    // user.save().then(()=>{
    //     res.status(201) .send(user)
    // }).catch((error)=>{
    //     // res.status(400)
    //     // res.send(error)
    //     res.status(400).send(error)
    // })
})

//fetching all user
//fetching login user profile
router.get('/users/me', auth ,async (req,res)=>{
    // try{
    //     const users = await User.find({})
    //     res.send(users)
    // }catch(e){
    //     res.status(500).send()
    // }

    //user already authenticated so no need of above code
    res.send(req.user)


    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
})

//fetching single user
///-------no need anymore
// router.get('/users/:id',async (req,res)=>{
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

//update
router.patch('/users/me', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowed = ['name','email','password','age']
    const check = updates.every((update)=>{
        return allowed.includes(update)
    })

    if(!check){
        return res.status(404).send()
    }

    try{
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       
        // updates.forEach((element)=>{
        //     user[element] = req.body[element]
        // })
        
        // await user.save()

        // if(!user){
        //     res.status(404).send()
        // }
        // res.send(user)
        updates.forEach((element)=>{
            req.user[element] = req.body[element]
        })
        
        await req.user.save()

        res.send(req.user)
    }catch(e){
        res.status(404).send(e)
    }
})

//delete
///users/:id  -> /users/me
router.delete('/users/me',auth, async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.params.id)
        
        //---change
        // const user = await User.findByIdAndDelete(req.user._id)
        //-------
        // if(!user){
        //     return res.status(404).send()
        // } 

        await req.user.remove()

        account.cancelMail(req.user.email, req.user.name)

        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

//upload avatar
const upload = multer({

    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('only image allowed'))
        }
        cb(undefined,true)

        // cb(new Error('Error'))
        // cb(undefined, true)
        // cb(undefined,false)
    }
})

router.post('/users/me/avatar', auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).png().resize({width:250, height:250}).toBuffer()
    
    req.user.avatar = buffer
    //req.user.avatar = req.file.buffer
    
    
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports = router