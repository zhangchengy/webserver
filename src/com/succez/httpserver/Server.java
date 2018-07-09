package com.succez.httpserver;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.succez.httpserver.ExitThread;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class Server {

	//logger为slf4j日志常量
	private static final Logger logger = LoggerFactory.getLogger(Server.class);

	//端口
	public static final int PORT = 80;

	//线程池pool
	private ExecutorService service = Executors.newCachedThreadPool();

	//服务器Socket
	private ServerSocket serverSocket;

	//客户端Socket
	private Socket client;

	/**
	 * 初始化函数
	 * 
	 */
	public void service() {
		try {
			serverSocket = new ServerSocket(PORT);
		}
		catch (IOException e) {
			logger.error("无法启动HTTP服务器：", e);
			return;
		}
	//	logger.info("HTTP服务器正在运行，端口：" + PORT);
		new ExitThread(service).start();//检测端口
		while (true) {
			try {
				client = serverSocket.accept();
	//			logger.info("客户端" + client.getInetAddress().getHostAddress() + "请求访问");
				service.execute(new ProcessThread(client));
			}
			catch (IOException e) {
				logger.error("监听出异常", e);
			}
		}
	}

	/**
	 * 主函数
	 * 
	 */
	public static void main(String[] args) {
		new Server().service();
	}

}
