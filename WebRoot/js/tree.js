//该函数用来获取当前目录下所有文件(夹)
var count = 0;
var Tree = function () {};
Tree.rootTree = function () { //初始化树
    ajax({
        url: "http://localhost/DirList.Action",
        type: "POST",
        async: true,
        data: {
            dirPath: "."
        },
        success: Tree.showTree
    });
}

Tree.showTree = function (data) { //显示树的目录
    data = JSON.parse(data);
    tree = document.getElementById("tree");
    for (var j = 0, len = data.files.length; j < len; j++) {
        if (data.files[j].directory === true)
            tree.appendChild(Tree.setNode(data, j));
    }
    for (var j = 0, len = data.files.length; j < len; j++) {
        if (data.files[j].directory !== true)
            tree.appendChild(Tree.setNode(data, j));
    }
   // AddressBar.findAddressNode();
}
Tree.setNode = function (data, j) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    var img = document.createElement('img');

    if (data.files[j].directory === true) {
        img.setAttribute("src", "http://localhost:80/WebRoot/image/ztri.png");
        div.appendChild(img);
        img = document.createElement('img');
        div.setAttribute("onclick", "Tree.opendir(this);");
        div.setAttribute("state", "off");
        div.setAttribute("asked", "no");
        img.setAttribute("src", "http://localhost:80/WebRoot/image/dir.png");
    } else {
        div.setAttribute("onclick", "File.fileOpen(this);");
        img.setAttribute("src", "http://localhost:80/WebRoot/image/file.png");
    }
    div.appendChild(img);
    var span = document.createElement("span");
    span.innerHTML = data.files[j].fileName;
    div.setAttribute("title", data.files[j].filePath);
    div.appendChild(span);
    li.appendChild(div);
    return li;
}

Tree.opendir = function (e) {
    var rootDirNode=document.getElementById("rootDirNode");
    rootDirNode.style.background="";
    var right_click_menu_div = document.getElementById("right_click_menu");
    right_click_menu_div.style.display="none";
    var args = arguments.length;
    var e = arguments[0];
    if (args > 1) {
        var n = arguments[2];
        var uris = new Array();
        for (var i = 0; i < arguments[1].length; i++)
            uris[i] = arguments[1][i];
    } else {
        //当点击文件夹选中后，会发生监听鼠标右键事件，可以在右键选择新建子文件夹，删除本文件夹，在文件夹下建立新文件

        var stateObject = {
            id: count
        };
        var newUri = e.getAttribute("title").substring(1);
        history.pushState(stateObject, "", "#"+newUri);
        count++;
    }
    var tools = document.getElementById("tools");
    tools.style.display="none";
    var welcome_div = document.getElementById("welcome_div");
    welcome_div.style.display="block";
    var div = result.getElementsByTagName("div");
    for (var i = 0; i < div.length; i++)
        div[i].style.background = "";
    e.style.background = "#dddddd";
    var save_file = document.getElementById("down_file");
    var down_file = document.getElementById("save_file");
    save_file.style.display = "none";
    down_file.style.display = "none";
    var show_text = document.getElementById("show_text");
    show_text.style.display = "none";
    var show_img_div = document.getElementById("show_img_div");
    show_img_div.style.display = "none";
    if (e.getAttribute("asked") === "no") {
        e.firstElementChild.setAttribute("src", "http://localhost:80/WebRoot/image/dtri.png");
        ajax({
            url: "http://localhost/DirList.Action",
            type: "POST",
            async: true,
            data: {
                dirPath: e.getAttribute("title")
            },
            success: openChildDir
        });

        function openChildDir(data) {
            data = JSON.parse(data);
            var ul = document.createElement("ul");
            for (var j = 0, len = data.files.length; j < len; j++) {
                if (data.files[j].directory === true)
                    ul.appendChild(Tree.setNode(data, j));
            }
            for (var j = 0, len = data.files.length; j < len; j++) {
                if (data.files[j].directory !== true)
                    ul.appendChild(Tree.setNode(data, j));
            }
            e.parentNode.appendChild(ul);
            if (args > 1 && uris.length > n) {
                div = e.nextSibling.getElementsByTagName("div");
                for (var i = 0; i < div.length; i++) {
                    if (div[i].getAttribute("title") === uris[n]) {
                        if (div[i].getAttribute("onclick") != "File.fileOpen(this);") {
                            Tree.opendir(div[i], uris, n + 1);
                            break;
                        } else {
                            File.fileOpen(div[i]);
                        }
                    }
                }
            }
            if (args == 1 || uris.length == n) {
                document.oncontextmenu = function () {
                    return false;
                }
                e.oncontextmenu = function () {
                   File.showRightClickMenu(e);
                }
            }
        }
        e.setAttribute("asked", "yes");
        e.setAttribute("state", "on");
    } else {
        if (e.getAttribute("state") === "off") {
            e.firstElementChild.setAttribute("src", "http://localhost:80/WebRoot/image/dtri.png");
            e.nextSibling.style.display = "block";
            e.setAttribute("state", "on");
        } else {
            e.firstElementChild.setAttribute("src", "http://localhost:80/WebRoot/image/ztri.png");
            e.nextSibling.style.display = "none";
            e.setAttribute("state", "off");
        }
    }
}

Tree.rootDirNode=function(e){   
    var div = document.getElementById("tree").getElementsByTagName("div");
    for (var i = 0; i < div.length; i++)
        div[i].style.background = "";
   // var rootDirNode=document.getElementById("rootDirNode");
    e.style.background="#dddddd";
    if(e.getAttribute("state")=="on"){
        document.getElementById("tree").style.display="none";
        e.setAttribute("state","off");
    }else{
        document.getElementById("tree").style.display="block";
        e.setAttribute("state","on");
    }
}

window.onload = function () {
    Tree.rootTree();   
}