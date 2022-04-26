var username = document.getElementById('username');
var email = document.getElementById('email');
var password = document.getElementById('password');
var signupButton = document.getElementById('signup');

signupButton.addEventListener('click',function(){
  if(username.value && email.value && password.value)
  {
     var obj = {
      name : username.value,
      id : email.value,
      key : password.value
    }
    var request = new XMLHttpRequest();
    request.open('post','/signup');
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(obj));
    request.addEventListener("load",function(){
        if(request.status === 200){
          alert("You are signed up successfully");
          window.location.href = "/";
        }
        else{
          alert("user already exist!");
          console.log("signup err", request.responseText);
        }
    })
  }

})
