var File = function () {};
File.fileSave = function () {
    var filePath = document.getElementById("save_file").getAttribute("name");
    var fileContent = document.getElementById("show_text").value;
    ajax({
        url: "http://localhost/FileSave.Action",
        type: "POST",
        async: true,
        data: {
            filePath: filePath,
            fileContent: fileContent
        },
        success: File.getResponseText
    });
}

File.getResponseText = function (data) {
    data = JSON.parse(data);
    if (data.msg === true)
        alert("保存成功！");
    else
        alert("保存失败！");
}

File.fileDownload = function () {
    var filePath = document.getElementById("down_file").getAttribute("name");
    var body = document.getElementsByTagName("body");
    var form = document.createElement("form");
    form.setAttribute("action", "http://localhost/FileDownload.Action");
    form.setAttribute("enctype",
        "application/x-www-form-urlencoded;charset=UTF-8");
    form.setAttribute("method", "post");
    body[0].appendChild(form);
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "filePath");
    input.setAttribute("value", filePath);
    form.appendChild(input);
    form.submit();
    body[0].removeChild(form);
}

File.fileOpen = function (e) {
    var tools = document.getElementById("tools");
    tools.style.display = "block";
    var rootDirNode = document.getElementById("rootDirNode");
    rootDirNode.style.background = "";
    var right_click_menu_div = document.getElementById("right_click_menu");
    right_click_menu_div.style.display = "none";
    var welcome_div = document.getElementById("welcome_div");
    welcome_div.style.display = "none";
    document.oncontextmenu = function () {
        return false;
    }
    e.oncontextmenu = function () {
        File.showRightClickMenu(e);
    }
    var stateObject = {
        id: count
    };
    var newUri = e.getAttribute("title").substring(1);
    history.pushState(stateObject, "", "#" + newUri);
    count++;
    var result = document.getElementById("result");
    var down_file = document.getElementById("down_file");
    var save_file = document.getElementById("save_file");
    save_file.style.display = "none";
    down_file.style.display = "block";
    down_file.setAttribute("name", e.getAttribute("title"));
    down_file.setAttribute("onclick", "File.fileDownload()");
    var div = result.getElementsByTagName("div");
    for (var i = 0; i < div.length; i++)
        div[i].style.background = "";
    e.style.background = "#dddddd";
    show_text = document.getElementById("show_text");
    show_text.style.display = "none";
    show_img_div = document.getElementById("show_img_div");
    show_img_div.style.display = "none";
    if (e.title.match("jpg") || e.title.match("png") || e.title.match("gif")) { //当打开图片时 
        var save_file = document.getElementById("save_file");
        save_file.removeAttribute("name");
        save_file.removeAttribute("onclick");
        img_address = e.getAttribute("title");

        show_img_div.firstElementChild.setAttribute("src", "http://localhost:80/" + img_address);
        show_img_div.style.display = "block";
    } else {
        if (!(e.title.match("jar") || e.title.match("class"))) {
            //当打开文本时          
            save_file.style.display = "block";
            save_file.setAttribute("name", e.getAttribute("title"));
            save_file.setAttribute("onclick", "File.fileSave()");
            show_img_div.style.display = "none";
            ajax({
                url: "http://localhost/FileOpen.Action",
                type: "POST",
                async: true,
                data: {
                    filePath: e.getAttribute("title")
                },
                success: function (data) {
                    var show_text = document.getElementById("show_text");
                    show_text.value = data;
                    show_text.style.display = "block";
                }
            });
        } else {
            alert("当前只支持查看文本文件");
        }
    }
}
File.showRightClickMenu=function() {
    var div = document.getElementById("right_click_menu");
    var x, y;
    var e = event || window.event;
    x = e.clientX;
    y = e.clientY;
    div.style.left = x+"px";
    div.style.top = y+"px";
   div.style.display="block";
}