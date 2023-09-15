import fs from "fs/promises"

const dbPath = `${__dirname}/../../database/`

export const load = async (filename: string): Promise<unknown> => {
  const data = await fs.readFile(`${dbPath}/${filename}.json`, "utf-8")
  return JSON.parse(data) as unknown
}

export const save = (filename: string, data: JSONStringifyable): Promise<void> =>
  fs.writeFile(`${dbPath}/${filename}.json`, JSON.stringify(data, null, 2) , "utf-8")

type Primitive = string | number | boolean | null
type JSONStringifyable = Primitive | JSONStringifyable[] | { [key: string]: JSONStringifyable }
