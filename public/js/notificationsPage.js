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
    var text=getNotificationText(notification);
    return `<a href='#'class='resultListItem notification' >
    <div class='resultsImageContainer'>
    <img src='${userFrom.profilePic}'>
    </div>
    <div class='resultDetailsContainer ellipsis'>
    <span class='ellipsis'>${text}</span>
    
    </div>
    </a>`
}

function getNotificationText(notification)
{   var userFrom=notification.userFrom;
    if(!userFrom.firstName)
    {
        return ;
    }
    var userFromName=`${userFrom.firstName}  ${userFrom.lastName} `;
    var text;
    if(notification.notificationType=='retweet')
    {
        text=`${userFromName} retweeted your Post`
    }
    if(notification.notificationType=='like')
    {
        text=`${userFromName} liked your Post`
    }
    if(notification.notificationType=='reply')
    {
        text=`${userFromName} commented on your Post`
    }
    if(notification.notificationType=='follow')
    {
        text=`${userFromName} started following you`
    }
    return `<span class='ellipsis'>${text}</span>`;
}