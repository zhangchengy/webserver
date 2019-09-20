//该函数用来获取当前目录下所有文件(夹)
var Tree = function () {};
Tree.rootTree = function () { //初始化树
    ajax({
        url: "User/DirAction",
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
}
Tree.setNode = function (data, j) {
    var li = document.createElement("li");
    var div=document.createElement("div");
    var img = document.createElement('img');

    if (data.files[j].directory === true) {
        img.setAttribute("src", "WebRoot/image/ztri.png");
        div.appendChild(img);
        img = document.createElement('img');
        div.setAttribute("onclick", "Tree.opendir(this);");
        div.setAttribute("state", "off");
        div.setAttribute("asked", "no");
        img.setAttribute("src", "WebRoot/image/dir.png");
    } else {
        div.setAttribute("onclick", "File.fileOpen(this);");
        img.setAttribute("src", "WebRoot/image/file.png");
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
        e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
        ajax({
            url: "User/DirAction",
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
        }
        e.setAttribute("asked", "yes");
        e.setAttribute("state", "on");
    } else {
        if (e.getAttribute("state") === "off") {
            e.firstElementChild.setAttribute("src", "WebRoot/image/dtri.png");
            e.nextSibling.style.display = "block";
            e.setAttribute("state", "on");
        } else {
            e.firstElementChild.setAttribute("src", "WebRoot/image/ztri.png");
            e.nextSibling.style.display = "none";
            e.setAttribute("state", "off");
        }
    }
}

window.onload = function () {
    Tree.rootTree();
}