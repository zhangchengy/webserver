package com.httpserver;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;

import org.jdom.input.SAXBuilder;

public class ReadWebXml {
	private Map<String,String> webXml=new HashMap<String,String>();
	public ReadWebXml() throws Exception{
		SAXBuilder sb=new SAXBuilder();
		Document doc=sb.build(this.getClass().getClassLoader().getResource("web.xml"));
		Element root=doc.getRootElement();
		List list= root.getChildren();
		for(int i=0;i<list.size();i++)
		{
			Element element =(Element) list.get(i);
			webXml.put(element.getName(),element.getText());
		}
	}
	public String getValue(String name){
		return webXml.get(name);
	}
}
