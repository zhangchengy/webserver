window.onload = function () {
    var fileManage = new FileManage();
    fileManage.init();
}

var FileManage = function () {};
FileManage.prototype = {
    init: function () {
        var file = new File();
        var tree = new Tree(file); //文件树
        //     tree.file = file;
        //      tree.init();
        //初始化目录树
        //     tree.clickedFolderNode = rootDirNode;
        //     file.openFolder(tree.clickedFolderNode.title, function (data) {
        //         tree.setChildrenNode(data);
        //     });

        //地址栏地址变化
        result.onclick = function (e) {
            var div;
            if (e.toElement.localName == "div") {
                div = e.toElement;
                modifyAddressBarAddress(div);
            }
            if (e.toElement.parentNode.localName == "div") {
                div = e.toElement.parentNode;
                modifyAddressBarAddress(div);
            }
        }

        //拖拽文件至目录树中的上传文件事件
        document.ondrop = function (e) {
            e.preventDefault();
        }
        document.ondragover = function (e) {
            e.preventDefault();
        }
        result.ondrop = function (e) {
            file.uploadFile(e, tree.clickedFolderNode.title,
                function (data) {
                    tree.setUploadFileNode(data);
                });
        }

        //给工具栏绑定点击事件
        down_file.onclick = function () {
            file.downloadFile(tree.clickedFileNode.title);
        }
        save_file.onclick = function () {
            file.saveFile(tree.clickedFileNode.title);
        }
        delete_file.onclick = function () {
            file.deleteFile(tree.clickedFileNode.title,
                function (data) {
                    tree.deleteFileNode(data);
                });
        }

        document.body.onclick = function () {
            if (document.getElementById("right_click_menu"))
                document.body.removeChild(right_click_menu);
        }
    }
}

//根据点击树的结点来改变地址栏url的显示
function modifyAddressBarAddress(e) {
    var count;
    document.oncontextmenu = function () {
        return false;
    }
    var stateObject = {
        id: count
    };
    var newUri = e.getAttribute("title");
    history.pushState(stateObject, "", "./SendFilePath.Action?Path=" + newUri.substring(1).replace(/\\/g, "/"));
}

//显示文件内容时文件显示区域和功能栏变化
function showFileContent(e) {
    var tools = document.getElementById("tools");
    tools.style.display = "block";
    var welcome = document.getElementById("welcome_div");
    var delete_file = document.getElementById("delete_file");
    var save_file = document.getElementById("save_file");
    var show_img_div = document.getElementById("show_img_div");
    var show_text = document.getElementById("show_text");
    welcome.style.display = "none";
    show_img_div.style.display = "none";
    save_file.style.display = "none";
    var down_file = document.getElementById("down_file");
    down_file.style.display = "block";
    down_file.setAttribute("name", e.getAttribute("title"));
    delete_file.style.display = "block";
    delete_file.setAttribute("name", e.getAttribute("title"));
    show_text.style.display = "none";
    if (e.title.match("jpg") || e.title.match("png") || e.title.match("gif") || e.title.match("PNG")) { //当打开图片时 
        img_address = e.getAttribute("title");
        show_img_div.firstElementChild.setAttribute("src", "" + img_address);
        show_img_div.style.display = "block";
        delete_file.style.marginLeft = "110px";
    } else {
        if (!(e.title.match("jar") || e.title.match("class"))) { //当打开文本时                          
            delete_file.style.marginLeft = "223px";
            var show_text = document.getElementById("show_text");
            save_file.style.display = "block";
            save_file.setAttribute("name", e.getAttribute("title"));
            show_img_div.style.display = "none";
        } else {
            show_img_div.style.display = "none";
            show_text.style.display = "none";
            welcome.style.display = "block";
            welcome.innerHTML = "此文件暂不支持查看，请下载后打开！";
            save_file.style.display = "none";
            delete_file.style.marginLeft = "110px";
        }
    }
    modifyAddressBarAddress(e);
}