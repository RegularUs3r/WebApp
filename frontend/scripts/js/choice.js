export function choices(){
    const option = []
    var choices = document.querySelectorAll('input[type="checkbox"]')
    for(let choice = 0; choice < choices.length; choice++){
        if (choices[choice].checked === true && choices[choice].value !== "on"){
            option.push(choices[choice].value)
        }
    }
    return option

}