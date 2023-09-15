import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)
  res.sendStatus(500)
}