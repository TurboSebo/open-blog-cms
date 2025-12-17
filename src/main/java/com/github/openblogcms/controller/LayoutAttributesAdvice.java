package com.github.openblogcms.controller;

import com.github.openblogcms.service.ConfigService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;

@ControllerAdvice
public class LayoutAttributesAdvice {

    private final ConfigService configService;

    public LayoutAttributesAdvice(ConfigService configService) {
        this.configService = configService;
    }

    @ModelAttribute
    public void addGlobalLayoutAttributes(Model model) {
        String siteTitle = configService.getValue(ConfigService.KEY_SITE_TITLE, "Open Blog CMS");
        String aboutAuthor = configService.getValue(ConfigService.KEY_SITE_ABOUT_AUTHOR,
                "To jest prosty blog zbudowany na Spring Boot i czystym JavaScript.");
        String aboutContent = configService.getValue(ConfigService.KEY_PAGE_ABOUT,
                "<p>To jest prosty blog, na którym możesz publikować swoje przemyślenia.</p>");
        String titleAlign = configService.getValue(ConfigService.KEY_SITE_TITLE_ALIGN, "left");
        String siteTitleColor = configService.getValue(ConfigService.KEY_SITE_TITLE_COLOR, "#ffffff");
        String siteTitleSize = configService.getValue(ConfigService.KEY_SITE_TITLE_SIZE, "32");
        String authorAvatar = configService.getValue(ConfigService.KEY_SITE_AUTHOR_AVATAR, "");

        if (!model.containsAttribute("siteTitle")) {
            model.addAttribute("siteTitle", siteTitle);
        }
        if (!model.containsAttribute("aboutAuthor")) {
            model.addAttribute("aboutAuthor", aboutAuthor);
        }
        if (!model.containsAttribute("aboutContent")) {
            model.addAttribute("aboutContent", aboutContent);
        }
        if (!model.containsAttribute("siteTitleAlign")) {
            model.addAttribute("siteTitleAlign", titleAlign);
        }
        if (!model.containsAttribute("siteTitleColor")) {
            model.addAttribute("siteTitleColor", siteTitleColor);
        }
        if (!model.containsAttribute("siteTitleSize")) {
            model.addAttribute("siteTitleSize", siteTitleSize);
        }
        if (!model.containsAttribute("authorAvatar")) {
            model.addAttribute("authorAvatar", authorAvatar);
        }
    }
}

