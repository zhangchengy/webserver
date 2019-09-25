var file = function () {};
file.clickFileDiv; //点击目录树中的文件时，将点击的div存储到该变量
file.clickDir; //点击目录树中的文件夹时，将点击的div存储到该变量
file.fileSave = function (e) {
    var filePath = e.getAttribute("name");
    var fileContent = document.getElementById("show_text").value;
    ajax({
        url: "FileSave.Action",
        type: "POST",
        async: true,
        data: {
            filePath: filePath,
            fileContent: encodeURIComponent(fileContent)
        },
        success: file.getResponseText
    });
}

file.getResponseText = function (data) {
    data = JSON.parse(data);
    if (data.msg === true)
        alert("保存成功！");
    else
        alert("保存失败！");
}

file.fileDownload = function (e) {
    var filePath = e.getAttribute("name");
    var body = document.getElementsByTagName("body");
    var form = document.createElement("form");
    form.setAttribute("action", "FileDownload.Action");
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

file.fileOpen = function (e) {
    file.clickFileDiv = e;
    file.clickDir = e.parentNode.parentNode.previousElementSibling;
    if (!(e.title.match("jar") || e.title.match("class"))) {
        var tools = document.getElementById("tools");
        tools.style.display = "block";
        var rootDirNode = document.getElementById("rootDirNode");
        rootDirNode.style.background = "";
        var right_click_menu_div = document.getElementById("right_click_menu");
        right_click_menu_div.style.display = "none";
        var welcome_div = document.getElementById("welcome_div");
        welcome_div.style.display = "none";
        addressBar.modifyAddress(e);
        var result = document.getElementById("result");
        var down_file = document.getElementById("down_file");
        var save_file = document.getElementById("save_file");
        var delete_file = document.getElementById("delete_file");
        delete_file.style.display = "block";
        save_file.style.display = "none";
        down_file.style.display = "block";
        down_file.setAttribute("name", e.getAttribute("title"));
        down_file.setAttribute("onclick", "file.fileDownload(this)");
        delete_file.setAttribute("name", e.getAttribute("title"));
        delete_file.setAttribute("onclick", "file.deleteFile(this)");
        var div = result.getElementsByTagName("div");
        for (var i = 0; i < div.length; i++)
            div[i].style.background = "";
        e.style.background = "#AAAAAA";
        show_img_div = document.getElementById("show_img_div");
        show_img_div.style.display = "none";
        if (e.title.match("jpg") || e.title.match("png") || e.title.match("gif") || e.title.match("PNG")) { //当打开图片时 
            var save_file = document.getElementById("save_file");
            img_address = e.getAttribute("title");
            var show_text = document.getElementById("show_text");
            show_text.style.display = "none";
            show_img_div.firstElementChild.setAttribute("src", "" + img_address);
            show_img_div.style.display = "block";
        } else {
            //当打开文本时           
            show_text = document.getElementById("show_text");
            show_text.style.display = "none";
            save_file.style.display = "block";
            save_file.setAttribute("name", e.getAttribute("title"));
            save_file.setAttribute("onclick", "file.fileSave(this)");
            show_img_div.style.display = "none";
            ajax({
                url: "FileOpen.Action",
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

        }
    } else {
        alert("当前只支持查看文本文件");
    }
}

file.showRightClickMenu = function (e1) {
    file.clickDir = e1;
    var div = document.getElementById("right_click_menu");
    var x, y;
    var e = event || window.event;
    x = e.clientX;
    y = e.clientY;
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.display = "block";
}

file.newChildDir = function () {
    if (file.clickDir.getAttribute("state") == "off")
        tree.opendir(file.clickDir);
    var right_click_menu = document.getElementById("right_click_menu");
    right_click_menu.style.display = "none";
    var li = document.createElement("li");
    li.setAttribute("id", "temp_li");
    var input = document.createElement("input");
    input.setAttribute("id", "temp_input");
    var cancel_button = document.createElement("button");
    cancel_button.setAttribute("id", "cancel_button");
    cancel_button.setAttribute("onclick", "clickCancelButton(this)");
    cancel_button.innerHTML = "取消";
    var ensure_button = document.createElement("button");
    ensure_button.setAttribute("id", "ensure_button");
    ensure_button.setAttribute("onclick", "clickNewDirEnsureButton(this)");
    ensure_button.innerHTML = "确定";
    li.appendChild(input);
    li.appendChild(ensure_button);
    li.appendChild(cancel_button);
    if (file.clickDir.getAttribute("childrenSum") != 0)
        file.clickDir.nextElementSibling.insertBefore(li, file.clickDir.nextElementSibling.firstElementChild);
    else {
        var ul = document.createElement("ul");
        ul.appendChild(li);
        file.clickDir.parentNode.appendChild(ul);
    }
}

function clickCancelButton(e) {
    e.parentNode.parentNode.removeChild(e.parentNode);
}

function clickNewDirEnsureButton(e) {
    var newChildDir = document.getElementById("temp_input").value;
    ajax({
        url: "NewChildDir.Action",
        type: "POST",
        async: true,
        data: {
            dirPath: file.clickDir.getAttribute("title"),
            newDirName: newChildDir
        },
        success: function (data) {
            data = JSON.parse(data);
            if (data.msg === true) {
                alert("成功新建文件夹：" + newChildDir);
                e.parentNode.parentNode.removeChild(e.parentNode);
                var li = document.createElement("li");
                var div = document.createElement("div");
                var img = document.createElement('img');
                div.appendChild(img);
                img = document.createElement('img');
                div.setAttribute("onclick", "tree.opendir(this);");
                div.setAttribute("state", "off");
                div.setAttribute("asked", "yes");
                div.style.marginLeft = "16px";
                div.setAttribute("childrenSum", 0);
                img.setAttribute("src", "WebRoot/image/dir.png");
                div.appendChild(img);
                var span = document.createElement("span");
                span.innerHTML = newChildDir;
                div.setAttribute("title", file.clickDir.getAttribute("title") + "\\" + newChildDir);
                div.appendChild(span);
                li.appendChild(div);
                file.clickDir.firstElementChild.src = "WebRoot/image/dtri.png";
                file.clickDir.style.marginLeft = "";
                file.clickDir.setAttribute("asked", "yes");
                file.clickDir.setAttribute("childrenSum", file.clickDir.getAttribute("childrenSum") + 1);
                file.clickDir.nextElementSibling.insertBefore(li, file.clickDir.nextElementSibling.firstElementChild);
            } else {
                alert("新建文件夹失败：文件夹名重复，无效或者太长"); //文件夹名不能为点.不能太长
            }
        }
    });
}

file.newFile = function () {
    if (file.clickDir.getAttribute("state") == "off")
        tree.opendir(file.clickDir);
    var right_click_menu = document.getElementById("right_click_menu");
    right_click_menu.style.display = "none";
    var li = document.createElement("li");
    li.setAttribute("id", "temp_li");
    var input = document.createElement("input");
    input.setAttribute("id", "temp_input");
    var cancel_button = document.createElement("button");
    cancel_button.setAttribute("id", "cancel_button");
    cancel_button.setAttribute("onclick", "clickCancelButton(this)");
    cancel_button.innerHTML = "取消";
    var ensure_button = document.createElement("button");
    ensure_button.setAttribute("id", "ensure_button");
    ensure_button.setAttribute("onclick", "clickNewFileEnsureButton(this)");
    ensure_button.innerHTML = "确定";
    li.appendChild(input);
    li.appendChild(ensure_button);
    li.appendChild(cancel_button);
    if (file.clickDir.getAttribute("childrenSum") != 0)
        file.clickDir.nextElementSibling.appendChild(li);
    else {
        var ul = document.createElement("ul");
        ul.appendChild(li);
        file.clickDir.parentNode.appendChild(ul);
    }
}

function clickNewFileEnsureButton(e) {
    var newFile = document.getElementById("temp_input").value;
    if (newFile.indexOf(".") == -1) {
        newFile = newFile + '.txt';
        alert(newFile);
    }

    ajax({
        url: "NewFile.Action",
        type: "POST",
        async: true,
        data: {
            dirPath: file.clickDir.getAttribute("title"),
            newFileName: newFile
        },
        success: function (data) {
            data = JSON.parse(data);
            if (data.msg === true) {
                alert("成功新建文件：" + newFile);
                e.parentNode.parentNode.removeChild(e.parentNode);
                var li = document.createElement("li");
                var div = document.createElement("div");
                img = document.createElement('img');
                div.setAttribute("onclick", "file.fileOpen(this);");
                img.setAttribute("src", "WebRoot/image/file.png");
                div.appendChild(img);
                div.style.marginLeft = "16px";
                var span = document.createElement("span");
                span.innerHTML = newFile;
                div.setAttribute("title", file.clickDir.getAttribute("title") + "\\" + newFile);
                div.appendChild(span);
                li.appendChild(div);
                file.clickDir.setAttribute("childrenSum", file.clickDir.getAttribute("childrenSum") + 1);
                file.clickDir.style.marginLeft = "";
                file.clickDir.firstElementChild.src = "WebRoot/image/dtri.png";
                file.clickDir.nextElementSibling.appendChild(li);
            } else {
                alert("新建文件失败：文件名重复，无效或者太长"); //文件夹名不能为点.不能太长
            }
        }
    });
}

file.deleteDir = function (e) {
    if (file.clickDir.getAttribute("title") != ".") {
        if (confirm("确定删除该文件夹吗？") == true) {
            var right_click_menu = document.getElementById("right_click_menu");
            right_click_menu.style.display = "none";
            ajax({
                url: "DeleteDir.Action",
                type: "POST",
                async: true,
                data: {
                    dirPath: file.clickDir.getAttribute("title"),
                },
                success: function (data) {
                    data = JSON.parse(data);
                    var dirparentDir = file.clickDir.parentNode.parentNode.previousElementSibling;
                    addressBar.modifyAddress(dirparentDir);
                    dirparentDir.style.background = "#AAAAAA";
                    dirparentDir.setAttribute("childrenSum", dirparentDir.getAttribute("childrenSum") - 1);
                    if (dirparentDir.getAttribute("childrenSum") == 0) {
                        dirparentDir.firstElementChild.src = "";
                        dirparentDir.style.marginLeft = "16px";
                    }
                    file.clickDir.parentNode.parentNode.removeChild(file.clickDir.parentNode);
                    alert("成功删除文件夹：" + file.clickDir.getAttribute("title"));
                }
            });
        } else
            return false;
    } else {
        document.getElementById("right_click_menu").style.display = "none";
    }
}

file.deleteFile = function (e) {
    if (confirm("确定删除该文件吗？") == true) {
        var delete_file = e.getAttribute("name");
        ajax({
            url: "DeleteFile.Action",
            type: "POST",
            async: true,
            data: {
                filePath: e.getAttribute("name"),
            },
            success: function (data) {
                data = JSON.parse(data);
                addressBar.modifyAddress(file.clickDir);
                file.clickDir.style.background = "#AAAAAA";
                var tools = document.getElementById("tools");
                tools.style.display = "none";
                var show_img_div = document.getElementById("show_img_div");
                show_img_div.style.display = "none";
                var show_text = document.getElementById("show_text");
                show_text.style.display = "none";
                var welcome_div = document.getElementById("welcome_div");
                welcome_div.style.display = "block";
                var fileparentdiv = file.clickFileDiv.parentNode.parentNode.previousElementSibling;
                fileparentdiv.setAttribute("childrenSum", fileparentdiv.getAttribute("childrenSum") - 1);
                if (fileparentdiv.getAttribute("childrenSum") == 0) {
                    fileparentdiv.firstElementChild.src = "";
                    fileparentdiv.style.marginLeft = "16px";
                }
                file.clickFileDiv.parentNode.parentNode.removeChild(file.clickFileDiv.parentNode);
                alert("成功删除文件：" + e.getAttribute("name"));
            }
        });
    } else {
        return false;
    }
}

file.uploadFile = function (e) {
    if (file.clickDir.getAttribute("state") == "off")
        tree.opendir(file.clickDir);
    var dataFile = e.dataTransfer.files[0];
    var fr = new FileReader();
    fr.readAsArrayBuffer(dataFile);
    fr.onload = function () {
        var fileContent = fr.result;
        var arr = new Int8Array(fileContent);
        ajax({
            url: "UpLoadFile.Action",
            type: "POST",
            async: true,
            data: {
                dirPath: file.clickDir.getAttribute("title"),
                fileName: dataFile.name,
                fileContent: new String(arr)
            },
            success: function (data) {
                data = JSON.parse(data);
                if (data.msg == true) {
                    alert("上传文件成功！");
                    var li = document.createElement("li");
                    var div = document.createElement("div");
                    img = document.createElement('img');
                    div.setAttribute("onclick", "file.fileOpen(this);");
                    file.clickDir.setAttribute("childrenSum", file.clickDir.getAttribute("childrenSum") + 1);
                    img.setAttribute("src", "WebRoot/image/file.png");
                    div.appendChild(img);
                    div.style.marginLeft="16px";
                    var span = document.createElement("span");
                    span.innerHTML = dataFile.name;
                    div.setAttribute("title", file.clickDir.getAttribute("title") + "\\" + dataFile.name);
                    div.appendChild(span);
                    li.appendChild(div);
                    file.clickDir.setAttribute("state", "on");
                    file.clickDir.firstElementChild.src = "WebRoot/image/dtri.png";
                    file.clickDir.nextElementSibling.appendChild(li);
                    if (dataFile.name.match("jpg") || dataFile.name.match("png") || dataFile.name.match("PNG") ||
                        dataFile.name.match("txt") || dataFile.name.match("html") || dataFile.name.match("css") ||
                        dataFile.name.match("js") || dataFile.name.match("java"))
                        file.fileOpen(div);
                } else
                    alert("重复！请重命名文件名");
            }
        });
    }

}