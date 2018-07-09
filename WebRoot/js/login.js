function save(){ 
	var request = new XMLHttpRequest();
	request.open("POST", "User/LoginAction");
	var data = "username=" + document.getElementById("username").value 
	                  + "&password=" + document.getElementById("password").value;
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
	request.send(data);
	request.onreadystatechange = function() {
		if (request.readyState===4) {
			if (request.status===200) { 
				var data = JSON.parse(request.responseText);
                var result=document.getElementById("result");
                result.innerHTML = data.username+data.password;
			} else {
				alert("发生错误：" + request.status);
			}
		} 
	}
}