$(document).ready(()=>{
    $.get("/api/notifications",(data)=>{
        //console.log(data);
        outputNotificationList(data,$('.resultsContainer'))
    })
})

function outputNotificationList(notifications,container)
{
    notifications.forEach(notification=>{
        var html=createNotificationHtml(notification);
        container.append(html);
    })
    if(notifications.length==0)
    {
        container.append(`<span class='noResult'>Nothing To Show</span>`);
    }
}
function createNotificationHtml(notification)
{   var userFrom=notification.userFrom;

    return `<a href='#'class='resultListItem notification' >
    <div class='resultsImageContainer'>
    <img src='${userFrom.profilePic}'>
    </div>
    <div class='resultDetailsContainer ellipsis'>
    <span class='ellipsis'>This is Notif</span>
    
    </div>
    </a>`
}