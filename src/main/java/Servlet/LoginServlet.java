package Servlet;

import java.io.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import Model.User;
import Util.AuthService;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final AuthService authService = AuthService.getInstance();

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();

		// ✅ Read JSON from request body
		StringBuilder sb = new StringBuilder();
		String line;
		try (BufferedReader reader = request.getReader()) {
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		}

		// ✅ Parse JSON using json-simple
		JSONParser parser = new JSONParser();
		JSONObject jsonRequest;
		try {
			jsonRequest = (JSONObject) parser.parse(sb.toString());

			String email = (String) jsonRequest.get("email");
			String password = (String) jsonRequest.get("password");

			// ✅ Authenticate user
			User user = authService.login(email, password);
			if (user != null) {
				String token = authService.generateToken(user.getUsername()); // Generate JWT Token

				// ✅ Construct JSON response manually
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("message", "Login successful");
				jsonResponse.put("username", user.getUsername());
				jsonResponse.put("token", token);

				// ✅ Set JWT token in HttpOnly Cookie
				Cookie jwtCookie = new Cookie("token", token);
				jwtCookie.setHttpOnly(true);
				jwtCookie.setPath("/");
				response.addCookie(jwtCookie);

				response.setStatus(HttpServletResponse.SC_OK);
				jsonResponse.put("success", true);
				out.print(jsonResponse.toJSONString());
			} else {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				System.out.print(new JSONObject().put("error", "Invalid email or password").toString());
			}
		} catch (org.json.simple.parser.ParseException e) {
			e.printStackTrace();
		}
	}
}
