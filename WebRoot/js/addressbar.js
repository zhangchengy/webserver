var addressBar = function () {};
addressBar.modifyAddress = function (e) { //根据点击树的结点来改变地址栏url的显示
    document.oncontextmenu = function () {
        return false;
    }
    var stateObject = {
        id: count
    };
    var newUri = e.getAttribute("title");
    history.pushState(stateObject, "", "./SendFilePath.Action?Path=" + newUri.substring(1).replace(/\\/g, "/"));
    count++;
}

addressBar.getAddressBarNode = function () { //根据输入到地址的url来发请求到后端一次性获取所有有关的结点
    var uri = decodeURI(window.location.href);
    var n = uri.indexOf("=");
    if (uri.match("SendFilePath.Action") && uri.match("\\?") && n != -1) {
        var Path = uri.substring(n + 1);
        if (Path != "") {
            ajax({
                url: "AddressBarDirList.Action",
                type: "POST",
                async: true,
                data: {
                    Path: Path
                },
                success: addressBar.setFileNode
            });
        }
    }
}

addressBar.setFileNode = function (data) {
    data = JSON.parse(data);
    for (var i = data.dirs.length - 1; i >= 0; i--) {
        var div = document.getElementById("result").getElementsByTagName("div");
        for (var j = 0; j < div.length; j++) {
            if (div[j].getAttribute("title") == (data.dirs[i].replace(new RegExp("/", "g"), "\\"))) {
                if ((i == 0 && div[j].getAttribute("state")) || i > 0) {
                    var ul = document.createElement("ul");
                    div[j].setAttribute("asked", "yes");
                    div[j].setAttribute("state", "on");
                    if (div[j].getAttribute("childrenSum") !=0)
                        div[j].firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
                    for (var k = 0; k < data.filess[i].length; k++) {
                        if (data.filess[i][k].directory === true) {
                            ul.appendChild(addressBar.setNode(data.filess[i][k]));
                        }
                    }
                    for (var k = 0; k < data.filess[i].length; k++) {
                        if (data.filess[i][k].directory !== true) {
                            ul.appendChild(addressBar.setNode(data.filess[i][k]));
                        }
                    }
                    div[j].parentNode.appendChild(ul);
                } else {
                    file.fileOpen(div[j]);
                }
                if (i == 0) {
                    div[j].style.background = "#AAAAAA";
                    if (div[j].getAttribute("state")) file.clickDir = div[j];
                }
            }
        }
    }
}
addressBar.setNode = function (data) {
    var li = document.createElement("li");
    var newdiv = document.createElement("div");
    var img = document.createElement('img');
    if (data.directory == true) {
        if (data.childrenSum !=0) {
            img.setAttribute("src", "WebRoot/image/ztri.png");
            
        } else {
            newdiv.style.marginLeft="16px";
            img.setAttribute("src", "");
           
        }
        newdiv.setAttribute("childrenSum", data.childrenSum);
        newdiv.appendChild(img);
        img = document.createElement('img');
        newdiv.setAttribute("onclick", "tree.opendir(this);");
        newdiv.setAttribute("state", "off");
        newdiv.setAttribute("asked", "no");
        img.setAttribute("src", "WebRoot/image/dir.png");
    } else {
        newdiv.style.marginLeft="16px";
        newdiv.setAttribute("onclick", "file.fileOpen(this);");
        img.setAttribute("src", "WebRoot/image/file.png");
    }
    newdiv.appendChild(img);
    var span = document.createElement("span");
    span.innerHTML = data.fileName;
    newdiv.setAttribute("title", data.filePath);
    newdiv.appendChild(span);
    li.appendChild(newdiv);
    return li;
}