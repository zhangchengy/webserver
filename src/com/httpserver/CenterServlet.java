package com.httpserver;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.filemanager.FileManage;

public class CenterServlet {
	private static final Logger logger = LoggerFactory.getLogger(Response.class);

	private Request request;
	private Response response;
	FileManage fileManage;
	
	

	public CenterServlet(OutputStream outputStream, InputStream inputStream) throws IOException {
		this.request = new Request(inputStream);
		this.response = new Response(outputStream, request);
		this.fileManage = new FileManage();
		
	}

	public void service() throws IOException {
		response.sendResponse(handler());
	}

	private byte[] handler() throws IOException {
		String json,filepath,content,dirpath;
		File file;	
		switch (request.getUri()) {
	
		case "User/DirAction":
			dirpath=request.getParameter("dirPath");
			json=fileManage.listDir(dirpath);
			return json.getBytes("UTF-8");
			
		case "User/FileDownload":
			filepath = request.getParameter("filePath");
			file = new File(filepath);
			response.addHeader("Content-Disposition",
					"attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
			return fileManage.sendContent(file);

		case "User/FileSave":
			filepath = request.getParameter("filePath");
			content = request.getParameter("fileContent");
			return fileManage.saveFile(filepath, content).getBytes("UTF-8");

		default:
			if ("".equalsIgnoreCase(request.getUrl()))
				file = new File("WebRoot/list.html");
			
			else {
				file = !"XMLHttpRequest".equalsIgnoreCase(request.getHeader("x-requested-with"))
						? new File(request.getUrl()) : new File(request.getUrl());// 三目表达式
			}
			if (file.exists()) {
				try {
					if (!file.isDirectory()) {
						return fileManage.sendContent(file);
					}
				} catch (Exception e) {
					logger.error("目录不存在！！！");
				}
			} else {
				response.setStatus(404);
				response.setMessage("File not found");
				return "<h1>404 错误！！！</h1><p>请检查地址输入是否正确</p>".getBytes("UTF-8");
			}
		}
		return null;
	}

}
