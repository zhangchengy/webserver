window.onload = function() {
	var result = document.getElementById("result");
	result.innerHTML = "";
	var request = new XMLHttpRequest();
	request.open("POST", "User/ListAction");
	request.setRequestHeader("Content-type",
			"application/x-www-form-urlencoded;charset=UTF-8");
	request.send();
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				var data = JSON.parse(request.responseText);
				for (var j = 0, len = data.files.length; j < len; j++) {
					var blank = "", lastLocation, tr, td, td2, td3, directory, i, li, a;
					for (var k = 0; k < data.files[j].level; k++) {
						blank = blank + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					}
					if (data.files[j].directory == true) {

						lastLocation = data.files[j].filePath.lastIndexOf("\\");
						directory = data.files[j].filePath.substring(0,
								lastLocation);
						tr = document.createElement("tr");
						result.appendChild(tr);
						td = document.createElement("td");
						tr.appendChild(td);
						li = document.createElement("li");

						li.innerHTML = blank;
						tr.setAttribute("onclick", "opendir(this);");
						td.appendChild(li);
						i = document.createElement("i");
						i.setAttribute("style", "font-size:16px");
						i.setAttribute("class", "fa fa-caret-right");
						li.appendChild(i);

						i = document.createElement("i");
						i.setAttribute("style", "font-size:16px");
						i.setAttribute("class", "fa fa-files-o fileswei");
						li.appendChild(i);

						a = document.createElement("a");
						a.setAttribute("id", directory);

						a.innerHTML = data.files[j].fileName;
						li.appendChild(a);

						td1 = document.createElement("td");
						tr.appendChild(td1);

						td2 = document.createElement("td");
						tr.appendChild(td2);
						td2.innerHTML = data.files[j].lastModify;
						if (data.files[j].level != 0)
							tr.style.display = "none";
					} else {
						lastLocation = data.files[j].filePath.lastIndexOf("\\");
						directory = data.files[j].filePath.substring(0,
								lastLocation);
						tr = document.createElement("tr");
						result.appendChild(tr);
						td = document.createElement("td");
						tr.appendChild(td);
						li = document.createElement("li");

						li.innerHTML = blank;

						td.appendChild(li);
						i = document.createElement("i");
						i.setAttribute("style", "font-size:16px");
						i.setAttribute("class", "fa fa-file-o fileswei");
						li.appendChild(i);

						a = document.createElement("a");
						a.setAttribute("id", directory);

						// a.setAttribute("onclick", "down(this);");
						a.innerHTML = data.files[j].fileName;
						tr.setAttribute("onclick", "todown(this);");
						li.appendChild(a);
						td1 = document.createElement("td");
						tr.appendChild(td1);
						if (data.files[j].size < 1024)
							td1.innerHTML = parseInt(data.files[j].size) + "B";
						else if (data.files[j].size > 1024
								&& data.files[j].size < 1024 * 1024)
							td1.innerHTML = parseInt(data.files[j].size
									/ Math.pow(2, 10))
									+ "KB";
						else
							td1.innerHTML = parseInt(data.files[j].size
									/ Math.pow(2, 20))
									+ "MB";
						td2 = document.createElement("td");
						tr.appendChild(td2);
						td2.innerHTML = data.files[j].lastModify;

						if (data.files[j].level != 0)
							tr.style.display = "none";
					}
				}
			} else {
				alert("发生错误：" + request.status);
			}
		}
	}

}
function opendir(ee) {
	var e = ee.firstChild.firstChild.lastChild;
	var id = e.id;
	var list = document.getElementsByTagName("a");
	var flag;
	if (ee.nextSibling.style.display == "table-row")
		flag = 1;
	else
		flag = 0;
	for (var i = 0; i < list.length; i++) {
		if (list[i].id.indexOf(id + "\\" + e.innerHTML) != -1
				&& (!list[i].classList.contains("save_file"))
				&& (!list[i].classList.contains("down_file"))) {
			if (flag == 1) {
				if (list[i].innerHTML.indexOf('.') == -1) {
					list[i].parentNode.firstElementChild.setAttribute("class",
							"fa fa-caret-right");
				}
				list[i].parentNode.parentNode.parentNode.style.display = "none";
				ee.firstElementChild.firstElementChild.firstElementChild
						.setAttribute("class", "fa fa-caret-right");

			} else {
				if (list[i].id == (id + "\\" + e.innerHTML)) {
					list[i].parentNode.parentNode.parentNode.style.display = "table-row";
					ee.firstElementChild.firstElementChild.firstElementChild
							.setAttribute("class", "fa fa-caret-down");

				}
			}
		}
	}
}

function filedownload() {
	var body = document.getElementsByTagName("body");
	var form = document.createElement("form");
	body[0].appendChild(form);
	form.setAttribute("action", "User/FileDownload");
	form.setAttribute("enctype",
			"application/x-www-form-urlencoded;charset=UTF-8");
	form.setAttribute("method", "post");
	var input = document.createElement("input");
	form.appendChild(input);
	input.setAttribute("type", "hidden");
	input.setAttribute("name", "filePath");
	var as = document.getElementsByClassName("down_file");
	if (as[0].id != "") {
		input.setAttribute("value", as[0].id);
		form.submit();
		body[0].removeChild(form);
	} else {
		alert("您还没有选择下载的文件！");
	}
}

function filesave() {
	var showtext = document.getElementsByTagName("textarea");
	var as = document.getElementsByClassName("down_file");
	if (as[0].id != "") {
		var request = new XMLHttpRequest();
		request.open("POST", "User/FileSave");
		request.setRequestHeader("Content-type",
				"application/x-www-form-urlencoded;charset=UTF-8");
		request.send("filePath=" + as[0].id + "&fileContent="
				+ showtext[0].value);
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) {
					var data = JSON.parse(request.responseText);
					if (data.msg == true) {
						alert("保存成功");
					} else {
						alert("保存失败");
					}
				} else {
					alert("发生错误：" + request.status);
				}
			}
		}
	} else {
		alert("您还没有需要保存的文件！");
	}
}

function todown(e) {
	var save_i = document.getElementById("save_i");
	save_i.setAttribute("onclick", "filesave();");
	save_i.style.cursor = "pointer";
	var tr = document.getElementsByTagName("tr");
	for (var i = 0; i < tr.length; i++) {
		if (tr[i] != e)
			tr[i].style.background = "";
	}
	e.style.background = "#C0C0C0";
	var f = e.firstChild.firstChild.lastChild;
	var as = document.getElementsByClassName("down_file");
	as[0].setAttribute("id", f.id + "\\" + f.innerHTML);

	var request = new XMLHttpRequest();
	request.open("POST", "User/FileDownload");
	request.setRequestHeader("Content-type",
			"application/x-www-form-urlencoded;charset=UTF-8");
	request.send("filePath=" + f.id + "\\" + f.innerHTML);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				var showtext = document.getElementsByTagName("textarea");
				var id = document.getElementById("show_img");
				if (f.innerHTML.indexOf("jpg") != -1
						|| f.innerHTML.indexOf("png") != -1) {// 图片
					var reg = /\\/g;
					id.style.display = "block";
					var newstr = f.id.replace(reg, "/");
					id.src = newstr + "/" + f.innerHTML;
					showtext[0].style.display = "none";
					save_i.style.cursor = "not-allowed";
					save_i.setAttribute("onclick", "");
				} else {// 文本
					showtext[0].style.display = "block";
					showtext[0].value = request.responseText;
					id.style.display = "none";
				}

			} else {
				alert("发生错误：" + request.status);
			}
		}
	}

}