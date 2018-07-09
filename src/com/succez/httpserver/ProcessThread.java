package com.succez.httpserver;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


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
			while (inputStream.available() == 0) {
				try {
					Thread.sleep(20);
				}
				catch (InterruptedException e) {
					logger.error("等待失败!!!");
				}
			}
			if (inputStream.available() != 0) {
				Request request = new Request(inputStream);
				OutputStream outputStream = client.getOutputStream();
				Response response = new Response(outputStream, request);
				response.sendResponse();
			}
		}
		catch (IOException e) {
			logger.error("处理异常!", e);
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