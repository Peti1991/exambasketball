import express from "express"
import { z } from "zod"
import { load, save } from "../utils/db"

const router = express.Router()

const VoteRequestSchema = z.object({
  playerId: z.number(),
})

const VoteSchema = z.object({
  playerId: z.number(),
  createdAt: z.string().datetime({ offset: true }),
})

router.post("/", async (req, res) => {
  const bodyParseResult = VoteRequestSchema.safeParse(req.body)
  if (!bodyParseResult.success)
    return res.sendStatus(400)
  const vote = bodyParseResult.data

  const data = await load("votes")
  const votes = VoteSchema.array().parse(data) 
  await save("votes", [ ...votes, { ...vote, createdAt: new Date().toISOString() } ])

  return res.sendStatus(204)
})

export { router }