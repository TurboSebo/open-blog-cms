package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.repository.PostRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PostViewController {

    private final PostRepository postRepository;

    public PostViewController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/post/{id}")
    public String showPost(@PathVariable Long id, Model model) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post nie znaleziony"));

        // Ukrywanie nieopublikowanych postów dla zwykłych użytkowników
        if (!post.isPublished()) {
            return "redirect:/";
        }

        model.addAttribute("post", post);
        return "post";
    }
}
