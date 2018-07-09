package com.succez.httpserver;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.json.JSONObject;

public class Response {

	//logger为slf4j日志常量
	private static final Logger logger = LoggerFactory.getLogger(Response.class);

	//待输出的报文流
	private OutputStream outputStream;

	//此次请求
	private Request request;

	//http协议的版本
	private String httpVersion;

	//http协议的响应状态 ，如200
	private int status;

	//http响应头的响应消息，如OK
	private String message;

	//响应头
	private Map<String, String> headers;

	ArrayList<MyFile> filess = new ArrayList<MyFile>();

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getHttpVersion() {
		return httpVersion;
	}

	public void setHttpVersion(String httpVersion) {
		this.httpVersion = httpVersion;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public void addHeader(String name, String value) {
		this.headers.put(name, value);
	}

	public void setHeader(String name, String value) {
		this.headers.replace(name, value);
	}

	/**
	 * 有参构造函数,并设置默认的函数，有需求时再调整
	 * 
	 * @param outputStream
	 */
	public Response(OutputStream outputStream, Request request) {
		this.outputStream = outputStream;
		this.request = request;
		this.httpVersion = "HTTP/1.1";
		this.status = 200;
		this.message = "OK";
		this.headers = new LinkedHashMap<String, String>();
	}

	//把响应头转换为响应的字符串
	public String getParseResponse() {
		String respMes = this.httpVersion + " " + this.status + " " + this.message + "\r\n";
		if (!"User/FileDownload".equalsIgnoreCase(request.getUri())) {
			this.setContentType(request.getUri());
		}
		for (String key : this.headers.keySet()) {
			respMes = respMes + key + ": " + this.headers.get(key) + "\r\n";
		}
		return respMes + "\r\n";
	}

	/**
	 *  获取输出报文流
	 */
	public OutputStream getOutputStream() {
		return outputStream;
	}

	
	public void setOutputStream(OutputStream outputStream) {
		this.outputStream = outputStream;
	}

	
	
	public String saveFile(String path, String content) {
		File file = new File(path);
		BufferedWriter writer = null;
		JSONObject obj = new JSONObject();
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(content);
			writer.flush();
			writer.close();
			obj.put("msg", true);
			return obj.toString();
		}
		catch (IOException e) {
			logger.error("IO错误", e);
			 obj.put("msg", false);
			return obj.toString();
		}
		finally {
			if (writer != null) {
				try {
					writer.close();
				}
				catch (IOException e) {
					logger.error("输出流关闭错误", e);
				}
			}
		}
	}

	public String listRoot() {	
		filess.clear();
		JSONObject obj = new JSONObject();
		findFile(".", 0);
		obj.put("files", filess);
		return obj.toString();
	}

	public void findFile(String path, int level) {
		File file = new File(path);
		File[] files = file.listFiles();
		for (File f : files) {
			MyFile myFile = new MyFile();
			myFile.setFileName(f.getName());			
			myFile.setFilePath(f.getPath());
			Long fileModified = f.lastModified();
			Date date = new Date(fileModified);
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String lastModify = simpleDateFormat.format(date);
			myFile.setLastModify(lastModify);
			myFile.setLevel(level);
			myFile.setSize(f.length());
			if (f.isDirectory()) {
				myFile.setDirectory(true);
				filess.add(myFile);
				findFile(f.getPath(), level + 1);
			} else {
				myFile.setDirectory(false);
				filess.add(myFile);
			}
		}
	}
	
	
	public void setContentType(String uri) {
		String[] filetypes = uri.split("\\.");
		int index = filetypes[filetypes.length - 1].indexOf('?');
		String filetype = ((index != -1) ? filetypes[filetypes.length - 1].substring(0, index)
				: filetypes[filetypes.length - 1]);
		switch (filetype.toLowerCase()) {
			case "html":
				this.headers.put("Content-Type", "text/html;charset=UTF-8");
				break;
			case "js":
				this.headers.put("Content-Type", "application/javascript;charset=UTF-8");
				break;
			case "css":
				this.headers.put("Content-Type", "text/css;charset=UTF-8");
				break;
			case "txt":
				this.headers.put("Content-Type", "text/plain;charset=UTF-8");
				break;
			case "jpg":
				this.headers.put("Content-Type", "image/jpeg");
				break;
			case "png":
				this.headers.put("Content-Type", "image/png");
				break;
			case "ico":
				this.headers.put("Content-Type", "image/x-icon");
				break;
			default:
				this.headers.put("Content-Type", "text/html;charset=UTF-8");
				break;
		}
	}

	public void sendContent(File file) throws IOException {
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			byte[] b = new byte[256];
			int read;
			while ((read = fis.read(b)) != -1) {
				outputStream.write(b, 0, read);
			}
		}
		catch (IOException e) {
			logger.error("读入文件输出异常", e);
		}
		finally {
			if (fis != null) {
				fis.close();
			}
		}
	}

	
	public void sendResponse() throws IOException {
		//url为不带请求参数的地址
		if (request.getUrl().equalsIgnoreCase("User/ListAction")) {
			String json=listRoot();
			outputStream.write(this.getParseResponse().getBytes("UTF-8"));
			outputStream.write(json.getBytes("UTF-8"));
		}
		else if (request.getUri().equalsIgnoreCase("User/FileDownload")) {
			String path = request.getParameter("filePath");
			File file = new File(path);
			//设置文件下载相关的响应头			
			addHeader("Content-Type", "application/octet-stream");
			addHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
			outputStream.write(getParseResponse().getBytes("UTF-8"));
			sendContent(file);
		}
		
		else if (request.getUri().equalsIgnoreCase("User/LoginAction")) {
			String username = request.getParameter("username");
			String password = request.getParameter("password");
			
			addHeader("Content-Type", "application/octet-stream");
			addHeader("Content-Disposition", "attachment");
			outputStream.write(getParseResponse().getBytes("UTF-8"));
			outputStream.write(username.getBytes("UTF-8"));outputStream.write(password.getBytes("UTF-8"));
		}
		else if (request.getUrl().equalsIgnoreCase("User/FileSave")) {
			String path = request.getParameter("filePath");
			String content = request.getParameter("fileContent");
			
			
			outputStream.write(this.getParseResponse().getBytes("UTF-8"));
			outputStream.write(saveFile(path, content).getBytes("UTF-8"));
		}
		else {
			File file = null;
			if ("".equalsIgnoreCase(request.getUrl()))
				file = new File("WebRoot/list.html");
			else {
				file = !"XMLHttpRequest".equalsIgnoreCase(request.getHeader("x-requested-with"))
						? new File(request.getUri()) : new File(request.getUri());//三目表达式
			}
			if (file.exists()) {
				try {
					if (!file.isDirectory()) {
					//文件就上传文件内容
						System.out.println(request.getUrl());
						this.outputStream.write(getParseResponse().getBytes("UTF-8"));
						this.sendContent(file);
					}
				}
				catch (Exception e) {
					logger.error("目录不存在！！！");
				}

			}
			else {
				this.setStatus(404);
				this.setMessage("File Not Find");
				outputStream.write(this.getParseResponse().getBytes("UTF-8"));
				outputStream.write("<h1>404 错误！！！</h1>".getBytes("UTF-8"));
				outputStream.flush();
			}
		}
	}
}
