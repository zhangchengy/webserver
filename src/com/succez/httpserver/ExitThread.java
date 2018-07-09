package com.succez.httpserver;

import java.util.Scanner;
import java.util.concurrent.ExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExitThread extends Thread {

	//logger为slf4j日志常量
	private static final Logger logger = LoggerFactory.getLogger(ExitThread.class);

	private ExecutorService service;

	//把线程池对象传进来
	public ExitThread(ExecutorService service) {
		this.service = service;
	}

	public void run() {
		Scanner sc = new Scanner(System.in);
		String s = sc.nextLine();
		while (true) {
			if ("exit".equalsIgnoreCase(s)) {
				this.service.shutdown();
				logger.info("开始 ！");
				if (this.service.isTerminated()) {
					sc.close();
					logger.info("程序结束！！");
					System.exit(0);
				}
				try {
					Thread.sleep(1000);
				}
				catch (InterruptedException e) {
					logger.error("失败！");
				}
			}

		}
	}

}
