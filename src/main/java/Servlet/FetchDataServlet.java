package Servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import Controller.UserSocket;
import Model.User;
import Util.SessionUtil;
import netscape.javascript.JSObject;

@WebServlet("/Service/FetchDataServlet")
public class FetchDataServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080"); //  Allow only frontend
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true"); //  Enable credentials
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	 response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080"); //  Only allow frontend origin
         response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
         response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
         response.setHeader("Access-Control-Allow-Credentials", "true"); //  Allow cookies
    	response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
    	
        User user = SessionUtil.getLoggedInUser(request); // Get existing session
        System.out.println(user);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not authenticated\"}");
            return;
        }


        UserSocket getDatabaseObjSocket = new UserSocket(user.getUsername());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        JSONObject jsonResponse = new JSONObject();

		jsonResponse.put("DATABASES",getDatabaseObjSocket.getFolderStructure());
		
		response.getWriter().write(jsonResponse.toJSONString());
        
    }


}
