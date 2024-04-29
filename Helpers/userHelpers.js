const db = require('../env/connection')
var { ObjectId } = require('mongodb')
require('dotenv').config()

module.exports = {
    accountExist: (userNumber)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(process.env.ACCOUNT_COLLECTION).findOne({number: userNumber}).then((response)=>{
                if(response){
                    resolve({exist:true})

                }else resolve({exist:false})
            })
        })
    },
    createAccount: (user,data) => {
        return new Promise((resolve, reject) => {
            let work={
                title: data.title,
                discription: data.discription,
                commenced: data.date? data.date : new Date(),
                estimate: data.estimate,
                advance: data.advance,
                progress: data
            }
            db.get().collection(process.env.ACCOUNT_COLLECTION).insertOne({name: user.name, number: user.mobile, created:new Date(), works: []}).then((responses)=>{
                resolve()
            })
        })
    },
    addWork: () => {
        return new Promise((resolve, reject)=>{
            db.get().collection(process.env.ACCOUNT_COLLECTION).updateOne({number: userNumber},{})
        })
    }
}


