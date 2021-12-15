$(document).ready(()=>{
    $.get('/api/chats',(data,status,xhr)=>{
        if(xhr.status==400)
        {
            alert("Boom");
        }
        else
        {
            outputChatList(data,$(".resultsContainer"));
        }
    })
})
function outputChatList(chatList,container)
{
    //console.log(chatList);
    chatList.forEach(chat=>{
        var html=createChatHtml(chat);
        container.append(html);
    })
    if(chatList.length==0)
    {
        container.append("<span class='noResults'>Nothing To Show </span>")
    }
}
function createChatHtml(chatData)
{
    var chatName=getChatName(chatData);
    var image =getChatImageElements(chatData);
    var latestMessage="Continue Conversation";
    return `<a href='/messages/${chatData._id}' class='resultListItem'> 
        ${image}
            <div class='resultDetailsContainer ellipsis'>
            <span class='heading ellipsis'>${chatName}</span>
            <span class='subText ellipsis'>${latestMessage}</span>
            </div>
            </a>`
}


function getChatName(chatData){
var chatName=chatData.chatName;
if(!chatName)
{
    var otherChatUsers=getOtherChatUsers(chatData.users);
    var names=otherChatUsers.map(user=>user.firstName + " " + user.lastName)
    chatName=names.join(", ")
}
return chatName;
}
function getOtherChatUsers(users)
{
    if(users.length==1)
    {
        return users;
    }
    return users.filter(user=>user._id!=userLoggedIn._id)
}

function getChatImageElements(chatData)
{
    var otherChatUsers=getOtherChatUsers(chatData.users);
    var groupChatClass="";
    var chatImage=getUserChatImageElement(otherChatUsers[0]);
    if(otherChatUsers.length>1)
    {
        groupChatClass="groupChatImage";
        chatImage+=getUserChatImageElement(otherChatUsers[1])
    }
    return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`
}
function getUserChatImageElement(user)
{
    if(!user||!user.profilePic)
    {
        return;
    }
    return `<img src='${user.profilePic}'>`
}