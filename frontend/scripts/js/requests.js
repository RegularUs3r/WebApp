import { choices } from './choice.js';
import { showContent } from './frontend-magic-tricks.js';

export async function addTarget(){


        const ProgramName = []
        const Targets = []
        const DiscrodBot = []
        const Sched = []

        const choice = choices().join().replace(",", "&")

        const discordHook = document.querySelectorAll("#dischook")
        const programName = document.querySelectorAll("#program")


        const cron = document.querySelectorAll("#cron")
        
        var input = document.querySelectorAll("#input-target")

        for(const values of [programName, input, discordHook, cron]){
            for(let data = 0; data < programName.length; data++){
                
                ProgramName.push(programName[data].value)
                
                Targets.push(input[data].value)
            
                DiscrodBot.push(discordHook[data].value)
                
                Sched.push(cron[data].value)
                

            }
            break            
        }
        

        try{
            for(let data = 0; data < ProgramName.length; data++){
                const content = {program_name: ProgramName[data], target: Targets[data], discord_hook: DiscrodBot[data], setcron: Sched[data], choice: [choice]}
                console.log(content)
                const response = await fetch('/api/add-program',{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(content)
                })
                const result = response.json()
                if(result.result === false){
                    alert("Algo de errado!")
                }
            }

        }catch(error){
            console.log(`Some error ${error}`)
        }finally{
            window.location.reload()
        }
                
}

export async function fetchData(){
    const mainDiv = document.getElementById("group-buttons")
    const response = await fetch('/api/getdata')
    const data = await response.json()
    for(const value of Object.values(data)){
        for(const [buttonName, items] of Object.entries(value)){
            const dinamycButton = document.createElement("button")
            

            const divContent = document.createElement("div")
            const childDiv = document.createElement("div")
            const table = document.createElement("table")
            const thead = document.createElement("thead")
            const theadrow = document.createElement("tr")
            const tbody = document.createElement("tbody")
            const th = document.createElement("th")
            const th2 = document.createElement("th")
            
            dinamycButton.textContent = buttonName
            divContent.classList = "container"
            divContent.style.display = "none"
            divContent.style.justifyContent = "center"
            dinamycButton.id = buttonName
            const search = document.createElement("input")
            search.id = "dom-search"
            search.setAttribute("type", "text")
            search.setAttribute("oninput", "filterData()")


            th.textContent = buttonName
            divContent.id = buttonName

            const tdata = document.createElement("td")
            for(const content of items){
                const a = document.createElement("a")
                const tr = document.createElement("tr")
                const td = document.createElement("td")
                const {subdomain, status} = content
                const info = subdomain + " - " + status
                a.target = "_blank"
                a.href = `https://${subdomain}`
                a.textContent = info
                td.appendChild(a)
                td.id = subdomain
                tr.id = "data-row"
                tr.appendChild(td)
                tbody.appendChild(tr)
            }

            const buttonDiv = document.createElement("div")
            buttonDiv.classList = "container"
            buttonDiv.style.display = "none"
            buttonDiv.style.justifyContent = "center"
            buttonDiv.id = buttonName

            tdata.appendChild(search)
            theadrow.appendChild(th)
            theadrow.appendChild(th2)
            thead.appendChild(theadrow)
            table.appendChild(tdata)
            table.appendChild(tbody)
            table.appendChild(thead)
            divContent.appendChild(table)
            childDiv.appendChild(dinamycButton)
            mainDiv.appendChild(childDiv)
            document.body.appendChild(buttonDiv)
            document.body.appendChild(divContent)

        }
    }
    showContent()
}
