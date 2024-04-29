const {MongoClient} = require( 'mongodb')
require('dotenv').config();

const state = {}

const url = process.env.URL
const dbName = process.env.DATABASE_NAME
const client = new MongoClient(url)
module.exports.connect = async function (done) {
    // Use connect method to connect to the server
    await client.connect((err,data)=>{
        
        if(err) return done(err)
        state.db=client.db(dbName)
       

    })
    state.db=client.db(dbName)
    done()

}

module.exports.get= function (){
    return state.db
}
