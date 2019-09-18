package com.filemanager;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.httpserver.Response;

import net.sf.json.JSONObject;

public class FileManage {
	private static final Logger logger = LoggerFactory.getLogger(Response.class);
	// 储存文件(夹)对象
	ArrayList<FileBean> filess = new ArrayList<FileBean>();
	private String rootDir;

	public FileManage() {
		setRootdir();
	}

	public void setRootdir() {
		SAXReader reader = new SAXReader();
		try {
			Document doc = reader.read(new File("./src/root.xml"));
			Element root = doc.getRootElement();
			this.rootDir = (String) root.getData();
		} catch (DocumentException e) {
			logger.error("找不到根目录配置文件");
		}
	}

	// 保存文件
	public String saveFile(String path, String content) {
		File file = new File(path);
		BufferedWriter writer = null;
		JSONObject obj = new JSONObject();
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(content);
			writer.flush();
			writer.close();
			obj.put("msg", true);
			return obj.toString();
		} catch (IOException e) {
			logger.error("IO错误", e);
			obj.put("msg", false);
			return obj.toString();
		} finally {
			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {
					logger.error("输出流关闭错误", e);
				}
			}
		}
	}

	// 打印指定目录下文件及文件夹
	public String listDir(String dir) {
		filess.clear();
		File file;
		JSONObject obj = new JSONObject();
		if (".".equals(dir))
			file = new File(rootDir);
		else
			file = new File(dir);
		File[] files = file.listFiles();
		for (File f : files) {
			FileBean myFile = new FileBean();
			myFile.setFileName(f.getName());
			myFile.setFilePath(f.getPath());
			Long fileModified = f.lastModified();
			Date date = new Date(fileModified);
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String lastModify = simpleDateFormat.format(date);
			myFile.setLastModify(lastModify);
			myFile.setSize(f.length());
			if (f.isDirectory()) {
				myFile.setDirectory(true);
			} else {
				myFile.setDirectory(false);
				
			}
			filess.add(myFile);
		}

		obj.put("files", filess);
		return obj.toString();
	}

	// 返回文件内容
	public byte[] sendContent(File file) throws IOException {
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
		} catch (IOException e) {
			logger.error("读入文件输出异常", e);
			return ("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes();

		} finally {
			if (fis != null) {
				fis.close();
			}
		}
		return b;
	}

}
