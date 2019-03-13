function login(){
   const user = document.getElementById('username').value;
   const pass = document.getElementById('password').value;

   let req = new XMLHttpRequest();

   req.open('POST', '/authMarket', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
         const token = JSON.parse(req.response).jwt;

         let date = new Date();
         date.setTime(date.getTime()+(7 * 24 * 60 * 60 *1000));
         let expires = "; expires="+date.toGMTString();

         document.cookie = "jwt=" + token + expires;
         sessionStorage.setItem('token', token);
         window.location.href = "/home";
      } else {
         alert("Invalid email and password combination.");
   }});

   req.send(
      "email=" + user + "&password=" + pass + "&accountType=markets"
   );
}


function loginAdmin(){
   const user = document.getElementById('Email').value;
   const pass = document.getElementById('password').value;

   let req = new XMLHttpRequest();

   req.open('POST', '/admin/auth', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
         const token = JSON.parse(req.response).jwt;

         let date = new Date();
         date.setTime(date.getTime()+(7 * 24 * 60 * 60 *1000));
         let expires = "; expires="+date.toGMTString();

         document.cookie = "jwt=" + token + expires;
         sessionStorage.setItem('token', token);
         window.location.href = "/admin/home";
      } else {
         alert("Invalid email and password combination.");
   }});

   req.send(
      "email=" + user + "&password=" + pass + "&accountType=markets"
   );
}

function approveMarket(id, status)
{
   const denialReason = document.getElementById('reason').value;
   if(denialReason == null)
   denialReason = "";
   var req = new XMLHttpRequest();
    req.open('POST', '/admin/approveMarket', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            window.location.href = "/admin/manageMarkets";
        } else {
        alert(req.response);
    }});
    req.send(JSON.stringify({"id":id, "status":status, "reason":denialReason}));
}


function logout( returnHref = "/home") {
   document.cookie = 'jwt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   sessionStorage.clear();
   window.location.href = returnHref;
}

function changePassword() {
   const curPass = document.getElementById('curPass').value;
   const newPass = document.getElementById('newPass').value;
   const newPass2 = document.getElementById('newPass2').value;

   if(!curPass.length) {
      alert("Please enter your current password.");
      return;
   }

   if(!newPass.length || !newPass2.length) {
      alert("Please enter your new password in both fields.");
      return;
   }

   if(newPass !== newPass2) {
      alert("New passwords in both fields don't match.");
      return;
   }

   const token = sessionStorage.getItem('token');
   let req = new XMLHttpRequest();

   req.open('POST', '/changePassword', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      alert(JSON.parse(req.response).message);
      if(req.status >= 200 && req.status < 400){
         window.location.href = "/home";
      }
   });

   req.send(
      "curPass=" + curPass + "&newPass=" + newPass + "&token=" + token
   );
}


function newMarket()
{
   const user = document.getElementById('marketName').value;
   const pass = document.getElementById('password').value;
   const email = document.getElementById('email').value;
   const phone = document.getElementById('phone').value;
   const contact = document.getElementById('contact').value;
   const address = document.getElementById('address').value;
   const city = document.getElementById('city').value;
   const state = document.getElementById('state').value;
   const zip = document.getElementById('zip').value;

   let req = new XMLHttpRequest();

   req.open('POST', 'createMarket', true);
   req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
	    alert("Success! Your application has been submitted.");
	    window.location.href = "/marketHome";
      } else {
	 alert(req.response);
         console.log('Error');
   }});

   req.send(
      "marketName=" + user + "&password=" + pass + "&email=" + email + "&phone=" + phone + "&contact=" + contact + "&address=" + address + "&city=" + city + "&state=" + state + "&zip=" + zip
   );

}
