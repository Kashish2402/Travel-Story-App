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

    return new Date(date).toLocaleDateString("en-US",{
        year:"numeric",
        month:"short",
        day:"numeric"
    })
}
