import { Request, Response, NextFunction } from "express"

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("--- Request arrived at " + new Date().toISOString() + " ---")
  console.log(`[${req.method}] -> ${req.url}`)
  console.log(`Path variables: ${JSON.stringify(req.params, null, 2)}`)
  console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`)
  console.log(`Query params: ${JSON.stringify(req.query, null, 2)}`)
  console.log(`Body: ${JSON.stringify(req.body, null, 2)}`)
  next()
}