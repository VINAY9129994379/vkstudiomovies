import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"



const app = express()
const port = process.env.PORT || 3000

app.use(express.json())  
app.use(cors())

app.use(clerkMiddleware())   


await connectDB()

app.get('/', (req, res) => {
  res.send('Server is running') 
})

app.use("/api/inngest", serve({ client: inngest, functions }));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)      
}) 