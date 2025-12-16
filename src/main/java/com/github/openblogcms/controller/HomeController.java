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
        addLayoutConfig(model);
        return "index";
    }

    @GetMapping("/about")
    public String about(Model model) {
        addLayoutConfig(model);
        String aboutContent = configService.getValue(ConfigService.KEY_PAGE_ABOUT,
                "<p>To jest prosty blog, na którym możesz publikować swoje przemyślenia.</p>");
        model.addAttribute("aboutContent", aboutContent);
        return "about";
    }

    private void addLayoutConfig(Model model) {
        String siteTitle = configService.getValue(ConfigService.KEY_SITE_TITLE, "Open Blog CMS");
        String aboutAuthor = configService.getValue(ConfigService.KEY_SITE_ABOUT_AUTHOR,
                "To jest prosty blog zbudowany na Spring Boot i czystym JavaScript.");
        String titleAlign = configService.getValue(ConfigService.KEY_SITE_TITLE_ALIGN, "left");
        model.addAttribute("siteTitle", siteTitle);
        model.addAttribute("aboutAuthor", aboutAuthor);
        model.addAttribute("siteTitleAlign", titleAlign);
    }
}
