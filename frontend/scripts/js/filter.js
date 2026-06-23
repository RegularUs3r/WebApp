

export function filterData(){
    console.log("aqui!")
    const searches = document.querySelectorAll('[id="dom-search"]')
    Object.values(searches).forEach(seach => {
        seach.addEventListener('input', (event) => {
            var itens = document.querySelectorAll('[id="data-row"]')
            itens.forEach(item => {
                if (item.getAttribute("id") !== null){
                    if(!/^\d/.test(item.textContent)){
                        if (item.textContent.includes(event.target.value)){
                            item.style.display = ""
                        }else{
                            item.style.display = "none"
                        }
                    }
                }
            })
        })
    })
}