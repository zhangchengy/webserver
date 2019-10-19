package com.httpserver;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CenterServlet {
	private static final Logger logger = LoggerFactory.getLogger(Response.class);
	private FilterMapping filterMapping;
	private ReadWebXml readWebXml;
	private ClassPathXmlApplicationContext cxt;
	public CenterServlet(FilterMapping filterMapping,ReadWebXml readWebXml,ClassPathXmlApplicationContext cxt) throws Exception {
		this.filterMapping = filterMapping;
		this.readWebXml = readWebXml;
		this.cxt=cxt;
	}
	
	public void service(OutputStream outputStream, InputStream inputStream) throws Exception {
		Request request = new Request(inputStream);
		Response response = new Response(outputStream, request);
		String uri=request.getUri();
		if(uri.contains(readWebXml.getValue("filter-mapping"))){
			FilterBean action=(FilterBean) filterMapping.getFilter(uri);
			String clazz=action.getClazz();
			String methodName=action.getMethodName();
			Object obj=cxt.getBean(clazz);
			Method method=obj.getClass().getDeclaredMethod(methodName,Request.class,Response.class);
			method.setAccessible(true);
			method.invoke(obj,request,response);		
		}
		else{
			if("".equals(request.getUri())){
				sendStaticFile(readWebXml.getValue("welcome-file"),response);
			}
			else
				sendStaticFile(request.getUri(),response);			
		}
	}
	
	public void sendStaticFile(String uri,Response response) throws IOException{
		File file=new File(uri);
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
			response.sendResponse(b);
		} catch (IOException e) {	
			response.setStatus(404);
			response.sendResponse(("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes());
		} finally {
			if (fis != null) {
				fis.close();
			}
		}	
	}

}
