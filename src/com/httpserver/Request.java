package com.httpserver;

import java.io.BufferedReader;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 用于解析http请求的报文信息，获取参数
 * <p>Copyright: Copyright (c) 2019</p>
 * <p>succez</p>
 * @author zhangchengy
 * @createdate 2019年9月12日
 */
public class Request {

	// logger为slf4j日志常量
	private static final Logger logger = LoggerFactory.getLogger(Request.class);

	// 存储头部信息的Map形式
	private Map<String, String> headMap = new LinkedHashMap<String, String>();

	// 存储请求的参数信息的map形式
	private Map<String, String> parameterMap = new LinkedHashMap<String, String>();

	// 输入的请求报文流
	private InputStream inputStream;

	// 用来存储报文的字符串形式
	private String messageString;

	// 用来存储客户请求的URI地址
	private String url;

	// 用来存储请求的是用什么方法
	private String method;

	// 用来存储协议
	private String protocol;

	public String getUrl() {
		return this.url;
	}

	public String getProtocol() {
		return this.protocol;
	}

	public String getUri()  {
		if (url.contains("?")) {
			int index = url.indexOf('?');
			return url.substring(0, index);
		} else
			return url;
	}

	public Request(InputStream inputStream) throws IOException {
		super();
		this.inputStream = inputStream;
		init();

	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public Map<String, String> getHeadMap() {
		return headMap;
	}
	
	public Map<String, String> getParameterMap() {
		return parameterMap;
	}

	public String getMethod() {
		return this.method;
	}

	public String getMessageString() {
		return this.messageString;
	}

	public void handleRequestLine(String line) {
		// 以下代码设置方法
		try {
			line=URLDecoder.decode(line, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		method = line.substring(0, line.indexOf(" "));
		//只读取http request第一行
		// 以下代码用来设置url
		int index1 = 0;
		int index2 = 0;
		index1 = line.indexOf(' ');
		if (index1 != -1) {
			index2 = line.indexOf(' ', index1 + 1);
			if (index2 > index1) {
				url = line.substring(index1 + 2, index2);
			} else
				url = null;
		}
		// 以下代码用来设置get请求的参数
		if ("get".equalsIgnoreCase(getMethod()) && (line.indexOf('?') != -1)) {
			String query = new String(url);
			// index为问号的位置
			int index = query.indexOf('?');
			if (index != -1) {
				query = query.substring(index + 1);
				this.parameterMap = getMapPara(query);
			}
		}
		// 以下代码用来设置协议
		this.protocol = line.substring(index2);
	}

	public void handleHeader(String line) {
		
		String[] splits = line.split(": ");
		if (splits.length > 1) {
			headMap.put(splits[0], splits[1]);
		}
	}

	public void handlePostData(BufferedReader reader) throws IOException {
		int length = 0;
		if ("post".equalsIgnoreCase(getMethod()) && (length = Integer.parseInt(getHeader("Content-Length"))) != 0) {
			char[] chars = new char[length];
			reader.read(chars);
			messageString = new String(chars, 0, length);
			this.parameterMap = getMapPara(messageString.trim());
			
		}
	}

	/**
	 * 对请求进行解析
	 * 
	 */
	private void init() {
		try {
			InputStreamReader inr = new InputStreamReader(this.inputStream);
			BufferedReader reader = new BufferedReader(inr);

			if (!reader.ready()) {
				logger.error("输入流没有准备好！！！");
				return;
			}
			
			handleRequestLine(reader.readLine());

			String line = null;
			while (!("".equals(line = reader.readLine()))) {
				handleHeader(line);
			}
			handlePostData(reader);

		} catch (UnsupportedEncodingException e) {
			logger.error("不支持的编码格式！！！", e);
		} catch (IOException e) {
			logger.error("IO错误！！！", e);
		}
	}

	public Map<String, String> getMapPara(String para) {
		if (para != null) {
			String[] pairs = para.split("&");
			Map<String, String> query_pairs = new LinkedHashMap<String, String>();
			for (String pair : pairs) {
				int idx = pair.indexOf("=");				
					query_pairs.put(pair.substring(0, idx),
							pair.substring(idx + 1));
			}
			
			return query_pairs;
		}
		return null;
	}

	public String getHeader(String name) {
		for (String key : headMap.keySet()) {
			if (key.equals(name)) {
				return headMap.get(key);
			}
		}
		return null;
	}

	public String getParameter(String name) {
		for (String key : parameterMap.keySet()) {
			if (key.equals(name)) {
				return parameterMap.get(key);
			}
		}
		return null;
	}
	
	public String getParameter(String name,String charset) throws UnsupportedEncodingException {
		for (String key : parameterMap.keySet()) {
			if (key.equals(name)) {
				return URLDecoder.decode(parameterMap.get(key),"UTF-8");
			}
		}
		return null;
	}
}
