package com.httpserver;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class DDE {
	public static void main(String[] args) throws IOException{
		File file = new File("D:/logo.png");
		FileInputStream fis = null;
		byte[] b = null;
		try {
			fis = new FileInputStream(file);
			b = new byte[fis.available()];
			fis.read(b);
			fis.close();
		}
		catch (IOException e) {
		}
		String dd=Base64.getEncoder().encodeToString(b);
		System.out.println(dd);		
		String fileContent=new String(Base64.getDecoder().decode(dd),StandardCharsets.UTF_8);		
		file = new File("D:/er/logo.png");
		if (!file.exists()) {						
					 b = fileContent.getBytes();
					 for (int i = 0; i < b.length; ++i) {
							if (b[i] < 0) {
								b[i]=(byte) (b[i]+256);
								
							}System.out.println(b[i]);
						}
					
					OutputStream out = new FileOutputStream(file);
					out.write(b);
					out.close();
		}	
		
	}
}