import "express-async-errors"
import express from "express"
import cors from "cors"
import { logger } from "./middleware/logger"
import { router as teams } from "./routes/teams"
import { router as votes } from "./routes/votes"
import { errorHandler } from "./middleware/errorHandler"

const app = express()
app.use(cors())
app.use(express.json())
app.use(logger)
app.use((req, res, next) => {
  console.log("loading...\n")
  setTimeout(next, 2000)
})

app.use("/api/teams", teams)
app.use("/api/votes", votes)

app.use(errorHandler)

const PORT = 8080
app.listen(PORT, () => console.log(`Listening on ${PORT}...\n`))
