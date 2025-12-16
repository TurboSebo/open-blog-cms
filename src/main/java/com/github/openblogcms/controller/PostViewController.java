package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.model.Role;
import com.github.openblogcms.model.User;
import com.github.openblogcms.repository.PostRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class PostViewController {

    private final PostRepository postRepository;

    public PostViewController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/post/{id}")
    public String showPost(@PathVariable Long id, Model model, HttpSession session) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nie znaleziony"));

        Object userObj = session.getAttribute("currentUser");
        Object roleObj = session.getAttribute("currentRole");
        boolean isAdmin = (userObj instanceof User) && (roleObj instanceof Integer) && ((Integer) roleObj) >= Role.ADMIN;

        // Zwykły użytkownik nie może oglądać nieopublikowanych postów
        if (!post.isPublished() && !isAdmin) {
            return "redirect:/";
        }

        model.addAttribute("post", post);
        model.addAttribute("isAdmin", isAdmin);
        return "post";
    }
}
