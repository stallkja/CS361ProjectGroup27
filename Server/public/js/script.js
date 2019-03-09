document.getElementById('submitBtn').addEventListener('click', function(event){
   console.log('inside function');
   event.preventDefault();

   const user = document.getElementById('username').value;
   const pass = document.getElementById('password').value;

   let req = new XMLHttpRequest();

   req.open('POST', '/auth', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
         console.log("Good");
         window.location.href = "/home";
      } else {
         console.log('Error');
         alert("Invalid username and password combination.");
   }});

   req.send(
      "username=" + user + "&password=" + pass + "&accountType=users"
   );
});