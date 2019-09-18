var File = function () {};
File.fileSave = function () {
        var filePath = document.getElementById("save_file").getAttribute("name");
        var fileContent = document.getElementById("show_text").value;
        ajax({
            url: "User/FileSave",
            type: "POST",
            async: true,
            data: {
                filePath: filePath,
                fileContent: fileContent
            },
            success: File.getResponseText
        });
    },
    File.getResponseText = function (data) {
        data = JSON.parse(data);
        if (data.msg === true)
            alert("保存成功！");
        else
            alert("保存失败！");
    }
File.fileDownload = function () {
    var filePath = document.getElementById("down_file").getAttribute("name");
    var body = document.getElementById("body");
    var form = document.createElement("form");
    form.setAttribute("action", "User/FileDownload");
    form.setAttribute("enctype",
        "application/x-www-form-urlencoded;charset=UTF-8");
    form.setAttribute("method", "post");
    body.appendChild(form);
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "filePath");
    input.setAttribute("value", filePath);
    form.appendChild(input);
    form.submit();
    body.removeChild(form);
}
File.fileOpen=function(e) {
    result = document.getElementById("result");
    li = result.getElementsByTagName("li");
    var down_file = document.getElementById("down_file");
    down_file.style.cursor = "pointer";
    down_file.setAttribute("name", e.getAttribute("title"));
    down_file.setAttribute("onclick", "File.fileDownload()");
    for (var i = 0; i < li.length; i++)
        li[i].style.background = "";
    e.style.background = "#dddddd";
    show_text = document.getElementById("show_text");
    show_text.style.display = "none";
    show_img_div = document.getElementById("show_img_div");
    if (e.title.match("jpg") || e.title.match("png") || e.title.match("gif")) { //当打开图片时 
        var save_file = document.getElementById("save_file");
        save_file.style.cursor = "not-allowed";
        save_file.removeAttribute("name");
        save_file.removeAttribute("onclick");
        show_img_div.firstElementChild.setAttribute("src", "");
        img_address = e.getAttribute("title");
        show_img_div.firstElementChild.setAttribute("src", img_address);
        show_img_div.style.display = "block";
    } else { //当打开文本时
        save_file = document.getElementById("save_file");
        save_file.style.cursor = "pointer";
        save_file.setAttribute("name", e.getAttribute("title"));
        save_file.setAttribute("onclick", "File.fileSave()");
        show_img_div.style.display = "none";
        ajax({
            url: "User/FileDownload",
            type: "POST",
            async: true,
            data: {
                filePath: e.getAttribute("title")
            },
            success:readFile
        });      
    }
}

function readFile(data) {
    show_text = document.getElementById("show_text");
    show_text.value = data;
    show_text.style.display = "block";
}