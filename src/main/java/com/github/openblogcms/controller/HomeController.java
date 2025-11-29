package com.github.openblogcms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
    @GetMapping("/login")
    @ResponseBody
    public String login() {
        return "tu będzie strona logowania";
    }
}



