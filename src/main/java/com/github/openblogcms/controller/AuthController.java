package com.github.openblogcms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AuthController {
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Prosty demonstracyjny endpoint zwracający tekst zamiast widoku
    @GetMapping("/login-demo")
    @ResponseBody
    public String loginDemo() {
        return "Tu będzie strona logowania"; // Tekst pokazujący działanie @ResponseBody
    }
}
