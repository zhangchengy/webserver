//该函数用来获取当前目录下所有文件(夹)
var Tree = function () {
    this.rootTree = function () { //初始化树
        ajax({
            url: "User/DirAction",
            type: "POST",
            async: true,
            data: {
                dirPath: "."
            },
            success: this.showTree
        });
    }
    this.showTree = function (data) { //显示树的目录
        data = JSON.parse(data);
        tree = document.getElementById("tree");
        for (var j = 0, len = data.files.length; j < len; j++) {
            tree.appendChild(setNode(data, j));
        }
    }
}

function setNode(data, j) {
    var li, img;
    li = document.createElement("li");
    img = document.createElement('img');
    img.setAttribute("src", "WebRoot/image/ztri.png");
    li.appendChild(img);
    img = document.createElement('img');
    if (data.files[j].directory == true) {
        li.setAttribute("onclick", "opendir(this);");
        li.setAttribute("state", "off");
        li.setAttribute("asked", "no");
        img.setAttribute("src", "WebRoot/image/dir.png");
    } else {
        li.setAttribute("onclick", "File.fileOpen(this);");
        img.setAttribute("src", "WebRoot/image/file.png");
    }
    li.appendChild(img);
    i = document.createElement("i");
    i.innerHTML = data.files[j].fileName;
    li.setAttribute("title", data.files[j].filePath);
    li.appendChild(i);
    return li;
}

function opendir(e) {
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
            ul = document.createElement("ul");
            for (var j = 0, len = data.files.length; j < len; j++) {

                ul.appendChild(setNode(data, j));
            }
            insertAfter(ul, e);
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

function insertAfter(newElement, targetElement) { //在元素后插入新元素
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

window.onload = function () {
    tree = new Tree();
    tree.rootTree();
}