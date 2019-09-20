package com.httpserver;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

public class ClassPathXmlApplicationContext {
	
    //储存各个实例的键值对
    private Map<String,Object> beans=new HashMap<String,Object>();
    //构造方法
    public ClassPathXmlApplicationContext(Request request,Response response) throws Exception{
        //读取XML文档
        SAXBuilder sb=new SAXBuilder();
        //构造文档对象DOC
        Document doc=sb.build(this.getClass().getClassLoader().getResource("applicationContext.xml"));
        //获取XML文档根元素
        Element root=doc.getRootElement();
        //获取根元素下所有的子元素
        List list=root.getChildren("bean");
        //遍历所有的Bean元素
        for(int i=0;i<list.size();i++){
            //取得第i个Bean元素
            Element element=(Element)list.get(i);
            //获取第i个Bean元素的id属性值，并将其存入到字符串变量id中
            String id=element.getAttributeValue("id");
            //获取第i个Bean元素的class属性值，并将其存入到字符串变量clazz中
            String clazz=element.getAttributeValue("class");
            //使用反射生成类的对象，相当于生成类对象，且存储在Map中         
            Object o=Class.forName(clazz).getConstructor(Request.class,Response.class).newInstance(request,response);                             
            beans.put(id,o);//将id和对象o存入Map中
            //对第i个bean元素下的每个property子元素进行遍历            
        }
    }
        public Object getBean(String id){
            return beans.get(id);
        }
    }