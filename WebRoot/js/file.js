var File = function () {
};
File.prototype = {

    //下载文件
    downloadFile: function (filePath) {
        var filePath = filePath;
        var form = document.createElement("form");
        form.setAttribute("action", "FileDownload.Action");
        form.setAttribute("enctype",
            "application/x-www-form-urlencoded;charset=UTF-8");
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "filePath");
        input.setAttribute("value", filePath);
        form.appendChild(input);
        form.submit();
        document.body.removeChild(form);
    },

    //修改后保存文件
    saveFile: function (filePath) {
        var filePath = filePath;
        var fileContent = show_text.firstElementChild.value;
        ajax({
            url: "FileSave.Action",
            type: "POST",
            async: true,
            data: {
                filePath: filePath,
                fileContent: encodeURIComponent(fileContent)
            },
            success: function (data) {
                data = JSON.parse(data);
                if (data.msg === true)
                    alert("保存成功！");
                else
                    alert("保存失败！");
            }
        });
    },

    //获取地址栏中的文件（从根目录下的文件夹开始每层路径都获取）
    openAddressBarFile: function (func) { //根据输入到地址的url来发请求到后端一次性获取所有有关的结点
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
                    success: func
                });
            }
        }
    },

    //获取文件内容
    openFile: function (filePath) {
        if (!(filePath.match("jar") || filePath.match("class") || filePath.match("jpg") ||
                filePath.match("png") || filePath.match("gif") || filePath.match("PNG"))) {
            ajax({
                url: "FileOpen.Action",
                type: "POST",
                async: true,
                data: {
                    filePath: filePath
                },
                success: function (data) {
                    var show_text = document.getElementById("show_text");
                    show_text.firstElementChild.value = data;
                    show_text.style.display = "block";
                }
            });
        }
    },

    //获取文件夹下的所有子文件（夹）
    openFolder: function ( dirPath,func) {
      
        ajax({
            url: "DirList.Action",
            type: "POST",
            async: true,
            data: {
                dirPath: dirPath
            },
            success: func
        });
    },

    //删除文件
    deleteFile: function (filePath, func) {
        if (confirm("确定删除文件 " + filePath + " ？") == true) {
            ajax({
                url: "DeleteFile.Action",
                type: "POST",
                async: true,
                data: {
                    filePath: filePath,
                },
                success: func
            });
        } else {
            return false;
        }
    },

    //新建文件夹
    newFolder: function (newChildDir, parentDir, func) {
        ajax({
            url: "NewChildDir.Action",
            type: "POST",
            async: true,
            data: {
                dirPath: parentDir,
                newDirName: newChildDir
            },
            success: func
        });
    },

    //新建文件
    newFile: function (newFile, parentDir, func) {
        ajax({
            url: "NewFile.Action",
            type: "POST",
            async: true,
            data: {
                dirPath: parentDir,
                newFileName: newFile
            },
            success: func
        });
    },

    //删除文件夹
    deleteFolder: function (dirPath, func) {
        if (e != ".") {
            if (confirm("确定删除该文件夹吗？") == true) {
                ajax({
                    url: "DeleteDir.Action",
                    type: "POST",
                    async: true,
                    data: {
                        dirPath: dirPath,
                    },
                    success: func
                });
            } else
                return false;
        }
    },

    //上传文件
    uploadFile: function (e,dirPath, func) {
        var dataFile = e.dataTransfer.files[0];
        var fileName = dataFile.name;
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
                    dirPath: dirPath,
                    fileName: fileName,
                    fileContent: new String(arr)
                },
                success: func
            });
        }
    }

}