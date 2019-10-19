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
 * @createdate 2019年9月12日
 */

public class ProcessThread implements Runnable {

	private static final Logger logger = LoggerFactory.getLogger(ProcessThread.class);

	private Socket client;

	private CenterServlet centerServlet;
	public ProcessThread(Socket client,CenterServlet centerServlet) {
		super();
		this.client = client;
		this.centerServlet=centerServlet;
	}

	public void run() {
		InputStream inputStream = null;
		try {
			inputStream = client.getInputStream();
		}
		catch (IOException e) {
			logger.error("建立客户端输入数据流错误:",e);
		}
		try {
			while (inputStream.available() == 0) {
				Thread.sleep(20);
			}
		}
		catch (IOException | InterruptedException e) {
			logger.error("等待时间过长，未接收数据",e);
		}

		try {
			if (inputStream.available() != 0) {
				centerServlet.service(client.getOutputStream(), inputStream);
			}
		}
		catch (Exception e) {
			logger.error("建立客户端输出数据流错误",e);
		}
		try {
			client.close();
		}
		catch (IOException e) {

			logger.error("关闭连接出错",e);
		}
	}
}