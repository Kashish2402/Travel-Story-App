import mongoose from "mongoose";

export const connectDb=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`)

        console.log(`\n MONGODB Connected Successfully || DBHOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGODB Connection Failed Error !!! ${error}`)
        process.exit(1)
    }
}