$(document).ready(()=>{
    $.get("/api/notifications",(data)=>{
        //console.log(data);
        outputNotificationList(data,$('.resultsContainer'))
    })
})
$('#markNotificationsAsRead').click(()=>markNotificationAsOpened());
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
    var url=getNotificationUrl(notification)
    var className=notification.opened?"":"active";
    return `<a href='${url}'class='resultListItem notification ${className}' data-id=${notification._id}>
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
function getNotificationUrl(notification)
{   
    var url="#";
    if(notification.notificationType=='retweet'||notification.notificationType=='like'||notification.notificationType=='reply')
    {
        url=`/posts/${notification.entityId}`
    }
   
    if(notification.notificationType=='follow')
    {
        url=`/profile/${notification.entityId}`
    }
    return url;
}