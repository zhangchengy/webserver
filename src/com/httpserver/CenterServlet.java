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
	private Request request;
	private Response response;

	private ClassPathXmlApplicationContext ctx;
	private CenterFilter centerFilter;
	private ReadWebXml readWebXml;
	public CenterServlet(OutputStream outputStream, InputStream inputStream) throws Exception {
		this.request = new Request(inputStream);
		this.response = new Response(outputStream, request);
		readWebXml=new ReadWebXml();
		ctx = new ClassPathXmlApplicationContext(this.request, this.response);
		centerFilter =new CenterFilter();
	}

	public void service() throws Exception {
		String uri=request.getUri();
		if(uri.contains(readWebXml.getValue("filter-mapping"))){
			FilterBean action=(FilterBean) centerFilter.getFilter(uri);
			String clazz=action.getClazz();
			String methodName=action.getMethodName();
			Object obj=ctx.getBean(clazz);
			Method method=obj.getClass().getDeclaredMethod(methodName);
			method.setAccessible(true);
			method.invoke(obj);		
		}
		else{
			if("".equals(request.getUri())){
				sendStaticFile(readWebXml.getValue("welcome-file"));
			}
			else
				sendStaticFile(request.getUri());			
		}
	}
	
	public void sendStaticFile(String uri) throws IOException{
		File file=new File(uri);
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
			response.sendResponse(b);
		} catch (IOException e) {			
			response.sendResponse(("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes());
		} finally {
			if (fis != null) {
				fis.close();
			}
		}	
	}

}
