package com.github.openblogcms.controller;

import com.github.openblogcms.service.ConfigService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final ConfigService configService;

    public HomeController(ConfigService configService) {
        this.configService = configService;
    }

    @GetMapping("/")
    public String index(Model model) {
        // LayoutAttributesAdvice doda globalne atrybuty (siteTitle, aboutAuthor, itp.)
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        // aboutContent jest również dostarczany globalnie przez LayoutAttributesAdvice
        return "about";
    }
}
