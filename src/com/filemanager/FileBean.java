package com.filemanager;
/**
 * 用于储存文件信息的bean
 * <p>Copyright: Copyright (c) 2018</p>
 * <p>succez</p>
 * @author zhangchengy
 * @createdate 2018年7月10日
 */
public class FileBean {
	String filePath;
	String fileName;
	boolean isDirectory;
	String lastModify;
	//int level;
	long size;

	public String getLastModify() {
		return lastModify;
	}

	public void setLastModify(String lastModify) {
		this.lastModify = lastModify;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	//public int getLevel() {
	//	return level;
	//}

	//public void setLevel(int level) {
	//	this.level = level;
	//}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public boolean isDirectory() {
		return isDirectory;
	}

	public void setDirectory(boolean isDirectory) {
		this.isDirectory = isDirectory;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

}
