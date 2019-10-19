package com.httpserver;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.httpserver.ExitThread;

/**
 * 用于开启服务器的主类
 * <p>Copyright: Copyright (c) 2019</p>
 * @author zhangchengy
 * @createdate 2019年9月12日
 */
public class Server {

	// logger为slf4j日志常量
	private static final Logger logger = LoggerFactory.getLogger(Server.class);

	// 端口
	public static final int PORT = 80;
	// 线程池pool
	private ExecutorService service = Executors.newCachedThreadPool();

	// 服务器Socket
	private ServerSocket serverSocket;

	// 客户端Socket
	private Socket client;
	private CenterServlet centerServlet;
	/**
	 * 初始化函数
	 * 
	 */
	public void service() {
		try {
			centerServlet=new CenterServlet(new FilterMapping(),new ReadWebXml(),new ClassPathXmlApplicationContext());
		}
		catch (Exception e1) {
			// TODO Auto-generated catch block
			logger.error("读取配置文件错误",e1);
		}
		try {
			serverSocket = new ServerSocket(PORT);
		} catch (IOException e) {
			logger.error("无法启动HTTP服务器：", e);
			return;
		}
		logger.info("HTTP服务器正在运行，端口：" + PORT);
		new ExitThread(service).start();
		while (true) {
			try {
				client = serverSocket.accept();
				logger.info("客户端" + client.getLocalSocketAddress() + "请求访问");
				service.execute(new ProcessThread(client,centerServlet));
			} catch (IOException e) {
				logger.error("监听出异常", e);
			}
		}
	}

	/**
	 * 主函数
	 * @throws Exception 
	 * 
	 */
	public static void main(String[] args) throws Exception {	
		new Server().service();
	}
}
