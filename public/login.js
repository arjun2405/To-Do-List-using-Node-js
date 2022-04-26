var username = document.getElementById('username');
var password = document.getElementById('password');
var loginButton = document.getElementById('login');

loginButton.addEventListener('click',function(){
  if(username.value && password.value)
  {
    var obj = {
      name : username.value,
      key : password.value
    }
    var request = new XMLHttpRequest();
    request.open('post','/login');
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(obj));
    request.addEventListener("load",function(){
        if(request.status === 200){
          window.location.href = "/";
        }
        else{
          alert("login failed");
          console.log("login err", request.responseText);
        }
    })
  }
})
