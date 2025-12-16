package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.repository.PostRepository;
import com.github.openblogcms.service.ConfigService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Controller
public class ArchiveController {

    private final PostRepository postRepository;
    private final ConfigService configService;

    public ArchiveController(PostRepository postRepository, ConfigService configService) {
        this.postRepository = postRepository;
        this.configService = configService;
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

    @GetMapping("/archive")
    public String archive(Model model) {
        addLayoutConfig(model);

        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

        Map<String, List<Post>> postsByMonth = new LinkedHashMap<>();
        Locale pl = new Locale("pl");

        for (Post post : posts) {
            if (post.getCreatedAt() == null) continue;
            if (!post.isPublished()) continue; // ukrywamy nieopublikowane posty w archiwum

            Month month = post.getCreatedAt().getMonth();
            int year = post.getCreatedAt().getYear();

            String monthName = month.getDisplayName(TextStyle.FULL_STANDALONE, pl);
            String key = monthName.substring(0, 1).toUpperCase(pl) + monthName.substring(1) + " " + year;

            postsByMonth.computeIfAbsent(key, k -> new java.util.ArrayList<>()).add(post);
        }

        model.addAttribute("postsByMonth", postsByMonth);
        return "archive";
    }
}
