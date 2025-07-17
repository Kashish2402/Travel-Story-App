export const formatDate=(date)=>{
    if(!date) return ""

    return new Date(date).toLocaleDateString("en-US",{
        year:"numeric",
        month:"short",
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit",
    })
}

export const formatDateOfBirth=(date)=>{
    if(!date) return ""

    return new Date(date).toLocaleDateString("en-us",{
        year:"numeric",
        month:"short",
        day:"numeric"
    })
}

export const formatInputDate=(date)=>{
    if(!date) return ""

    const d=new Date(date);
    const year=d.getFullYear()
    const month=String(d.getMonth()+1).padStart(2,'0')
    const day=String(d.getDate()).padStart(2,'0')

    return `${year}-${month}-${day}`
}

export const formatLocation=(location)=>{
    if(!location) return ""

    let newLocation=location.split(",")
    newLocation=newLocation.filter((loc)=>loc!=="" && loc!==" ")
    newLocation=newLocation.join(", ")
    newLocation=newLocation.length>30?newLocation.slice(0,30)+ "...":newLocation
    console.log(newLocation)
    return newLocation
}


