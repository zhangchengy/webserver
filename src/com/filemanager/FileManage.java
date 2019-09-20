package com.filemanager;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.httpserver.ReadWebXml;
import com.httpserver.Request;
import com.httpserver.Response;

import net.sf.json.JSONObject;

public class FileManage {
	private static final Logger logger = LoggerFactory.getLogger(FileManage.class);
	// 储存文件(夹)对象
	ArrayList<FileBean> filess = new ArrayList<FileBean>();
	private String rootDir;
	private Request request;
	private Response response;
	ReadWebXml readWebXml;
	public FileManage(Request request,Response response) throws Exception {
		this.request=request;
		this.response=response;
		readWebXml=new ReadWebXml();
		setRootdir();		
	}

	public void setRootdir() {
			this.rootDir=readWebXml.getValue("root-address");	
	}

	// 保存文件
	public void saveFile() throws IOException {
		String path = request.getParameter("filePath");
		String content = request.getParameter("fileContent");
		File file = new File(path);
		BufferedWriter writer = null;
		JSONObject obj = new JSONObject();
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(content);
			writer.flush();
			writer.close();
			obj.put("msg", true);
			
		} catch (IOException e) {
			logger.error("IO错误", e);
			obj.put("msg", false);
			 
		} finally {
			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {
					logger.error("输出流关闭错误", e);
				}
			}
			response.sendResponse(obj.toString().getBytes("UTF-8"));
		}
		
	}

	// 打印指定目录下文件及文件夹
	public void listDir() throws IOException {
		String dir=request.getParameter("dirPath");
		filess.clear();
		File file;
		JSONObject obj = new JSONObject();
		if (".".equals(readWebXml.getValue("root-directory-address")))
			file = new File(rootDir);
		else
			file = new File(dir);
		File[] files = file.listFiles();
		for (File f : files) {
			FileBean myFile = new FileBean();
			myFile.setFileName(f.getName());
			myFile.setFilePath(f.getPath());
			Long fileModified = f.lastModified();
			Date date = new Date(fileModified);
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String lastModify = simpleDateFormat.format(date);
			myFile.setLastModify(lastModify);
			myFile.setSize(f.length());
			if (f.isDirectory()) {
				myFile.setDirectory(true);
			} else {
				myFile.setDirectory(false);
				
			}
			filess.add(myFile);
		}
		 obj.put("files", filess);
		 response.sendResponse(obj.toString().getBytes("UTF-8"));
	}

	// 返回文件内容
	public void sendContent() throws IOException {
		String filepath = request.getParameter("filePath");
		File file=new File(filepath);
		
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
		} catch (IOException e) {
			logger.error("读入文件输出异常", e);
			response.sendResponse(("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes());

		} finally {
			if (fis != null) {
				fis.close();
			}
		}
		response.sendResponse(b);
	}
	
	public void fileDownload() throws IOException{
		String filepath = request.getParameter("filePath");
		File file=new File(filepath);
		response.addHeader("Content-Disposition",
				"attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
		sendContent();
	}
}
