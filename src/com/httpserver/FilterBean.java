package com.httpserver;

public class FilterBean {
	private String action;
	private String clazz;
	private String methodName;
	
	public FilterBean(String action,String clazz,String methodName){
		this.action=action;
		this.clazz=clazz;
		this.methodName=methodName;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getClazz() {
		return clazz;
	}
	public void setClazz(String clazz) {
		this.clazz = clazz;
	}
	public String getMethodName() {
		return methodName;
	}
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	
	
}
