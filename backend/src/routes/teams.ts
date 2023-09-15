import express from "express"
import { z } from "zod"
import { load } from "../utils/db"

const router = express.Router()

const FilterRequest = z.object({
  name: z.string().optional()
})

const PlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  players: PlayerSchema.array(),
})

router.get("/", async (req, res) => {
  const queryParseResult = FilterRequest.safeParse(req.query)
  if (!queryParseResult.success)
    return res.sendStatus(400)
  const query = queryParseResult.data

  const data = await load("teams")
  const teams = TeamSchema.array().parse(data)
  
  if (query.name === undefined)
    return res.json(teams)

  const name = query.name
  return res.json(teams.filter(team =>
    team.name.toLowerCase().startsWith(name.toLowerCase())))
})

export { router }