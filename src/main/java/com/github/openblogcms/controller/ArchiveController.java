package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.repository.PostRepository;
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

    public ArchiveController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/archive")
    public String archive(Model model) {
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
