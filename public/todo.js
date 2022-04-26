var task = document.getElementById('textbox');
task.addEventListener('keyup',function(event){
  if(event.key==='Enter')
  {
    if(task.value.length!==1)
    {
        var taskItem = {
          name: task.value,
          id: new Date().getTime().toString(),
          isCheck: false,
          todoOwner: null
        };
        var leftDiv = document.getElementById('list');
        var todoItem = document.createElement('div');
        leftDiv.appendChild(todoItem);
        todoItem.setAttribute('class', 'partition');

        var taskContainer = document.createElement('div');
        taskContainer.setAttribute('class', 'taskContainer');
        var todo = document.createElement("h4");
        todo.innerText = taskItem.name;
        taskContainer.appendChild(todo);

        todoItem.appendChild(taskContainer);

        var request = new XMLHttpRequest();
        request.open("post","/save");
        request.setRequestHeader("Content-type","application/json");
        request.send(JSON.stringify(taskItem))

        var deleteItemContainer = document.createElement('div');
        deleteItemContainer.setAttribute('class', 'deleteItemContainer');
        deleteItemContainer.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteItemContainer.addEventListener('click',function(event){
          todoItem.remove();
          leftDiv.removeChild(hr);
          var request = new XMLHttpRequest();
          request.open("post","/delete");
          request.setRequestHeader("Content-type","application/json");
          request.send(JSON.stringify(taskItem));
        });

        todoItem.appendChild(deleteItemContainer);

        var checkBoxContainer = document.createElement('div');
        checkBoxContainer.setAttribute('class', 'checkBoxContainer');
        var checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBoxContainer.appendChild(checkBox);
        checkBox.addEventListener('click',function(event){
          if(taskItem.isCheck)
          {
            todo.style.textDecoration='none';
            taskItem.isCheck=false;
          }
          else{
            todo.style.textDecoration='line-through';
            taskItem.isCheck=true;
          }
          var request = new XMLHttpRequest();
          request.open('post',"/complete");
          request.setRequestHeader("Content-type","application/json");
          request.send(JSON.stringify(taskItem));
        })

        todoItem.appendChild(checkBoxContainer);

        var hr = document.createElement('hr');
        leftDiv.appendChild(hr);
    }
    task.value="";
  }
})

var request = new XMLHttpRequest();
request.open("get","/recieve");
request.send();

request.addEventListener('load',function(){
  var todos = JSON.parse(request.responseText);
  console.log(todos);
  todos.forEach(function(task){
        var leftDiv = document.getElementById('list');
        var todoItem = document.createElement('div');
        leftDiv.appendChild(todoItem);
        todoItem.setAttribute('class', 'partition');

        var taskContainer = document.createElement('div');
        taskContainer.setAttribute('class', 'taskContainer');
        var todo = document.createElement("h4");
        todo.innerText = task.name;
        taskContainer.appendChild(todo);

        todoItem.appendChild(taskContainer);

        var deleteItemContainer = document.createElement('div');
        deleteItemContainer.setAttribute('class', 'deleteItemContainer');
        deleteItemContainer.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteItemContainer.addEventListener('click',function(event){
          todoItem.remove();
          leftDiv.removeChild(hr);
          var request = new XMLHttpRequest();
          request.open("post","/delete");
          request.setRequestHeader("Content-type","application/json");
          request.send(JSON.stringify(task));
        })

        todoItem.appendChild(deleteItemContainer);

        var checkBoxContainer = document.createElement('div');
        checkBoxContainer.setAttribute('class', 'checkBoxContainer');
        var checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBoxContainer.appendChild(checkBox);
        if(task.isCheck)
        {
          todo.style.textDecoration='line-through';
          checkBox.checked=true;
        }
        else{
          todo.style.textDecoration='none';
          checkBox.checked=false;
        }
        checkBox.addEventListener('click',function(event){
          if(task.isCheck)
          {
            todo.style.textDecoration='none';
            task.isCheck=false;
          }
          else{
            todo.style.textDecoration='line-through';
            task.isCheck=true;
          }
          var request = new XMLHttpRequest();
          request.open('post',"/complete");
          request.setRequestHeader("Content-type","application/json");
          request.send(JSON.stringify(task));
        })

        todoItem.appendChild(checkBoxContainer);

        var hr = document.createElement('hr');
        leftDiv.appendChild(hr);
  })
})

function navbar()
{
  var request = new XMLHttpRequest();
  request.open('get','/getusername');
  request.send();
  request.addEventListener('load',function(){
    var name = JSON.parse(request.responseText);
    var heading = document.getElementById('heading');
    heading.innerHTML = heading.innerHTML+" "+name.name;
  })
  var logout = document.getElementById('logout');
  logout.addEventListener('click',function(){
    var request2 = new XMLHttpRequest();
    request2.open('get','/logout');
    request2.send();
    request2.addEventListener('load',function(){
      if(request2.status===200)
      {
        window.location.href="/";
      }
      else{
        console.log("logout failed");
      }
    })
  })
}
navbar();
