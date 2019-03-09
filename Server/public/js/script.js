function login(){
   const user = document.getElementById('username').value;
   const pass = document.getElementById('password').value;

   let req = new XMLHttpRequest();

   req.open('POST', '/auth', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
         window.sessionStorage.token = JSON.parse(req.response).jwt;
         window.location.href = "/home";
      } else {
         console.log('Error');
         alert("Invalid username and password combination.");
   }});

   req.send(
      "username=" + user + "&password=" + pass
   );
}
