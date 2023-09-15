import './style.css'
import axios from "axios";
import { z } from "zod";

const BASE_URL = "http://localhost:8080"

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


type Team = z.infer<typeof TeamSchema>

type Player = z.infer<typeof PlayerSchema>
//----------------------------------------App state-----------------------------------------------------------------------//
let teams: Team[] = []
let teamNameInput = document.getElementById("teamname") as HTMLInputElement

//----------------------------------------App state-----------------------------------------------------------------------//

//----------------------------------------Mutation-----------------------------------------------------------------------//
const getTeams = async (teamName = "") => {
  const response = await axios.get(BASE_URL + "/api/teams",{
    params: { 
      "name" : teamName
    }
  })

  const result = TeamSchema.array().safeParse(response.data)
  if (!result.success) {
    teams = []
  }else {
    teams = result.data
  }

} 


//----------------------------------------Mutation-----------------------------------------------------------------------//
//----------------------------------------Render-----------------------------------------------------------------------// 

const renderTeams = () => {
  if (!teams.length) {
    (document.getElementById("teams") as HTMLDivElement).innerHTML = '<h1 class="font-bold text-xl">There is no such team</h1>'
    return
  }

  const container = document.getElementById("teams")!
  container.innerHTML = ""

  for (const team of teams) {
    const content = `
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">${team.name}</h2>
        <ul class="menu menu-vertical  rounded-box">
          ${renderPlayers(team.players)}
        </ul>
      </div>
    </div>
    `

    const paragraph = document.createElement("p")
    paragraph.innerHTML = content
    container.appendChild(paragraph);
    for (const player of team.players) {
      document.getElementById(`vote-${player.id}`)!.addEventListener("click", voteListener)
    }
  }
}

const renderPlayers = (players: Player[]) => {
  let content = ""
  for (const player of players) {
    content += `<li class="flex flex-row justify-between"><span>${player.name}</span><button id="vote-${player.id}">Vote</button></li> `
  }
  return content
}

//----------------------------------------Render-----------------------------------------------------------------------// 
//----------------------------------------EventListener-----------------------------------------------------------------------//
const init = async () => {
  await getTeams();
  
  if (teams.length){
    renderTeams()
  }

  (document.getElementById("search") as HTMLInputElement).addEventListener("click", async () => {
    await getTeams(teamNameInput.value)

    renderTeams()
  })

}

const voteListener = async(event: Event) => {
  const id = (event.target as HTMLButtonElement).id.split("-")[1]

  await axios.post(BASE_URL + "/api/votes",{"playerId" : +id})
}


init()