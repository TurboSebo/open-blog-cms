package com.github.openblogcms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AdminViewController {

    @GetMapping("/dashboard")
    @ResponseBody
    public String login() {
        return "<h1>Dashboard View</h1><p>Welcome to the admin dashboard!</p>";
    }
}
