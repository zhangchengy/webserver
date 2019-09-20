package com.httpserver;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Response {

	private static final Logger logger = LoggerFactory.getLogger(Response.class);

	private OutputStream outputStream;
	
	private Request request;
	
	private String httpVersion;

	private int status;

	private String message;

	private Map<String, String> headers;

	public void setMessage(String message) {
		this.message = message;
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

	public Response(OutputStream outputStream, Request request){
		this.outputStream = outputStream;
		this.request = request;
		this.httpVersion = "HTTP/1.1";
		this.status = 200;
		this.message = "OK";
		this.headers = new HashMap<String, String>();
	}

	//把响应头转换为响应的字符串
	public String getParseResponse() {
		String respMes = this.httpVersion + " " + this.status + " " + this.message + "\r\n";		
			this.setContentType(request.getUri());
		for (String key : this.headers.keySet()) {
			respMes = respMes + key + ": " + this.headers.get(key) + "\r\n";
		}
		return respMes + "\r\n";
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
		
	public void sendResponse(byte[] b) throws IOException {
		//url为不带请求参数的地址
		if(b!=null){
		outputStream.write(getParseResponse().getBytes("UTF-8"));
		outputStream.write(b);}
		else{
			logger.error("outputStream写入数据为空");
		}
	}
}
