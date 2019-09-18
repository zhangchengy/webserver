package com.httpserver;

import java.util.Scanner;
import java.util.concurrent.ExecutorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 用于管理线程以及关闭服务器的主类
 * <p>Copyright: Copyright (c) 2018</p>
 * <p>succez</p>
 * @author zhangchengy
 * @createdate 2018年7月10日
 */
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
				if (this.service.isTerminated()) {//调用shutdown方法后且完成任务则返回true
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
