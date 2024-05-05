const bcrypt = require('bcrypt')
const db = require('../env/connection')
var { ObjectId } = require('mongodb')
require('dotenv').config()

module.exports = {
    adminLogIn: (adminData) => {
        return new Promise(async(resolve,reject)=>{
            let admin = await db.get().collection(process.env.ADMIN_COLLECTION).findOne({username: adminData.username,})

            if(admin){

                bcrypt.compare(adminData.password, admin.password).then((status)=>{
                    resolve({password:status, admin:admin})
                })

            }else{
                resolve({nullUser:true})
            }

        })
    }
}