package com.filemanager;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.httpserver.ReadWebXml;
import com.httpserver.Request;
import com.httpserver.Response;
import net.sf.json.JSONObject;

public class FileManage {
	private static final Logger logger = LoggerFactory.getLogger(FileManage.class);

	private String rootDir;
	private ReadWebXml readWebXml;

	public FileManage() throws Exception {
		readWebXml=new ReadWebXml();
	}

	// 修改后保存文件
	public void saveFile(Request request, Response response) throws IOException {
		String path = request.getParameter("filePath", "UTF-8");
		String content = request.getParameter("fileContent", "UTF-8");
		File file = new File(path);
		BufferedWriter writer = null;
		JSONObject obj = new JSONObject();
		try {
			writer = new BufferedWriter(new FileWriter(file));
			writer.write(content);
			writer.flush();
			writer.close();
			obj.put("msg", true);
		}
		catch (IOException e) {
			logger.error("IO错误", e);
			obj.put("msg", false);
		}
		finally {
			if (writer != null) {
				try {
					writer.close();
				}
				catch (IOException e) {
					logger.error("输出流关闭错误", e);
				}
			}
			response.sendResponse(obj.toString().getBytes("UTF-8"));
		}
	}

	// 打印指定目录下文件及文件夹
	public void listDir(Request request, Response response) throws IOException {
		ArrayList<FileBean> filess = new ArrayList<FileBean>();
		this.rootDir = readWebXml.getValue("root-address");
		String dir = request.getParameter("dirPath", "UTF-8");
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
			myFile.setDirectory(f.isDirectory());
			if (f.isDirectory()) {
				File[] dirfiles = f.listFiles();
				myFile.setChildrenSum(dirfiles.length);
			}
			else {
				myFile.setChildrenSum(0);
			}
			filess.add(myFile);
		}
		obj.put("files", filess);
		response.sendResponse(obj.toString().getBytes("UTF-8"));
	}

	// 返回文件内容
	public void sendContent(Request request, Response response) throws IOException {
		String filepath = request.getParameter("filePath", "UTF-8");
		File file = new File(filepath);

		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
		}
		catch (IOException e) {
			logger.error("读入文件输出异常", e);
			response.sendResponse(("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes());
		}
		finally {
			if (fis != null) {
				fis.close();
			}
		}
		response.sendResponse(b);
	}

	public void fileDownload(Request request, Response response) throws IOException {
		String filepath = request.getParameter("filePath", "UTF-8");
		File file = new File(filepath);
		response.addHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
		sendContent(request, response);
	}

	public void sendPageFromAddressBar(Request request, Response response) throws IOException {
		File file = new File(readWebXml.getValue("welcome-file"));
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
			response.sendResponse(b);
		}
		catch (IOException e) {
			response.setStatus(404);
			response.sendResponse(("文件可能刚刚被删除\r\n请尝试刷新来重新读取文件目录").getBytes());
		}
		finally {
			if (fis != null) {
				fis.close();
			}
		}
	}

	public void listDirFromAddressBar(Request request, Response response) throws UnsupportedEncodingException {
		JSONObject obj = new JSONObject();
		String path = "."+request.getParameter("Path", "UTF-8");
		ArrayList<String> paths = new ArrayList<String>();
		paths.add(path);
		boolean isDirectory = new File(path).isDirectory();
		int n;
		do {
			n = path.lastIndexOf("/");
			path = path.substring(0, n);
			paths.add(path);
		}
		while (!".".equals(path));
		ArrayList<FileBean> filebeanList;
		ArrayList<ArrayList<FileBean>> array = new ArrayList<ArrayList<FileBean>>();
		File[] files;
		FileBean fileBean;
		for (int i = 0; i < paths.size() - 1; i++) {
			filebeanList = new ArrayList<FileBean>();
			if (i > 0 || (i == 0 && isDirectory)) {
				files = new File(paths.get(i)).listFiles();
				for (File f : files) {
					fileBean = new FileBean();
					fileBean.setDirectory(f.isDirectory());
					if (f.isDirectory()) {
						File[] dirfiles = f.listFiles();
						fileBean.setChildrenSum(dirfiles.length);
					}
					else {
						fileBean.setChildrenSum(0);
					}
					fileBean.setFileName(f.getName());
					fileBean.setFilePath(f.getPath());
					filebeanList.add(fileBean);
				}
				array.add(filebeanList);
			}
			else {
				File f = new File(paths.get(0));
				fileBean = new FileBean();
				fileBean.setDirectory(false);
				fileBean.setFileName(f.getName());
				fileBean.setFilePath(f.getPath());
				filebeanList.add(fileBean);
				array.add(filebeanList);
			}
		}
		paths.remove(paths.size() - 1);
		obj.put("filess", array);
		obj.put("dirs", paths);
		try {
			response.sendResponse(obj.toString().getBytes("UTF-8"));
		}
		catch (IOException e) {
			logger.error("发送响应数据失败", e);
		}
	}

	public void newChildDir(Request request, Response response) throws UnsupportedEncodingException {
		JSONObject json = new JSONObject();
		String dirPath = request.getParameter("dirPath", "UTF-8");
		String newDirName = request.getParameter("newDirName", "UTF-8");
		File file = new File(dirPath + "/" + newDirName);
		json.put("msg", file.mkdir());
		try {
			response.sendResponse(json.toString().getBytes("UTF-8"));
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("新建文件夹时发送响应数据失败");
		}
	}

	public void newFile(Request request, Response response) throws IOException {
		JSONObject json = new JSONObject();
		String dirPath = request.getParameter("dirPath", "UTF-8");
		String newFileName = request.getParameter("newFileName", "UTF-8");
		File file = new File(dirPath + "/" + newFileName);
		if (!file.exists()) {
			json.put("msg", file.createNewFile());
		}
		try {
			response.sendResponse(json.toString().getBytes("UTF-8"));
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("新建文件时发送响应数据失败");
		}
	}

	public void deleteFile(Request request, Response response) throws IOException {
		JSONObject json = new JSONObject();
		String filePath = request.getParameter("filePath", "UTF-8");
		json.put("msg", new File(filePath).delete());
		try {
			response.sendResponse(json.toString().getBytes("UTF-8"));
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("删除文件时发送响应数据失败");
		}
	}

	public void deleteDir(Request request, Response response) throws IOException {
		JSONObject json = new JSONObject();
		String dirPath = request.getParameter("dirPath", "UTF-8");
		File f = new File(dirPath);
		deleteFile(f);
		try {
			response.sendResponse(json.toString().getBytes("UTF-8"));
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("删除文件夹时发送响应数据失败");
		}
	}

	public void deleteFile(File file) {
		File[] f;
		if (file.isFile() || (file.isDirectory() && file.listFiles().length == 0))
			file.delete();
		else {
			f = file.listFiles();
			for (File ff : f) {
				deleteFile(ff);
			}
			file.delete();
		}
	}

	public void uploadFile(Request request, Response response) throws IOException {
		JSONObject json = new JSONObject();
		String dirPath = request.getParameter("dirPath", "UTF-8");
		String fileName = request.getParameter("fileName", "UTF-8");
		String fileContent = request.getParameter("fileContent");
		String[] content = fileContent.split(",");
		byte[] b = new byte[content.length];
		for (int i = 0; i < content.length; i++)
			b[i] = Byte.parseByte(content[i]);
		File file = new File(dirPath + "/" + fileName);
		if (!file.exists()) {
			try {
				OutputStream out = new FileOutputStream(file);
				out.write(b);
				out.close();
				json.put("msg", true);
				json.put("fileName",fileName);
			}
			catch (IOException e) {
				logger.error("IO错误", e);
				json.put("msg", false);
			}
		}
		else
			json.put("msg", false);
		response.sendResponse(json.toString().getBytes("UTF-8"));
	}
}
