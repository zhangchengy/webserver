package com.httpserver;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ClassPathXmlApplicationContext {
	private static final Logger logger = LoggerFactory.getLogger(Server.class);
    //储存各个实例的键值对
    private Map<String,Object> beans=new HashMap<String,Object>();
    //构造方法
    
	public ClassPathXmlApplicationContext(){
        //读取XML文档
        SAXBuilder sb=new SAXBuilder();
        //构造文档对象DOC
        Document doc = null;
		try {
			doc = sb.build(this.getClass().getClassLoader().getResource("applicationContext.xml"));
		}
		catch (JDOMException e) {
			// TODO Auto-generated catch block
			logger.error("读取xml配置文件异常，请确定xml文件结构正确",e);
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error("IO错误,找不到applicationContext.xml文件",e);
		}
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
            Object o = null;
			try {
				o = Class.forName(clazz).getConstructor().newInstance();
			}
			catch (InstantiationException | IllegalAccessException | IllegalArgumentException
					| InvocationTargetException | NoSuchMethodException | SecurityException
					| ClassNotFoundException e) {
				// TODO Auto-generated catch block
				logger.error("实例化类："+clazz+"出现错误，请确定配置bean的名称，id，name，以及构造函数是否正确",e);
			}          
            beans.put(id,o);//将id和对象o存入Map中
            //对第i个bean元素下的每个property子元素进行遍历            
            for(Element propertyElement:(List<Element>)element.getChildren("property")){
                //获取property元素的name属性值
                String name=propertyElement.getAttributeValue("name");
                //获取property元素的bean属性值
                String beanInstance=propertyElement.getAttributeValue("ref");
                //取得被注入对象的实例
                Object beanObject=beans.get(beanInstance);
                //获取setter方法的方法名,形式为setXxx
                String methodName="set"+name.substring(0, 1).toUpperCase()+name.substring(1);
                //使用反射取得指定名称，指定参数类型的setXxx方法
              //  Method m=o.getClass().getMethod(methodName, beanObject.getClass().getInterfaces()[0]);
                //调用对象o的setXxx方法
              //  m.invoke(o,beanObject);
                System.out.println();
                Method method = null;
				try {
					method = o.getClass().getDeclaredMethod(methodName,beanObject.getClass());
				}
				catch (NoSuchMethodException | SecurityException e) {
					// TODO Auto-generated catch block
					logger.error("请确定"+clazz+"中有方法："+methodName,e);
				}
    			method.setAccessible(true);
    			try {
					method.invoke(o,beanObject);
				}
				catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
					// TODO Auto-generated catch block
					logger.error("请确定该方法能够被授权在此状态下执行",e);
				} 
                
            }                       
        }
    }
        public Object getBean(String id){
            return beans.get(id);
        }
    }