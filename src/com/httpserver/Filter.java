package com.httpserver;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Filter {
	private static final Logger logger = LoggerFactory.getLogger(Filter.class);
	private FilterBean filterBean;
	private Map<String,Object> filters=new HashMap<String,Object>();
	
	public Filter() throws Exception{
		SAXBuilder sb=new SAXBuilder();
		Document doc=sb.build(this.getClass().getClassLoader().getResource("struts.xml"));
		Element root=doc.getRootElement();
		List list= root.getChildren("action");
		for(int i=0;i<list.size();i++){			
			Element element=(Element)list.get(i);
			String action=element.getAttributeValue("name");
			String clazz=element.getAttributeValue("class");
			String methodName=element.getAttributeValue("method");
			filterBean=new FilterBean(action,clazz,methodName); 
			filters.put(action, filterBean);
		}
	}
	public Object getFilter(String action){
		return filters.get(action);
	}
}
