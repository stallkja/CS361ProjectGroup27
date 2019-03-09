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
      "username=" + user + "&password=" + pass + "&accountType=users"
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
      //   window.sessionStorage.token = JSON.parse(req.response).jwt;
         //window.location.href = "/home";
	 alert("Success");
      } else {
         console.log('Error');
         alert("Invalid Input.");
   }});

   req.send(
      "marketName=" + user + "&password=" + pass + "&email=" + email + "&phone=" + phone + "&contact=" + contact + "&address=" + address + "&city=" + city + "&state=" + state + "&zip=" + zip
   );

}
