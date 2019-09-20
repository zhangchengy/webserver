package com.httpserver;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 用于实现接口完成服务器与客户端通信
 * <p>Copyright: Copyright (c) 2018</p>
 * <p>succez</p>
 * @author zhangchengy
 * @createdate 2018年7月10日
 */

public class ProcessThread implements Runnable {
	
	private static final Logger logger = LoggerFactory.getLogger(ProcessThread.class);

	private Socket client;
	
	public ProcessThread(Socket client) {
		super();
		this.client = client;
	}

	public void run() {
		try {
			InputStream inputStream = client.getInputStream();
			while (inputStream.available() == 0) {//等待响应数据的发送
				try {
					Thread.sleep(20);
				}
				catch (InterruptedException e) {
					logger.error("等待失败!!!");
				}
			}
			if (inputStream.available() != 0) {		
				OutputStream outputStream = client.getOutputStream();				
				CenterServlet centerServlet = new CenterServlet(outputStream,inputStream);
				centerServlet.service();						
			}
		}
		catch (IOException e) {
			logger.error("处理异常!", e);
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			try {
				client.close();
			}
			catch (IOException e) {
				logger.error("客户端关闭异常!", e);
			}
		}
	}
}