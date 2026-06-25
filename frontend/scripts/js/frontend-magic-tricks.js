export function addMore(){
    const groupInputsDiv = document.getElementById("group-inputs")
    const middleIndex = Math.floor(groupInputsDiv.children.length / 2 )

    const programName = document.createElement("input")
    programName.id = "program"
    programName.setAttribute("type", "text")
    programName.setAttribute("oninput", "runtimeFilter(event)")
    programName.placeholder = "Program Name"

    const discordWebhook = document.createElement("input")
    discordWebhook.id = "dischook"
    discordWebhook.setAttribute("type", "text")
    discordWebhook.setAttribute("oninput", "runtimeFilter(event)")
    discordWebhook.placeholder = "Discord Webhook URL"

    const crontab = document.createElement("select")
    crontab.id = "cron"
    crontab.setAttribute("type", "text")
    
    const cron = document.createElement("option")
    const option1min = document.createElement("option")
    const option1 = document.createElement("option")
    const option2 = document.createElement("option")
    const option3 = document.createElement("option")
    const option4 = document.createElement("option")
    const option5 = document.createElement("option")
    const option6 = document.createElement("option")
    const option7 = document.createElement("option")
    const option8 = document.createElement("option")
    const option9 = document.createElement("option")
    const option10 = document.createElement("option")
    const option11 = document.createElement("option")
    const option12 = document.createElement("option")
    

    cron.textContent = "Cronjob"
    option1min.textContent = "1M"
    option1.textContent = "1H"
    option2.textContent = "2H"
    option3.textContent = "3H"
    option4.textContent = "4H"
    option5.textContent = "5H"
    option6.textContent = "6H"
    option7.textContent = "7H"
    option8.textContent = "8H"
    option9.textContent = "9H"
    option10.textContent = "10H"
    option11.textContent = "11H"
    option12.textContent = "12H"

    crontab.appendChild(cron)
    crontab.appendChild(option1min)
    crontab.appendChild(option1)
    crontab.appendChild(option2)
    crontab.appendChild(option3)
    crontab.appendChild(option4)
    crontab.appendChild(option5)
    crontab.appendChild(option6)
    crontab.appendChild(option7)
    crontab.appendChild(option8)
    crontab.appendChild(option9)
    crontab.appendChild(option10)
    crontab.appendChild(option11)
    crontab.appendChild(option12)


    const targetInput = document.createElement("input")
    targetInput.id = "input-target"
    targetInput.setAttribute("type", "text")
    targetInput.setAttribute("oninput", "runtimeFilter(event)")
    targetInput.placeholder = "domain.io"

    const childDiv = document.createElement("div")
    childDiv.className = "item"
    childDiv.id = "inputs"
    childDiv.appendChild(programName)
    childDiv.appendChild(discordWebhook)
    childDiv.appendChild(crontab)
    childDiv.appendChild(targetInput)

    groupInputsDiv.insertBefore(childDiv, groupInputsDiv.children[middleIndex])
    
}



export function runtimeFilter(event){
    
    const badChars = ["!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"]
    for(const char of badChars){
        try{
        var event = event["target"]
            if(event.id === "cron"){
                cleanCron(event.value, char)
            }
            
            if(event.id === "dischook"){
                cleanDiscordHook(event.value, char)
                
            }
            
            if(event.id === "program"){
                cleanProgram(event.value, char)
                
            }
            
            if(event.id === "input-target"){
                cleanInputTarget(event.value, char)
                
            }
        
        
    }catch (e){

    }
        Object.values(document.getElementsByTagName("input")).forEach(button => {
            button.addEventListener('input', (event) => {
                if(button.id === "cron"){
                    cleanCron(char, button)
                }
                if(button.id === "dischook"){
                    cleanDiscordHook(char, button)
                    
                }
                if(button.id === "program"){
                    cleanProgram(char, button)
                    
                }
                if(button.id === "input-target"){
                    cleanInputTarget(char, button)
                    
                }

            })
        })
    }
}

function cleanDiscordHook(char, button){
    if(button.value.includes(char)){
        if(char === "/" || char === ":" || char === "." || char === "_" || char === "-"){

        }else{
            console.log(`Replaced ${char}`)
            button.value = button.value.replace(char, "")
        }
    }
}
function cleanProgram(char, button){
    if(button.value.includes(char)){
        if(char === "-"){

        }else{
            console.log(`Replaced ${char}`)
            button.value = button.value.replace(char, "")
        }
    }
}
function cleanInputTarget(char, button){
    if(button.value.includes(char)){
        if(char === "-" || char === "," || char === "."){

        }else{
            console.log(`Replaced ${char}`)
            button.value = button.value.replace(char, "")
        }
    }
}



export function showContent(){

    const const_divs = document.querySelectorAll('div.container')
    for(let i = 3; i < const_divs.length; i++){
        console.log(const_divs[i].id)
        const one_ahead = i + 1
        try{
            localStorage.setItem(const_divs[i].id, const_divs[one_ahead].id)
        }catch (e){
            
        }

    }


    Object.values(document.getElementsByTagName("button")).forEach(button => {
        button.addEventListener('click', () => {
            const displayed_div = document.querySelectorAll('div[style*="display: flex"]')
            if(button.id === "add" || button.id === "recon" || button.id === "enum"){
            }else{
                for(const shownDiv  of Object.values(displayed_div)){
                    if(button.id === "display_settings"){
                        shownDiv.style.display = "none"
                        document.getElementById("group-inputs").style.display = "flex"
                        document.getElementById(button.id).style.display = "none"
                        document.getElementById("display_hooks").style.display = "block"
                    }else if (button.id === "display_hooks"){
                        fetchHooks()
                        console.log(button.id)
                        shownDiv.style.display = "none"
                        document.getElementById(button.id).style.display = "none"
                        document.getElementById("display_settings").style.display = "block"
                    }else{
                        shownDiv.style.display = "none"
                        const hiddenDiv = document.querySelector(`div[id*="${button.id}"]`)
                        hiddenDiv.style.display = "flex"
                        document.getElementById("display_hooks").style.display = "none"
                        document.getElementById("display_settings").style.display = "block"

                    }
                }
            }    
        })
    })
}

async function fetchHooks(){
    const hooks = await fetch('/api/gethooks')
    const data = await hooks.json()
    const table = document.createElement("table")
    table.border = "1px"
    const divConfig = document.createElement("div")
    divConfig.id = "display_config"
    divConfig.style.display = "none"
    divConfig.style.justifyContent = "center"
    for(const content of Object.values(data)){
        for(const [program, data] of Object.entries(content)){
            const tablerow = document.createElement("thead")

            const td_programname = document.createElement("td")
            const td_options = document.createElement("td")
            const td_period = document.createElement("td")
            const td_button = document.createElement("td")
            const td_hook = document.createElement("td")

            const update = document.createElement("button")

            const {id, period, hook, options, p_name} = data

            update.textContent = "Update"
            td_programname.textContent = program
            td_period.textContent = period
            td_hook.textContent = hook
            td_options.textContent = options
            td_button.appendChild(update)

            tablerow.appendChild(td_programname)
            tablerow.appendChild(td_hook)
            tablerow.appendChild(td_options)
            tablerow.appendChild(td_period)
            tablerow.appendChild(td_button)

            table.appendChild(tablerow)
            divConfig.appendChild(table)
        }
    }
    document.body.appendChild(divConfig)
    document.getElementById("display_config").style.display = "flex"
}