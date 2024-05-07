const db = require('../env/connection')
var { ObjectId } = require('mongodb')
require('dotenv').config()

module.exports = {
    accountExist: (userNumber)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(process.env.ACCOUNT_COLLECTION).findOne({number: userNumber,works: {$exists: true}}).then((response)=>{
                if(response){
                    resolve({exist:true})

                }else{
                    db.get().collection(process.env.ADMIN_COLLECTION).findOne({number: userNumber}).then((response)=>{
                        
                        if(response) resolve({admin:true, adminData:response})
                        else resolve({exist:false})
                    })
                } 
                
            })
        })
    },
    createAccount: (user) => {
        var data={
            name: user.name,
            number: user.mobile,
            created: new Date(),
            pending: 0,
            success: 0,

        }
        return new Promise((resolve, reject) => {
            db.get().collection(process.env.ACCOUNT_COLLECTION).insertOne(data).then((response)=>{
                resolve()
            })
        })
    },
    newWork: (data, progress, payment) => {
  
        return new Promise((resolve, reject)=>{
            db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne({number: data.number},
                {
                    $push:{
                        works: {
                            id: new ObjectId(),
                            title: data.title,
                            description: data.description,
                            progress: progress,
                            estimate: data.estimate,
                            payment: payment,
                            initialized: data.initialized,
                            pending: true
                        }
                    },
                    $inc:{pending: 1}
                }).then((response)=>{
                    resolve()
                })
        })
    },
    listUser: () => {
        return new Promise(async(resolve, reject) => {
            let user =await db.get().collection(process.env.ACCOUNT_COLLECTION).find().project(
                {
                    _id : 1,
                    name: 1,
                    number: 1,
                    pending: 1,
                    success: 1,
                }).toArray()
            resolve(user)
        })
    },
    userDetails: (number) => {
        return new Promise(async(resolve, reject)=>{
            let details = await db.get().collection(process.env.ACCOUNT_COLLECTION).findOne({number: number})
            resolve(details)
        })
    },
    viewProgress: (id) => {
        return new Promise(async(resolve,reject)=>{
            let progress = await db.get().collection(process.env.ACCOUNT_COLLECTION).
            find(
                {"works.id": new ObjectId(id)}
            ).project(
                {
                    "works.$": 1
                }).toArray()



            resolve(progress[0].works[0] )
        })
    },
    editUser: (id, updatedUser) => {
        return new Promise((resolve, reject)=>{
            db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne({_id:new ObjectId(id)},
        {
            $set:{
                name: updatedUser.name,
                number: updatedUser.number
            }
        }).then(()=>{
            resolve()
        })
            
        })
    },
    viewWork: (id)=> {
        return new Promise(async(resolve,reject)=>{
            let details = await db.get().collection(process.env.ACCOUNT_COLLECTION).
            find(
                {"works.id": new ObjectId(id)}
            ).project(
                {
                    "works.$": 1
                }).toArray()


            resolve(details[0].works[0])
        })
    },
    updateWork: (id, updateData, updateProgress, updatesLog, updatedPaymentInfo)=> {
        return new Promise((resolve,reject)=>{
            if(updateData.pending === 'true'){
                updateData.pending = updateData.pending === 'true' ? true: false;
                db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne( {"works.id": new ObjectId(id)},
            {
                $set:{
                    'works.$.title': updateData.title,
                    'works.$.description': updateData.description,
                    'works.$.progress': updateProgress,
                    'works.$.estimate': updateData.estimate,
                    'works.$.unexpected': updateData.unexpected,
                    'works.$.payment.amount': updatedPaymentInfo.totalAmount,
                    'works.$.payment.paid': updatedPaymentInfo.totalPaid,
                    'works.$.payment.balance': updatedPaymentInfo.balance,
                },
                $push:{
                    'works.$.updates': updatesLog
                }
            }).then(()=>{
                resolve()
            })

            }else{

                updateData.pending = updateData.pending === 'true' ? true: false;

                db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne( {"works.id": new ObjectId(id)},
            {
                $inc: { 
                    'pending': -1,
                    'success': 1,
    
                 },
                $set:{
                    'works.$.title': updateData.title,
                    'works.$.description': updateData.description,
                    'works.$.advance': updateData.advance,
                    'works.$.pending': updateData.pending,
                    'works.$.progress': updateProgress,
                    'works.$.unexpected': updateData.unexpected,
                },
                
            },
        {
            
        }).then(()=>{
                resolve()
            })
            }
            
        })
    },
    allPendings: () => {
        return new Promise(async(resolve, reject) => {
            let pendings =await db.get().collection(process.env.ACCOUNT_COLLECTION).find({'works.pending': true}).project(
                {
                    works: 1
                }
            ).toArray()
            resolve(pendings)
        })
    },
    allComplete: () => {
        return new Promise(async(resolve, reject) => {
            let complete =await db.get().collection(process.env.ACCOUNT_COLLECTION).find({'works.pending': false}).project(
                {
                    works: 1
                }
            ).toArray()
            resolve(complete)
        })
    },
    addRequote: (id, data) => {
        return new Promise((resolve, reject)=>{
            db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne({'works.id':new ObjectId(id)},
        {
            $push:{'works.$.requote': data}
        }).then((response)=>{
            resolve({success:true})
        })
        })
    }
}


